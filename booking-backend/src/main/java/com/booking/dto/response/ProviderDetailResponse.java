package com.booking.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data @Builder
public class ProviderDetailResponse {

    private Long providerProfileId;
    private String businessName;
    private String description;
    private String address;
    private String city;
    private String website;
    private List<ServiceItem> services;

    @Data @Builder
    public static class ServiceItem {
        private Long id;
        private String name;
        private String description;
        private Integer durationMinutes;
        private BigDecimal price;
        private String currency;
    }
}
