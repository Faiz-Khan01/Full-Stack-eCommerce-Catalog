package com.ecom.productcatalog.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {

    // =========================================================
    // BASIC ORDER INFORMATION
    // =========================================================

    private Long id;

    private String orderNumber;

    private String userEmail;

    private String fullName;

    private String mobile;

    private String address;

    // =========================================================
    // ORDER AMOUNTS
    // =========================================================

    /**
     * Final order amount including:
     *
     * Product subtotal
     * - Coupon discount
     * + Shipping fee
     */
    private BigDecimal totalAmount;

    /**
     * Shipping amount calculated by backend.
     */
    private BigDecimal shippingFee;

    /**
     * Coupon code applied to the order.
     *
     * Example:
     * SAVE10
     */
    private String couponCode;

    /**
     * Discount amount calculated by backend.
     *
     * Example:
     * 100.00
     */
    private BigDecimal discountAmount;

    // =========================================================
    // ORDER DATE
    // =========================================================

    private Date orderDate;

    // =========================================================
    // PAYMENT
    // =========================================================

    private String paymentStatus;

    private String paymentMethod;

    private String razorpayOrderId;

    // =========================================================
    // ORDER STATUS
    // =========================================================

    private String orderStatus;

    // =========================================================
    // SHIPPING / COURIER INFORMATION
    // =========================================================

    private String courierName;

    private String trackingNumber;

    private String trackingUrl;

    // =========================================================
    // ORDER ITEMS
    // =========================================================

    private List<OrderItemDTO> items;

    // =========================================================
    // ORDER HISTORY
    // =========================================================

    private List<OrderHistoryDTO> orderHistories;
}