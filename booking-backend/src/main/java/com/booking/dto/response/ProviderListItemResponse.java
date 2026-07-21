package com.booking.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data @Builder
public class ProviderListItemResponse {
    private Long providerProfileId;
    private String businessName;
    private String description;
    private String city;
    private int serviceCount;
    private List<String> services;
}
