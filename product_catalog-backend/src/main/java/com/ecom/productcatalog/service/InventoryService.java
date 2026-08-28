package com.ecom.productcatalog.service;

import com.ecom.productcatalog.model.Product;
import com.ecom.productcatalog.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InventoryService {

    private static final Logger log = LoggerFactory.getLogger(InventoryService.class);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private EmailService emailService;

    @Transactional(readOnly = true)
    public boolean isStockAvailable(Long productId, Integer requestedQuantity) {
        if (productId == null || requestedQuantity == null || requestedQuantity <= 0) {
            return false;
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        return product.getStockQuantity() != null && product.getStockQuantity() >= requestedQuantity;
    }

    @Transactional
    public void deductStock(Long productId, Integer quantity) {
        if (productId == null || quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Invalid product or quantity for stock deduction");
        }

        Product product = productRepository.findByIdWithLock(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        Integer available = product.getStockQuantity() == null ? 0 : product.getStockQuantity();

        if (available < quantity) {
            throw new RuntimeException("Insufficient stock for product: " + product.getName());
        }

        int updatedStock = available - quantity;
        product.setStockQuantity(updatedStock);
        productRepository.save(product);

        Integer threshold = product.getLowStockThreshold() == null ? 5 : product.getLowStockThreshold();

        if (updatedStock <= threshold) {
            try {
                emailService.sendLowStockAlert(product.getName(), updatedStock, threshold);
            } catch (Exception e) {
                log.warn("Failed to send low-stock mail for {}: {}", product.getName(), e.getMessage());
            }
        }
    }

    @Transactional
    public Product updateStock(Long productId, Integer newStockQuantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        product.setStockQuantity(newStockQuantity);
        return productRepository.save(product);
    }

    @Transactional
    public void restoreStock(Long productId, Integer quantity) {
        if (productId == null || quantity == null || quantity <= 0) {
            return;
        }
        Product product = productRepository.findById(productId).orElse(null);
        if (product != null) {
            int current = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
            product.setStockQuantity(current + quantity);
            productRepository.save(product);
        }
    }

    @Transactional(readOnly = true)
    public List<Product> getLowStockProducts() {
        return productRepository.findLowStockProducts();
    }
}