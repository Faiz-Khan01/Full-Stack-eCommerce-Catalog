package com.ecom.productcatalog.service;

import com.ecom.productcatalog.model.Cart;
import com.ecom.productcatalog.model.CartItem;
import com.ecom.productcatalog.model.Product;
import com.ecom.productcatalog.repository.CartRepository;
import com.ecom.productcatalog.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    // Get or create cart for user
    public Cart getOrCreateCart(String userEmail) {
        return cartRepository.findByUserEmail(userEmail)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserEmail(userEmail);
                    return cartRepository.save(newCart);
                });
    }

    // Get cart items
    public List<CartItem> getCartItems(String userEmail) {
        Cart cart = getOrCreateCart(userEmail);
        return cart.getItems();
    }

    // Add item to cart
    public CartItem addToCart(String userEmail, Long productId, Integer quantity) {
        Cart cart = getOrCreateCart(userEmail);
        Product product = productService.getProductById(productId);
        
        if (product == null) {
            throw new RuntimeException("Product not found");
        }

        // Check if product already in cart
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + (quantity != null ? quantity : 1));
            return cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity != null ? quantity : 1);
            CartItem savedItem = cartItemRepository.save(newItem);
            cart.getItems().add(savedItem);
            cartRepository.save(cart);
            return savedItem;
        }
    }

    // Remove item from cart
    public void removeFromCart(String userEmail, Long productId) {
        Cart cart = getOrCreateCart(userEmail);
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        cartRepository.save(cart);
    }

    // Clear cart
    public void clearCart(String userEmail) {
        Cart cart = getOrCreateCart(userEmail);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    // Get cart total
    public double getCartTotal(String userEmail) {
        Cart cart = getOrCreateCart(userEmail);
        return cart.getTotalPrice();
    }
}
