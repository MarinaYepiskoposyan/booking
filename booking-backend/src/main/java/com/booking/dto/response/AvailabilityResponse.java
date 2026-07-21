package com.booking.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.DayOfWeek;

@Data @Builder
public class AvailabilityResponse {
    private Long id;
    private DayOfWeek dayOfWeek;
    private String startTime;
    private String endTime;
    private Boolean isActive;
}
