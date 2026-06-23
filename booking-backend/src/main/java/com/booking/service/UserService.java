package com.booking.service;

import com.booking.dto.request.UpdateProfileRequest;
import com.booking.dto.response.UserResponse;

public interface UserService {
    UserResponse getProfile(Long userId);
    UserResponse updateProfile(Long userId, UpdateProfileRequest request);
}
