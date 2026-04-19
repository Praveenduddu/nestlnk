package com.interiorcolab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    private long totalCustomers;
    private long totalFirms;
    private long verifiedFirms;
    private long totalProperties;
    private long openProperties;
    private long totalQuotations;
}
