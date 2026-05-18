package com.ecom.productcatalog.controller;

import com.ecom.productcatalog.model.Order;
import com.ecom.productcatalog.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"https://techstore-catalog.vercel.app"})
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Improved placeOrder with better error handling
    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody Order order) {
        try {
            if (order.getUserEmail() == null || order.getTotalAmount() <= 0) {
                return ResponseEntity.badRequest().body("Invalid order data");
            }
            order.setOrderDate(new Date());
            Order savedOrder = orderRepository.save(order);
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Database Error: " + e.getMessage());
        }
    }
}