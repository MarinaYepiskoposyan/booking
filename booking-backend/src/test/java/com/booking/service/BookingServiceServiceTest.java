package com.booking.service;

import com.booking.dto.request.ServiceRequest;
import com.booking.dto.response.ServiceResponse;
import com.booking.entity.ProviderProfile;
import com.booking.entity.Service;
import com.booking.entity.User;
import com.booking.entity.UserRole;
import com.booking.exception.ResourceNotFoundException;
import com.booking.repository.ProviderProfileRepository;
import com.booking.repository.ServiceRepository;
import com.booking.service.impl.BookingServiceServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceServiceTest {

    @Mock ServiceRepository serviceRepository;
    @Mock ProviderProfileRepository providerProfileRepository;
    @InjectMocks BookingServiceServiceImpl bookingServiceService;

    private ProviderProfile profile;
    private ServiceRequest request;

    @BeforeEach
    void setUp() {
        User user = User.builder().id(1L).role(UserRole.PROVIDER).build();
        profile = ProviderProfile.builder().id(1L).user(user).businessName("Test Salon").build();

        request = new ServiceRequest();
        request.setName("Haircut");
        request.setDurationMinutes(30);
        request.setPrice(new BigDecimal("25.00"));
        request.setCurrency("USD");
    }

    @Test
    void addService_ShouldReturnServiceResponse_WhenProfileExists() {
        Service savedService = Service.builder()
                .id(1L).providerProfile(profile).name("Haircut")
                .durationMinutes(30).price(new BigDecimal("25.00")).currency("USD").isActive(true).build();

        when(providerProfileRepository.findByUserId(1L)).thenReturn(Optional.of(profile));
        when(serviceRepository.save(any(Service.class))).thenReturn(savedService);

        ServiceResponse response = bookingServiceService.addService(1L, request);

        assertThat(response.getName()).isEqualTo("Haircut");
        assertThat(response.getDurationMinutes()).isEqualTo(30);
        assertThat(response.getPrice()).isEqualByComparingTo("25.00");
        assertThat(response.getIsActive()).isTrue();
    }

    @Test
    void addService_ShouldThrow_WhenProviderProfileNotFound() {
        when(providerProfileRepository.findByUserId(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookingServiceService.addService(99L, request))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getMyServices_ShouldReturnActiveServices() {
        Service s1 = Service.builder().id(1L).providerProfile(profile).name("Haircut")
                .durationMinutes(30).price(new BigDecimal("25.00")).currency("USD").isActive(true).build();
        Service s2 = Service.builder().id(2L).providerProfile(profile).name("Color")
                .durationMinutes(90).price(new BigDecimal("80.00")).currency("USD").isActive(true).build();

        when(providerProfileRepository.findByUserId(1L)).thenReturn(Optional.of(profile));
        when(serviceRepository.findByProviderProfileIdAndIsActiveTrue(1L)).thenReturn(List.of(s1, s2));

        List<ServiceResponse> services = bookingServiceService.getMyServices(1L);

        assertThat(services).hasSize(2);
        assertThat(services).extracting(ServiceResponse::getName).containsExactly("Haircut", "Color");
    }

    @Test
    void updateService_ShouldThrow_WhenServiceNotBelongToProvider() {
        when(providerProfileRepository.findByUserId(1L)).thenReturn(Optional.of(profile));
        when(serviceRepository.findByIdAndProviderProfileId(99L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookingServiceService.updateService(1L, 99L, request))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
