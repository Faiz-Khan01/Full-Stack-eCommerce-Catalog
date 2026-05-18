package com.ecom.productcatalog.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "user_orders") // 'orders' is a reserved word in many SQL DBs
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;
    private Double totalAmount;
    private Date orderDate;

    @Column(name = "payment_status")
    private String paymentStatus; // PENDING, CAPTURED, FAILED

    @Column(name = "payment_method")
    private String paymentMethod; // razorpay, etc.

    @Column(name = "razorpay_order_id")
    private String razorpayOrderId;

    // Constructors
    public Order() {}
    public Order(String userEmail, Double totalAmount, Date orderDate) {
        this.userEmail = userEmail;
        this.totalAmount = totalAmount;
        this.orderDate = orderDate;
        this.paymentStatus = "PENDING";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public Date getOrderDate() { return orderDate; }
    public void setOrderDate(Date orderDate) { this.orderDate = orderDate; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }
}