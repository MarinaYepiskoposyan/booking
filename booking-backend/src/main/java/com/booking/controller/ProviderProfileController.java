package com.booking.controller;

import com.booking.dto.request.ProviderProfileRequest;
import com.booking.dto.response.ProviderProfileResponse;
import com.booking.entity.User;
import com.booking.service.ProviderProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/provider/profile")
@RequiredArgsConstructor
public class ProviderProfileController {

    private final ProviderProfileService providerProfileService;

    @PostMapping
    public ResponseEntity<ProviderProfileResponse> createOrUpdate(@AuthenticationPrincipal User currentUser,
                                                                    @Valid @RequestBody ProviderProfileRequest request) {
        return ResponseEntity.ok(providerProfileService.createOrUpdateProfile(currentUser.getId(), request));
    }

    @GetMapping
    public ResponseEntity<ProviderProfileResponse> getProfile(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(providerProfileService.getProfile(currentUser.getId()));
    }
}
