package com.booking.service;

import com.booking.dto.request.AvailabilityRequest;
import com.booking.dto.response.AvailabilityResponse;

import java.util.List;

public interface AvailabilityService {

    List<AvailabilityResponse> setAvailability(Long userId, List<AvailabilityRequest> requests);

    List<AvailabilityResponse> getAvailabilityByUserId(Long userId);

    List<AvailabilityResponse> getAvailabilityByProviderProfileId(Long providerProfileId);
}
