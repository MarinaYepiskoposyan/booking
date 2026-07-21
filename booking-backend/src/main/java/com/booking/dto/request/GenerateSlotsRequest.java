package com.booking.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class GenerateSlotsRequest {

    @NotBlank
    private String fromDate; // "yyyy-MM-dd"

    @NotBlank
    private String toDate;   // "yyyy-MM-dd"

    @NotNull @Positive
    private Integer durationMinutes;
}
