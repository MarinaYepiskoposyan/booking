package com.booking.service;

import com.booking.dto.request.LoginRequest;
import com.booking.dto.request.RegisterRequest;
import com.booking.dto.response.AuthResponse;
import com.booking.entity.User;
import com.booking.entity.UserRole;
import com.booking.exception.EmailAlreadyExistsException;
import com.booking.repository.UserRepository;
import com.booking.security.JwtService;
import com.booking.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UserRepository userRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtService jwtService;
    @Mock AuthenticationManager authenticationManager;
    @InjectMocks AuthServiceImpl authService;

    private RegisterRequest registerRequest;
    private User savedUser;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("Password1!");
        registerRequest.setFirstName("John");
        registerRequest.setLastName("Doe");
        registerRequest.setRole("CLIENT");

        savedUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .password("encodedPassword")
                .firstName("John")
                .lastName("Doe")
                .role(UserRole.CLIENT)
                .build();
    }

    @Test
    void register_ShouldReturnAuthResponse_WhenEmailIsNew() {
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken(any(User.class))).thenReturn("jwt.token.here");

        AuthResponse response = authService.register(registerRequest);

        assertThat(response.getToken()).isEqualTo("jwt.token.here");
        assertThat(response.getTokenType()).isEqualTo("Bearer");
        assertThat(response.getUser().getEmail()).isEqualTo("test@example.com");
        verify(passwordEncoder).encode("Password1!");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_ShouldThrowEmailAlreadyExistsException_WhenEmailIsTaken() {
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(true);

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(EmailAlreadyExistsException.class)
                .hasMessageContaining("test@example.com");

        verify(userRepository, never()).save(any());
    }

    @Test
    void login_ShouldReturnAuthResponse_WhenCredentialsAreValid() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("Password1!");

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(savedUser);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(jwtService.generateToken(savedUser)).thenReturn("jwt.token.here");

        AuthResponse response = authService.login(loginRequest);

        assertThat(response.getToken()).isEqualTo("jwt.token.here");
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void login_ShouldThrow_WhenCredentialsAreInvalid() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("wrongpassword");

        doThrow(new BadCredentialsException("Bad credentials"))
                .when(authenticationManager).authenticate(any());

        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(BadCredentialsException.class);
    }
}
