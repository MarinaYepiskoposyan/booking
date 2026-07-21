package com.booking.controller;

import com.booking.dto.request.AvailabilityRequest;
import com.booking.dto.response.AvailabilityResponse;
import com.booking.entity.User;
import com.booking.service.AvailabilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/provider/availability")
@RequiredArgsConstructor
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    @GetMapping
    public ResponseEntity<List<AvailabilityResponse>> getMyAvailability(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(availabilityService.getAvailabilityByUserId(currentUser.getId()));
    }

    @PutMapping
    public ResponseEntity<List<AvailabilityResponse>> setAvailability(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody List<@Valid AvailabilityRequest> requests) {
        return ResponseEntity.ok(availabilityService.setAvailability(currentUser.getId(), requests));
    }

    @GetMapping("/{providerProfileId}")
    public ResponseEntity<List<AvailabilityResponse>> getProviderAvailability(
            @PathVariable Long providerProfileId) {
        return ResponseEntity.ok(availabilityService.getAvailabilityByProviderProfileId(providerProfileId));
    }
}
