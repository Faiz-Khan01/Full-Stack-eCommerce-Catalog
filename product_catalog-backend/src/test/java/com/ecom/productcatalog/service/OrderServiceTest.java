package com.ecom.productcatalog.service;

import com.ecom.productcatalog.dto.OrderDTO;
import com.ecom.productcatalog.model.Order;
import com.ecom.productcatalog.repository.OrderRepository;
import com.ecom.productcatalog.repository.PaymentRepository;
import com.ecom.productcatalog.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private InventoryService inventoryService;

    @Mock
    private EmailService emailService;

    @Mock
    private CartService cartService;

    @Mock
    private CourierService courierService;

    @Mock
    private CouponService couponService;

    @InjectMocks
    private OrderService orderService;

    private Order sampleOrder;

    @BeforeEach
    void setUp() {
        sampleOrder = new Order();
        sampleOrder.setId(501L);
        sampleOrder.setOrderNumber("ORD-2026-501");
        sampleOrder.setUserEmail("customer@example.com");
        sampleOrder.setFullName("Arjun Verma");
        sampleOrder.setMobile("9876543210");
        sampleOrder.setAddress("Mumbai, Maharashtra");
        sampleOrder.setTotalAmount(new BigDecimal("3499.00"));
        sampleOrder.setOrderStatus("PLACED");
        sampleOrder.setItems(new ArrayList<>());
    }

    @Test
    @DisplayName("getOrderById() should return mapped OrderDTO when order exists")
    void testGetOrderById_Found() {
        when(orderRepository.findById(501L)).thenReturn(Optional.of(sampleOrder));

        OrderDTO result = orderService.getOrderById(501L);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(501L);
        assertThat(result.getOrderNumber()).isEqualTo("ORD-2026-501");
        assertThat(result.getTotalAmount()).isEqualByComparingTo("3499.00");
        verify(orderRepository, times(1)).findById(501L);
    }

    @Test
    @DisplayName("getOrderById() should throw RuntimeException when order is missing")
    void testGetOrderById_NotFound() {
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.getOrderById(999L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Order not found with ID: 999");
    }

    @Test
    @DisplayName("getOrdersByUserEmail() should query orders by lowercase customer email")
    void testGetOrdersByUserEmail() {
        when(orderRepository.findByUserEmailIgnoreCase("customer@example.com"))
                .thenReturn(List.of(sampleOrder));

        List<OrderDTO> orders = orderService.getOrdersByUserEmail("customer@example.com");

        assertThat(orders).hasSize(1);
        assertThat(orders.get(0).getUserEmail()).isEqualTo("customer@example.com");
        verify(orderRepository, times(1))
                .findByUserEmailIgnoreCase("customer@example.com");
    }

    @Test
    @DisplayName("getAllOrders() should return all orders mapped to DTOs")
    void testGetAllOrders() {
        Order o2 = new Order();
        o2.setId(502L);
        o2.setOrderNumber("ORD-2026-502");
        o2.setUserEmail("test2@example.com");
        o2.setTotalAmount(new BigDecimal("1999.00"));
        o2.setItems(new ArrayList<>());

        when(orderRepository.findAll()).thenReturn(Arrays.asList(sampleOrder, o2));

        List<OrderDTO> result = orderService.getAllOrders();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getOrderNumber()).isEqualTo("ORD-2026-501");
        verify(orderRepository, times(1)).findAll();
    }
}
