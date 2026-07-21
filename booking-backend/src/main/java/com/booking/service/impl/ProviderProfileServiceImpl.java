package com.booking.service.impl;

import com.booking.dto.request.ProviderProfileRequest;
import com.booking.dto.response.ProviderListItemResponse;
import com.booking.dto.response.ProviderProfileResponse;
import com.booking.entity.ProviderProfile;
import com.booking.entity.Service;
import com.booking.entity.User;
import com.booking.entity.UserRole;
import com.booking.exception.ResourceNotFoundException;
import com.booking.exception.UnauthorizedAccessException;
import com.booking.repository.ProviderProfileRepository;
import com.booking.repository.ServiceRepository;
import com.booking.repository.UserRepository;
import com.booking.service.ProviderProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ProviderProfileServiceImpl implements ProviderProfileService {

    private final ProviderProfileRepository providerProfileRepository;
    private final ServiceRepository serviceRepository;
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

    @Override
    @Transactional(readOnly = true)
    public Page<ProviderListItemResponse> getProviders(String search, String city, Pageable pageable) {
        String searchParam = (search != null && !search.isBlank()) ? search.trim() : null;
        String cityParam = (city != null && !city.isBlank()) ? city.trim() : null;

        Page<ProviderProfile> profiles = providerProfileRepository.findByFilters(searchParam, cityParam, pageable);

        return profiles.map(profile -> {
            List<Service> activeServices = serviceRepository.findByProviderProfileIdAndIsActiveTrue(profile.getId());
            List<String> top3Names = activeServices.stream()
                    .limit(3)
                    .map(svc -> svc.getName())
                    .collect(Collectors.toList());

            return ProviderListItemResponse.builder()
                    .providerProfileId(profile.getId())
                    .businessName(profile.getBusinessName())
                    .description(profile.getDescription())
                    .city(profile.getCity())
                    .serviceCount(activeServices.size())
                    .services(top3Names)
                    .build();
        });
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
