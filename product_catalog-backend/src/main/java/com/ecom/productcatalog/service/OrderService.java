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
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private CartService cartService;

    @Autowired
    private CourierService courierService;

    @Value("${razorpay.key-secret:}")
    private String razorpaySecret;

    private Long parseNumericOrderId(Object rawOrderId) {

        if (rawOrderId == null) {
            return null;
        }

        String orderIdStr = rawOrderId.toString().trim();

        if (orderIdStr.isBlank()) {
            return null;
        }

        try {

            String numericPart =
                    orderIdStr.replaceAll("[^0-9]", "");

            return numericPart.isEmpty()
                    ? null
                    : Long.valueOf(numericPart);

        } catch (Exception e) {

            return null;
        }
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
    public List<OrderDTO> getOrdersByUserEmail(String email) {

        if (email == null || email.trim().isEmpty()) {
            return new ArrayList<>();
        }

        String cleanEmail =
                email.trim().toLowerCase();

        return orderRepository
                .findByUserEmailIgnoreCase(cleanEmail)
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

        if (orderDTO == null) {

            throw new IllegalArgumentException(
                    "Order data cannot be null"
            );
        }

        String cleanUserEmail =
                orderDTO.getUserEmail() == null ||
                        orderDTO.getUserEmail()
                                .trim()
                                .isEmpty()
                        ? "guest@productcatalog.com"
                        : orderDTO.getUserEmail()
                        .trim()
                        .toLowerCase();

        orderDTO.setUserEmail(cleanUserEmail);

        if (orderDTO.getItems() == null ||
                orderDTO.getItems().isEmpty()) {

            throw new IllegalArgumentException(
                    "Order items list cannot be empty"
            );
        }

        BigDecimal calculatedTotal =
                BigDecimal.ZERO;

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

            if (product.getPrice() == null ||
                    product.getPrice()
                            .compareTo(BigDecimal.ZERO) < 0) {

                throw new IllegalArgumentException(
                        "Invalid price for product ID: "
                                + product.getId()
                );
            }

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

            BigDecimal lineTotal =
                    product.getPrice()
                            .multiply(
                                    BigDecimal.valueOf(
                                            itemDto.getQuantity()
                                    )
                            );

            calculatedTotal =
                    calculatedTotal.add(lineTotal);
        }

        if (calculatedTotal.compareTo(
                BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Invalid calculated order total"
            );
        }

        BigDecimal shippingFee = BigDecimal.ZERO;
        if (orderDTO.getShippingFee() != null) {
            shippingFee = orderDTO.getShippingFee();
        } else if (calculatedTotal.compareTo(new BigDecimal("500")) < 0) {
            shippingFee = new BigDecimal("50.00");
        }

        BigDecimal grandTotal = calculatedTotal.add(shippingFee);

        Order order = new Order();

        order.setUserEmail(cleanUserEmail);
        order.setFullName(orderDTO.getFullName());
        order.setMobile(orderDTO.getMobile());
        order.setAddress(orderDTO.getAddress());
        order.setShippingFee(shippingFee);
        order.setTotalAmount(grandTotal);
        order.setOrderDate(new Date());

        String method =
                orderDTO.getPaymentMethod() != null &&
                        !orderDTO.getPaymentMethod()
                                .trim()
                                .isEmpty()
                        ? orderDTO.getPaymentMethod()
                        .trim()
                        .toUpperCase()
                        : "COD";

        order.setPaymentMethod(method);

        order.setOrderStatus("PLACED");
        order.setPaymentStatus("PENDING");

        order.addHistory(new OrderHistory(order, "PLACED", "Origin Hub", "Order placed successfully via " + method));

        if (orderDTO.getRazorpayOrderId() != null &&
                !orderDTO.getRazorpayOrderId()
                        .trim()
                        .isEmpty()) {

            order.setRazorpayOrderId(
                    orderDTO.getRazorpayOrderId()
                            .trim()
            );
        }

        List<String> itemsSummary =
                new ArrayList<>();

        for (OrderItemDTO itemDto :
                orderDTO.getItems()) {

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

            OrderItem item =
                    new OrderItem(
                            product,
                            itemDto.getQuantity(),
                            product.getPrice()
                    );

            order.addItem(item);

            itemsSummary.add(
                    String.format(
                            "%s (x%d) - ₹%s",
                            product.getName(),
                            item.getQuantity(),
                            item.getPrice().toPlainString()
                    )
            );
        }

        Order savedOrder =
                orderRepository.save(order);

        String generatedOrderNumber =
                orderDTO.getOrderNumber() != null &&
                        !orderDTO.getOrderNumber()
                                .isBlank()
                        ? orderDTO.getOrderNumber()
                        .replace("#", "")
                        .trim()
                        : "ORD-"
                        + LocalDate.now().getYear()
                        + "-"
                        + String.format(
                        "%04d",
                        savedOrder.getId()
                );

        savedOrder.setOrderNumber(
                generatedOrderNumber
        );

        savedOrder =
                orderRepository.save(savedOrder);

        if ("COD".equalsIgnoreCase(method)) {

            for (OrderItem item :
                    savedOrder.getItems()) {

                inventoryService.deductStock(
                        item.getProduct().getId(),
                        item.getQuantity()
                );
            }

            triggerOrderEmails(
                    savedOrder,
                    itemsSummary
            );
        }

        return convertToDTO(savedOrder);
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

        String cleanEmail =
                email.trim().toLowerCase();

        List<CartItem> cartItems =
                cartService.getCartItems(cleanEmail);

        if (cartItems == null ||
                cartItems.isEmpty()) {

            throw new RuntimeException(
                    "Cart is empty for user: "
                            + cleanEmail
            );
        }

        if (orderDTO == null) {
            orderDTO = new OrderDTO();
        }

        orderDTO.setUserEmail(cleanEmail);

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

            itemDTO.setPrice(
                    product.getPrice()
            );

            itemDTOs.add(itemDTO);
        }

        if (itemDTOs.isEmpty()) {

            throw new RuntimeException(
                    "No valid products found in cart"
            );
        }

        orderDTO.setItems(itemDTOs);

        OrderDTO placedOrder =
                placeOrder(orderDTO);

        try {

            clearCartSafely(cleanEmail);

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
            orderDTO = new OrderDTO();
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

        itemDTO.setQuantity(1);

        itemDTO.setPrice(
                product.getPrice()
        );

        items.add(itemDTO);

        orderDTO.setItems(items);

        orderDTO.setTotalAmount(
                product.getPrice()
        );

        return placeOrder(orderDTO);
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

        Order order = null;

        if (dbOrderId != null) {

            order =
                    orderRepository
                            .findById(dbOrderId)
                            .orElse(null);
        }

        if (order == null &&
                razorpayOrderId != null &&
                !razorpayOrderId.isBlank()) {

            order =
                    orderRepository
                            .findByRazorpayOrderId(
                                    razorpayOrderId
                            )
                            .orElse(null);
        }

        if (order == null &&
                razorpayOrderId != null &&
                !razorpayOrderId.isBlank()) {

            Payment paymentRecord =
                    paymentRepository
                            .findByRazorpayOrderId(
                                    razorpayOrderId
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

        if (order == null) {

            throw new RuntimeException(
                    "Order not found with DB ID: "
                            + dbOrderId
                            + " or Razorpay ID: "
                            + razorpayOrderId
            );
        }

        if ("SUCCESS".equalsIgnoreCase(
                order.getPaymentStatus()
        )) {

            return convertToDTO(order);
        }

        if (razorpayOrderId == null ||
                razorpayOrderId.isBlank()) {

            throw new IllegalArgumentException(
                    "Razorpay order ID cannot be empty"
            );
        }

        if (order.getRazorpayOrderId() == null ||
                order.getRazorpayOrderId().isBlank()) {

            order.setRazorpayOrderId(
                    razorpayOrderId.trim()
            );
        }

        if (!order.getRazorpayOrderId()
                .equals(
                        razorpayOrderId.trim()
                )) {

            throw new IllegalArgumentException(
                    "Razorpay order ID does not match the order"
            );
        }

        boolean isValid =
                verifyRazorpaySignature(
                        order.getRazorpayOrderId(),
                        razorpayPaymentId,
                        razorpaySignature
                );

        if (!isValid) {

            throw new IllegalArgumentException(
                    "Invalid Razorpay payment signature"
            );
        }

        order.setPaymentStatus("SUCCESS");
        order.setPaymentMethod("RAZORPAY");

        List<String> itemsSummary =
                new ArrayList<>();

        if (order.getItems() != null) {

            for (OrderItem item :
                    order.getItems()) {

                if (item.getProduct() == null) {
                    continue;
                }

                inventoryService.deductStock(
                        item.getProduct().getId(),
                        item.getQuantity()
                );

                itemsSummary.add(
                        String.format(
                                "%s (x%d) - ₹%s",
                                item.getProduct().getName(),
                                item.getQuantity(),
                                item.getPrice() != null
                                        ? item.getPrice()
                                        .toPlainString()
                                        : "0.00"
                        )
                );
            }
        }

        Order updatedOrder =
                orderRepository.save(order);

        triggerOrderEmails(
                updatedOrder,
                itemsSummary
        );

        try {

            if (updatedOrder.getUserEmail() != null) {

                clearCartSafely(
                        updatedOrder.getUserEmail()
                );
            }

        } catch (Exception ignored) {
        }

        return convertToDTO(updatedOrder);
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
    // CLEAR CART SAFELY
    // =========================================================

    @Transactional
    public void clearCartSafely(String email) {

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
                    orderId + "|" + paymentId;

            Mac sha256HMAC =
                    Mac.getInstance("HmacSHA256");

            SecretKeySpec secretKey =
                    new SecretKeySpec(
                            razorpaySecret.getBytes(
                                    StandardCharsets.UTF_8
                            ),
                            "HmacSHA256"
                    );

            sha256HMAC.init(secretKey);

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

                hexString.append(hex);
            }

            return hexString
                    .toString()
                    .equalsIgnoreCase(
                            signature.trim()
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

            String displayOrderId =
                    order.getOrderNumber() != null &&
                            !order.getOrderNumber().isBlank()
                            ? order.getOrderNumber()
                            : String.valueOf(
                            order.getId()
                    );

            String customerName =
                    order.getFullName() != null &&
                            !order.getFullName().isBlank()
                            ? order.getFullName().trim()
                            : order.getUserEmail() != null &&
                            order.getUserEmail().contains("@")
                            ? order.getUserEmail()
                            .split("@")[0]
                            : "Customer";

            String paymentMethod =
                    order.getPaymentMethod() != null &&
                            !order.getPaymentMethod().isBlank()
                            ? order.getPaymentMethod()
                            : "COD";

            String paymentStatus =
                    order.getPaymentStatus() != null &&
                            !order.getPaymentStatus().isBlank()
                            ? order.getPaymentStatus()
                            : "PENDING";

            emailService.sendOrderConfirmationEmail(
                    order.getUserEmail(),
                    customerName,
                    displayOrderId,
                    order.getTotalAmount(),
                    itemsSummary,
                    paymentMethod,
                    paymentStatus
            );

            emailService.sendAdminNewOrderAlert(
                    displayOrderId,
                    order.getTotalAmount(),
                    customerName,
                    paymentMethod,
                    paymentStatus
            );

        } catch (Exception e) {

            System.err.println(
                    "Mail triggering failed for Order #"
                            + order.getId()
                            + ": "
                            + e.getMessage()
            );
        }
    }

    // =========================================================
    // CONVERT ORDER ENTITY TO DTO
    // =========================================================

    @Transactional(readOnly = true)
    public OrderDTO convertToDTO(Order order) {

        if (order == null) {
            return null;
        }

        OrderDTO dto =
                new OrderDTO();

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

        dto.setTotalAmount(
                order.getTotalAmount()
        );

        dto.setOrderDate(
                order.getOrderDate()
        );

        dto.setPaymentStatus(
                order.getPaymentStatus()
        );

        dto.setPaymentMethod(
                order.getPaymentMethod()
        );

        dto.setRazorpayOrderId(
                order.getRazorpayOrderId()
        );

        dto.setShippingFee(
                order.getShippingFee() != null
                        ? order.getShippingFee()
                        : BigDecimal.ZERO
        );

        // =====================================================
        // ORDER STATUS
        // =====================================================

        dto.setOrderStatus(
                order.getOrderStatus()
        );

        // =====================================================
        // SHIPPING / COURIER INFORMATION
        // =====================================================

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
        // ORDER HISTORIES / TIMELINE
        // =====================================================

        if (order.getOrderHistories() != null) {
            List<OrderHistoryDTO> historyDTOs = order.getOrderHistories()
                    .stream()
                    .map(h -> new OrderHistoryDTO(
                            h.getId(),
                            h.getStatus(),
                            h.getLocation(),
                            h.getNotes(),
                            h.getTimestamp()
                    ))
                    .collect(Collectors.toList());
            dto.setOrderHistories(historyDTOs);
        } else {
            dto.setOrderHistories(new ArrayList<>());
        }

        // =====================================================
        // ORDER ITEMS
        // =====================================================

        if (order.getItems() != null) {

            List<OrderItemDTO> itemDTOs =
                    order.getItems()
                            .stream()
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
                            .collect(Collectors.toList());

            dto.setItems(itemDTOs);

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

        order.setOrderStatus(
                newStatus
        );

        String note = "Order status updated to " + newStatus;
        order.addHistory(new OrderHistory(order, newStatus, "Logistics Center", note));

        Order updatedOrder =
                orderRepository.save(order);

        try {
            emailService.sendOrderStatusUpdateEmail(
                    updatedOrder.getUserEmail(),
                    updatedOrder.getFullName(),
                    updatedOrder.getOrderNumber(),
                    newStatus,
                    updatedOrder.getCourierName(),
                    updatedOrder.getTrackingNumber(),
                    updatedOrder.getTrackingUrl()
            );
        } catch (Exception ignored) {}

        return convertToDTO(updatedOrder);
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

        String effectiveCourier = courierName != null && !courierName.trim().isEmpty() ? courierName.trim() : order.getCourierName();
        String effectiveTrackingNo = trackingNumber != null && !trackingNumber.trim().isEmpty() ? trackingNumber.trim() : order.getTrackingNumber();
        String effectiveTrackingUrl = trackingUrl != null && !trackingUrl.trim().isEmpty() ? trackingUrl.trim() : order.getTrackingUrl();

        if ((effectiveTrackingNo == null || effectiveTrackingNo.isEmpty()) && effectiveCourier != null && !effectiveCourier.isEmpty()) {
            Map<String, String> generated = courierService.generateTracking(order, effectiveCourier);
            effectiveTrackingNo = generated.get("trackingNumber");
            effectiveTrackingUrl = generated.get("trackingUrl");
        }

        order.setCourierName(effectiveCourier);
        order.setTrackingNumber(effectiveTrackingNo);
        order.setTrackingUrl(effectiveTrackingUrl);

        if (!"DELIVERED".equalsIgnoreCase(order.getOrderStatus()) && !"CANCELLED".equalsIgnoreCase(order.getOrderStatus())) {
            order.setOrderStatus("SHIPPED");
        }

        order.addHistory(new OrderHistory(
                order,
                "SHIPPED",
                "Distribution Center",
                "Shipment handed over to " + (effectiveCourier != null ? effectiveCourier : "Courier") + " (Tracking #" + (effectiveTrackingNo != null ? effectiveTrackingNo : "N/A") + ")"
        ));

        Order updatedOrder =
                orderRepository.save(order);

        try {
            emailService.sendOrderStatusUpdateEmail(
                    updatedOrder.getUserEmail(),
                    updatedOrder.getFullName(),
                    updatedOrder.getOrderNumber(),
                    updatedOrder.getOrderStatus(),
                    updatedOrder.getCourierName(),
                    updatedOrder.getTrackingNumber(),
                    updatedOrder.getTrackingUrl()
            );
        } catch (Exception ignored) {}

        return convertToDTO(updatedOrder);
    }

    // =========================================================
    // CANCEL ORDER
    // =========================================================

    @Transactional
    public OrderDTO cancelOrder(Long id, String userEmail, String reason) {
        if (id == null) {
            throw new IllegalArgumentException("Order ID cannot be null");
        }

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));

        if (userEmail != null && !userEmail.equalsIgnoreCase("admin") && !userEmail.equalsIgnoreCase(order.getUserEmail())) {
            throw new RuntimeException("Unauthorized: You can only cancel your own orders.");
        }

        String currentStatus = order.getOrderStatus() != null ? order.getOrderStatus().toUpperCase() : "PLACED";
        if ("DELIVERED".equals(currentStatus) || "CANCELLED".equals(currentStatus)) {
            throw new RuntimeException("Order cannot be cancelled in status: " + currentStatus);
        }

        // 1. Restore Inventory
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                if (item.getProduct() != null && item.getQuantity() != null) {
                    inventoryService.restoreStock(item.getProduct().getId(), item.getQuantity());
                }
            }
        }

        // 2. Refund Handling
        String refundStatus = "N/A (COD)";
        if ("SUCCESS".equalsIgnoreCase(order.getPaymentStatus())) {
            order.setPaymentStatus("REFUND_INITIATED");
            refundStatus = "Refund initiated (Amount: ₹" + order.getTotalAmount() + ")";
        }

        // 3. Status Update
        order.setOrderStatus("CANCELLED");
        String cancelReason = (reason != null && !reason.trim().isEmpty()) ? reason.trim() : "Cancelled by user";
        order.addHistory(new OrderHistory(order, "CANCELLED", "Customer Service", "Order cancelled. Reason: " + cancelReason + " | " + refundStatus));

        Order updatedOrder = orderRepository.save(order);

        // 4. Email Alert
        try {
            emailService.sendOrderCancelledEmail(
                    updatedOrder.getUserEmail(),
                    updatedOrder.getFullName(),
                    updatedOrder.getOrderNumber(),
                    refundStatus
            );
        } catch (Exception ignored) {}

        return convertToDTO(updatedOrder);
    }

    // =========================================================
    // TRACK ORDER BY ID OR TRACKING NUMBER
    // =========================================================

    @Transactional(readOnly = true)
    public OrderDTO trackOrderByQuery(String query) {
        if (query == null || query.trim().isEmpty()) {
            throw new IllegalArgumentException("Tracking query cannot be empty");
        }
        String clean = query.trim().replace("#", "");

        // 1. Try orderNumber
        Order order = orderRepository.findByOrderNumber(clean).orElse(null);

        // 2. Try ID
        if (order == null && clean.matches("\\d+")) {
            order = orderRepository.findById(Long.parseLong(clean)).orElse(null);
        }

        // 3. Try tracking number
        if (order == null) {
            order = orderRepository.findAll().stream()
                    .filter(o -> clean.equalsIgnoreCase(o.getTrackingNumber()))
                    .findFirst()
                    .orElse(null);
        }

        if (order == null) {
            throw new RuntimeException("No order found matching: " + query);
        }

        return convertToDTO(order);
    }
}