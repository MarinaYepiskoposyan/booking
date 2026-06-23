package com.booking.service;

import com.booking.dto.request.ProviderProfileRequest;
import com.booking.dto.response.ProviderProfileResponse;

public interface ProviderProfileService {
    ProviderProfileResponse createOrUpdateProfile(Long userId, ProviderProfileRequest request);
    ProviderProfileResponse getProfile(Long userId);
}
