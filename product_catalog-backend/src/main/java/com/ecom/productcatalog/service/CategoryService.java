package com.ecom.productcatalog.service;

import com.ecom.productcatalog.model.Category;
import com.ecom.productcatalog.repository.CategoryRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // Fetch all categories (cached for 60 minutes)
    @Cacheable(value = "categories", key = "'all'")
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Fetch category by ID (cached by category ID)
    @Cacheable(value = "categories", key = "#id")
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    // Create a new category (invalidates categories cache)
    @CacheEvict(value = "categories", allEntries = true)
    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Update an existing category (invalidates both categories and products caches)
    @Caching(evict = {
            @CacheEvict(value = "categories", allEntries = true),
            @CacheEvict(value = "products", allEntries = true)
    })
    public Category updateCategory(Long id, Category updatedCategory) {
        return categoryRepository.findById(id)
                .map(existing -> {
                    existing.setName(updatedCategory.getName());
                    return categoryRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    // Delete a category (invalidates both categories and products caches)
    @Caching(evict = {
            @CacheEvict(value = "categories", allEntries = true),
            @CacheEvict(value = "products", allEntries = true)
    })
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
