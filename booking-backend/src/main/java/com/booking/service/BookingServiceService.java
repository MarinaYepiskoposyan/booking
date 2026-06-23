package com.booking.service;

import com.booking.dto.request.ServiceRequest;
import com.booking.dto.response.ServiceResponse;
import java.util.List;

public interface BookingServiceService {
    ServiceResponse addService(Long userId, ServiceRequest request);
    List<ServiceResponse> getMyServices(Long userId);
    ServiceResponse updateService(Long userId, Long serviceId, ServiceRequest request);
}
