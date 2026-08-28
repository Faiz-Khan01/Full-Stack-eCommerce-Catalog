package com.ecom.productcatalog.service;

import com.ecom.productcatalog.dto.PaymentRequest;
import com.ecom.productcatalog.dto.PaymentResponse;
import com.ecom.productcatalog.dto.PaymentVerificationRequest;
import com.ecom.productcatalog.model.Order;
import com.ecom.productcatalog.model.OrderItem;
import com.ecom.productcatalog.model.Payment;
import com.ecom.productcatalog.repository.OrderRepository;
import com.ecom.productcatalog.repository.PaymentRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Slf4j
public class PaymentService {

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final InventoryService inventoryService;
    private final OrderService orderService;

    public PaymentService(PaymentRepository paymentRepository,
                          OrderRepository orderRepository,
                          InventoryService inventoryService,
                          OrderService orderService) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.inventoryService = inventoryService;
        this.orderService = orderService;
    }

    /**
     * Safely parse a potentially alphanumeric order ID string into a Long database ID.
     * Uses \\D+ regex and proper exception handling to prevent NumberFormatExceptions.
     */
    private Long parseNumericOrderId(Object rawOrderId) {
        if (rawOrderId == null) {
            return null;
        }
        String orderIdStr = rawOrderId.toString().trim();
        if (orderIdStr.isEmpty()) {
            return null;
        }
        try {
            // Extract only the numeric digits from strings like "ORD_68_288603"
            String numericPart = orderIdStr.replaceAll("\\D+", "");
            if (numericPart.isEmpty()) {
                log.warn("No numeric part found in Order ID: {}", orderIdStr);
                return null;
            }
            return Long.parseLong(numericPart);
        } catch (NumberFormatException e) {
            log.error("Number format error while parsing Order ID [{}]: {}", orderIdStr, e.getMessage());
            return null;
        } catch (Exception e) {
            log.error("Failed to parse order ID value [{}] to Long: {}", orderIdStr, e.getMessage());
            return null;
        }
    }

    @Transactional
    public PaymentResponse createOrder(PaymentRequest paymentRequest) throws RazorpayException {
        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            if (paymentRequest.getAmount() == null || paymentRequest.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Payment amount must be greater than zero");
            }

            int amountInPaise = paymentRequest.getAmount().multiply(BigDecimal.valueOf(100)).intValue();

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", paymentRequest.getCurrency() != null ? paymentRequest.getCurrency() : "INR");

            // Safely generate and truncate receipt ID to fit Razorpay's 40-character limit
            String baseId = paymentRequest.getDbOrderId() != null ? paymentRequest.getDbOrderId() : paymentRequest.getOrderId();
            String rawReceipt = baseId != null ? "ord_" + baseId : "txn_" + System.currentTimeMillis();
            String receiptId = rawReceipt.length() > 40 ? rawReceipt.substring(0, 40) : rawReceipt;

            orderRequest.put("receipt", receiptId);
            orderRequest.put("description", "Product Catalog Order Payment");

            if (paymentRequest.getCouponCode() != null && !paymentRequest.getCouponCode().isBlank()) {
                JSONObject notes = new JSONObject();
                notes.put("applied_coupon", paymentRequest.getCouponCode());
                orderRequest.put("notes", notes);
            }

            com.razorpay.Order razorpayOrder = client.orders.create(orderRequest);
            String rzpOrderId = razorpayOrder.get("id");

            Long dbOrderId = parseNumericOrderId(paymentRequest.getDbOrderId());
            if (dbOrderId == null) {
                dbOrderId = parseNumericOrderId(paymentRequest.getOrderId());
            }

            Payment payment = new Payment();
            if (dbOrderId != null) {
                payment.setOrderId(String.valueOf(dbOrderId));
            }
            payment.setRazorpayOrderId(rzpOrderId);
            payment.setAmount(paymentRequest.getAmount().doubleValue());
            payment.setCurrency(paymentRequest.getCurrency() != null ? paymentRequest.getCurrency() : "INR");
            payment.setPaymentMethod("RAZORPAY");
            payment.setStatus("CREATED");
            payment.setUserEmail(paymentRequest.getUserEmail());
            payment.setCouponCode(paymentRequest.getCouponCode());
            payment.setCreatedAt(LocalDateTime.now());
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.saveAndFlush(payment);

            if (dbOrderId != null) {
                orderRepository.findById(dbOrderId).ifPresent(order -> {
                    order.setRazorpayOrderId(rzpOrderId);
                    order.setPaymentMethod("RAZORPAY");
                    order.setPaymentStatus("PENDING");
                    orderRepository.saveAndFlush(order);
                    log.info("Linked razorpay_order_id [{}] to user_orders ID [{}]", rzpOrderId, order.getId());
                });
            }

            PaymentResponse response = new PaymentResponse();
            response.setRazorpayOrderId(rzpOrderId);
            response.setAmount(paymentRequest.getAmount());
            response.setCurrency(paymentRequest.getCurrency() != null ? paymentRequest.getCurrency() : "INR");
            response.setStatus("CREATED");

            if (dbOrderId != null) {
                response.setOrderId(String.valueOf(dbOrderId));
            }

            log.info("Razorpay order successfully created with ID: {}", rzpOrderId);
            return response;

        } catch (RazorpayException e) {
            log.error("Razorpay API Error during order creation: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Transactional
    public boolean verifyPayment(PaymentVerificationRequest verificationRequest) {
        try {
            String signature = verificationRequest.getRazorpaySignature();
            String rzpOrderId = verificationRequest.getRazorpayOrderId();
            String paymentId = verificationRequest.getRazorpayPaymentId();

            if (signature == null || rzpOrderId == null || paymentId == null) {
                log.warn("Missing Razorpay verification fields");
                return false;
            }

            String data = rzpOrderId + "|" + paymentId;
            String expectedSignature = generateSignature(data, razorpayKeySecret);

            boolean isSignatureValid = expectedSignature.equals(signature);

            if (isSignatureValid) {
                Payment payment = paymentRepository.findByRazorpayOrderId(rzpOrderId)
                        .orElseGet(() -> {
                            Payment newPayment = new Payment();
                            newPayment.setRazorpayOrderId(rzpOrderId);
                            newPayment.setCreatedAt(LocalDateTime.now());
                            return newPayment;
                        });

                if ("CAPTURED".equalsIgnoreCase(payment.getStatus())) {
                    log.info("Payment already verified and captured for Razorpay order: {}", rzpOrderId);
                    return true;
                }

                payment.setRazorpayPaymentId(paymentId);
                payment.setRazorpaySignature(signature);
                payment.setPaymentMethod("RAZORPAY");
                payment.setStatus("CAPTURED");
                payment.setUpdatedAt(LocalDateTime.now());
                paymentRepository.saveAndFlush(payment);

                Order order = null;

                Long verifiedDbId = parseNumericOrderId(verificationRequest.getDbOrderId());
                if (verifiedDbId != null) {
                    order = orderRepository.findById(verifiedDbId).orElse(null);
                }

                if (order == null && payment != null && payment.getOrderId() != null) {
                    Long paymentOrderIdLong = parseNumericOrderId(payment.getOrderId());
                    if (paymentOrderIdLong != null) {
                        order = orderRepository.findById(paymentOrderIdLong).orElse(null);
                    }
                }

                if (order == null && rzpOrderId != null) {
                    order = orderRepository.findByRazorpayOrderId(rzpOrderId).orElse(null);
                }

                if (order != null) {
                    order.setOrderDate(new Date());
                    order.setPaymentStatus("SUCCESS");
                    order.setPaymentMethod("RAZORPAY");
                    order.setRazorpayOrderId(rzpOrderId);

                    if (order.getOrderNumber() == null || order.getOrderNumber().isBlank()) {
                        order.setOrderNumber(String.format("ORD-%d-%04d", LocalDate.now().getYear(), order.getId()));
                    }

                    orderRepository.saveAndFlush(order);

                    List<String> itemsSummary = new ArrayList<>();

                    if (order.getItems() != null && !order.getItems().isEmpty()) {
                        for (OrderItem item : order.getItems()) {
                            if (item.getProduct() != null) {
                                try {
                                    inventoryService.deductStock(item.getProduct().getId(), item.getQuantity());
                                    log.info("Stock deducted for product ID: {} by quantity: {}",
                                            item.getProduct().getId(), item.getQuantity());
                                } catch (Exception ex) {
                                    log.error("Failed to deduct stock for product ID: {} - {}",
                                            item.getProduct().getId(), ex.getMessage());
                                }

                                itemsSummary.add(String.format("%s (x%d) - ₹%.2f",
                                        item.getProduct().getName(),
                                        item.getQuantity(),
                                        item.getPrice()));
                            }
                        }
                    } else {
                        log.warn("No items found attached to Order ID: {}", order.getId());
                    }

                    try {
                        orderService.triggerOrderEmails(order, itemsSummary);
                    } catch (Exception mailEx) {
                        log.error("Failed to send order email notification for Order ID: {}", order.getId(), mailEx);
                    }

                    log.info("Order ID [{}] status updated to SUCCESS with Order Number [{}]", order.getId(), order.getOrderNumber());
                } else {
                    log.error("Could not find matching user_orders row for Razorpay Order ID: {}", rzpOrderId);
                }

                log.info("Payment verified and completed for Razorpay order: {}", rzpOrderId);
                return true;
            } else {
                log.warn("Payment signature verification failed for Razorpay order: {}", rzpOrderId);

                Payment payment = paymentRepository.findByRazorpayOrderId(rzpOrderId).orElse(new Payment());
                payment.setStatus("FAILED");
                payment.setUpdatedAt(LocalDateTime.now());
                paymentRepository.saveAndFlush(payment);

                Order order = null;
                Long verifiedDbId = parseNumericOrderId(verificationRequest.getDbOrderId());
                if (verifiedDbId != null) {
                    order = orderRepository.findById(verifiedDbId).orElse(null);
                }

                if (order == null && payment != null && payment.getOrderId() != null) {
                    Long paymentOrderIdLong = parseNumericOrderId(payment.getOrderId());
                    if (paymentOrderIdLong != null) {
                        order = orderRepository.findById(paymentOrderIdLong).orElse(null);
                    }
                }

                if (order == null && rzpOrderId != null) {
                    order = orderRepository.findByRazorpayOrderId(rzpOrderId).orElse(null);
                }
                if (order != null) {
                    order.setPaymentStatus("FAILED");
                    orderRepository.saveAndFlush(order);
                }
                return false;
            }
        } catch (Exception e) {
            log.error("Error verifying payment, updating stock, or sending emails: ", e);
            return false;
        }
    }

    private String generateSignature(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec keySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(keySpec);

            byte[] hashBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();

            for (byte hashByte : hashBytes) {
                String hex = Integer.toHexString(0xff & hashByte);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            return hexString.toString();
        } catch (Exception e) {
            log.error("Error generating signature: ", e);
            throw new RuntimeException("Error generating signature", e);
        }
    }

    public Payment getPaymentByOrderId(Object orderId) {
        Long numericId = parseNumericOrderId(orderId);
        if (numericId == null) {
            return null;
        }
        return paymentRepository.findByOrderId(String.valueOf(numericId)).orElse(null);
    }
}