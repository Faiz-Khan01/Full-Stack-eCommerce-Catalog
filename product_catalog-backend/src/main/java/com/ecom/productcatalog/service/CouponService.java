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

    // =========================================================
    // CREATE COUPON
    // =========================================================

    public Coupon createCoupon(Coupon coupon) {

        if (coupon == null) {
            throw new IllegalArgumentException(
                    "Coupon cannot be null"
            );
        }

        if (coupon.getCode() == null ||
                coupon.getCode().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Coupon code cannot be empty"
            );
        }

        coupon.setCode(
                coupon.getCode()
                        .trim()
                        .toUpperCase()
        );

        return couponRepository.save(coupon);
    }

    // =========================================================
    // GET ALL COUPONS
    // =========================================================

    public List<Coupon> getAllCoupons() {

        return couponRepository.findAll();
    }

    // =========================================================
    // DELETE COUPON
    // =========================================================

    public void deleteCoupon(Long id) {

        if (id == null) {
            throw new IllegalArgumentException(
                    "Coupon ID cannot be null"
            );
        }

        couponRepository.deleteById(id);
    }

    // =========================================================
    // CALCULATE DISCOUNT
    // =========================================================

    /**
     * Validates coupon and returns only the calculated
     * discount amount.
     *
     * This method is used by OrderService.
     *
     * @param code       coupon code
     * @param cartAmount product subtotal before discount
     * @return discount amount
     */
    public BigDecimal calculateDiscount(
            String code,
            BigDecimal cartAmount) {

        Map<String, Object> result =
                validateAndApplyCoupon(
                        code,
                        cartAmount
                );

        Object discountObject =
                result.get("discountAmount");

        if (discountObject == null) {
            return BigDecimal.ZERO;
        }

        if (discountObject instanceof BigDecimal) {
            return (BigDecimal) discountObject;
        }

        return new BigDecimal(
                discountObject.toString()
        );
    }

    // =========================================================
    // VALIDATE AND APPLY COUPON
    // =========================================================

    /**
     * Validates coupon and calculates:
     *
     * - coupon code
     * - discount amount
     * - final amount
     * - success message
     */
    public Map<String, Object> validateAndApplyCoupon(
            String code,
            BigDecimal cartAmount) {

        // -----------------------------------------------------
        // INPUT VALIDATION
        // -----------------------------------------------------

        if (code == null ||
                code.trim().isEmpty()) {

            throw new RuntimeException(
                    "Coupon code cannot be empty!"
            );
        }

        if (cartAmount == null ||
                cartAmount.compareTo(
                        BigDecimal.ZERO
                ) <= 0) {

            throw new RuntimeException(
                    "Cart amount must be greater than zero!"
            );
        }

        // -----------------------------------------------------
        // NORMALIZE INPUT
        // -----------------------------------------------------

        String normalizedCode =
                code.trim().toUpperCase();

        // -----------------------------------------------------
        // FETCH ACTIVE COUPON
        // -----------------------------------------------------

        Coupon coupon =
                couponRepository
                        .findByCodeIgnoreCaseAndActiveTrue(
                                normalizedCode
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid or inactive coupon code"
                                )
                        );

        // -----------------------------------------------------
        // EXPIRY CHECK
        // -----------------------------------------------------

        if (coupon.getExpiryDate() != null &&
                coupon.getExpiryDate()
                        .isBefore(
                                LocalDateTime.now()
                        )) {

            throw new RuntimeException(
                    "Coupon code has expired!"
            );
        }

        // -----------------------------------------------------
        // MINIMUM ORDER AMOUNT
        // -----------------------------------------------------

        if (coupon.getMinOrderAmount() != null &&
                cartAmount.compareTo(
                        coupon.getMinOrderAmount()
                ) < 0) {

            throw new RuntimeException(
                    "Minimum order amount required is ₹"
                            + coupon.getMinOrderAmount()
            );
        }

        // -----------------------------------------------------
        // VALIDATE DISCOUNT VALUE
        // -----------------------------------------------------

        if (coupon.getDiscountValue() == null ||
                coupon.getDiscountValue()
                        .compareTo(
                                BigDecimal.ZERO
                        ) < 0) {

            throw new RuntimeException(
                    "Invalid coupon discount value"
            );
        }

        // =====================================================
        // CALCULATE DISCOUNT
        // =====================================================

        BigDecimal discount =
                BigDecimal.ZERO;

        String discountType =
                coupon.getDiscountType() != null
                        ? coupon.getDiscountType()
                        .trim()
                        .toUpperCase()
                        : "";

        // -----------------------------------------------------
        // PERCENTAGE DISCOUNT
        // -----------------------------------------------------

        if ("PERCENTAGE".equals(
                discountType
        )) {

            /*
             * Example:
             *
             * Cart = ₹1000
             * Discount = 10%
             *
             * Discount = ₹100
             */

            if (coupon.getDiscountValue()
                    .compareTo(
                            BigDecimal.valueOf(100)
                    ) > 0) {

                throw new RuntimeException(
                        "Percentage discount cannot exceed 100%"
                );
            }

            discount =
                    cartAmount
                            .multiply(
                                    coupon.getDiscountValue()
                            )
                            .divide(
                                    BigDecimal.valueOf(100),
                                    2,
                                    RoundingMode.HALF_UP
                            );

            // -------------------------------------------------
            // MAX DISCOUNT CAP
            // -------------------------------------------------

            if (coupon.getMaxDiscountAmount() != null &&
                    coupon.getMaxDiscountAmount()
                            .compareTo(
                                    BigDecimal.ZERO
                            ) >= 0 &&
                    discount.compareTo(
                            coupon.getMaxDiscountAmount()
                    ) > 0) {

                discount =
                        coupon.getMaxDiscountAmount();
            }

        }

        // -----------------------------------------------------
        // FLAT / FIXED DISCOUNT
        // -----------------------------------------------------

        else if ("FLAT".equals(
                discountType
        ) ||
                "FIXED".equals(
                        discountType
                )) {

            discount =
                    coupon.getDiscountValue();

            // -------------------------------------------------
            // MAX DISCOUNT CAP
            // -------------------------------------------------

            if (coupon.getMaxDiscountAmount() != null &&
                    coupon.getMaxDiscountAmount()
                            .compareTo(
                                    BigDecimal.ZERO
                            ) >= 0 &&
                    discount.compareTo(
                            coupon.getMaxDiscountAmount()
                    ) > 0) {

                discount =
                        coupon.getMaxDiscountAmount();
            }

        }

        // -----------------------------------------------------
        // UNSUPPORTED TYPE
        // -----------------------------------------------------

        else {

            throw new RuntimeException(
                    "Unsupported discount type: "
                            + coupon.getDiscountType()
            );
        }

        // =====================================================
        // FINAL SAFETY CHECKS
        // =====================================================

        if (discount == null) {
            discount =
                    BigDecimal.ZERO;
        }

        if (discount.compareTo(
                BigDecimal.ZERO
        ) < 0) {

            discount =
                    BigDecimal.ZERO;
        }

        /*
         * Discount can never be greater than
         * the cart subtotal.
         */
        if (discount.compareTo(
                cartAmount
        ) > 0) {

            discount =
                    cartAmount;
        }

        discount =
                discount.setScale(
                        2,
                        RoundingMode.HALF_UP
                );

        // =====================================================
        // FINAL AMOUNT
        // =====================================================

        BigDecimal finalAmount =
                cartAmount.subtract(
                        discount
                );

        if (finalAmount.compareTo(
                BigDecimal.ZERO
        ) < 0) {

            finalAmount =
                    BigDecimal.ZERO;
        }

        finalAmount =
                finalAmount.setScale(
                        2,
                        RoundingMode.HALF_UP
                );

        // =====================================================
        // RESPONSE
        // =====================================================

        return Map.of(
                "couponCode",
                coupon.getCode(),

                "discountAmount",
                discount,

                "finalAmount",
                finalAmount,

                "message",
                "Coupon applied successfully!"
        );
    }
}