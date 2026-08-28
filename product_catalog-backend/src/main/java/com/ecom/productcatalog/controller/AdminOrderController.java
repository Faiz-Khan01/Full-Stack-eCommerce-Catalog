package com.ecom.productcatalog.controller;

import com.ecom.productcatalog.dto.OrderDTO;
import com.ecom.productcatalog.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(
        origins = {
                "http://localhost:3000",
                "http://localhost:5173",
                "https://techstore-catalog.vercel.app"
        }
)
public class AdminOrderController {

    private final OrderService orderService;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // =========================================================
    // GET ALL ORDERS FOR ADMIN
    // GET /api/admin/orders
    // =========================================================

    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders() {

        try {

            List<OrderDTO> orders =
                    orderService.getAllOrders();

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "success",
                    true
            );

            response.put(
                    "data",
                    orders
            );

            response.put(
                    "count",
                    orders.size()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            System.err.println(
                    "❌ Failed to fetch admin orders: "
                            + e.getMessage()
            );

            e.printStackTrace();

            Map<String, Object> errorResponse =
                    new HashMap<>();

            errorResponse.put(
                    "success",
                    false
            );

            errorResponse.put(
                    "message",
                    "Failed to fetch orders: "
                            + e.getMessage()
            );

            return ResponseEntity
                    .internalServerError()
                    .body(errorResponse);
        }
    }

    // =========================================================
    // UPDATE ORDER SHIPPING INFO
    // PUT /api/admin/orders/{id}/shipping
    // =========================================================

    @org.springframework.web.bind.annotation.PutMapping("/orders/{id}/shipping")
    public ResponseEntity<?> updateShipping(
            @org.springframework.web.bind.annotation.PathVariable Long id,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String courierName,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String trackingNumber,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String trackingUrl,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String status) {

        try {
            if (status != null && !status.trim().isEmpty()) {
                orderService.updateOrderStatus(id, status);
            }

            OrderDTO updated = orderService.updateShippingInfo(
                    id,
                    courierName,
                    trackingNumber,
                    trackingUrl
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", updated);
            response.put("message", "Shipping information updated successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // =========================================================
    // UPDATE ORDER STATUS
    // PUT /api/admin/orders/{id}/status
    // =========================================================

    @org.springframework.web.bind.annotation.PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateStatus(
            @org.springframework.web.bind.annotation.PathVariable Long id,
            @org.springframework.web.bind.annotation.RequestParam String status) {

        try {
            OrderDTO updated = orderService.updateOrderStatus(id, status);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", updated);
            response.put("message", "Order status updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}