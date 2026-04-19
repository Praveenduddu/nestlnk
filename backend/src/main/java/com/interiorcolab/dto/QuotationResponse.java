package com.interiorcolab.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuotationResponse {
    private UUID id;
    private UUID propertyId;
    private String propertyType;
    private String city;
    private UUID firmId;
    private String firmName;
    private String firmCompany;
    private BigDecimal estimatedCost;
    private BigDecimal designCost;
    private BigDecimal materialCost;
    private BigDecimal laborCost;
    private BigDecimal otherCost;
    private String timeline;
    private String coverNote;
    private String pdfUrl;
    private String status;
    private String propertyStatus;
    private LocalDateTime createdAt;

    // Customer details — only populated for shortlisted quotes
    private String customerName;
    private String customerEmail;
    private String customerPhone;
}
