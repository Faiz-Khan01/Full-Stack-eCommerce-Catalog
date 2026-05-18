package com.ecom.productcatalog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private String razorpayOrderId;
    private Double amount;
    private String currency;
    private String status;
}
