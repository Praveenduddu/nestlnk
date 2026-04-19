package com.interiorcolab.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class QuotationRequest {
    @NotNull(message = "Property ID is required")
    private UUID propertyId;

    @NotNull(message = "Estimated cost is required")
    @DecimalMin(value = "0.0", message = "Cost must be positive")
    private BigDecimal estimatedCost;

    @DecimalMin(value = "0.0")
    private BigDecimal designCost;

    @DecimalMin(value = "0.0")
    private BigDecimal materialCost;

    @DecimalMin(value = "0.0")
    private BigDecimal laborCost;

    @DecimalMin(value = "0.0")
    private BigDecimal otherCost;

    @NotBlank(message = "Timeline is required")
    private String timeline;

    private String coverNote;
}
