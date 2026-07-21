package com.booking.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingRequest {

    @NotNull
    private Long timeSlotId;

    private Long serviceId;

    private String notes;
}
