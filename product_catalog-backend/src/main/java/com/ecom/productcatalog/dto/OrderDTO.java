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

    private Long id;
    private String orderNumber;
    private String userEmail;
    private String fullName;
    private String mobile;
    private String address;
    private BigDecimal totalAmount;
    private Date orderDate;

    private String paymentStatus;
    private String paymentMethod;
    private String razorpayOrderId;

    // Order status
    private String orderStatus;

    // Shipping / Courier information
    private String courierName;
    private String trackingNumber;
    private String trackingUrl;
    private BigDecimal shippingFee;

    private List<OrderItemDTO> items;
    private List<OrderHistoryDTO> orderHistories;
}