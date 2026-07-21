package com.booking.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.DayOfWeek;

@Data
public class AvailabilityRequest {

    @NotNull
    private DayOfWeek dayOfWeek;

    @NotBlank
    private String startTime; // "HH:mm"

    @NotBlank
    private String endTime;   // "HH:mm"
}
