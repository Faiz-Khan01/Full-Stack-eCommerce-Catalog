package com.ecom.productcatalog.service;

import com.ecom.productcatalog.dto.UserDTO;
import com.ecom.productcatalog.model.User;
import com.ecom.productcatalog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    // =====================================================
    // Register User
    // =====================================================

    @Transactional
    public User registerUser(User user) {

        if (user.getEmail() == null ||
                user.getEmail().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Email is required for registration."
            );
        }

        String cleanEmail =
                user.getEmail()
                        .trim()
                        .toLowerCase();

        if (userRepository.existsByEmail(cleanEmail)) {
            throw new RuntimeException(
                    "Email is already in use!"
            );
        }

        user.setEmail(cleanEmail);

        // Role
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

        // Password
        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        return userRepository.save(user);
    }

    // =====================================================
    // Find By Email
    // =====================================================

    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {

        if (email == null) {
            return Optional.empty();
        }

        return userRepository.findByEmail(
                email.trim().toLowerCase()
        );
    }

    // =====================================================
    // Exists By Email
    // =====================================================

    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {

        if (email == null) {
            return false;
        }

        return userRepository.existsByEmail(
                email.trim().toLowerCase()
        );
    }

    // =====================================================
    // Get Profile
    // =====================================================

    @Transactional(readOnly = true)
    public UserDTO getUserProfile(String email) {

        if (email == null ||
                email.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Email cannot be null or empty"
            );
        }

        User user =
                userRepository.findByEmail(
                        email.trim().toLowerCase()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email: "
                                        + email
                        )
                );

        return convertToDTO(user);
    }

    // =====================================================
    // Update Profile
    // =====================================================

    @Transactional
    public UserDTO updateUserProfile(
            String email,
            UserDTO userDTO
    ) {

        if (email == null ||
                email.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Email cannot be null or empty"
            );
        }

        if (userDTO == null) {
            throw new IllegalArgumentException(
                    "User data is required"
            );
        }

        User user =
                userRepository.findByEmail(
                        email.trim().toLowerCase()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email: "
                                        + email
                        )
                );

        if (userDTO.getName() != null &&
                !userDTO.getName().trim().isEmpty()) {

            user.setName(
                    userDTO.getName().trim()
            );
        }

        if (userDTO.getPhone() != null) {

            user.setPhone(
                    userDTO.getPhone().trim()
            );
        }

        if (userDTO.getAddress() != null) {

            user.setAddress(
                    userDTO.getAddress().trim()
            );
        }

        User updatedUser =
                userRepository.save(user);

        return convertToDTO(updatedUser);
    }

    // =====================================================
    // Get All Users
    // =====================================================

    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // =====================================================
    // Convert User -> DTO
    // =====================================================

    public UserDTO convertToDTO(User user) {

        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getPhone(),
                user.getAddress()
        );
    }
}