package com.ecom.productcatalog.controller;

import com.ecom.productcatalog.service.CouponService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyCoupon(@RequestBody Map<String, Object> request) {
        try {
            String code = (String) request.get("code");
            BigDecimal cartAmount = new BigDecimal(request.get("cartAmount").toString());

            Map<String, Object> response = couponService.validateAndApplyCoupon(code, cartAmount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}