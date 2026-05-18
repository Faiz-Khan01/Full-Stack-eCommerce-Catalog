package com.ecom.productcatalog.service;

import com.ecom.productcatalog.dto.PaymentRequest;
import com.ecom.productcatalog.dto.PaymentResponse;
import com.ecom.productcatalog.dto.PaymentVerificationRequest;
import com.ecom.productcatalog.model.Order;
import com.ecom.productcatalog.model.Payment;
import com.ecom.productcatalog.repository.OrderRepository;
import com.ecom.productcatalog.repository.PaymentRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.time.LocalDateTime;
import java.util.Date;

@Service
@Slf4j
public class PaymentService {

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentService(PaymentRepository paymentRepository, OrderRepository orderRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    public PaymentResponse createOrder(PaymentRequest paymentRequest) throws RazorpayException {
        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (paymentRequest.getAmount() * 100)); // Amount in paise
            orderRequest.put("currency", paymentRequest.getCurrency());
            orderRequest.put("receipt", "order_" + paymentRequest.getOrderId());

            com.razorpay.Order razorpayOrder = client.orders.create(orderRequest);

            // Save payment record
            Payment payment = new Payment();
            payment.setOrderId(paymentRequest.getOrderId());
            payment.setRazorpayOrderId(razorpayOrder.get("id"));
            payment.setAmount(paymentRequest.getAmount());
            payment.setCurrency(paymentRequest.getCurrency());
            payment.setStatus("CREATED");
            payment.setUserEmail(paymentRequest.getUserEmail());
            payment.setCreatedAt(LocalDateTime.now());
            payment.setUpdatedAt(LocalDateTime.now());

            paymentRepository.save(payment);

            PaymentResponse response = new PaymentResponse();
            response.setRazorpayOrderId(razorpayOrder.get("id"));
            response.setAmount(paymentRequest.getAmount());
            response.setCurrency(paymentRequest.getCurrency());
            response.setStatus("CREATED");

            log.info("Razorpay order created: {}", (Object) razorpayOrder.get("id"));
            return response;

        } catch (RazorpayException e) {
            log.error("Error creating Razorpay order: ", e);
            throw e;
        }
    }

    public boolean verifyPayment(PaymentVerificationRequest verificationRequest) {
        try {
            String signature = verificationRequest.getRazorpaySignature();
            String orderId = verificationRequest.getRazorpayOrderId();
            String paymentId = verificationRequest.getRazorpayPaymentId();

            // Create signature hash
            String data = orderId + "|" + paymentId;
            String expectedSignature = generateSignature(data, razorpayKeySecret);

            if (expectedSignature.equals(signature)) {
                // Update payment record
                Payment payment = paymentRepository.findByRazorpayOrderId(orderId)
                        .orElse(new Payment());

                payment.setRazorpayPaymentId(paymentId);
                payment.setRazorpaySignature(signature);
                payment.setStatus("CAPTURED");
                payment.setUpdatedAt(LocalDateTime.now());

                paymentRepository.save(payment);

                // Update order status
                if (payment.getOrderId() != null) {
                    Order order = orderRepository.findById(payment.getOrderId()).orElse(null);
                    if (order != null) {
                        order.setOrderDate(new Date());
                        orderRepository.save(order);
                    }
                }

                log.info("Payment verified successfully for order: {}", orderId);
                return true;
            } else {
                log.warn("Payment signature verification failed for order: {}", orderId);
                Payment payment = paymentRepository.findByRazorpayOrderId(orderId)
                        .orElse(new Payment());
                payment.setStatus("FAILED");
                payment.setUpdatedAt(LocalDateTime.now());
                paymentRepository.save(payment);
                return false;
            }
        } catch (Exception e) {
            log.error("Error verifying payment: ", e);
            return false;
        }
    }

    private String generateSignature(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec keySpec = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
            mac.init(keySpec);
            byte[] hashBytes = mac.doFinal(data.getBytes());

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
