package com.ecom.productcatalog.config;

import com.ecom.productcatalog.security.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Value("${app.frontend.url:https://techstore-catalog-vite.vercel.app}")
    private String frontendUrl;

    // =========================================================
    // CORS
    // =========================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        List<String> allowedOrigins = new ArrayList<>();

        allowedOrigins.add("http://localhost:5173");
        allowedOrigins.add("http://localhost:3000");

        // Production frontend from environment
        if (frontendUrl != null && !frontendUrl.isBlank()) {
            allowedOrigins.add(frontendUrl);
        }

        config.setAllowedOrigins(allowedOrigins);

        config.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
        ));

        config.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin",
                "X-Requested-With"
        ));

        config.setExposedHeaders(List.of(
                "Authorization"
        ));

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                config
        );

        return source;
    }

    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http) throws Exception {

        http

                // -------------------------------------------------
                // CSRF
                // -------------------------------------------------

                .csrf(csrf -> csrf.disable())

                // -------------------------------------------------
                // CORS
                // -------------------------------------------------

                .cors(Customizer.withDefaults())

                // -------------------------------------------------
                // STATELESS JWT
                // -------------------------------------------------

                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // -------------------------------------------------
                // 401 FOR UNAUTHENTICATED REQUESTS
                // -------------------------------------------------

                .exceptionHandling(exceptions ->
                        exceptions.authenticationEntryPoint(
                                new HttpStatusEntryPoint(
                                        HttpStatus.UNAUTHORIZED
                                )
                        )
                )

                // -------------------------------------------------
                // AUTHORIZATION
                // -------------------------------------------------

                .authorizeHttpRequests(auth -> auth

                        // CORS preflight
                        .requestMatchers(
                                org.springframework.http.HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // Health / Render
                        .requestMatchers(
                                "/",
                                "/health",
                                "/error"
                        ).permitAll()

                        // Authentication
                        .requestMatchers(
                                "/api/auth/**",
                                "/oauth2/**",
                                "/login/**"
                        ).permitAll()

                        // Public catalog
                        .requestMatchers(
                                "/api/products/**",
                                "/api/categories",
                                "/api/categories/**"
                        ).permitAll()

                        // Public images
                        .requestMatchers(
                                "/api/images/**",
                                "/images/**",
                                "/uploads/**"
                        ).permitAll()

                        // Guest order
                        .requestMatchers(
                                "/api/orders/guest"
                        ).permitAll()

                        // Reviews
                        // Keep public only if your application
                        // intentionally allows unauthenticated reviews.
                        .requestMatchers(
                                "/api/reviews/**"
                        ).permitAll()

                        // Payment
                        // If payment endpoints require login,
                        // remove this permitAll and authenticate them.
                        .requestMatchers(
                                "/api/payment/**",
                                "/api/payments/**"
                        ).permitAll()

                        // Cart
                        // If cart belongs to logged-in users,
                        // these should be authenticated instead.
                        .requestMatchers(
                                "/api/cart",
                                "/api/cart/**"
                        ).permitAll()

                        // Coupons
                        .requestMatchers(
                                "/api/coupons/**"
                        ).permitAll()

                        // Test email
                        .requestMatchers(
                                "/api/test-email/**"
                        ).permitAll()

                        // ADMIN
                        .requestMatchers(
                                "/api/admin/**"
                        ).hasAnyAuthority(
                                "ADMIN",
                                "ROLE_ADMIN"
                        )

                        // NORMAL USER ORDERS
                        .requestMatchers(
                                "/api/orders/**"
                        ).authenticated()

                        // USERS
                        .requestMatchers(
                                "/api/users/**"
                        ).authenticated()

                        // EVERYTHING ELSE
                        .anyRequest().authenticated()
                )

                // -------------------------------------------------
                // OAUTH2
                // -------------------------------------------------

                .oauth2Login(oauth2 ->
                        oauth2.defaultSuccessUrl(
                                frontendUrl + "/",
                                true
                        )
                )

                // -------------------------------------------------
                // JWT FILTER
                // -------------------------------------------------

                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
