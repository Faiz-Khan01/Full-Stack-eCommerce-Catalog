package com.ecom.productcatalog.controller;

import com.ecom.productcatalog.dto.PaymentRequest;
import com.ecom.productcatalog.dto.PaymentResponse;
import com.ecom.productcatalog.dto.PaymentVerificationRequest;
import com.ecom.productcatalog.model.Payment;
import com.ecom.productcatalog.service.PaymentService;
import com.razorpay.RazorpayException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentRequest paymentRequest) {
        try {
            PaymentResponse response = paymentService.createOrder(paymentRequest);
            return ResponseEntity.ok(response);
        } catch (RazorpayException e) {
            log.error("Error creating order: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error creating order: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest verificationRequest) {
        try {
            boolean isVerified = paymentService.verifyPayment(verificationRequest);
            if (isVerified) {
                return ResponseEntity.ok("Payment verified successfully");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Payment verification failed");
            }
        } catch (Exception e) {
            log.error("Error verifying payment: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error verifying payment: " + e.getMessage());
        }
    }

    @GetMapping("/status/{orderId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable Long orderId) {
        try {
            Payment payment = paymentService.getPaymentByOrderId(orderId);
            if (payment != null) {
                return ResponseEntity.ok(payment);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Payment not found for order: " + orderId);
            }
        } catch (Exception e) {
            log.error("Error fetching payment status: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching payment status: " + e.getMessage());
        }
    }
}
