package com.ecom.productcatalog.service;

import com.ecom.productcatalog.model.Product;
import com.ecom.productcatalog.repository.ProductRepository;
import com.ecom.productcatalog.repository.CategoryRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    // Fetch all products (cached for 15 minutes)
    @Cacheable(value = "products", key = "'all'")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Fetch products by category (cached per category ID)
    @Cacheable(value = "products", key = "'category_' + #categoryId")
    public List<Product> getProductByCategory(Long categoryId) {
        return productRepository.findByCategory_Id(categoryId);
    }

    // Fetch product by ID (cached per product ID)
    @Cacheable(value = "products", key = "#id")
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    // Create a new product (evicts products cache)
    @CacheEvict(value = "products", allEntries = true)
    public Product saveProduct(Product product) {
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            product.setCategory(categoryRepository.findById(product.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found")));
        }
        return productRepository.save(product);
    }

    // Update product (evicts products cache)
    @CacheEvict(value = "products", allEntries = true)
    public Product updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id)
                .map(existing -> {
                    existing.setName(updatedProduct.getName());
                    existing.setDescription(updatedProduct.getDescription());
                    existing.setPrice(updatedProduct.getPrice());
                    existing.setImageUrl(updatedProduct.getImageUrl());
                    if (updatedProduct.getCategory() != null) {
                        existing.setCategory(categoryRepository.findById(updatedProduct.getCategory().getId())
                                .orElseThrow(() -> new RuntimeException("Category not found")));
                    }
                    return productRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    // Delete product (evicts products cache)
    @CacheEvict(value = "products", allEntries = true)
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
