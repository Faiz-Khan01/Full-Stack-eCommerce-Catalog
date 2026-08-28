package com.ecom.productcatalog.controller;

import com.ecom.productcatalog.model.User;
import com.ecom.productcatalog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"https://techstore-catalog.vercel.app", "http://localhost:5173", "http://localhost:3000"})
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody User updatedUserData) {
        if (updatedUserData.getEmail() == null || updatedUserData.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required to update profile."));
        }

        Optional<User> userOpt = userRepository.findByEmail(updatedUserData.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found."));
        }

        User existingUser = userOpt.get();

        // Update profile fields safely without changing password or role
        if (updatedUserData.getName() != null) existingUser.setName(updatedUserData.getName());
        if (updatedUserData.getAddress() != null) existingUser.setAddress(updatedUserData.getAddress());
        if (updatedUserData.getPhone() != null) existingUser.setPhone(updatedUserData.getPhone());

        userRepository.save(existingUser);

        return ResponseEntity.ok(Map.of(
                "message", "Profile updated successfully!",
                "name", existingUser.getName(),
                "email", existingUser.getEmail(),
                "address", existingUser.getAddress() != null ? existingUser.getAddress() : "",
                "phone", existingUser.getPhone() != null ? existingUser.getPhone() : ""
        ));
    }
}