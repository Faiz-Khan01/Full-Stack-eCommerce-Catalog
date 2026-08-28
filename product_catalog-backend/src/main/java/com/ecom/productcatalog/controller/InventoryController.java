package com.ecom.productcatalog.controller;

import com.ecom.productcatalog.model.Product;
import com.ecom.productcatalog.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // 1. Get low-stock products (for Admin Alerts)
    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>> getLowStockProducts() {
        return ResponseEntity.ok(inventoryService.getLowStockProducts());
    }

    // 2. Check stock availability for an item
    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkStock(
            @RequestParam Long productId,
            @RequestParam Integer quantity) {
        boolean available = inventoryService.isStockAvailable(productId, quantity);
        return ResponseEntity.ok(Map.of("available", available));
    }

    // 3. Update product stock level (Admin Restock)
    @PutMapping("/{productId}")
    public ResponseEntity<?> updateStock(
            @PathVariable Long productId,
            @RequestParam Integer stock) {
        try {
            Product updatedProduct = inventoryService.updateStock(productId, stock);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}