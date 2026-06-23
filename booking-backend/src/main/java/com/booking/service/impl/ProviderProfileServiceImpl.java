package com.booking.service.impl;

import com.booking.dto.request.ProviderProfileRequest;
import com.booking.dto.response.ProviderProfileResponse;
import com.booking.entity.ProviderProfile;
import com.booking.entity.User;
import com.booking.entity.UserRole;
import com.booking.exception.ResourceNotFoundException;
import com.booking.exception.UnauthorizedAccessException;
import com.booking.repository.ProviderProfileRepository;
import com.booking.repository.UserRepository;
import com.booking.service.ProviderProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProviderProfileServiceImpl implements ProviderProfileService {

    private final ProviderProfileRepository providerProfileRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ProviderProfileResponse createOrUpdateProfile(Long userId, ProviderProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        if (user.getRole() != UserRole.PROVIDER) {
            throw new UnauthorizedAccessException("Only PROVIDER accounts can create a business profile");
        }

        ProviderProfile profile = providerProfileRepository.findByUserId(userId)
                .orElse(ProviderProfile.builder().user(user).build());

        profile.setBusinessName(request.getBusinessName());
        profile.setDescription(request.getDescription());
        profile.setAddress(request.getAddress());
        profile.setCity(request.getCity());
        profile.setCountry(request.getCountry());
        profile.setWebsite(request.getWebsite());

        return mapToResponse(providerProfileRepository.save(profile));
    }

    @Override
    public ProviderProfileResponse getProfile(Long userId) {
        ProviderProfile profile = providerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found for user " + userId));
        return mapToResponse(profile);
    }

    private ProviderProfileResponse mapToResponse(ProviderProfile p) {
        return ProviderProfileResponse.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .businessName(p.getBusinessName())
                .description(p.getDescription())
                .address(p.getAddress())
                .city(p.getCity())
                .country(p.getCountry())
                .website(p.getWebsite())
                .build();
    }
}
