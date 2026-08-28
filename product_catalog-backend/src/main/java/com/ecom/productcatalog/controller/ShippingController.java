package com.ecom.productcatalog.controller;

import com.ecom.productcatalog.service.CourierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/shipping")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "https://techstore-catalog.vercel.app"})
public class ShippingController {

    @Autowired
    private CourierService courierService;

    @GetMapping("/rates")
    public ResponseEntity<?> getShippingRate(
            @RequestParam(required = false, defaultValue = "440001") String pincode,
            @RequestParam(required = false, defaultValue = "1.0") Double weightKg,
            @RequestParam(required = false, defaultValue = "0.0") Double orderAmount) {

        Map<String, Object> rates = courierService.calculateShippingRate(pincode, weightKg, orderAmount);
        return ResponseEntity.ok(rates);
    }

    @GetMapping("/couriers")
    public ResponseEntity<?> getAvailableCouriers() {
        Map<String, Object> response = new HashMap<>();
        response.put("couriers", Arrays.asList("Delhivery", "BlueDart", "DTDC", "Shadowfax", "Ekart"));
        return ResponseEntity.ok(response);
    }
}
