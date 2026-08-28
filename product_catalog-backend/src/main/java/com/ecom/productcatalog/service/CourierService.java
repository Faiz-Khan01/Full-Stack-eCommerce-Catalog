package com.ecom.productcatalog.service;

import com.ecom.productcatalog.model.Order;
import com.ecom.productcatalog.model.OrderHistory;

import java.util.List;
import java.util.Map;

public interface CourierService {
    Map<String, String> generateTracking(Order order, String preferredCourier);
    List<OrderHistory> getRealtimeMilestones(String trackingNumber);
    Map<String, Object> calculateShippingRate(String pincode, Double weightKg, Double orderAmount);
}
