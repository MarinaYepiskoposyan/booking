package com.booking.service.impl;

import com.booking.dto.request.AvailabilityRequest;
import com.booking.dto.response.AvailabilityResponse;
import com.booking.entity.Availability;
import com.booking.entity.ProviderProfile;
import com.booking.exception.ResourceNotFoundException;
import com.booking.repository.AvailabilityRepository;
import com.booking.repository.ProviderProfileRepository;
import com.booking.service.AvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AvailabilityServiceImpl implements AvailabilityService {

    private final AvailabilityRepository availabilityRepository;
    private final ProviderProfileRepository providerProfileRepository;

    @Override
    @Transactional
    public List<AvailabilityResponse> setAvailability(Long userId, List<AvailabilityRequest> requests) {
        ProviderProfile profile = providerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Provider profile not found. Please create your business profile first."));

        availabilityRepository.deleteByProviderProfileId(profile.getId());
        availabilityRepository.flush();

        List<Availability> availabilities = requests.stream()
                .map(req -> Availability.builder()
                        .providerProfile(profile)
                        .dayOfWeek(req.getDayOfWeek())
                        .startTime(LocalTime.parse(req.getStartTime()))
                        .endTime(LocalTime.parse(req.getEndTime()))
                        .isActive(true)
                        .build())
                .collect(Collectors.toList());

        List<Availability> saved = availabilityRepository.saveAll(availabilities);

        return saved.stream()
                .sorted(Comparator.comparingInt(a -> a.getDayOfWeek().getValue()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AvailabilityResponse> getAvailabilityByUserId(Long userId) {
        ProviderProfile profile = providerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found."));
        return getAvailabilityByProviderProfileId(profile.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AvailabilityResponse> getAvailabilityByProviderProfileId(Long providerProfileId) {
        return availabilityRepository.findByProviderProfileId(providerProfileId).stream()
                .sorted(Comparator.comparingInt(a -> a.getDayOfWeek().getValue()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private AvailabilityResponse mapToResponse(Availability a) {
        return AvailabilityResponse.builder()
                .id(a.getId())
                .dayOfWeek(a.getDayOfWeek())
                .startTime(a.getStartTime().toString())
                .endTime(a.getEndTime().toString())
                .isActive(a.getIsActive())
                .build();
    }
}
