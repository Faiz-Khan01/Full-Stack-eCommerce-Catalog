package com.ecom.productcatalog.service;

import com.ecom.productcatalog.model.Order;
import com.ecom.productcatalog.model.OrderHistory;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MockCourierServiceImpl implements CourierService {

    private static final Map<String, String> COURIER_TRACKING_URLS = new HashMap<>();

    static {
        COURIER_TRACKING_URLS.put("BlueDart", "https://www.bluedart.com/tracking?numbers=");
        COURIER_TRACKING_URLS.put("Delhivery", "https://www.delhivery.com/track/package/");
        COURIER_TRACKING_URLS.put("DTDC", "https://www.dtdc.in/tracking/shipment-tracking.asp?awb=");
        COURIER_TRACKING_URLS.put("Shadowfax", "https://tracker.shadowfax.in/#/track?awb=");
        COURIER_TRACKING_URLS.put("Ekart", "https://ekartlogistics.com/track/");
    }

    @Override
    public Map<String, String> generateTracking(Order order, String preferredCourier) {
        String courier = (preferredCourier != null && !preferredCourier.trim().isEmpty())
                ? preferredCourier.trim()
                : "Delhivery";

        String prefix = courier.length() >= 3 ? courier.substring(0, 3).toUpperCase() : "EXP";
        long randomSuffix = 100000000L + (long) (Math.random() * 900000000L);
        String trackingNumber = prefix + "-" + (order != null && order.getId() != null ? order.getId() : "0") + "-" + randomSuffix;

        String baseUrl = COURIER_TRACKING_URLS.getOrDefault(courier, "https://www.delhivery.com/track/package/");
        String trackingUrl = baseUrl + trackingNumber;

        Map<String, String> result = new HashMap<>();
        result.put("courierName", courier);
        result.put("trackingNumber", trackingNumber);
        result.put("trackingUrl", trackingUrl);
        return result;
    }

    @Override
    public List<OrderHistory> getRealtimeMilestones(String trackingNumber) {
        List<OrderHistory> milestones = new ArrayList<>();
        Date now = new Date();
        milestones.add(new OrderHistory(null, "PLACED", "Origin Facility", "Order received and manifested"));
        milestones.add(new OrderHistory(null, "PROCESSING", "Fulfillment Hub", "Package packed and quality checked"));
        milestones.add(new OrderHistory(null, "SHIPPED", "In Transit", "Dispatched with tracking #" + trackingNumber));
        return milestones;
    }

    @Override
    public Map<String, Object> calculateShippingRate(String pincode, Double weightKg, Double orderAmount) {
        Map<String, Object> result = new HashMap<>();
        boolean isFree = orderAmount != null && orderAmount >= 500.0;
        double rate = isFree ? 0.0 : 50.0;
        
        result.put("pincode", pincode != null ? pincode : "440001");
        result.put("shippingFee", rate);
        result.put("isFreeShipping", isFree);
        result.put("estimatedDeliveryDays", 3);
        result.put("availableCouriers", Arrays.asList("Delhivery", "BlueDart", "DTDC", "Shadowfax"));
        return result;
    }
}
