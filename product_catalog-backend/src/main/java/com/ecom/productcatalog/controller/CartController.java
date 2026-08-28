package com.ecom.productcatalog.controller;

import com.ecom.productcatalog.dto.CartItemDTO;
import com.ecom.productcatalog.model.CartItem;
import com.ecom.productcatalog.model.Order;
import com.ecom.productcatalog.repository.OrderRepository;
import com.ecom.productcatalog.service.CartService;
import com.ecom.productcatalog.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal; // Import BigDecimal
import java.util.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = {"https://techstore-catalog.vercel.app", "http://localhost:5173"})
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private OrderRepository orderRepository;

    // Get cart items mapped safely to DTOs under an open transaction
    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<?>> getCart(@RequestParam(required = false) String email) {
        try {
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                        ApiResponse.error("Email parameter is required")
                );
            }

            List<CartItemDTO> cartItems = cartService.getCartItemDTOs(email);

            return ResponseEntity.ok(
                    ApiResponse.success("Cart fetched successfully", cartItems)
            );
        } catch (Exception e) {
            return ResponseEntity.ok(
                    ApiResponse.success("Cart is empty or not created yet", Collections.emptyList())
            );
        }
    }

    // Add to cart
    @PostMapping("/add/{productId}")
    public ResponseEntity<ApiResponse<?>> addToCart(
            @PathVariable Long productId,
            @RequestParam String email,
            @RequestParam(defaultValue = "1") Integer quantity) {
        try {
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                        ApiResponse.error("Email parameter is required")
                );
            }

            CartItem cartItem = cartService.addToCart(email, productId, quantity);
            return ResponseEntity.ok(
                    ApiResponse.success("Product added to cart successfully", cartItem)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error(e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error("Error adding to cart: " + e.getMessage())
            );
        }
    }

    // Update cart item quantity directly
    @PutMapping("/update/{productId}")
    public ResponseEntity<ApiResponse<?>> updateQuantity(
            @PathVariable Long productId,
            @RequestParam String email,
            @RequestParam Integer quantity) {
        try {
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                        ApiResponse.error("Email parameter is required")
                );
            }

            CartItemDTO updatedItem = cartService.updateQuantity(email, productId, quantity);
            return ResponseEntity.ok(
                    ApiResponse.success("Cart updated successfully", updatedItem)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Error updating cart: " + e.getMessage())
            );
        }
    }

    // Remove from cart
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<ApiResponse<?>> removeFromCart(
            @PathVariable Long productId,
            @RequestParam String email) {
        try {
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                        ApiResponse.error("Email parameter is required")
                );
            }

            cartService.removeFromCart(email, productId);
            return ResponseEntity.ok(
                    ApiResponse.success("Item removed from cart successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Error removing from cart: " + e.getMessage())
            );
        }
    }

    // Checkout
    @PostMapping("/buy")
    public ResponseEntity<ApiResponse<?>> buyCart(@RequestParam String email) {
        try {
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                        ApiResponse.error("Email parameter is required")
                );
            }

            List<CartItem> cartItems = cartService.getCartItems(email);
            if (cartItems.isEmpty()) {
                return ResponseEntity.badRequest().body(
                        ApiResponse.error("Cart is empty")
                );
            }

            BigDecimal total = cartService.getCartTotal(email); // Changed from double to BigDecimal
            Order order = new Order();
            order.setUserEmail(email);
            order.setTotalAmount(total); // Ensure Order entity's totalAmount supports BigDecimal
            order.setOrderDate(new Date());
            Order savedOrder = orderRepository.save(order);

            cartService.clearCart(email);

            return ResponseEntity.ok(
                    ApiResponse.success("Purchase successful", savedOrder)
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error("Error processing order: " + e.getMessage())
            );
        }
    }

    // Clear cart
    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<?>> clearCart(@RequestParam String email) {
        try {
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                        ApiResponse.error("Email parameter is required")
                );
            }

            cartService.clearCart(email);
            return ResponseEntity.ok(
                    ApiResponse.success("Cart cleared successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Error clearing cart: " + e.getMessage())
            );
        }
    }
}