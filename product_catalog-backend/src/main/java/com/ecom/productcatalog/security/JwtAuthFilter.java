package com.ecom.productcatalog.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
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

        String path = request.getRequestURI();

        // =====================================================
        // CORS PREFLIGHT
        // =====================================================

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        // =====================================================
        // PUBLIC HEALTH ENDPOINTS
        // =====================================================

        if ("/".equals(path)
                || "/health".equals(path)
                || "/error".equals(path)) {

            filterChain.doFilter(request, response);
            return;
        }

        // =====================================================
        // GET JWT
        // =====================================================

        String authHeader = request.getHeader("Authorization");

        System.out.println(
                "➡️ Incoming URI: " + path +
                        " | Auth Header present: " +
                        (authHeader != null)
        );

        // No Authorization header.
        //
        // DO NOT return 401 here.
        //
        // SecurityConfig will decide whether this
        // endpoint requires authentication.
        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7).trim();

        if (token.isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }

        // =====================================================
        // VALIDATE JWT
        // =====================================================

        try {

            if (!jwtUtils.validateToken(token)) {

                System.out.println(
                        "❌ JWT validation failed."
                );

                filterChain.doFilter(request, response);
                return;
            }

            String email =
                    jwtUtils.getEmailFromToken(token);

            String role =
                    jwtUtils.getRoleFromToken(token);

            // =================================================
            // FORMAT ROLE
            // =================================================

            String formattedRole =
                    (role != null && !role.isBlank())
                            ? role.toUpperCase()
                            : "USER";

            if (!formattedRole.startsWith("ROLE_")) {
                formattedRole =
                        "ROLE_" + formattedRole;
            }

            // =================================================
            // AUTHENTICATION
            // =================================================

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(
                                    new SimpleGrantedAuthority(
                                            formattedRole
                                    )
                            )
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

            System.out.println(
                    "✅ Authenticated user: " + email +
                            " | Role: " + formattedRole
            );

        } catch (Exception e) {

            SecurityContextHolder.clearContext();

            System.out.println(
                    "🔥 JWT error: " + e.getMessage()
            );
        }

        filterChain.doFilter(request, response);
    }
}
