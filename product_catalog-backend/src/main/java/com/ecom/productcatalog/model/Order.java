package com.ecom.productcatalog.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "user_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "address", length = 1000)
    private String address;

    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "order_date")
    private Date orderDate;

    @Column(name = "order_number", unique = true)
    private String orderNumber;

    @Column(name = "payment_status")
    private String paymentStatus;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "razorpay_order_id")
    private String razorpayOrderId;

    @Column(name = "order_status")
    private String orderStatus = "PLACED";

    @Column(name = "courier_name", length = 100)
    private String courierName;

    @Column(name = "tracking_number", length = 100)
    private String trackingNumber;

    @Column(name = "tracking_url", length = 1000)
    private String trackingUrl;

    @Column(name = "shipping_fee", precision = 10, scale = 2)
    private BigDecimal shippingFee = BigDecimal.ZERO;

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<OrderItem> items = new ArrayList<>();

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("timestamp ASC")
    private List<OrderHistory> orderHistories = new ArrayList<>();

    public Order(
            String userEmail,
            BigDecimal totalAmount,
            Date orderDate
    ) {
        this.userEmail = userEmail;
        this.totalAmount = totalAmount;
        this.orderDate = orderDate;
        this.paymentStatus = "PENDING";
        this.orderStatus = "PLACED";
        this.shippingFee = BigDecimal.ZERO;
    }

    public void addItem(OrderItem item) {
        if (item == null) {
            return;
        }

        items.add(item);
        item.setOrder(this);
    }

    public void setItems(List<OrderItem> items) {
        this.items = items != null
                ? items
                : new ArrayList<>();
    }

    public void addHistory(OrderHistory history) {
        if (history == null) {
            return;
        }

        if (this.orderHistories == null) {
            this.orderHistories = new ArrayList<>();
        }

        this.orderHistories.add(history);
        history.setOrder(this);
    }
}