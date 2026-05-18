package com.ecom.productcatalog.repository;

import com.ecom.productcatalog.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);
    Optional<Payment> findByOrderId(Long orderId);
    List<Payment> findByUserEmail(String userEmail);
    List<Payment> findByStatus(String status);
}
