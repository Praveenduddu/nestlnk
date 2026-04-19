package com.interiorcolab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyBriefResponse {
    private UUID id;
    private String propertyType;
    private String city;
    private Integer sizeSqft;
    private BigDecimal budgetMin;
    private BigDecimal budgetMax;
    private String timeline;
    private String scope;
    private String status;
    private LocalDateTime createdAt;
    private int quoteCount;
    private List<String> imageUrls;

    // Only included for customer viewing their own properties
    private String customerName;

    // Firms already assigned to this property
    private List<String> targetedFirmIds;
}
