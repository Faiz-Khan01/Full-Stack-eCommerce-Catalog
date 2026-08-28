package com.ecom.productcatalog.service;

import com.ecom.productcatalog.dto.WishlistDTO;
import com.ecom.productcatalog.model.Product;
import com.ecom.productcatalog.model.Wishlist;
import com.ecom.productcatalog.repository.ProductRepository;
import com.ecom.productcatalog.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;

    // =====================================================
    // ADD TO WISHLIST
    // =====================================================

    @Transactional
    public WishlistDTO addToWishlist(Long productId, String email) {

        validateEmail(email);

        if (productId == null) {
            throw new IllegalArgumentException("Product ID is required");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found with ID: " + productId
                        )
                );

        // Already exists
        if (wishlistRepository.existsByUserEmailAndProduct_Id(
                email,
                productId
        )) {

            Wishlist existing = wishlistRepository
                    .findByUserEmailAndProduct_Id(email, productId)
                    .orElseThrow();

            log.info(
                    "Product {} already exists in wishlist for {}",
                    productId,
                    email
            );

            return convertToDTO(existing);
        }

        Wishlist wishlist = new Wishlist();

        wishlist.setUserEmail(email);
        wishlist.setProduct(product);

        Wishlist saved = wishlistRepository.save(wishlist);

        log.info(
                "Product {} added to wishlist for {}",
                productId,
                email
        );

        return convertToDTO(saved);
    }

    // =====================================================
    // REMOVE FROM WISHLIST
    // =====================================================

    @Transactional
    public void removeFromWishlist(Long productId, String email) {

        validateEmail(email);

        if (productId == null) {
            throw new IllegalArgumentException("Product ID is required");
        }

        Wishlist wishlist = wishlistRepository
                .findByUserEmailAndProduct_Id(email, productId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product is not in wishlist"
                        )
                );

        wishlistRepository.delete(wishlist);

        log.info(
                "Product {} removed from wishlist for {}",
                productId,
                email
        );
    }

    // =====================================================
    // GET USER WISHLIST
    // =====================================================

    @Transactional(readOnly = true)
    public List<WishlistDTO> getWishlist(String email) {

        validateEmail(email);

        return wishlistRepository
                .findByUserEmailOrderByCreatedAtDesc(email)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // =====================================================
    // CHECK WISHLIST
    // =====================================================

    @Transactional(readOnly = true)
    public boolean isProductWishlisted(
            Long productId,
            String email
    ) {

        validateEmail(email);

        if (productId == null) {
            return false;
        }

        return wishlistRepository
                .existsByUserEmailAndProduct_Id(
                        email,
                        productId
                );
    }

    // =====================================================
    // CLEAR WISHLIST
    // =====================================================

    @Transactional
    public void clearWishlist(String email) {

        validateEmail(email);

        wishlistRepository.deleteByUserEmail(email);

        log.info(
                "Wishlist cleared for {}",
                email
        );
    }

    // =====================================================
    // CONVERT ENTITY -> DTO
    // =====================================================

    private WishlistDTO convertToDTO(Wishlist wishlist) {

        Product product = wishlist.getProduct();

        WishlistDTO dto = new WishlistDTO();

        dto.setId(wishlist.getId());

        dto.setProductId(product.getId());

        dto.setProductName(product.getName());

        dto.setProductDescription(
                product.getDescription()
        );

        dto.setProductPrice(
                product.getPrice()
        );

        dto.setImageUrl(
                product.getImageUrl()
        );

        dto.setUserEmail(
                wishlist.getUserEmail()
        );

        dto.setWishlisted(true);

        return dto;
    }

    // =====================================================
    // VALIDATE EMAIL
    // =====================================================

    private void validateEmail(String email) {

        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "User email is required"
            );
        }
    }
}