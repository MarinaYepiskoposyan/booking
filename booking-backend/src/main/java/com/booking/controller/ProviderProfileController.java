package com.booking.controller;

import com.booking.dto.request.ProviderProfileRequest;
import com.booking.dto.response.ProviderDetailResponse;
import com.booking.dto.response.ProviderListItemResponse;
import com.booking.dto.response.ProviderProfileResponse;
import com.booking.entity.User;
import com.booking.service.ProviderProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ProviderProfileController {

    private final ProviderProfileService providerProfileService;

    @PostMapping("/api/provider/profile")
    public ResponseEntity<ProviderProfileResponse> createOrUpdate(@AuthenticationPrincipal User currentUser,
                                                                   @Valid @RequestBody ProviderProfileRequest request) {
        return ResponseEntity.ok(providerProfileService.createOrUpdateProfile(currentUser.getId(), request));
    }

    @GetMapping("/api/provider/profile")
    public ResponseEntity<ProviderProfileResponse> getProfile(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(providerProfileService.getProfile(currentUser.getId()));
    }

    @GetMapping("/api/providers")
    public ResponseEntity<Page<ProviderListItemResponse>> getProviders(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String city,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(providerProfileService.getProviders(search, city, pageable));
    }

    @GetMapping("/api/providers/{providerProfileId}")
    public ResponseEntity<ProviderDetailResponse> getProviderById(@PathVariable Long providerProfileId) {
        return ResponseEntity.ok(providerProfileService.getProviderById(providerProfileId));
    }
}
