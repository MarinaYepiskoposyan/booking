package com.booking.controller;

import com.booking.dto.request.ServiceRequest;
import com.booking.dto.response.ServiceResponse;
import com.booking.entity.User;
import com.booking.service.BookingServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/provider/services")
@RequiredArgsConstructor
public class ServiceController {

    private final BookingServiceService bookingServiceService;

    @PostMapping
    public ResponseEntity<ServiceResponse> addService(@AuthenticationPrincipal User currentUser,
                                                       @Valid @RequestBody ServiceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingServiceService.addService(currentUser.getId(), request));
    }

    @GetMapping
    public ResponseEntity<Page<ServiceResponse>> getMyServices(@AuthenticationPrincipal User currentUser,
                                                               @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(bookingServiceService.getMyServices(currentUser.getId(), pageable));
    }

    @PutMapping("/{serviceId}")
    public ResponseEntity<ServiceResponse> updateService(@AuthenticationPrincipal User currentUser,
                                                          @PathVariable Long serviceId,
                                                          @Valid @RequestBody ServiceRequest request) {
        return ResponseEntity.ok(bookingServiceService.updateService(currentUser.getId(), serviceId, request));
    }
}
