package com.ecom.productcatalog.config;

import com.ecom.productcatalog.security.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.Customizer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    // ✅ FIX 1: FULL CORS CONFIG (THIS FIXES YOUR ERROR)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "https://your-vercel-domain.vercel.app"
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())

                // ✅ FIX 2: ENABLE CORS PROPERLY
                .cors(Customizer.withDefaults())

                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth
                        // PUBLIC ENDPOINTS
                        .requestMatchers(
                                "/",
                                "/api/auth/**",
                                "/api/products/**",
                                "/api/categories/**",
                                "/api/cart/**",
                                "/api/images/**",
                                "/images/**"
                        ).permitAll()

                        // PROTECTED
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/orders/**").authenticated()
                        .requestMatchers("/api/profile/**").authenticated()

                        .anyRequest().authenticated()
                )

                // JWT FILTER
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}