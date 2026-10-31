package com.ecom.productcatalog.service;

import com.ecom.productcatalog.dto.UserDTO;
import com.ecom.productcatalog.model.User;
import com.ecom.productcatalog.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setName("Faiz Khan");
        sampleUser.setEmail("faiz@example.com");
        sampleUser.setPassword("RawPassword123");
        sampleUser.setRole("USER");
        sampleUser.setPhone("+919876543210");
        sampleUser.setAddress("Nagpur, Maharashtra");
    }

    @Test
    @DisplayName("registerUser() should encode password and save user with default role")
    void testRegisterUser_Success() {
        when(userRepository.existsByEmail("faiz@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User result = userService.registerUser(sampleUser);

        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("faiz@example.com");
        assertThat(result.getRole()).isEqualTo("USER");
        // Password must be hashed, not raw
        assertThat(result.getPassword()).isNotEqualTo("RawPassword123");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("registerUser() should throw exception when email is duplicate")
    void testRegisterUser_DuplicateEmail() {
        when(userRepository.existsByEmail("faiz@example.com")).thenReturn(true);

        assertThatThrownBy(() -> userService.registerUser(sampleUser))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Email is already in use!");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("registerUser() should throw IllegalArgumentException when email is blank")
    void testRegisterUser_BlankEmail() {
        sampleUser.setEmail("   ");

        assertThatThrownBy(() -> userService.registerUser(sampleUser))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email is required");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("getUserProfile() should return UserDTO when user exists")
    void testGetUserProfile_Found() {
        when(userRepository.findByEmail("faiz@example.com")).thenReturn(Optional.of(sampleUser));

        UserDTO dto = userService.getUserProfile("faiz@example.com");

        assertThat(dto).isNotNull();
        assertThat(dto.getEmail()).isEqualTo("faiz@example.com");
        assertThat(dto.getName()).isEqualTo("Faiz Khan");
        verify(userRepository, times(1)).findByEmail("faiz@example.com");
    }

    @Test
    @DisplayName("getUserProfile() should throw RuntimeException when user does not exist")
    void testGetUserProfile_NotFound() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUserProfile("unknown@example.com"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("User not found with email");
    }
}
