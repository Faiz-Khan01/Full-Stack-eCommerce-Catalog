package com.ecom.productcatalog.controller;

import com.ecom.productcatalog.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test-email")
public class EmailTestController {

    @Autowired
    private EmailService emailService;


    // 1. TEST CUSTOMER ORDER CONFIRMATION EMAIL

    @GetMapping("/customer")
    public ResponseEntity<?> testCustomerEmail(
            @RequestParam String email
    ) {

        List<String> mockItems = List.of(
                "Wireless Gaming Mouse (x1) - ₹1,499.00",
                "Mechanical Keyboard (x1) - ₹3,299.00"
        );

        emailService.sendOrderConfirmationEmail(
                email,
                "Faiz Khan",
                "ORD-99823",
                BigDecimal.valueOf(4798.00),
                mockItems,
                "RAZORPAY",
                "SUCCESS"
        );

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Customer test email sent asynchronously to " + email
                )
        );
    }


    // =========================================================
    // 2. TEST ADMIN NEW ORDER EMAIL
    // =========================================================

    @GetMapping("/admin-order")
    public ResponseEntity<?> testAdminOrderAlert() {

        emailService.sendAdminNewOrderAlert(
                "ORD-99823",
                BigDecimal.valueOf(4798.00),
                "Faiz Khan"
        );

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Admin order alert email sent successfully!"
                )
        );
    }


    // =========================================================
    // 3. TEST ADMIN LOW STOCK EMAIL
    // =========================================================

    @GetMapping("/low-stock")
    public ResponseEntity<?> testLowStockAlert() {

        emailService.sendLowStockAlert(
                "RGB Gaming Mouse Pad",
                2,
                5
        );

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Low stock alert email sent successfully!"
                )
        );
    }
}