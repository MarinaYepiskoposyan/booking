package com.booking.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ServiceRequest {
    @NotBlank private String name;
    private String description;

    @NotNull @Positive
    private Integer durationMinutes;

    @NotNull @DecimalMin("0.01")
    private BigDecimal price;

    @Size(min = 3, max = 3)
    private String currency = "USD";
}
