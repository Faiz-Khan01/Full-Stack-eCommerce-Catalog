package com.ecom.productcatalog.controller;

import com.ecom.productcatalog.dto.WishlistDTO;
import com.ecom.productcatalog.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@CrossOrigin
public class WishlistController {

    private final WishlistService wishlistService;

    // =====================================================
    // ADD TO WISHLIST
    // =====================================================

    @PostMapping("/add/{productId}")
    public ResponseEntity<?> addToWishlist(
            @PathVariable Long productId,
            @RequestParam String email
    ) {

        try {

            WishlistDTO wishlist =
                    wishlistService.addToWishlist(
                            productId,
                            email
                    );

            return ResponseEntity.ok(wishlist);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "success", false,
                            "error", e.getMessage()
                    ));

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "success", false,
                            "error", e.getMessage()
                    ));
        }
    }

    // =====================================================
    // REMOVE FROM WISHLIST
    // =====================================================

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeFromWishlist(
            @PathVariable Long productId,
            @RequestParam String email
    ) {

        try {

            wishlistService.removeFromWishlist(
                    productId,
                    email
            );

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message",
                            "Product removed from wishlist"
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "success", false,
                            "error", e.getMessage()
                    ));

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "success", false,
                            "error", e.getMessage()
                    ));
        }
    }

    // =====================================================
    // GET WISHLIST
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getWishlist(
            @RequestParam String email
    ) {

        try {

            List<WishlistDTO> wishlist =
                    wishlistService.getWishlist(email);

            return ResponseEntity.ok(wishlist);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "success", false,
                            "error", e.getMessage()
                    ));
        }
    }

    // =====================================================
    // CHECK PRODUCT
    // =====================================================

    @GetMapping("/check/{productId}")
    public ResponseEntity<?> checkWishlist(
            @PathVariable Long productId,
            @RequestParam String email
    ) {

        try {

            boolean wishlisted =
                    wishlistService.isProductWishlisted(
                            productId,
                            email
                    );

            Map<String, Object> response =
                    new HashMap<>();

            response.put("productId", productId);
            response.put("email", email);
            response.put("wishlisted", wishlisted);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "success", false,
                            "error", e.getMessage()
                    ));
        }
    }

    // =====================================================
    // CLEAR WISHLIST
    // =====================================================

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearWishlist(
            @RequestParam String email
    ) {

        try {

            wishlistService.clearWishlist(email);

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message",
                            "Wishlist cleared successfully"
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "success", false,
                            "error", e.getMessage()
                    ));
        }
    }
}