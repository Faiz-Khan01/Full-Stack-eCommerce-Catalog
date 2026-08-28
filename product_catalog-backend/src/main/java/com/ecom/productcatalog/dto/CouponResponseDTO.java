package com.ecom.productcatalog.dto;

import java.math.BigDecimal;

public class CouponResponseDTO {
    private String couponCode;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private String message;

    public CouponResponseDTO(String couponCode, BigDecimal discountAmount, BigDecimal finalAmount, String message) {
        this.couponCode = couponCode;
        this.discountAmount = discountAmount;
        this.finalAmount = finalAmount;
        this.message = message;
    }

    // Getters and Setters
    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getFinalAmount() { return finalAmount; }
    public void setFinalAmount(BigDecimal finalAmount) { this.finalAmount = finalAmount; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}