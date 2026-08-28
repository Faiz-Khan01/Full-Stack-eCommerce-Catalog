package com.ecom.productcatalog.service;

import com.ecom.productcatalog.dto.CartItemDTO;
import com.ecom.productcatalog.model.Cart;
import com.ecom.productcatalog.model.CartItem;
import com.ecom.productcatalog.model.Product;
import com.ecom.productcatalog.repository.CartItemRepository;
import com.ecom.productcatalog.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductService productService;

    // Helper: Get cart, create if it doesn't exist
    private Cart getOrCreateCartForSafeOps(String userEmail) {
        return cartRepository.findByUserEmail(userEmail)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserEmail(userEmail);
                    newCart.setItems(new ArrayList<>());
                    return cartRepository.save(newCart);
                });
    }

    /**
     * Retrieves cart items as DTOs for safe JSON serialization and prevents lazy-loading exceptions.
     */
    @Transactional(readOnly = true)
    public List<CartItemDTO> getCartItemDTOs(String userEmail) {
        Optional<Cart> cartOpt = cartRepository.findByUserEmail(userEmail);

        if (cartOpt.isEmpty()) {
            return new ArrayList<>();
        }

        Cart cart = cartOpt.get();
        List<CartItemDTO> dtos = new ArrayList<>();

        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                Product p = item.getProduct();
                if (p != null) {
                    CartItemDTO dto = new CartItemDTO();
                    dto.setId(item.getId());
                    dto.setProductId(p.getId());
                    dto.setQuantity(item.getQuantity());
                    dto.setName(p.getName());
                    dto.setDescription(p.getDescription());
                    dto.setImageUrl(p.getImageUrl());
                    dto.setPrice(p.getPrice());
                    dto.setCategoryId(p.getCategory() != null ? p.getCategory().getId() : null);
                    dtos.add(dto);
                }
            }
        }
        return dtos;
    }

    /**
     * Legacy method for internal calculations/checking
     */
    public List<CartItem> getCartItems(String userEmail) {
        Optional<Cart> cartOpt = cartRepository.findByUserEmail(userEmail);
        if (cartOpt.isEmpty()) {
            return new ArrayList<>();
        }
        Cart cart = cartOpt.get();
        return cart.getItems() != null ? cart.getItems() : new ArrayList<>();
    }

    /**
     * Adds an item to the user's cart. Creates cart if it doesn't exist.
     */
    @Transactional
    public CartItem addToCart(String userEmail, Long productId, Integer quantity) {
        Cart cart = getOrCreateCartForSafeOps(userEmail);

        Product product = productService.getProductById(productId);

        if (product == null) {
            throw new RuntimeException("Product not found with ID: " + productId);
        }

        int qtyToAdd = (quantity != null && quantity > 0) ? quantity : 1;

        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getProduct() != null && item.getProduct().getId().equals(productId))
                .findFirst();

        CartItem savedItem;

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + qtyToAdd);
            savedItem = cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(qtyToAdd);

            savedItem = cartItemRepository.save(newItem);
            cart.getItems().add(savedItem);
            cartRepository.save(cart);
        }

        return savedItem;
    }

    /**
     * Updates an existing cart item quantity directly and returns a safe DTO.
     */
    @Transactional
    public CartItemDTO updateQuantity(String userEmail, Long productId, int quantity) {
        Cart cart = getOrCreateCartForSafeOps(userEmail);

        if (quantity <= 0) {
            removeFromCart(userEmail, productId);
            return null;
        }

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct() != null && i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        item.setQuantity(quantity);
        CartItem savedItem = cartItemRepository.save(item);
        cartRepository.save(cart);

        // Map to DTO to prevent Jackson serialization / LazyInitialization errors
        Product p = savedItem.getProduct();
        CartItemDTO dto = new CartItemDTO();
        dto.setId(savedItem.getId());
        dto.setProductId(p != null ? p.getId() : productId);
        dto.setQuantity(savedItem.getQuantity());
        dto.setName(p != null ? p.getName() : null);
        dto.setDescription(p != null ? p.getDescription() : null);
        dto.setImageUrl(p != null ? p.getImageUrl() : null);
        dto.setPrice(p != null ? p.getPrice() : BigDecimal.valueOf(0.0));
        dto.setCategoryId(p != null && p.getCategory() != null ? p.getCategory().getId() : null);

        return dto;
    }

    /**
     * Removes a specific product from the user's cart.
     */
    @Transactional
    public void removeFromCart(String userEmail, Long productId) {
        Optional<Cart> cartOpt = cartRepository.findByUserEmail(userEmail);

        if (cartOpt.isPresent()) {
            Cart cart = cartOpt.get();
            boolean removed = cart.getItems().removeIf(item ->
                    item.getProduct() != null && item.getProduct().getId().equals(productId)
            );

            if (removed) {
                cartRepository.save(cart);
            }
        }
    }

    /**
     * Clears all items from the user's cart.
     */
    @Transactional
    public void clearCart(String userEmail) {
        Optional<Cart> cartOpt = cartRepository.findByUserEmail(userEmail);

        if (cartOpt.isPresent()) {
            Cart cart = cartOpt.get();
            if (cart.getItems() != null) {
                cart.getItems().clear();
                cartRepository.save(cart);
            }
        }
    }

    /**
     * Calculates the total monetary value of the cart.
     */
    @Transactional(readOnly = true)
    public BigDecimal getCartTotal(String userEmail) { // Changed from double to BigDecimal
        Optional<Cart> cartOpt = cartRepository.findByUserEmail(userEmail);

        if (cartOpt.isEmpty()) {
            return BigDecimal.ZERO; // Return BigDecimal.ZERO instead of 0.0
        }

        Cart cart = cartOpt.get();
        return cart.getTotalPrice();
    }
}