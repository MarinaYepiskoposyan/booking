package com.booking.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data @Builder
public class ServiceResponse {
    private Long id;
    private Long providerProfileId;
    private String name;
    private String description;
    private Integer durationMinutes;
    private BigDecimal price;
    private String currency;
    private Boolean isActive;
}
