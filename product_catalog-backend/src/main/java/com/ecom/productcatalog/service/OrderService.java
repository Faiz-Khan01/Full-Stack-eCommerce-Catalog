package com.ecom.productcatalog.service;

import com.ecom.productcatalog.dto.OrderDTO;
import com.ecom.productcatalog.dto.OrderHistoryDTO;
import com.ecom.productcatalog.dto.OrderItemDTO;
import com.ecom.productcatalog.model.CartItem;
import com.ecom.productcatalog.model.Order;
import com.ecom.productcatalog.model.OrderHistory;
import com.ecom.productcatalog.model.OrderItem;
import com.ecom.productcatalog.model.Payment;
import com.ecom.productcatalog.model.Product;
import com.ecom.productcatalog.repository.OrderRepository;
import com.ecom.productcatalog.repository.PaymentRepository;
import com.ecom.productcatalog.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderService {

    // =========================================================
    // REPOSITORIES
    // =========================================================

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    // =========================================================
    // SERVICES
    // =========================================================

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private CartService cartService;

    @Autowired
    private CourierService courierService;

    @Autowired
    private CouponService couponService;

    // =========================================================
    // RAZORPAY
    // =========================================================

    @Value("${razorpay.key-secret:}")
    private String razorpaySecret;

    // =========================================================
    // CONSTANTS
    // =========================================================

    private static final String GUEST_EMAIL =
            "guest@productcatalog.com";

    private static final String STATUS_PLACED =
            "PLACED";

    private static final String STATUS_SHIPPED =
            "SHIPPED";

    private static final String STATUS_DELIVERED =
            "DELIVERED";

    private static final String STATUS_CANCELLED =
            "CANCELLED";

    private static final String PAYMENT_PENDING =
            "PENDING";

    private static final String PAYMENT_SUCCESS =
            "SUCCESS";

    private static final String PAYMENT_REFUND_INITIATED =
            "REFUND_INITIATED";

    private static final String PAYMENT_COD =
            "COD";

    private static final String PAYMENT_RAZORPAY =
            "RAZORPAY";

    private static final BigDecimal FREE_SHIPPING_THRESHOLD =
            new BigDecimal("500.00");

    private static final BigDecimal DEFAULT_SHIPPING_FEE =
            new BigDecimal("50.00");

    // =========================================================
    // PARSE NUMERIC ORDER ID
    // =========================================================

    private Long parseNumericOrderId(Object rawOrderId) {

        if (rawOrderId == null) {
            return null;
        }

        String orderIdStr =
                rawOrderId.toString().trim();

        if (orderIdStr.isBlank()) {
            return null;
        }

        try {

            String numericPart =
                    orderIdStr.replaceAll("[^0-9]", "");

            if (numericPart.isEmpty()) {
                return null;
            }

            return Long.valueOf(numericPart);

        } catch (Exception e) {

            return null;
        }
    }

    // =========================================================
    // CLEAN EMAIL
    // =========================================================

    private String cleanEmail(String email) {

        if (email == null ||
                email.trim().isEmpty()) {

            return GUEST_EMAIL;
        }

        return email.trim().toLowerCase();
    }

    // =========================================================
    // GET ALL ORDERS
    // =========================================================

    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders() {

        return orderRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET ORDERS BY USER EMAIL
    // =========================================================

    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersByUserEmail(
            String email) {

        if (email == null ||
                email.trim().isEmpty()) {

            return new ArrayList<>();
        }

        String cleanUserEmail =
                email.trim().toLowerCase();

        return orderRepository
                .findByUserEmailIgnoreCase(cleanUserEmail)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET ORDER BY ORDER NUMBER
    // =========================================================

    @Transactional(readOnly = true)
    public OrderDTO getOrderByOrderNumber(
            String orderNumber) {

        if (orderNumber == null ||
                orderNumber.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Order number cannot be null or empty"
            );
        }

        String cleanNumber =
                orderNumber
                        .replace("#", "")
                        .trim();

        Order order =
                orderRepository
                        .findByOrderNumber(cleanNumber)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found with order number: "
                                                + cleanNumber
                                )
                        );

        return convertToDTO(order);
    }

    // =========================================================
    // GET ORDER BY ID
    // =========================================================

    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long id) {

        if (id == null) {

            throw new IllegalArgumentException(
                    "Order ID cannot be null"
            );
        }

        Order order =
                orderRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found with ID: "
                                                + id
                                )
                        );

        return convertToDTO(order);
    }

    // =========================================================
    // PLACE ORDER
    // =========================================================

    @Transactional
    public OrderDTO placeOrder(OrderDTO orderDTO) {

        // -----------------------------------------------------
        // VALIDATE DTO
        // -----------------------------------------------------

        if (orderDTO == null) {

            throw new IllegalArgumentException(
                    "Order data cannot be null"
            );
        }

        // -----------------------------------------------------
        // CLEAN EMAIL
        // -----------------------------------------------------

        String cleanUserEmail =
                cleanEmail(
                        orderDTO.getUserEmail()
                );

        orderDTO.setUserEmail(
                cleanUserEmail
        );

        // -----------------------------------------------------
        // VALIDATE ITEMS
        // -----------------------------------------------------

        if (orderDTO.getItems() == null ||
                orderDTO.getItems().isEmpty()) {

            throw new IllegalArgumentException(
                    "Order items list cannot be empty"
            );
        }

        // =====================================================
        // CALCULATE PRODUCT TOTAL FROM DATABASE
        // =====================================================

        BigDecimal calculatedTotal =
                BigDecimal.ZERO;

        List<Product> validatedProducts =
                new ArrayList<>();

        for (OrderItemDTO itemDto :
                orderDTO.getItems()) {

            if (itemDto == null) {

                throw new IllegalArgumentException(
                        "Order item cannot be null"
                );
            }

            if (itemDto.getProductId() == null) {

                throw new IllegalArgumentException(
                        "Product ID cannot be null in order items"
                );
            }

            if (itemDto.getQuantity() == null ||
                    itemDto.getQuantity() <= 0) {

                throw new IllegalArgumentException(
                        "Product quantity must be greater than zero"
                );
            }

            Product product =
                    productRepository
                            .findById(
                                    itemDto.getProductId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Product not found with ID: "
                                                    + itemDto.getProductId()
                                    )
                            );

            // -------------------------------------------------
            // VALIDATE PRICE
            // -------------------------------------------------

            if (product.getPrice() == null ||
                    product.getPrice()
                            .compareTo(BigDecimal.ZERO) < 0) {

                throw new IllegalArgumentException(
                        "Invalid price for product ID: "
                                + product.getId()
                );
            }

            // -------------------------------------------------
            // CHECK STOCK
            // -------------------------------------------------

            boolean available =
                    inventoryService.isStockAvailable(
                            product.getId(),
                            itemDto.getQuantity()
                    );

            if (!available) {

                throw new RuntimeException(
                        "Insufficient stock for product ID: "
                                + product.getId()
                );
            }

            // -------------------------------------------------
            // CALCULATE LINE TOTAL
            // -------------------------------------------------

            BigDecimal lineTotal =
                    product.getPrice()
                            .multiply(
                                    BigDecimal.valueOf(
                                            itemDto.getQuantity()
                                    )
                            );

            calculatedTotal =
                    calculatedTotal.add(
                            lineTotal
                    );

            validatedProducts.add(product);
        }

        // =====================================================
        // VALIDATE PRODUCT TOTAL
        // =====================================================

        if (calculatedTotal.compareTo(
                BigDecimal.ZERO
        ) <= 0) {

            throw new IllegalArgumentException(
                    "Invalid calculated order total"
            );
        }

        // =====================================================
        // COUPON
        // =====================================================

        BigDecimal discountAmount =
                BigDecimal.ZERO;

        String couponCode =
                null;

        if (orderDTO.getCouponCode() != null &&
                !orderDTO.getCouponCode()
                        .trim()
                        .isEmpty()) {

            couponCode =
                    orderDTO.getCouponCode()
                            .trim()
                            .toUpperCase();

            try {

                discountAmount =
                        couponService.calculateDiscount(
                                couponCode,
                                calculatedTotal
                        );

                if (discountAmount == null) {
                    discountAmount =
                            BigDecimal.ZERO;
                }

            } catch (Exception e) {

                throw new IllegalArgumentException(
                        "Invalid coupon: "
                                + e.getMessage()
                );
            }

            // -------------------------------------------------
            // DISCOUNT CANNOT BE NEGATIVE
            // -------------------------------------------------

            if (discountAmount.compareTo(
                    BigDecimal.ZERO
            ) < 0) {

                discountAmount =
                        BigDecimal.ZERO;
            }

            // -------------------------------------------------
            // DISCOUNT CANNOT EXCEED SUBTOTAL
            // -------------------------------------------------

            if (discountAmount.compareTo(
                    calculatedTotal
            ) > 0) {

                discountAmount =
                        calculatedTotal;
            }
        }

        // =====================================================
        // DISCOUNTED SUBTOTAL
        // =====================================================

        BigDecimal discountedSubtotal =
                calculatedTotal.subtract(
                        discountAmount
                );

        if (discountedSubtotal.compareTo(
                BigDecimal.ZERO
        ) < 0) {

            discountedSubtotal =
                    BigDecimal.ZERO;
        }

        // =====================================================
        // SHIPPING
        // =====================================================

        BigDecimal shippingFee;

        /*
         * IMPORTANT:
         *
         * Frontend shipping fee should ideally NOT be trusted.
         * For security, calculate shipping on backend.
         *
         * Current rule:
         * - >= ₹500 => FREE
         * - < ₹500 => ₹50
         */

        if (discountedSubtotal.compareTo(
                FREE_SHIPPING_THRESHOLD
        ) >= 0) {

            shippingFee =
                    BigDecimal.ZERO;

        } else {

            shippingFee =
                    DEFAULT_SHIPPING_FEE;
        }

        // =====================================================
        // GRAND TOTAL
        // =====================================================

        BigDecimal grandTotal =
                discountedSubtotal
                        .add(shippingFee);

        if (grandTotal.compareTo(
                BigDecimal.ZERO
        ) < 0) {

            grandTotal =
                    BigDecimal.ZERO;
        }

        // =====================================================
        // PAYMENT METHOD
        // =====================================================

        String method =
                orderDTO.getPaymentMethod() != null &&
                        !orderDTO.getPaymentMethod().trim().isEmpty()
                        ? orderDTO.getPaymentMethod()
                        .trim()
                        .toUpperCase()
                        : PAYMENT_COD;

        if ("ONLINE".equals(method)) {
            method = PAYMENT_RAZORPAY;
        }

          //   -----------------------------------------------------
          // VALIDATE PAYMENT METHOD
          // -----------------------------------------------------

        if (!PAYMENT_COD.equals(method) &&
                !PAYMENT_RAZORPAY.equals(method)) {

            throw new IllegalArgumentException(
                    "Unsupported payment method: " + method
            );
        }

        // =====================================================
        // CREATE ORDER ENTITY
        // =====================================================

        Order order =
                new Order();

        order.setUserEmail(
                cleanUserEmail
        );

        order.setFullName(
                orderDTO.getFullName()
        );

        order.setMobile(
                orderDTO.getMobile()
        );

        order.setAddress(
                orderDTO.getAddress()
        );

        // -----------------------------------------------------
        // SERVER CALCULATED VALUES
        // -----------------------------------------------------

        order.setShippingFee(
                shippingFee
        );

        order.setDiscountAmount(
                discountAmount
        );

        order.setCouponCode(
                couponCode
        );

        order.setTotalAmount(
                grandTotal
        );

        // -----------------------------------------------------
        // ORDER DATE
        // -----------------------------------------------------

        order.setOrderDate(
                new Date()
        );

        // -----------------------------------------------------
        // PAYMENT
        // -----------------------------------------------------

        order.setPaymentMethod(
                method
        );

        order.setPaymentStatus(
                PAYMENT_COD.equalsIgnoreCase(method)
                        ? PAYMENT_PENDING
                        : PAYMENT_PENDING
        );

        // -----------------------------------------------------
        // ORDER STATUS
        // -----------------------------------------------------

        order.setOrderStatus(
                STATUS_PLACED
        );

        // =====================================================
        // RAZORPAY ORDER ID
        // =====================================================

        if (orderDTO.getRazorpayOrderId() != null &&
                !orderDTO.getRazorpayOrderId()
                        .trim()
                        .isEmpty()) {

            order.setRazorpayOrderId(
                    orderDTO.getRazorpayOrderId()
                            .trim()
            );
        }

        // =====================================================
        // ORDER HISTORY
        // =====================================================

        String historyMessage =
                "Order placed successfully via "
                        + method;

        if (couponCode != null) {

            historyMessage +=
                    " | Coupon: "
                            + couponCode
                            + " | Discount: ₹"
                            + discountAmount
                            .toPlainString();
        }

        order.addHistory(
                new OrderHistory(
                        order,
                        STATUS_PLACED,
                        "Origin Hub",
                        historyMessage
                )
        );

        // =====================================================
        // ORDER ITEMS
        // =====================================================

        List<String> itemsSummary =
                new ArrayList<>();

        for (int i = 0;
             i < orderDTO.getItems().size();
             i++) {

            OrderItemDTO itemDto =
                    orderDTO.getItems().get(i);

            Product product =
                    validatedProducts.get(i);

            OrderItem item =
                    new OrderItem(
                            product,
                            itemDto.getQuantity(),
                            product.getPrice()
                    );

            order.addItem(
                    item
            );

            itemsSummary.add(
                    String.format(
                            "%s (x%d) - ₹%s",
                            product.getName(),
                            item.getQuantity(),
                            product.getPrice()
                                    .toPlainString()
                    )
            );
        }

        // =====================================================
        // SAVE ORDER
        // =====================================================

        Order savedOrder =
                orderRepository.save(
                        order
                );

        // =====================================================
        // GENERATE ORDER NUMBER
        // =====================================================

        String generatedOrderNumber;

        if (orderDTO.getOrderNumber() != null &&
                !orderDTO.getOrderNumber()
                        .isBlank()) {

            generatedOrderNumber =
                    orderDTO.getOrderNumber()
                            .replace("#", "")
                            .trim();

        } else {

            generatedOrderNumber =
                    "ORD-"
                            + LocalDate.now().getYear()
                            + "-"
                            + String.format(
                            "%04d",
                            savedOrder.getId()
                    );
        }

        savedOrder.setOrderNumber(
                generatedOrderNumber
        );

        savedOrder =
                orderRepository.save(
                        savedOrder
                );

        // =====================================================
        // COD
        // =====================================================

        if (PAYMENT_COD.equalsIgnoreCase(method)) {

            deductInventoryForOrder(
                    savedOrder
            );

            triggerOrderEmails(
                    savedOrder,
                    itemsSummary
            );
        }

        // =====================================================
        // ONLINE PAYMENT
        // =====================================================

        /*
         * IMPORTANT:
         *
         * Online payment order ke time inventory deduct nahi karna.
         *
         * Payment SUCCESS hone ke baad
         * completeOnlineOrder() mein deduct hoga.
         */

        return convertToDTO(
                savedOrder
        );
    }

    // =========================================================
    // CREATE ORDER FROM CART
    // =========================================================

    @Transactional
    public OrderDTO createOrderFromCart(
            String email,
            OrderDTO orderDTO) {

        if (email == null ||
                email.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "User email cannot be null or empty"
            );
        }

        String cleanUserEmail =
                email.trim().toLowerCase();

        List<CartItem> cartItems =
                cartService.getCartItems(
                        cleanUserEmail
                );

        if (cartItems == null ||
                cartItems.isEmpty()) {

            throw new RuntimeException(
                    "Cart is empty for user: "
                            + cleanUserEmail
            );
        }

        if (orderDTO == null) {

            orderDTO =
                    new OrderDTO();
        }

        orderDTO.setUserEmail(
                cleanUserEmail
        );

        List<OrderItemDTO> itemDTOs =
                new ArrayList<>();

        for (CartItem cartItem :
                cartItems) {

            if (cartItem == null ||
                    cartItem.getProduct() == null) {

                continue;
            }

            if (cartItem.getQuantity() == null ||
                    cartItem.getQuantity() <= 0) {

                throw new IllegalArgumentException(
                        "Invalid cart item quantity"
                );
            }

            Product product =
                    cartItem.getProduct();

            if (product.getId() == null) {

                throw new IllegalArgumentException(
                        "Cart product ID cannot be null"
                );
            }

            if (product.getPrice() == null) {

                throw new IllegalArgumentException(
                        "Cart product price cannot be null"
                );
            }

            OrderItemDTO itemDTO =
                    new OrderItemDTO();

            itemDTO.setProductId(
                    product.getId()
            );

            itemDTO.setProductName(
                    product.getName()
            );

            itemDTO.setProductImageUrl(
                    product.getImageUrl()
            );

            itemDTO.setQuantity(
                    cartItem.getQuantity()
            );

            /*
             * This is only informational.
             * placeOrder() uses DB product price.
             */
            itemDTO.setPrice(
                    product.getPrice()
            );

            itemDTOs.add(
                    itemDTO
            );
        }

        if (itemDTOs.isEmpty()) {

            throw new RuntimeException(
                    "No valid products found in cart"
            );
        }

        orderDTO.setItems(
                itemDTOs
        );

        /*
         * Do NOT calculate or trust totalAmount
         * from frontend/cart here.
         *
         * placeOrder() calculates everything
         * from database.
         */

        OrderDTO placedOrder =
                placeOrder(
                        orderDTO
                );

        try {

            clearCartSafely(
                    cleanUserEmail
            );

        } catch (Exception ignored) {
        }

        return placedOrder;
    }

    // =========================================================
    // CREATE DIRECT ORDER
    // =========================================================

    @Transactional
    public OrderDTO createDirectOrder(
            Long productId,
            String email,
            OrderDTO orderDTO) {

        if (productId == null) {

            throw new IllegalArgumentException(
                    "Product ID cannot be null for direct order"
            );
        }

        if (email == null ||
                email.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "User email cannot be null or empty"
            );
        }

        Product product =
                productRepository
                        .findById(productId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found with ID: "
                                                + productId
                                )
                        );

        if (product.getPrice() == null ||
                product.getPrice()
                        .compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Invalid product price"
            );
        }

        if (orderDTO == null) {

            orderDTO =
                    new OrderDTO();
        }

        orderDTO.setUserEmail(
                email.trim().toLowerCase()
        );

        List<OrderItemDTO> items =
                new ArrayList<>();

        OrderItemDTO itemDTO =
                new OrderItemDTO();

        itemDTO.setProductId(
                product.getId()
        );

        itemDTO.setProductName(
                product.getName()
        );

        itemDTO.setProductImageUrl(
                product.getImageUrl()
        );

        itemDTO.setQuantity(
                1
        );

        itemDTO.setPrice(
                product.getPrice()
        );

        items.add(
                itemDTO
        );

        orderDTO.setItems(
                items
        );

        /*
         * Total is recalculated inside placeOrder().
         */

        return placeOrder(
                orderDTO
        );
    }

    // =========================================================
    // COMPLETE ONLINE ORDER
    // =========================================================

    @Transactional
    public OrderDTO completeOnlineOrder(
            Long dbOrderId,
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature) {

        Order order =
                null;

        // -----------------------------------------------------
        // 1. FIND BY DATABASE ORDER ID
        // -----------------------------------------------------

        if (dbOrderId != null) {

            order =
                    orderRepository
                            .findById(
                                    dbOrderId
                            )
                            .orElse(null);
        }

        // -----------------------------------------------------
        // 2. FIND BY RAZORPAY ORDER ID
        // -----------------------------------------------------

        if (order == null &&
                razorpayOrderId != null &&
                !razorpayOrderId.isBlank()) {

            order =
                    orderRepository
                            .findByRazorpayOrderId(
                                    razorpayOrderId.trim()
                            )
                            .orElse(null);
        }

        // -----------------------------------------------------
        // 3. FIND THROUGH PAYMENT RECORD
        // -----------------------------------------------------

        if (order == null &&
                razorpayOrderId != null &&
                !razorpayOrderId.isBlank()) {

            Payment paymentRecord =
                    paymentRepository
                            .findByRazorpayOrderId(
                                    razorpayOrderId.trim()
                            )
                            .orElse(null);

            if (paymentRecord != null &&
                    paymentRecord.getOrderId() != null) {

                Long paymentOrderId =
                        parseNumericOrderId(
                                paymentRecord.getOrderId()
                        );

                if (paymentOrderId != null) {

                    order =
                            orderRepository
                                    .findById(
                                            paymentOrderId
                                    )
                                    .orElse(null);
                }
            }
        }

        // -----------------------------------------------------
        // ORDER NOT FOUND
        // -----------------------------------------------------

        if (order == null) {

            throw new RuntimeException(
                    "Order not found with DB ID: "
                            + dbOrderId
                            + " or Razorpay ID: "
                            + razorpayOrderId
            );
        }

        // -----------------------------------------------------
        // VALIDATE RAZORPAY DATA
        // -----------------------------------------------------

        if (razorpayOrderId == null ||
                razorpayOrderId.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Razorpay order ID cannot be empty"
            );
        }

        if (razorpayPaymentId == null ||
                razorpayPaymentId.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Razorpay payment ID cannot be empty"
            );
        }

        if (razorpaySignature == null ||
                razorpaySignature.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Razorpay signature cannot be empty"
            );
        }

        String cleanRazorpayOrderId =
                razorpayOrderId.trim();

        String cleanRazorpayPaymentId =
                razorpayPaymentId.trim();

        String cleanRazorpaySignature =
                razorpaySignature.trim();

        // -----------------------------------------------------
        // CHECK RAZORPAY ORDER ID
        // -----------------------------------------------------

        if (order.getRazorpayOrderId() == null ||
                order.getRazorpayOrderId().isBlank()) {

            order.setRazorpayOrderId(
                    cleanRazorpayOrderId
            );

        } else if (!order.getRazorpayOrderId()
                .equals(
                        cleanRazorpayOrderId
                )) {

            throw new IllegalArgumentException(
                    "Razorpay order ID does not match the order"
            );
        }

        // -----------------------------------------------------
        // ALREADY PAID
        // -----------------------------------------------------

        if (PAYMENT_SUCCESS.equalsIgnoreCase(
                order.getPaymentStatus()
        )) {

            return convertToDTO(
                    order
            );
        }

        // -----------------------------------------------------
        // VERIFY SIGNATURE
        // -----------------------------------------------------

        boolean validSignature =
                verifyRazorpaySignature(
                        order.getRazorpayOrderId(),
                        cleanRazorpayPaymentId,
                        cleanRazorpaySignature
                );

        if (!validSignature) {

            throw new IllegalArgumentException(
                    "Invalid Razorpay payment signature"
            );
        }

        // =====================================================
        // PAYMENT SUCCESS
        // =====================================================

        order.setPaymentStatus(
                PAYMENT_SUCCESS
        );

        order.setPaymentMethod(
                PAYMENT_RAZORPAY
        );

        // =====================================================
        // ORDER HISTORY
        // =====================================================

        order.addHistory(
                new OrderHistory(
                        order,
                        STATUS_PLACED,
                        "Payment Gateway",
                        "Online payment successful. Razorpay Payment ID: "
                                + cleanRazorpayPaymentId
                )
        );

        // =====================================================
        // INVENTORY
        // =====================================================

        /*
         * Stock is deducted ONLY after successful payment.
         *
         * IMPORTANT:
         * If your inventoryService.deductStock() itself
         * throws when stock is insufficient, the transaction
         * will rolback the payment-status DB change.
         */

        deductInventoryForOrder(
                order
        );

        // =====================================================
        // SAVE
        // =====================================================

        Order updatedOrder =
                orderRepository.save(
                        order
                );

        // =====================================================
        // ITEMS SUMMARY
        // =====================================================

        List<String> itemsSummary =
                buildItemsSummary(
                        updatedOrder
                );

        // =====================================================
        // EMAIL
        // =====================================================

        triggerOrderEmails(
                updatedOrder,
                itemsSummary
        );

        // =====================================================
        // CLEAR CART
        // =====================================================

        try {

            if (updatedOrder.getUserEmail() != null) {

                clearCartSafely(
                        updatedOrder.getUserEmail()
                );
            }

        } catch (Exception ignored) {
        }

        return convertToDTO(
                updatedOrder
        );
    }

    // =========================================================
    // COMPLETE ONLINE ORDER - OVERLOADED
    // =========================================================

    @Transactional
    public OrderDTO completeOnlineOrder(
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature) {

        return completeOnlineOrder(
                null,
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature
        );
    }

    // =========================================================
    // DEDUCT INVENTORY
    // =========================================================

    private void deductInventoryForOrder(
            Order order) {

        if (order == null ||
                order.getItems() == null ||
                order.getItems().isEmpty()) {

            return;
        }

        for (OrderItem item :
                order.getItems()) {

            if (item == null) {
                continue;
            }

            if (item.getProduct() == null) {
                continue;
            }

            if (item.getQuantity() == null ||
                    item.getQuantity() <= 0) {

                throw new IllegalArgumentException(
                        "Invalid quantity for order item"
                );
            }

            inventoryService.deductStock(
                    item.getProduct().getId(),
                    item.getQuantity()
            );
        }
    }

    // =========================================================
    // BUILD ITEMS SUMMARY
    // =========================================================

    private List<String> buildItemsSummary(
            Order order) {

        List<String> itemsSummary =
                new ArrayList<>();

        if (order == null ||
                order.getItems() == null) {

            return itemsSummary;
        }

        for (OrderItem item :
                order.getItems()) {

            if (item == null ||
                    item.getProduct() == null) {

                continue;
            }

            BigDecimal price =
                    item.getPrice() != null
                            ? item.getPrice()
                            : BigDecimal.ZERO;

            int quantity =
                    item.getQuantity() != null
                            ? item.getQuantity()
                            : 0;

            itemsSummary.add(
                    String.format(
                            "%s (x%d) - ₹%s",
                            item.getProduct().getName(),
                            quantity,
                            price.toPlainString()
                    )
            );
        }

        return itemsSummary;
    }

    // =========================================================
    // CLEAR CART SAFELY
    // =========================================================

    @Transactional
    public void clearCartSafely(
            String email) {

        if (email == null ||
                email.trim().isEmpty()) {

            return;
        }

        try {

            cartService.clearCart(
                    email.trim().toLowerCase()
            );

        } catch (Exception e) {

            System.err.println(
                    "Cart clear warning: "
                            + e.getMessage()
            );
        }
    }

    // =========================================================
    // VERIFY RAZORPAY SIGNATURE
    // =========================================================

    private boolean verifyRazorpaySignature(
            String orderId,
            String paymentId,
            String signature) {

        if (razorpaySecret == null ||
                razorpaySecret.isBlank()) {

            System.err.println(
                    "Razorpay secret is not configured"
            );

            return false;
        }

        if (orderId == null ||
                orderId.isBlank() ||
                paymentId == null ||
                paymentId.isBlank() ||
                signature == null ||
                signature.isBlank()) {

            return false;
        }

        try {

            String payload =
                    orderId.trim()
                            + "|"
                            + paymentId.trim();

            Mac sha256HMAC =
                    Mac.getInstance(
                            "HmacSHA256"
                    );

            SecretKeySpec secretKey =
                    new SecretKeySpec(
                            razorpaySecret
                                    .getBytes(
                                            StandardCharsets.UTF_8
                                    ),
                            "HmacSHA256"
                    );

            sha256HMAC.init(
                    secretKey
            );

            byte[] hash =
                    sha256HMAC.doFinal(
                            payload.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );

            StringBuilder hexString =
                    new StringBuilder();

            for (byte b : hash) {

                String hex =
                        Integer.toHexString(
                                0xff & b
                        );

                if (hex.length() == 1) {
                    hexString.append('0');
                }

                hexString.append(
                        hex
                );
            }

            /*
             * Constant-time comparison is preferable
             * for signatures.
             */

            return MessageDigest.isEqual(
                    hexString
                            .toString()
                            .getBytes(
                                    StandardCharsets.UTF_8
                            ),
                    signature
                            .trim()
                            .getBytes(
                                    StandardCharsets.UTF_8
                            )
            );

        } catch (Exception e) {

            System.err.println(
                    "HMAC verification error: "
                            + e.getMessage()
            );

            return false;
        }
    }

    // =========================================================
    // TRIGGER ORDER EMAILS
    // =========================================================

    public void triggerOrderEmails(
            Order order,
            List<String> itemsSummary) {

        if (order == null) {
            return;
        }

        try {

            // -------------------------------------------------
            // CUSTOMER EMAIL
            // -------------------------------------------------

            String customerEmail =
                    order.getUserEmail();

            // -------------------------------------------------
            // ORDER NUMBER
            // -------------------------------------------------

            String displayOrderId =
                    order.getOrderNumber() != null &&
                            !order.getOrderNumber().isBlank()
                            ? order.getOrderNumber()
                            : String.valueOf(
                            order.getId()
                    );

            // -------------------------------------------------
            // CUSTOMER NAME
            // -------------------------------------------------

            String customerName;

            if (order.getFullName() != null &&
                    !order.getFullName().isBlank()) {

                customerName =
                        order.getFullName().trim();

            } else if (order.getUserEmail() != null &&
                    order.getUserEmail().contains("@")) {

                customerName =
                        order.getUserEmail()
                                .split("@")[0];

            } else {

                customerName =
                        "Customer";
            }

            // -------------------------------------------------
            // PAYMENT METHOD
            // -------------------------------------------------

            String paymentMethod =
                    order.getPaymentMethod() != null &&
                            !order.getPaymentMethod().isBlank()
                            ? order.getPaymentMethod()
                            : PAYMENT_COD;

            // -------------------------------------------------
            // PAYMENT STATUS
            // -------------------------------------------------

            String paymentStatus =
                    order.getPaymentStatus() != null &&
                            !order.getPaymentStatus().isBlank()
                            ? order.getPaymentStatus()
                            : PAYMENT_PENDING;

            // -------------------------------------------------
            // SUBTOTAL
            // -------------------------------------------------

            BigDecimal subtotalAmount =
                    BigDecimal.ZERO;

            if (order.getItems() != null) {

                for (OrderItem item :
                        order.getItems()) {

                    if (item == null ||
                            item.getPrice() == null ||
                            item.getQuantity() == null) {

                        continue;
                    }

                    BigDecimal itemTotal =
                            item.getPrice()
                                    .multiply(
                                            BigDecimal.valueOf(
                                                    item.getQuantity()
                                            )
                                    );

                    subtotalAmount =
                            subtotalAmount.add(
                                    itemTotal
                            );
                }
            }

            // -------------------------------------------------
            // DISCOUNT
            // -------------------------------------------------

            BigDecimal discountAmount =
                    order.getDiscountAmount() != null
                            ? order.getDiscountAmount()
                            : BigDecimal.ZERO;

            // -------------------------------------------------
            // COUPON
            // -------------------------------------------------

            String couponCode =
                    order.getCouponCode();

            // -------------------------------------------------
            // SHIPPING
            // -------------------------------------------------

            BigDecimal shippingFee =
                    order.getShippingFee() != null
                            ? order.getShippingFee()
                            : BigDecimal.ZERO;

            // -------------------------------------------------
            // FINAL TOTAL
            // -------------------------------------------------

            BigDecimal totalAmount =
                    order.getTotalAmount() != null
                            ? order.getTotalAmount()
                            : BigDecimal.ZERO;

            // -------------------------------------------------
            // CUSTOMER EMAIL
            // -------------------------------------------------

            if (customerEmail != null &&
                    !customerEmail.isBlank()) {

                emailService.sendOrderConfirmationEmail(
                        customerEmail,
                        customerName,
                        displayOrderId,
                        subtotalAmount,
                        discountAmount,
                        couponCode,
                        totalAmount,
                        itemsSummary,
                        paymentMethod,
                        paymentStatus
                );
            }

            // -------------------------------------------------
            // ADMIN EMAIL
            // -------------------------------------------------

            emailService.sendAdminNewOrderAlert(
                    displayOrderId,
                    totalAmount,
                    customerName,
                    paymentMethod,
                    paymentStatus
            );

            System.out.println(
                    "Order emails triggered successfully"
                            + " | Order: #"
                            + displayOrderId
                            + " | Customer: "
                            + customerEmail
                            + " | Subtotal: ₹"
                            + subtotalAmount
                            + " | Discount: ₹"
                            + discountAmount
                            + " | Coupon: "
                            + couponCode
                            + " | Shipping: ₹"
                            + shippingFee
                            + " | Total: ₹"
                            + totalAmount
            );

        } catch (Exception e) {

            System.err.println(
                    "Mail triggering failed for Order #"
                            + order.getId()
                            + ": "
                            + e.getMessage()
            );

            e.printStackTrace();
        }
    }

    // =========================================================
    // CONVERT ENTITY TO DTO
    // =========================================================

    @Transactional(readOnly = true)
    public OrderDTO convertToDTO(
            Order order) {

        if (order == null) {
            return null;
        }

        OrderDTO dto =
                new OrderDTO();

        // -----------------------------------------------------
        // BASIC INFORMATION
        // -----------------------------------------------------

        dto.setId(
                order.getId()
        );

        dto.setOrderNumber(
                order.getOrderNumber()
        );

        dto.setUserEmail(
                order.getUserEmail()
        );

        dto.setFullName(
                order.getFullName()
        );

        dto.setMobile(
                order.getMobile()
        );

        dto.setAddress(
                order.getAddress()
        );

        // -----------------------------------------------------
        // AMOUNTS
        // -----------------------------------------------------

        dto.setTotalAmount(
                order.getTotalAmount()
        );

        dto.setShippingFee(
                order.getShippingFee() != null
                        ? order.getShippingFee()
                        : BigDecimal.ZERO
        );

        dto.setDiscountAmount(
                order.getDiscountAmount() != null
                        ? order.getDiscountAmount()
                        : BigDecimal.ZERO
        );

        dto.setCouponCode(
                order.getCouponCode()
        );

        // -----------------------------------------------------
        // DATE
        // -----------------------------------------------------

        dto.setOrderDate(
                order.getOrderDate()
        );

        // -----------------------------------------------------
        // PAYMENT
        // -----------------------------------------------------

        dto.setPaymentStatus(
                order.getPaymentStatus()
        );

        dto.setPaymentMethod(
                order.getPaymentMethod()
        );

        dto.setRazorpayOrderId(
                order.getRazorpayOrderId()
        );

        // -----------------------------------------------------
        // ORDER STATUS
        // -----------------------------------------------------

        dto.setOrderStatus(
                order.getOrderStatus()
        );

        // -----------------------------------------------------
        // COURIER
        // -----------------------------------------------------

        dto.setCourierName(
                order.getCourierName()
        );

        dto.setTrackingNumber(
                order.getTrackingNumber()
        );

        dto.setTrackingUrl(
                order.getTrackingUrl()
        );

        // =====================================================
        // ORDER HISTORY
        // =====================================================

        if (order.getOrderHistories() != null) {

            List<OrderHistoryDTO> historyDTOs =
                    order.getOrderHistories()
                            .stream()
                            .filter(h -> h != null)
                            .map(h ->
                                    new OrderHistoryDTO(
                                            h.getId(),
                                            h.getStatus(),
                                            h.getLocation(),
                                            h.getNotes(),
                                            h.getTimestamp()
                                    )
                            )
                            .collect(
                                    Collectors.toList()
                            );

            dto.setOrderHistories(
                    historyDTOs
            );

        } else {

            dto.setOrderHistories(
                    new ArrayList<>()
            );
        }

        // =====================================================
        // ORDER ITEMS
        // =====================================================

        if (order.getItems() != null) {

            List<OrderItemDTO> itemDTOs =
                    order.getItems()
                            .stream()
                            .filter(item -> item != null)
                            .map(item -> {

                                OrderItemDTO itemDto =
                                        new OrderItemDTO();

                                itemDto.setId(
                                        item.getId()
                                );

                                itemDto.setQuantity(
                                        item.getQuantity()
                                );

                                itemDto.setPrice(
                                        item.getPrice()
                                );

                                if (item.getProduct() != null) {

                                    itemDto.setProductId(
                                            item.getProduct().getId()
                                    );

                                    itemDto.setProductName(
                                            item.getProduct().getName()
                                    );

                                    itemDto.setProductImageUrl(
                                            item.getProduct()
                                                    .getImageUrl()
                                    );
                                }

                                return itemDto;

                            })
                            .collect(
                                    Collectors.toList()
                            );

            dto.setItems(
                    itemDTOs
            );

        } else {

            dto.setItems(
                    new ArrayList<>()
            );
        }

        return dto;
    }

    // =========================================================
    // UPDATE ORDER STATUS
    // =========================================================

    @Transactional
    public OrderDTO updateOrderStatus(
            Long id,
            String status) {

        if (id == null) {

            throw new IllegalArgumentException(
                    "Order ID cannot be null"
            );
        }

        if (status == null ||
                status.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Order status cannot be empty"
            );
        }

        String newStatus =
                status.trim().toUpperCase();

        Order order =
                orderRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found with ID: "
                                                + id
                                )
                        );

        String oldStatus =
                order.getOrderStatus();

        // -----------------------------------------------------
        // VALIDATE STATUS
        // -----------------------------------------------------

        List<String> allowedStatuses =
                List.of(
                        STATUS_PLACED,
                        "PROCESSING",
                        STATUS_SHIPPED,
                        "OUT_FOR_DELIVERY",
                        STATUS_DELIVERED,
                        STATUS_CANCELLED
                );

        if (!allowedStatuses.contains(
                newStatus
        )) {

            throw new IllegalArgumentException(
                    "Invalid order status: "
                            + newStatus
            );
        }

        // -----------------------------------------------------
        // UPDATE
        // -----------------------------------------------------

        order.setOrderStatus(
                newStatus
        );

        String note =
                "Order status updated from "
                        + (
                        oldStatus != null
                                ? oldStatus
                                : "UNKNOWN"
                )
                        + " to "
                        + newStatus;

        order.addHistory(
                new OrderHistory(
                        order,
                        newStatus,
                        "Logistics Center",
                        note
                )
        );

        Order updatedOrder =
                orderRepository.save(
                        order
                );

        // -----------------------------------------------------
        // EMAIL
        // -----------------------------------------------------

        try {

            if (updatedOrder.getUserEmail() != null &&
                    !updatedOrder.getUserEmail()
                            .isBlank()) {

                emailService.sendOrderStatusUpdateEmail(
                        updatedOrder.getUserEmail(),
                        updatedOrder.getFullName(),
                        updatedOrder.getOrderNumber(),
                        newStatus,
                        updatedOrder.getCourierName(),
                        updatedOrder.getTrackingNumber(),
                        updatedOrder.getTrackingUrl()
                );
            }

        } catch (Exception e) {

            System.err.println(
                    "Order status email failed: "
                            + e.getMessage()
            );
        }

        return convertToDTO(
                updatedOrder
        );
    }

    // =========================================================
    // UPDATE SHIPPING INFORMATION
    // =========================================================

    @Transactional
    public OrderDTO updateShippingInfo(
            Long id,
            String courierName,
            String trackingNumber,
            String trackingUrl) {

        if (id == null) {

            throw new IllegalArgumentException(
                    "Order ID cannot be null"
            );
        }

        Order order =
                orderRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found with ID: "
                                                + id
                                )
                        );

        String effectiveCourier =
                courierName != null &&
                        !courierName.trim().isEmpty()
                        ? courierName.trim()
                        : order.getCourierName();

        String effectiveTrackingNo =
                trackingNumber != null &&
                        !trackingNumber.trim().isEmpty()
                        ? trackingNumber.trim()
                        : order.getTrackingNumber();

        String effectiveTrackingUrl =
                trackingUrl != null &&
                        !trackingUrl.trim().isEmpty()
                        ? trackingUrl.trim()
                        : order.getTrackingUrl();

        // -----------------------------------------------------
        // GENERATE TRACKING
        // -----------------------------------------------------

        if ((effectiveTrackingNo == null ||
                effectiveTrackingNo.isEmpty()) &&
                effectiveCourier != null &&
                !effectiveCourier.isEmpty()) {

            Map<String, String> generated =
                    courierService.generateTracking(
                            order,
                            effectiveCourier
                    );

            if (generated != null) {

                effectiveTrackingNo =
                        generated.get(
                                "trackingNumber"
                        );

                effectiveTrackingUrl =
                        generated.get(
                                "trackingUrl"
                        );
            }
        }

        // -----------------------------------------------------
        // SET SHIPPING INFO
        // -----------------------------------------------------

        order.setCourierName(
                effectiveCourier
        );

        order.setTrackingNumber(
                effectiveTrackingNo
        );

        order.setTrackingUrl(
                effectiveTrackingUrl
        );

        // -----------------------------------------------------
        // UPDATE STATUS
        // -----------------------------------------------------

        String currentStatus =
                order.getOrderStatus();

        if (!STATUS_DELIVERED.equalsIgnoreCase(
                currentStatus
        ) &&
                !STATUS_CANCELLED.equalsIgnoreCase(
                        currentStatus
                )) {

            order.setOrderStatus(
                    STATUS_SHIPPED
            );
        }

        // -----------------------------------------------------
        // HISTORY
        // -----------------------------------------------------

        order.addHistory(
                new OrderHistory(
                        order,
                        STATUS_SHIPPED,
                        "Distribution Center",
                        "Shipment handed over to "
                                + (
                                effectiveCourier != null
                                        ? effectiveCourier
                                        : "Courier"
                        )
                                + " (Tracking #"
                                + (
                                effectiveTrackingNo != null
                                        ? effectiveTrackingNo
                                        : "N/A"
                        )
                                + ")"
                )
        );

        // -----------------------------------------------------
        // SAVE
        // -----------------------------------------------------

        Order updatedOrder =
                orderRepository.save(
                        order
                );

        // -----------------------------------------------------
        // EMAIL
        // -----------------------------------------------------

        try {

            if (updatedOrder.getUserEmail() != null &&
                    !updatedOrder.getUserEmail()
                            .isBlank()) {

                emailService.sendOrderStatusUpdateEmail(
                        updatedOrder.getUserEmail(),
                        updatedOrder.getFullName(),
                        updatedOrder.getOrderNumber(),
                        updatedOrder.getOrderStatus(),
                        updatedOrder.getCourierName(),
                        updatedOrder.getTrackingNumber(),
                        updatedOrder.getTrackingUrl()
                );
            }

        } catch (Exception e) {

            System.err.println(
                    "Shipping email failed: "
                            + e.getMessage()
            );
        }

        return convertToDTO(
                updatedOrder
        );
    }

    // =========================================================
    // CANCEL ORDER
    // =========================================================

    @Transactional
    public OrderDTO cancelOrder(
            Long id,
            String userEmail,
            String reason) {

        if (id == null) {

            throw new IllegalArgumentException(
                    "Order ID cannot be null"
            );
        }

        Order order =
                orderRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found with ID: "
                                                + id
                                )
                        );

        // =====================================================
        // AUTHORIZATION
        // =====================================================

        if (userEmail != null &&
                !userEmail.trim().isEmpty() &&
                !userEmail.equalsIgnoreCase("admin") &&
                !userEmail.equalsIgnoreCase(
                        order.getUserEmail()
                )) {

            throw new RuntimeException(
                    "Unauthorized: You can only cancel your own orders."
            );
        }

        // =====================================================
        // CURRENT STATUS
        // =====================================================

        String currentStatus =
                order.getOrderStatus() != null
                        ? order.getOrderStatus()
                        .toUpperCase()
                        : STATUS_PLACED;

        if (STATUS_DELIVERED.equals(
                currentStatus
        ) ||
                STATUS_CANCELLED.equals(
                        currentStatus
                )) {

            throw new RuntimeException(
                    "Order cannot be cancelled in status: "
                            + currentStatus
            );
        }

        // =====================================================
        // INVENTORY RESTORE
        // =====================================================

        /*
         * IMPORTANT FIX:
         *
         * Original code always restored inventory.
         *
         * But online orders do NOT deduct inventory until
         * payment succeeds.
         *
         * Therefore:
         *
         * COD:
         *     stock was deducted at placement
         *     => restore stock on cancellation
         *
         * ONLINE + SUCCESS:
         *     stock was deducted after payment
         *     => restore stock on cancellation
         *
         * ONLINE + PENDING:
         *     stock was NOT deducted
         *     => DO NOT restore
         */

        boolean inventoryWasDeducted =
                PAYMENT_COD.equalsIgnoreCase(
                        order.getPaymentMethod()
                )
                        ||
                        PAYMENT_SUCCESS.equalsIgnoreCase(
                                order.getPaymentStatus()
                        );

        if (inventoryWasDeducted &&
                order.getItems() != null) {

            for (OrderItem item :
                    order.getItems()) {

                if (item == null ||
                        item.getProduct() == null ||
                        item.getQuantity() == null ||
                        item.getQuantity() <= 0) {

                    continue;
                }

                inventoryService.restoreStock(
                        item.getProduct().getId(),
                        item.getQuantity()
                );
            }
        }

        // =====================================================
        // REFUND
        // =====================================================

        String refundStatus;

        if (PAYMENT_SUCCESS.equalsIgnoreCase(
                order.getPaymentStatus()
        )) {

            /*
             * NOTE:
             * This only changes DB status.
             * Actual Razorpay refund API call should be handled
             * separately if required.
             */

            order.setPaymentStatus(
                    PAYMENT_REFUND_INITIATED
            );

            refundStatus =
                    "Refund initiated (Amount: ₹"
                            + (
                            order.getTotalAmount() != null
                                    ? order.getTotalAmount()
                                    : BigDecimal.ZERO
                    )
                            + ")";

        } else {

            refundStatus =
                    "N/A (Payment not completed)";
        }

        // =====================================================
        // CANCEL REASON
        // =====================================================

        String cancelReason =
                reason != null &&
                        !reason.trim().isEmpty()
                        ? reason.trim()
                        : "Cancelled by user";

        // =====================================================
        // UPDATE STATUS
        // =====================================================

        order.setOrderStatus(
                STATUS_CANCELLED
        );

        // =====================================================
        // HISTORY
        // =====================================================

        order.addHistory(
                new OrderHistory(
                        order,
                        STATUS_CANCELLED,
                        "Customer Service",
                        "Order cancelled. Reason: "
                                + cancelReason
                                + " | "
                                + refundStatus
                )
        );

        // =====================================================
        // SAVE
        // =====================================================

        Order updatedOrder =
                orderRepository.save(
                        order
                );

        // =====================================================
        // EMAIL
        // =====================================================

        try {

            if (updatedOrder.getUserEmail() != null &&
                    !updatedOrder.getUserEmail()
                            .isBlank()) {

                emailService.sendOrderCancelledEmail(
                        updatedOrder.getUserEmail(),
                        updatedOrder.getFullName(),
                        updatedOrder.getOrderNumber(),
                        refundStatus
                );
            }

        } catch (Exception e) {

            System.err.println(
                    "Cancellation email failed: "
                            + e.getMessage()
            );
        }

        return convertToDTO(
                updatedOrder
        );
    }

    // =========================================================
    // TRACK ORDER
    // =========================================================

    @Transactional(readOnly = true)
    public OrderDTO trackOrderByQuery(
            String query) {

        if (query == null ||
                query.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Tracking query cannot be empty"
            );
        }

        String clean =
                query.trim()
                        .replace("#", "")
                        .trim();

        Order order =
                null;

        // =====================================================
        // 1. ORDER NUMBER
        // =====================================================

        order =
                orderRepository
                        .findByOrderNumber(
                                clean
                        )
                        .orElse(null);

        // =====================================================
        // 2. DATABASE ID
        // =====================================================

        if (order == null &&
                clean.matches("\\d+")) {

            try {

                Long dbId =
                        Long.parseLong(clean);

                order =
                        orderRepository
                                .findById(
                                        dbId
                                )
                                .orElse(null);

            } catch (NumberFormatException ignored) {
            }
        }

        // =====================================================
        // 3. TRACKING NUMBER
        // =====================================================

        if (order == null) {

            /*
             * Current implementation keeps compatibility
             * with your existing repository.
             *
             * Better approach:
             *
             * orderRepository.findByTrackingNumber(clean)
             *
             * Add that repository method if possible.
             */

            order =
                    orderRepository
                            .findAll()
                            .stream()
                            .filter(o ->
                                    o != null &&
                                            o.getTrackingNumber() != null &&
                                            clean.equalsIgnoreCase(
                                                    o.getTrackingNumber()
                                            )
                            )
                            .findFirst()
                            .orElse(null);
        }

        // =====================================================
        // NOT FOUND
        // =====================================================

        if (order == null) {

            throw new RuntimeException(
                    "No order found matching: "
                            + query
            );
        }

        return convertToDTO(
                order
        );
    }
}
