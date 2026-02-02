package com.ecom.productcatalog.repository;

import com.ecom.productcatalog.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // This will help us find orders for a specific user later
}