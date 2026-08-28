package com.ecom.productcatalog.controller;

import com.ecom.productcatalog.dto.OrderDTO;
import com.ecom.productcatalog.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // =========================================================
    // GET ALL ORDERS
    // GET /api/orders
    // =========================================================

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {

        return ResponseEntity.ok(
                orderService.getAllOrders()
        );
    }

    // =========================================================
    // GET USER ORDERS
    // GET /api/orders/user/{email}
    // =========================================================

    @GetMapping("/orders/user/{email}")
    public ResponseEntity<List<OrderDTO>> getOrdersByUserEmail(
            @PathVariable String email) {

        return ResponseEntity.ok(
                orderService.getOrdersByUserEmail(email)
        );
    }

    // =========================================================
    // CREATE ORDER
    // POST /api/orders
    // =========================================================

    @PostMapping("/orders")
    public ResponseEntity<?> createOrder(
            @RequestBody OrderDTO orderDTO) {

        try {

            OrderDTO savedOrder =
                    orderService.placeOrder(orderDTO);

            return ResponseEntity.ok(savedOrder);

        } catch (Exception e) {

            System.err.println(
                    "❌ Order Creation Failed: "
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
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(errorResponse);
        }
    }

    // =========================================================
    // GUEST ORDER
    // POST /api/orders/guest
    // =========================================================

    @PostMapping("/orders/guest")
    public ResponseEntity<?> createGuestOrder(
            @RequestBody OrderDTO orderDTO) {

        try {

            OrderDTO savedOrder =
                    orderService.placeOrder(orderDTO);

            return ResponseEntity.ok(savedOrder);

        } catch (Exception e) {

            System.err.println(
                    "❌ Guest Order Failed: "
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
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(errorResponse);
        }
    }

    // =========================================================
    // PLACE ORDER
    // POST /api/orders/place
    // =========================================================

    @PostMapping("/orders/place")
    public ResponseEntity<?> placeOrder(
            @RequestBody OrderDTO orderDTO) {

        try {

            OrderDTO savedOrder =
                    orderService.placeOrder(orderDTO);

            return ResponseEntity.ok(savedOrder);

        } catch (Exception e) {

            System.err.println(
                    "❌ Place Order Failed: "
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
                    e.getMessage()
            );

            return ResponseEntity
                    .internalServerError()
                    .body(errorResponse);
        }
    }

    // =========================================================
    // UPDATE ORDER STATUS
    // PUT /api/orders/{id}/status
    // =========================================================

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        try {

            OrderDTO updatedOrder =
                    orderService.updateOrderStatus(
                            id,
                            status
                    );

            return ResponseEntity.ok(updatedOrder);

        } catch (Exception e) {

            System.err.println(
                    "❌ Order Status Update Failed: "
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
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(errorResponse);
        }
    }

    // =========================================================
    // UPDATE SHIPPING / COURIER INFORMATION
    // PUT /api/orders/{id}/shipping
    // =========================================================

    @PutMapping("/orders/{id}/shipping")
    public ResponseEntity<?> updateShippingInfo(
            @PathVariable Long id,
            @RequestParam(required = false) String courierName,
            @RequestParam(required = false) String trackingNumber,
            @RequestParam(required = false) String trackingUrl) {

        try {

            OrderDTO updatedOrder =
                    orderService.updateShippingInfo(
                            id,
                            courierName,
                            trackingNumber,
                            trackingUrl
                    );

            return ResponseEntity.ok(updatedOrder);

        } catch (Exception e) {

            System.err.println(
                    "❌ Shipping Information Update Failed: "
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
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(errorResponse);
        }
    }

    // =========================================================
    // CANCEL ORDER
    // POST /api/orders/{id}/cancel
    // =========================================================

    @PostMapping("/orders/{id}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long id,
            @RequestParam(required = false) String userEmail,
            @RequestParam(required = false) String reason) {

        try {
            OrderDTO cancelledOrder = orderService.cancelOrder(id, userEmail, reason);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", cancelledOrder);
            response.put("message", "Order #" + id + " has been cancelled successfully.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // =========================================================
    // TRACK ORDER
    // GET /api/orders/track/{query}
    // =========================================================

    @GetMapping("/orders/track/{query}")
    public ResponseEntity<?> trackOrder(@PathVariable String query) {
        try {
            OrderDTO orderDTO = orderService.trackOrderByQuery(query);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", orderDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}