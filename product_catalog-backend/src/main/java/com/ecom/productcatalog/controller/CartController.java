package com.ecom.productcatalog.controller;

import com.ecom.productcatalog.model.Product;
import com.ecom.productcatalog.model.Order;
import com.ecom.productcatalog.repository.OrderRepository;
import com.ecom.productcatalog.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = {"https://techstore-catalog.vercel.app"})
public class CartController {

    private final ProductService productService;
    private final List<Product> cart = Collections.synchronizedList(new ArrayList<>());

    @Autowired
    private OrderRepository orderRepository;

    public CartController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getCart() {
        return cart;
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<String> addToCart(@PathVariable Long productId) {
        Product product = productService.getProductById(productId);
        if (product != null) {
            cart.add(product);
            return ResponseEntity.ok(product.getName() + " added to cart!");
        }
        return ResponseEntity.badRequest().body("Product not found");
    }

    // NEW METHOD: Removes the item from the backend list so it won't reappear on refresh
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<String> removeFromCart(@PathVariable Long productId) {
        Optional<Product> productToRemove = cart.stream()
                .filter(p -> p.getId().equals(productId))
                .findFirst();

        if (productToRemove.isPresent()) {
            cart.remove(productToRemove.get());
            return ResponseEntity.ok("Item removed from cart");
        }
        return ResponseEntity.badRequest().body("Product not found in cart");
    }

    @PostMapping("/buy/{productId}")
    public ResponseEntity<String> buyProduct(@PathVariable Long productId) {
        Product product = productService.getProductById(productId);
        if (product == null) return ResponseEntity.badRequest().body("Product not found");

        try {
            Order order = new Order();
            order.setUserEmail("guest@example.com");
            order.setTotalAmount(product.getPrice());
            order.setOrderDate(new Date());
            orderRepository.save(order);
            return ResponseEntity.ok("Purchase successful for: " + product.getName());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error saving order: " + e.getMessage());
        }
    }

    @PostMapping("/buy")
    public ResponseEntity<String> buyCart(@RequestParam(defaultValue = "guest@example.com") String email) {
        if (cart.isEmpty()) return ResponseEntity.badRequest().body("Cart is empty");

        try {
            double total = cart.stream().mapToDouble(Product::getPrice).sum();
            Order order = new Order();
            order.setUserEmail(email);
            order.setTotalAmount(total);
            order.setOrderDate(new Date());
            orderRepository.save(order);
            cart.clear();
            return ResponseEntity.ok("Purchase successful!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error saving order: " + e.getMessage());
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart() {
        cart.clear();
        return ResponseEntity.ok("Cart cleared");
    }
}