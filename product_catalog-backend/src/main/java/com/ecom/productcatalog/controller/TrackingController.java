package com.ecom.productcatalog.controller;

import com.ecom.productcatalog.model.OrderHistory;
import com.ecom.productcatalog.service.CourierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tracking")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "https://techstore-catalog.vercel.app"})
public class TrackingController {

    @Autowired
    private CourierService courierService;

    @GetMapping("/{trackingNumber}")
    public ResponseEntity<?> getTrackingMilestones(@PathVariable String trackingNumber) {
        List<OrderHistory> milestones = courierService.getRealtimeMilestones(trackingNumber);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("trackingNumber", trackingNumber);
        response.put("milestones", milestones);
        return ResponseEntity.ok(response);
    }
}
