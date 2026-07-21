package com.booking.controller;

import com.booking.dto.request.GenerateSlotsRequest;
import com.booking.dto.response.TimeSlotResponse;
import com.booking.entity.User;
import com.booking.service.TimeSlotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class TimeSlotController {

    private final TimeSlotService timeSlotService;

    @PostMapping("/api/provider/slots/generate")
    public ResponseEntity<List<TimeSlotResponse>> generateSlots(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody GenerateSlotsRequest request) {
        LocalDate from = LocalDate.parse(request.getFromDate());
        LocalDate to = LocalDate.parse(request.getToDate());
        List<TimeSlotResponse> slots = timeSlotService.generateSlots(
                currentUser.getId(), from, to, request.getDurationMinutes());
        return ResponseEntity.status(HttpStatus.CREATED).body(slots);
    }

    @GetMapping("/api/slots/{providerProfileId}")
    public ResponseEntity<List<TimeSlotResponse>> getAvailableSlots(
            @PathVariable Long providerProfileId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(timeSlotService.getAvailableSlots(providerProfileId, date));
    }
}
