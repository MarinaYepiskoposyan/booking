package com.booking.controller;

import com.booking.dto.response.BookingResponse;
import com.booking.entity.User;
import com.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/provider/bookings")
@RequiredArgsConstructor
public class ProviderBookingController {

    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getProviderBookings(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(bookingService.getProviderBookings(currentUser.getId()));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<BookingResponse> completeBooking(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id) {
        return ResponseEntity.ok(bookingService.completeBooking(id, currentUser.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> cancelBooking(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id) {
        bookingService.cancelBookingByProvider(id, currentUser.getId());
        return ResponseEntity.ok(Map.of("message", "Booking cancelled successfully"));
    }
}
