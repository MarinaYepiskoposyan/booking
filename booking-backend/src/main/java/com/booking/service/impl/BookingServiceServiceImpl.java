package com.booking.service.impl;

import com.booking.dto.request.ServiceRequest;
import com.booking.dto.response.ServiceResponse;
import com.booking.entity.ProviderProfile;
import com.booking.entity.Service;
import com.booking.exception.ResourceNotFoundException;
import com.booking.repository.ProviderProfileRepository;
import com.booking.repository.ServiceRepository;
import com.booking.service.BookingServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class BookingServiceServiceImpl implements BookingServiceService {

    private final ServiceRepository serviceRepository;
    private final ProviderProfileRepository providerProfileRepository;

    @Override
    @Transactional
    public ServiceResponse addService(Long userId, ServiceRequest request) {
        ProviderProfile profile = providerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found. Please create your business profile first."));

        Service service = Service.builder()
                .providerProfile(profile)
                .name(request.getName())
                .description(request.getDescription())
                .durationMinutes(request.getDurationMinutes())
                .price(request.getPrice())
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .isActive(true)
                .build();

        return mapToResponse(serviceRepository.save(service));
    }

    @Override
    public List<ServiceResponse> getMyServices(Long userId) {
        ProviderProfile profile = providerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found."));
        return serviceRepository.findByProviderProfileIdAndIsActiveTrue(profile.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ServiceResponse updateService(Long userId, Long serviceId, ServiceRequest request) {
        ProviderProfile profile = providerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found."));

        Service service = serviceRepository.findByIdAndProviderProfileId(serviceId, profile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Service", serviceId));

        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setPrice(request.getPrice());
        if (request.getCurrency() != null) service.setCurrency(request.getCurrency());

        return mapToResponse(serviceRepository.save(service));
    }

    private ServiceResponse mapToResponse(Service s) {
        return ServiceResponse.builder()
                .id(s.getId())
                .providerProfileId(s.getProviderProfile().getId())
                .name(s.getName())
                .description(s.getDescription())
                .durationMinutes(s.getDurationMinutes())
                .price(s.getPrice())
                .currency(s.getCurrency())
                .isActive(s.getIsActive())
                .build();
    }
}
