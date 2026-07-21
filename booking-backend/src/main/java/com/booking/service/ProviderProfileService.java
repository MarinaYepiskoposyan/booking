package com.booking.service;

import com.booking.dto.request.ProviderProfileRequest;
import com.booking.dto.response.ProviderDetailResponse;
import com.booking.dto.response.ProviderListItemResponse;
import com.booking.dto.response.ProviderProfileResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProviderProfileService {
    ProviderProfileResponse createOrUpdateProfile(Long userId, ProviderProfileRequest request);
    ProviderProfileResponse getProfile(Long userId);
    Page<ProviderListItemResponse> getProviders(String search, String city, Pageable pageable);
    ProviderDetailResponse getProviderById(Long id);
}
