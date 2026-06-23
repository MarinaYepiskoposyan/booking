package com.booking.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProviderProfileRequest {
    @NotBlank private String businessName;
    private String description;
    private String address;
    private String city;
    private String country;
    private String website;
}
