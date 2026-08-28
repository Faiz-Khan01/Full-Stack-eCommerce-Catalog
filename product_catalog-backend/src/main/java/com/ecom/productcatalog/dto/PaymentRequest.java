package com.ecom.productcatalog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private String dbOrderId;
    private String orderId;
    private BigDecimal amount;
    private String currency;
    private String userEmail;
    private String description;
    private String couponCode;
}