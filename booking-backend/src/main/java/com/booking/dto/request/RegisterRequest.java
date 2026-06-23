package com.booking.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).+$",
             message = "Password must contain uppercase, digit, and special character")
    private String password;

    @NotBlank private String firstName;
    @NotBlank private String lastName;

    @Pattern(regexp = "^[+\\d\\s\\-()]{7,20}$", message = "Invalid phone number format")
    private String phone;

    // Role is accepted from client but restricted to CLIENT or PROVIDER — no admin self-assignment
    @NotNull
    @Pattern(regexp = "CLIENT|PROVIDER", message = "Role must be CLIENT or PROVIDER")
    private String role;
}
