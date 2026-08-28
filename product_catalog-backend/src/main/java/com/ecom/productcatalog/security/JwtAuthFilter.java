package com.ecom.productcatalog.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String rawPath = request.getRequestURI();
        // Decode URL components (e.g., handles spaces like %20)
        String path = URLDecoder.decode(rawPath, StandardCharsets.UTF_8);

        // 🚀 ONLY bypass endpoints that are TRULY public.
        if (path.startsWith("/api/products") ||
                path.startsWith("/api/auth") ||
                path.startsWith("/api/payment") ||
                path.startsWith("/api/test-email") ||
                path.startsWith("/api/categories") ||
                path.startsWith("/api/cart") ||
                path.startsWith("/api/coupons") ||
                path.startsWith("/api/reviews") ||
                path.startsWith("/images") ||
                path.startsWith("/uploads") ||
                path.endsWith(".png") ||
                path.endsWith(".jpg") ||
                path.endsWith(".jpeg")) {

            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        System.out.println("➡️ Incoming URI: " + path + " | Auth Header present: " + (authHeader != null));

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("❌ Missing or invalid Authorization header for secure route: " + path);
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            if (!jwtUtils.validateToken(token)) {
                System.out.println("❌ JWT Token validation failed (expired, tampered, or invalid key).");
                filterChain.doFilter(request, response);
                return;
            }

            String email = jwtUtils.getEmailFromToken(token);
            String role = jwtUtils.getRoleFromToken(token); // Dynamically extract role from token

            // Format role properly (e.g., ensure "ROLE_" prefix is present)
            String formattedRole = (role != null && !role.isBlank()) ? role.toUpperCase() : "USER";
            if (!formattedRole.startsWith("ROLE_")) {
                formattedRole = "ROLE_" + formattedRole;
            }

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(new SimpleGrantedAuthority(formattedRole))
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            System.out.println("✅ Successfully authenticated user: " + email + " with role: " + formattedRole);

        } catch (Exception e) {
            System.out.println("🔥 JWT Exception error: " + e.getMessage());
            filterChain.doFilter(request, response);
            return;
        }

        filterChain.doFilter(request, response);
    }
}