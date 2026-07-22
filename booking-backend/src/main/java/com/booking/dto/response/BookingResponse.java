package com.booking.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class BookingResponse {
    private Long id;
    private String clientName;
    private String providerName;
    private String serviceName;
    private String slotDate;
    private String startTime;
    private String endTime;
    private String status;
    private String notes;
    private LocalDateTime createdAt;
}
