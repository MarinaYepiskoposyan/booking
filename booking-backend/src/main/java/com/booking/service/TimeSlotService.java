package com.booking.service;

import com.booking.dto.response.TimeSlotResponse;

import java.time.LocalDate;
import java.util.List;

public interface TimeSlotService {

    List<TimeSlotResponse> generateSlots(Long userId, LocalDate from, LocalDate to, int durationMinutes);

    List<TimeSlotResponse> getAvailableSlots(Long providerProfileId, LocalDate date);
}
