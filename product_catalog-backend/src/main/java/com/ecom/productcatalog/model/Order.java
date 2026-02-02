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

    // Constructors
    public Order() {}
    public Order(String userEmail, Double totalAmount, Date orderDate) {
        this.userEmail = userEmail;
        this.totalAmount = totalAmount;
        this.orderDate = orderDate;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public Date getOrderDate() { return orderDate; }
    public void setOrderDate(Date orderDate) { this.orderDate = orderDate; }
}