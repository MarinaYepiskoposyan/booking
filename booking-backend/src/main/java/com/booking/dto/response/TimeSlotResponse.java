package com.booking.dto.response;

import com.booking.entity.SlotStatus;
import lombok.Builder;
import lombok.Data;

@Data @Builder
public class TimeSlotResponse {
    private Long id;
    private String slotDate;    // "yyyy-MM-dd"
    private String startTime;   // "HH:mm"
    private String endTime;     // "HH:mm"
    private SlotStatus status;
    private String serviceName;
}
