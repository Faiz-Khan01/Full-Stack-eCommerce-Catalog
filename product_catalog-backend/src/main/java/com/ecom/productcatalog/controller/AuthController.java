package com.ecom.productcatalog.controller;

import com.ecom.productcatalog.model.User;
import com.ecom.productcatalog.repository.UserRepository;
import com.ecom.productcatalog.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
        "https://techstore-catalog-vite.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000"
})
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    // =====================================================
    // REGISTER
    // =====================================================

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        try {

            // -----------------------------
            // Validate email
            // -----------------------------
            if (user.getEmail() == null ||
                    user.getEmail().trim().isEmpty()) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "message",
                                "Email is required."
                        ));
            }

            String email = user.getEmail()
                    .trim()
                    .toLowerCase();

            // -----------------------------
            // Validate password
            // -----------------------------
            if (user.getPassword() == null ||
                    user.getPassword().trim().isEmpty()) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "message",
                                "Password is required."
                        ));
            }

            // -----------------------------
            // Check existing email
            // -----------------------------
            if (userRepository.existsByEmail(email)) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "message",
                                "Error: Email is already in use!"
                        ));
            }

            // -----------------------------
            // Normalize user data
            // -----------------------------
            user.setEmail(email);

            if (user.getRole() == null ||
                    user.getRole().trim().isEmpty()) {

                user.setRole("USER");

            } else {

                user.setRole(
                        user.getRole()
                                .trim()
                                .toUpperCase()
                                .replace("ROLE_", "")
                );
            }

            // -----------------------------
            // Encrypt password
            // -----------------------------
            user.setPassword(
                    passwordEncoder.encode(user.getPassword())
            );

            // -----------------------------
            // Save user
            // -----------------------------
            User savedUser = userRepository.save(user);

            // -----------------------------
            // Response
            // -----------------------------
            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "User registered successfully!"
            );

            response.put(
                    "id",
                    savedUser.getId()
            );

            response.put(
                    "name",
                    savedUser.getName()
            );

            response.put(
                    "email",
                    savedUser.getEmail()
            );

            response.put(
                    "role",
                    savedUser.getRole()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            return ResponseEntity.status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(Map.of(
                            "message",
                            "Registration failed.",
                            "error",
                            e.getMessage()
                    ));
        }
    }

    // =====================================================
    // LOGIN
    // =====================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> loginData) {

        try {

            String email = loginData.get("email");
            String password = loginData.get("password");

            // -----------------------------
            // Validate input
            // -----------------------------
            if (email == null ||
                    email.trim().isEmpty() ||
                    password == null ||
                    password.trim().isEmpty()) {

                return ResponseEntity.status(
                                HttpStatus.BAD_REQUEST
                        )
                        .body(Map.of(
                                "message",
                                "Email and password are required."
                        ));
            }

            email = email.trim().toLowerCase();

            // -----------------------------
            // Find user
            // -----------------------------
            Optional<User> userOptional =
                    userRepository.findByEmail(email);

            if (userOptional.isEmpty()) {

                return ResponseEntity.status(
                                HttpStatus.UNAUTHORIZED
                        )
                        .body(Map.of(
                                "message",
                                "Invalid email or password"
                        ));
            }

            User user = userOptional.get();

            // -----------------------------
            // Verify password
            // -----------------------------
            if (!passwordEncoder.matches(
                    password,
                    user.getPassword()
            )) {

                return ResponseEntity.status(
                                HttpStatus.UNAUTHORIZED
                        )
                        .body(Map.of(
                                "message",
                                "Invalid email or password"
                        ));
            }

            // -----------------------------
            // Generate JWT
            // -----------------------------
            String token =
                    jwtUtils.generateToken(
                            user.getEmail(),
                            user.getRole()
                    );

            // =================================================
            // USER OBJECT
            // =================================================
            Map<String, Object> userData =
                    new HashMap<>();

            userData.put(
                    "id",
                    user.getId()
            );

            userData.put(
                    "name",
                    user.getName()
            );

            userData.put(
                    "email",
                    user.getEmail()
            );

            userData.put(
                    "role",
                    user.getRole()
            );

            userData.put(
                    "phone",
                    user.getPhone() != null
                            ? user.getPhone()
                            : ""
            );

            userData.put(
                    "address",
                    user.getAddress() != null
                            ? user.getAddress()
                            : ""
            );

            // =================================================
            // LOGIN RESPONSE
            // =================================================
            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "token",
                    token
            );

            response.put(
                    "id",
                    user.getId()
            );

            response.put(
                    "name",
                    user.getName()
            );

            response.put(
                    "email",
                    user.getEmail()
            );

            response.put(
                    "role",
                    user.getRole()
            );

            // Very useful for frontend
            response.put(
                    "user",
                    userData
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            return ResponseEntity.status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(Map.of(
                            "message",
                            "Login failed.",
                            "error",
                            e.getMessage()
                    ));
        }
    }
}