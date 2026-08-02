//package com.ecom.productcatalog.service;
//
//import com.ecom.productcatalog.dto.PaymentRequest;
//import com.ecom.productcatalog.dto.PaymentResponse;
//import com.ecom.productcatalog.dto.PaymentVerificationRequest;
//import com.ecom.productcatalog.model.Order;
//import com.ecom.productcatalog.model.OrderItem;
//import com.ecom.productcatalog.model.Payment;
//import com.ecom.productcatalog.repository.OrderRepository;
//import com.ecom.productcatalog.repository.PaymentRepository;
//import com.razorpay.RazorpayClient;
//import com.razorpay.RazorpayException;
//import lombok.extern.slf4j.Slf4j;
//import org.json.JSONObject;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import javax.crypto.Mac;
//import javax.crypto.spec.SecretKeySpec;
//import java.nio.charset.StandardCharsets;
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.Date;
//import java.util.List;
//
//@Service
//@Slf4j
//public class PaymentService {
//
//    @Value("${razorpay.key.id}")
//    private String razorpayKeyId;
//
//    @Value("${razorpay.key.secret}")
//    private String razorpayKeySecret;
//
//    private final PaymentRepository paymentRepository;
//    private final OrderRepository orderRepository;
//    private final InventoryService inventoryService;
//    private final OrderService orderService;
//
//    public PaymentService(PaymentRepository paymentRepository,
//                          OrderRepository orderRepository,
//                          InventoryService inventoryService,
//                          OrderService orderService) {
//        this.paymentRepository = paymentRepository;
//        this.orderRepository = orderRepository;
//        this.inventoryService = inventoryService;
//        this.orderService = orderService;
//    }
//
//    @Transactional
//    public PaymentResponse createOrder(PaymentRequest paymentRequest) throws RazorpayException {
//        try {
//            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
//
//            JSONObject orderRequest = new JSONObject();
//
//            // Convert amount to Paise (1 INR = 100 Paise)
//            int amountInPaise = (int) Math.round(paymentRequest.getAmount() * 100);
//            orderRequest.put("amount", amountInPaise);
//            orderRequest.put("currency", paymentRequest.getCurrency() != null ? paymentRequest.getCurrency() : "INR");
//            orderRequest.put("receipt", "order_" + paymentRequest.getOrderId());
//
//            // Pass Coupon Code to Razorpay Notes if present
//            if (paymentRequest.getCouponCode() != null && !paymentRequest.getCouponCode().isBlank()) {
//                JSONObject notes = new JSONObject();
//                notes.put("applied_coupon", paymentRequest.getCouponCode());
//                orderRequest.put("notes", notes);
//            }
//
//            com.razorpay.Order razorpayOrder = client.orders.create(orderRequest);
//            String rzpOrderId = razorpayOrder.get("id");
//
//            // 1. Save local payment record
//            Payment payment = new Payment();
//            payment.setOrderId(paymentRequest.getOrderId());
//            payment.setRazorpayOrderId(rzpOrderId);
//            payment.setAmount(paymentRequest.getAmount());
//            payment.setCurrency(paymentRequest.getCurrency() != null ? paymentRequest.getCurrency() : "INR");
//            payment.setPaymentMethod("RAZORPAY");
//            payment.setStatus("CREATED");
//            payment.setUserEmail(paymentRequest.getUserEmail());
//            payment.setCouponCode(paymentRequest.getCouponCode());
//            payment.setCreatedAt(LocalDateTime.now());
//            payment.setUpdatedAt(LocalDateTime.now());
//
//            paymentRepository.saveAndFlush(payment);
//
//            // 2. Link razorpayOrderId & Payment Method to user_orders table instantly
//            if (paymentRequest.getOrderId() != null) {
//                orderRepository.findById(paymentRequest.getOrderId()).ifPresent(order -> {
//                    order.setRazorpayOrderId(rzpOrderId);
//                    order.setPaymentMethod("RAZORPAY");
//                    order.setPaymentStatus("PENDING");
//                    orderRepository.saveAndFlush(order);
//                    log.info("Linked razorpay_order_id [{}] to user_orders ID [{}]", rzpOrderId, order.getId());
//                });
//            }
//
//            PaymentResponse response = new PaymentResponse();
//            response.setRazorpayOrderId(rzpOrderId);
//            response.setAmount(amountInPaise);
//            response.setCurrency(paymentRequest.getCurrency() != null ? paymentRequest.getCurrency() : "INR");
//            response.setStatus("CREATED");
//
//            log.info("Razorpay order created with ID: {} | Coupon: {}", rzpOrderId, paymentRequest.getCouponCode());
//            return response;
//
//        } catch (RazorpayException e) {
//            log.error("Error creating Razorpay order: ", e);
//            throw e;
//        }
//    }
//
//    @Transactional
//    public boolean verifyPayment(PaymentVerificationRequest verificationRequest) {
//        try {
//            String signature = verificationRequest.getRazorpaySignature();
//            String rzpOrderId = verificationRequest.getRazorpayOrderId();
//            String paymentId = verificationRequest.getRazorpayPaymentId();
//
//            // Create signature hash using UTF-8
//            String data = rzpOrderId + "|" + paymentId;
//            String expectedSignature = generateSignature(data, razorpayKeySecret);
//
//            // 🧪 TEST BYPASS: Postman testing dummy values bypass
//            boolean isTestMode = "xxxxxxxxxxxxxxxxxxxxxxxx".equals(signature) || "dummy_signature".equals(signature);
//            boolean isSignatureValid = expectedSignature.equals(signature) || isTestMode;
//
//            if (isSignatureValid) {
//                if (isTestMode) {
//                    log.warn("⚠️ Bypassing Signature Verification for Testing on Razorpay Order: {}", rzpOrderId);
//                }
//
//                Payment payment = paymentRepository.findByRazorpayOrderId(rzpOrderId)
//                        .orElseGet(() -> {
//                            Payment newPayment = new Payment();
//                            newPayment.setRazorpayOrderId(rzpOrderId);
//                            newPayment.setCreatedAt(LocalDateTime.now());
//                            return newPayment;
//                        });
//
//                // 🛡️ IDEMPOTENCY GUARD: Prevent duplicate deductions/emails
//                if ("CAPTURED".equalsIgnoreCase(payment.getStatus())) {
//                    log.info("Payment already verified and captured for Razorpay order: {}", rzpOrderId);
//                    return true;
//                }
//
//                // 1. Update Payment Record
//                payment.setRazorpayPaymentId(paymentId);
//                payment.setRazorpaySignature(signature);
//                payment.setPaymentMethod("RAZORPAY");
//                payment.setStatus("CAPTURED");
//                payment.setUpdatedAt(LocalDateTime.now());
//                paymentRepository.saveAndFlush(payment);
//
//                // 2. Multi-tier Order Lookup Strategy
//                Order order = null;
//
//                // Lookup via dbOrderId passed in DTO
//                if (verificationRequest.getDbOrderId() != null) {
//                    order = orderRepository.findById(verificationRequest.getDbOrderId()).orElse(null);
//                }
//
//                // Fallback: Lookup via Payment entity's orderId
//                if (order == null && payment.getOrderId() != null) {
//                    order = orderRepository.findById(payment.getOrderId()).orElse(null);
//                }
//
//                // Fallback: Direct lookup via razorpayOrderId
//                if (order == null && rzpOrderId != null) {
//                    order = orderRepository.findByRazorpayOrderId(rzpOrderId).orElse(null);
//                }
//
//                // 3. Update user_orders table, generate order_number, deduct stock & send confirmation email
//                if (order != null) {
//                    order.setOrderDate(new Date());
//                    order.setPaymentStatus("SUCCESS");
//                    order.setPaymentMethod("RAZORPAY");
//                    order.setRazorpayOrderId(rzpOrderId);
//
//                    // 🟢 FIX: Assign Order Number if missing
//                    if (order.getOrderNumber() == null || order.getOrderNumber().isBlank()) {
//                        order.setOrderNumber(String.format("ORD-%d-%04d", LocalDate.now().getYear(), order.getId()));
//                    }
//
//                    orderRepository.saveAndFlush(order);
//
//                    List<String> itemsSummary = new ArrayList<>();
//
//                    // Deduct stock safely
//                    if (order.getItems() != null && !order.getItems().isEmpty()) {
//                        for (OrderItem item : order.getItems()) {
//                            if (item.getProduct() != null) {
//                                try {
//                                    inventoryService.deductStock(item.getProduct().getId(), item.getQuantity());
//                                    log.info("Stock deducted for product ID: {} by quantity: {}",
//                                            item.getProduct().getId(), item.getQuantity());
//                                } catch (Exception ex) {
//                                    log.error("Failed to deduct stock for product ID: {} - {}",
//                                            item.getProduct().getId(), ex.getMessage());
//                                }
//
//                                itemsSummary.add(String.format("%s (x%d) - ₹%.2f",
//                                        item.getProduct().getName(),
//                                        item.getQuantity(),
//                                        item.getPrice()));
//                            }
//                        }
//                    } else {
//                        log.warn("No items found attached to Order ID: {}", order.getId());
//                    }
//
//                    // Trigger order confirmation and admin alert emails
//                    try {
//                        orderService.triggerOrderEmails(order, itemsSummary);
//                    } catch (Exception mailEx) {
//                        log.error("Failed to send order email notification for Order ID: {}", order.getId(), mailEx);
//                    }
//
//                    log.info("Order ID [{}] status updated to SUCCESS with Order Number [{}]", order.getId(), order.getOrderNumber());
//                } else {
//                    log.error("Could not find matching user_orders row for Razorpay Order ID: {}", rzpOrderId);
//                }
//
//                log.info("Payment verified and completed for Razorpay order: {}", rzpOrderId);
//                return true;
//            } else {
//                log.warn("Payment signature verification failed for Razorpay order: {}", rzpOrderId);
//
//                // Mark payment as FAILED
//                Payment payment = paymentRepository.findByRazorpayOrderId(rzpOrderId).orElse(new Payment());
//                payment.setStatus("FAILED");
//                payment.setUpdatedAt(LocalDateTime.now());
//                paymentRepository.saveAndFlush(payment);
//
//                // Mark order status as FAILED in user_orders table
//                Order order = null;
//                if (verificationRequest.getDbOrderId() != null) {
//                    order = orderRepository.findById(verificationRequest.getDbOrderId()).orElse(null);
//                }
//                if (order == null && payment.getOrderId() != null) {
//                    order = orderRepository.findById(payment.getOrderId()).orElse(null);
//                }
//                if (order == null && rzpOrderId != null) {
//                    order = orderRepository.findByRazorpayOrderId(rzpOrderId).orElse(null);
//                }
//
//                if (order != null) {
//                    order.setPaymentStatus("FAILED");
//                    orderRepository.saveAndFlush(order);
//                }
//                return false;
//            }
//        } catch (Exception e) {
//            log.error("Error verifying payment, updating stock, or sending emails: ", e);
//            return false;
//        }
//    }
//
//    private String generateSignature(String data, String secret) {
//        try {
//            Mac mac = Mac.getInstance("HmacSHA256");
//            SecretKeySpec keySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
//            mac.init(keySpec);
//            byte[] hashBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
//
//            StringBuilder hexString = new StringBuilder();
//            for (byte hashByte : hashBytes) {
//                String hex = Integer.toHexString(0xff & hashByte);
//                if (hex.length() == 1) hexString.append('0');
//                hexString.append(hex);
//            }
//            return hexString.toString();
//        } catch (Exception e) {
//            log.error("Error generating signature: ", e);
//            throw new RuntimeException("Error generating signature", e);
//        }
//    }
//
//    public Payment getPaymentByOrderId(Long orderId) {
//        return paymentRepository.findByOrderId(orderId).orElse(null);
//    }
//
//    public Payment getPaymentStatus(String razorpayOrderId) {
//        return paymentRepository.findByRazorpayOrderId(razorpayOrderId).orElse(null);
//    }
//}









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
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Slf4j
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
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

    @Transactional
    public PaymentResponse createOrder(PaymentRequest paymentRequest) throws RazorpayException {
        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();

            // Convert amount to Paise (1 INR = 100 Paise)
            int amountInPaise = (int) Math.round(paymentRequest.getAmount() * 100);
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", paymentRequest.getCurrency() != null ? paymentRequest.getCurrency() : "INR");
            orderRequest.put("receipt", "order_" + paymentRequest.getOrderId());

            // Pass Coupon Code to Razorpay Notes if present
            if (paymentRequest.getCouponCode() != null && !paymentRequest.getCouponCode().isBlank()) {
                JSONObject notes = new JSONObject();
                notes.put("applied_coupon", paymentRequest.getCouponCode());
                orderRequest.put("notes", notes);
            }

            com.razorpay.Order razorpayOrder = client.orders.create(orderRequest);
            String rzpOrderId = razorpayOrder.get("id");

            // 1. Save local payment record
            Payment payment = new Payment();
            payment.setOrderId(paymentRequest.getOrderId());
            payment.setRazorpayOrderId(rzpOrderId);
            payment.setAmount(paymentRequest.getAmount());
            payment.setCurrency(paymentRequest.getCurrency() != null ? paymentRequest.getCurrency() : "INR");
            payment.setPaymentMethod("RAZORPAY");
            payment.setStatus("CREATED");
            payment.setUserEmail(paymentRequest.getUserEmail());
            payment.setCouponCode(paymentRequest.getCouponCode());
            payment.setCreatedAt(LocalDateTime.now());
            payment.setUpdatedAt(LocalDateTime.now());

            paymentRepository.saveAndFlush(payment);

            // 2. Link razorpayOrderId & Payment Method to user_orders table instantly
            if (paymentRequest.getOrderId() != null) {
                orderRepository.findById(paymentRequest.getOrderId()).ifPresent(order -> {
                    order.setRazorpayOrderId(rzpOrderId);
                    order.setPaymentMethod("RAZORPAY");
                    order.setPaymentStatus("PENDING");
                    orderRepository.saveAndFlush(order);
                    log.info("Linked razorpay_order_id [{}] to user_orders ID [{}]", rzpOrderId, order.getId());
                });
            }

            PaymentResponse response = new PaymentResponse();
            response.setRazorpayOrderId(rzpOrderId);
            response.setAmount(amountInPaise);
            response.setCurrency(paymentRequest.getCurrency() != null ? paymentRequest.getCurrency() : "INR");
            response.setStatus("CREATED");

            log.info("Razorpay order created with ID: {} | Coupon: {}", rzpOrderId, paymentRequest.getCouponCode());
            return response;

        } catch (RazorpayException e) {
            log.error("Error creating Razorpay order: ", e);
            throw e;
        }
    }

    @Transactional
    public boolean verifyPayment(PaymentVerificationRequest verificationRequest) {
        try {
            String signature = verificationRequest.getRazorpaySignature();
            String rzpOrderId = verificationRequest.getRazorpayOrderId();
            String paymentId = verificationRequest.getRazorpayPaymentId();

            // Create signature hash using UTF-8
            String data = rzpOrderId + "|" + paymentId;
            String expectedSignature = generateSignature(data, razorpayKeySecret);

            // 🧪 TEST BYPASS: Postman testing dummy values bypass
            boolean isTestMode = "xxxxxxxxxxxxxxxxxxxxxxxx".equals(signature) || "dummy_signature".equals(signature);
            boolean isSignatureValid = expectedSignature.equals(signature) || isTestMode;

            if (isSignatureValid) {
                if (isTestMode) {
                    log.warn("⚠️ Bypassing Signature Verification for Testing on Razorpay Order: {}", rzpOrderId);
                }

                Payment payment = paymentRepository.findByRazorpayOrderId(rzpOrderId)
                        .orElseGet(() -> {
                            Payment newPayment = new Payment();
                            newPayment.setRazorpayOrderId(rzpOrderId);
                            newPayment.setCreatedAt(LocalDateTime.now());
                            return newPayment;
                        });

                // 🛡️ IDEMPOTENCY GUARD: Prevent duplicate deductions/emails
                if ("CAPTURED".equalsIgnoreCase(payment.getStatus())) {
                    log.info("Payment already verified and captured for Razorpay order: {}", rzpOrderId);
                    return true;
                }

                // 1. Update Payment Record
                payment.setRazorpayPaymentId(paymentId);
                payment.setRazorpaySignature(signature);
                payment.setPaymentMethod("RAZORPAY");
                payment.setStatus("CAPTURED");
                payment.setUpdatedAt(LocalDateTime.now());
                paymentRepository.saveAndFlush(payment);

                // 2. Multi-tier Order Lookup Strategy
                Order order = null;

                // Lookup via dbOrderId passed in DTO
                if (verificationRequest.getDbOrderId() != null) {
                    order = orderRepository.findById(verificationRequest.getDbOrderId()).orElse(null);
                }

                // Fallback: Lookup via Payment entity's orderId
                if (order == null && payment.getOrderId() != null) {
                    order = orderRepository.findById(payment.getOrderId()).orElse(null);
                }

                // Fallback: Direct lookup via razorpayOrderId
                if (order == null && rzpOrderId != null) {
                    order = orderRepository.findByRazorpayOrderId(rzpOrderId).orElse(null);
                }

                // 3. Update user_orders table, generate order_number, deduct stock & send confirmation email
                if (order != null) {
                    order.setOrderDate(new Date());
                    order.setPaymentStatus("SUCCESS");
                    order.setPaymentMethod("RAZORPAY");
                    order.setRazorpayOrderId(rzpOrderId);

                    // 🟢 FIX: Assign Order Number if missing
                    if (order.getOrderNumber() == null || order.getOrderNumber().isBlank()) {
                        order.setOrderNumber(String.format("ORD-%d-%04d", LocalDate.now().getYear(), order.getId()));
                    }

                    orderRepository.saveAndFlush(order);

                    List<String> itemsSummary = new ArrayList<>();

                    // Deduct stock safely
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

                    // Trigger order confirmation and admin alert emails
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

                // Mark payment as FAILED
                Payment payment = paymentRepository.findByRazorpayOrderId(rzpOrderId).orElse(new Payment());
                payment.setStatus("FAILED");
                payment.setUpdatedAt(LocalDateTime.now());
                paymentRepository.saveAndFlush(payment);

                // Mark order status as FAILED in user_orders table
                Order order = null;
                if (verificationRequest.getDbOrderId() != null) {
                    order = orderRepository.findById(verificationRequest.getDbOrderId()).orElse(null);
                }
                if (order == null && payment.getOrderId() != null) {
                    order = orderRepository.findById(payment.getOrderId()).orElse(null);
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

    public Payment getPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId).orElse(null);
    }

    public Payment getPaymentStatus(String razorpayOrderId) {
        return paymentRepository.findByRazorpayOrderId(razorpayOrderId).orElse(null);
    }
}