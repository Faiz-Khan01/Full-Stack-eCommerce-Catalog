package com.ecom.productcatalog.controller;

import com.ecom.productcatalog.dto.PaymentRequest;
import com.ecom.productcatalog.dto.PaymentVerificationRequest;
import com.ecom.productcatalog.model.Order;
import com.ecom.productcatalog.repository.OrderRepository;
import com.ecom.productcatalog.service.PaymentService;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OrderRepository orderRepository;

    @Value("${razorpay.key-id:}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret:}")
    private String razorpayKeySecret;

    /**
     * Safely parse potentially alphanumeric order ID into Long database ID.
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
            String numericPart = orderIdStr.replaceAll("\\D+", "");
            if (numericPart.isEmpty()) {
                return null;
            }
            return Long.parseLong(numericPart);
        } catch (Exception e) {
            System.err.println("Failed to parse order ID [" + orderIdStr + "]: " + e.getMessage());
            return null;
        }
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createRazorpayOrder(@RequestBody PaymentRequest paymentRequest) {
        try {
            Long orderId = parseNumericOrderId(paymentRequest.getOrderId() != null ? paymentRequest.getOrderId() : paymentRequest.getDbOrderId());

            BigDecimal amount = paymentRequest.getAmount() != null
                    ? paymentRequest.getAmount()
                    : BigDecimal.ZERO;

            if (orderId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Order ID is missing or invalid in payment request."));
            }
            if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid order total amount."));
            }

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            BigDecimal amountInPaise = amount.multiply(BigDecimal.valueOf(100));

            JSONObject options = new JSONObject();
            options.put("amount", amountInPaise.intValue());
            options.put("currency", "INR");
            options.put("receipt", "txn_ord_" + orderId);

            com.razorpay.Order razorpayOrder = razorpay.orders.create(options);
            String razorpayOrderId = razorpayOrder.get("id");

            order.setRazorpayOrderId(razorpayOrderId);
            order.setPaymentMethod("RAZORPAY");
            order.setPaymentStatus("PENDING");
            orderRepository.save(order);

            return ResponseEntity.ok(Map.of(
                    "razorpayOrderId", razorpayOrderId,
                    "dbOrderId", order.getId(),
                    "amount", amount,
                    "currency", "INR"
            ));

        } catch (Exception e) {
            System.err.println("❌ Razorpay Order Creation Failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, Object> payload) {
        try {
            PaymentVerificationRequest verificationRequest = new PaymentVerificationRequest();

            Object rawDbOrderId = payload.get("dbOrderId");
            if (rawDbOrderId != null) {
                verificationRequest.setDbOrderId(rawDbOrderId.toString());
            }

            verificationRequest.setRazorpayOrderId((String) payload.get("razorpayOrderId"));
            verificationRequest.setRazorpayPaymentId((String) payload.get("razorpayPaymentId"));
            verificationRequest.setRazorpaySignature((String) payload.get("razorpaySignature"));

            boolean isVerified = paymentService.verifyPayment(verificationRequest);

            if (isVerified) {
                return ResponseEntity.ok(Map.of("message", "Payment verified successfully", "success", true));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Payment signature verification failed."));
            }
        } catch (Exception e) {
            System.err.println("❌ Payment Verification Failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}