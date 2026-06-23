package com.booking.service;

import com.booking.dto.request.ServiceRequest;
import com.booking.dto.response.ServiceResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookingServiceService {
    ServiceResponse addService(Long userId, ServiceRequest request);
    Page<ServiceResponse> getMyServices(Long userId, Pageable pageable);
    ServiceResponse updateService(Long userId, Long serviceId, ServiceRequest request);
}
