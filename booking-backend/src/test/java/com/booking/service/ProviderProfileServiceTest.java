package com.booking.service;

import com.booking.dto.request.ProviderProfileRequest;
import com.booking.dto.response.ProviderProfileResponse;
import com.booking.entity.ProviderProfile;
import com.booking.entity.User;
import com.booking.entity.UserRole;
import com.booking.exception.ResourceNotFoundException;
import com.booking.exception.UnauthorizedAccessException;
import com.booking.repository.ProviderProfileRepository;
import com.booking.repository.UserRepository;
import com.booking.service.impl.ProviderProfileServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProviderProfileServiceTest {

    @Mock ProviderProfileRepository providerProfileRepository;
    @Mock UserRepository userRepository;
    @InjectMocks ProviderProfileServiceImpl providerProfileService;

    private User providerUser;
    private User clientUser;
    private ProviderProfileRequest request;

    @BeforeEach
    void setUp() {
        providerUser = User.builder().id(1L).email("provider@example.com").role(UserRole.PROVIDER).build();
        clientUser = User.builder().id(2L).email("client@example.com").role(UserRole.CLIENT).build();

        request = new ProviderProfileRequest();
        request.setBusinessName("Test Salon");
        request.setCity("New York");
        request.setCountry("USA");
    }

    @Test
    void createOrUpdateProfile_ShouldCreateNew_WhenProfileDoesNotExist() {
        ProviderProfile savedProfile = ProviderProfile.builder()
                .id(1L).user(providerUser).businessName("Test Salon").city("New York").country("USA").build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(providerUser));
        when(providerProfileRepository.findByUserId(1L)).thenReturn(Optional.empty());
        when(providerProfileRepository.save(any(ProviderProfile.class))).thenReturn(savedProfile);

        ProviderProfileResponse response = providerProfileService.createOrUpdateProfile(1L, request);

        assertThat(response.getBusinessName()).isEqualTo("Test Salon");
        assertThat(response.getUserId()).isEqualTo(1L);
        verify(providerProfileRepository).save(any(ProviderProfile.class));
    }

    @Test
    void createOrUpdateProfile_ShouldUpdate_WhenProfileExists() {
        ProviderProfile existingProfile = ProviderProfile.builder()
                .id(1L).user(providerUser).businessName("Old Name").build();
        ProviderProfile updatedProfile = ProviderProfile.builder()
                .id(1L).user(providerUser).businessName("Test Salon").city("New York").country("USA").build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(providerUser));
        when(providerProfileRepository.findByUserId(1L)).thenReturn(Optional.of(existingProfile));
        when(providerProfileRepository.save(any(ProviderProfile.class))).thenReturn(updatedProfile);

        ProviderProfileResponse response = providerProfileService.createOrUpdateProfile(1L, request);

        assertThat(response.getBusinessName()).isEqualTo("Test Salon");
    }

    @Test
    void createOrUpdateProfile_ShouldThrowUnauthorized_WhenUserIsClient() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(clientUser));

        assertThatThrownBy(() -> providerProfileService.createOrUpdateProfile(2L, request))
                .isInstanceOf(UnauthorizedAccessException.class)
                .hasMessageContaining("PROVIDER");
    }

    @Test
    void getProfile_ShouldThrowNotFound_WhenProfileDoesNotExist() {
        when(providerProfileRepository.findByUserId(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> providerProfileService.getProfile(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
