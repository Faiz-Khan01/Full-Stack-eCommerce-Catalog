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

    // =========================================================
    // PRIMARY KEY
    // =========================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================================================
    // CUSTOMER INFORMATION
    // =========================================================

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "address", length = 1000)
    private String address;

    // =========================================================
    // ORDER AMOUNTS
    // =========================================================

    @Column(
            name = "total_amount",
            precision = 10,
            scale = 2
    )
    private BigDecimal totalAmount;

    @Column(
            name = "shipping_fee",
            precision = 10,
            scale = 2
    )
    private BigDecimal shippingFee = BigDecimal.ZERO;

    /**
     * Coupon code applied to this order.
     *
     * Example:
     * SAVE10
     * FLAT100
     */
    @Column(
            name = "coupon_code",
            length = 100
    )
    private String couponCode;

    /**
     * Actual discount amount applied to the order.
     *
     * Example:
     * ₹100.00
     */
    @Column(
            name = "discount_amount",
            precision = 10,
            scale = 2
    )
    private BigDecimal discountAmount = BigDecimal.ZERO;

    // =========================================================
    // ORDER DATE
    // =========================================================

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "order_date")
    private Date orderDate;

    // =========================================================
    // ORDER NUMBER
    // =========================================================

    @Column(
            name = "order_number",
            unique = true
    )
    private String orderNumber;

    // =========================================================
    // PAYMENT
    // =========================================================

    @Column(name = "payment_status")
    private String paymentStatus;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "razorpay_order_id")
    private String razorpayOrderId;

    // =========================================================
    // ORDER STATUS
    // =========================================================

    @Column(name = "order_status")
    private String orderStatus = "PLACED";

    // =========================================================
    // SHIPPING / COURIER
    // =========================================================

    @Column(
            name = "courier_name",
            length = 100
    )
    private String courierName;

    @Column(
            name = "tracking_number",
            length = 100
    )
    private String trackingNumber;

    @Column(
            name = "tracking_url",
            length = 1000
    )
    private String trackingUrl;

    // =========================================================
    // ORDER ITEMS
    // =========================================================

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<OrderItem> items = new ArrayList<>();

    // =========================================================
    // ORDER HISTORY
    // =========================================================

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("timestamp ASC")
    private List<OrderHistory> orderHistories =
            new ArrayList<>();

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

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

        this.discountAmount = BigDecimal.ZERO;

        this.couponCode = null;
    }

    // =========================================================
    // ADD ORDER ITEM
    // =========================================================

    public void addItem(OrderItem item) {

        if (item == null) {
            return;
        }

        if (items == null) {
            items = new ArrayList<>();
        }

        items.add(item);

        item.setOrder(this);
    }

    // =========================================================
    // SET ORDER ITEMS
    // =========================================================

    public void setItems(List<OrderItem> items) {

        this.items = items != null
                ? items
                : new ArrayList<>();

        /*
         * Keep bidirectional relationship synchronized.
         */
        for (OrderItem item : this.items) {

            if (item != null) {
                item.setOrder(this);
            }
        }
    }

    // =========================================================
    // ADD ORDER HISTORY
    // =========================================================

    public void addHistory(OrderHistory history) {

        if (history == null) {
            return;
        }

        if (this.orderHistories == null) {
            this.orderHistories =
                    new ArrayList<>();
        }

        this.orderHistories.add(history);

        history.setOrder(this);
    }
}