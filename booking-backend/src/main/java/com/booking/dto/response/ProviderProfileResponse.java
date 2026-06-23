package com.booking.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class ProviderProfileResponse {
    private Long id;
    private Long userId;
    private String businessName;
    private String description;
    private String address;
    private String city;
    private String country;
    private String website;
}
