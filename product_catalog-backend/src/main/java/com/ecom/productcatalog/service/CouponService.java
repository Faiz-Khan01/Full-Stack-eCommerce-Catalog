package com.ecom.productcatalog.service;

import com.ecom.productcatalog.model.Coupon;
import com.ecom.productcatalog.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class CouponService {

    @Autowired
    private CouponRepository couponRepository;

    public Coupon createCoupon(Coupon coupon) {
        if (coupon.getCode() != null) {
            coupon.setCode(coupon.getCode().toUpperCase().trim());
        }
        return couponRepository.save(coupon);
    }

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    public void deleteCoupon(Long id) {
        couponRepository.deleteById(id);
    }

    // Core Coupon Validation & Discount Calculation
    public Map<String, Object> validateAndApplyCoupon(String code, BigDecimal cartAmount) {

        // Input Validations
        if (code == null || code.trim().isEmpty()) {
            throw new RuntimeException("Coupon code cannot be empty!");
        }

        if (cartAmount == null || cartAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Cart amount must be greater than zero!");
        }

        // Fetch active coupon by code
        Coupon coupon = couponRepository.findByCodeIgnoreCaseAndActiveTrue(code.trim())
                .orElseThrow(() -> new RuntimeException("Invalid or inactive coupon code"));

        // Check 1: Expiry Date
        if (coupon.getExpiryDate() != null && coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Coupon code has expired!");
        }

        // Check 2: Minimum Order Amount (Safe check against null)
        if (coupon.getMinOrderAmount() != null && cartAmount.compareTo(coupon.getMinOrderAmount()) < 0) {
            throw new RuntimeException("Minimum order amount required is ₹" + coupon.getMinOrderAmount());
        }

        // Calculate Discount
        BigDecimal discount = BigDecimal.ZERO;
        String type = coupon.getDiscountType() != null ? coupon.getDiscountType().trim().toUpperCase() : "";

        if ("PERCENTAGE".equals(type)) {
            discount = cartAmount.multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            // Cap the maximum discount if specified
            if (coupon.getMaxDiscountAmount() != null && discount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
                discount = coupon.getMaxDiscountAmount();
            }
        } else if ("FLAT".equals(type) || "FIXED".equals(type)) {
            discount = coupon.getDiscountValue();

            // Cap maximum discount if specified
            if (coupon.getMaxDiscountAmount() != null && discount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
                discount = coupon.getMaxDiscountAmount();
            }
        } else {
            throw new RuntimeException("Unsupported discount type: " + coupon.getDiscountType());
        }

        // Ensure discount does not exceed total cart amount
        if (discount.compareTo(cartAmount) > 0) {
            discount = cartAmount;
        }

        // Final Amount calculation
        BigDecimal finalAmount = cartAmount.subtract(discount);
        if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
            finalAmount = BigDecimal.ZERO;
        }

        return Map.of(
                "couponCode", coupon.getCode(),
                "discountAmount", discount,
                "finalAmount", finalAmount,
                "message", "Coupon applied successfully!"
        );
    }
}