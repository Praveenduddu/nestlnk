package com.interiorcolab.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PropertyBriefRequest {
    @NotBlank(message = "Property type is required")
    private String propertyType;

    @NotBlank(message = "City is required")
    private String city;

    @NotNull(message = "Size is required")
    @Min(value = 1, message = "Size must be positive")
    private Integer sizeSqft;

    @NotNull(message = "Minimum budget is required")
    @DecimalMin(value = "0.0", message = "Budget must be positive")
    private BigDecimal budgetMin;

    @NotNull(message = "Maximum budget is required")
    @DecimalMin(value = "0.0", message = "Budget must be positive")
    private BigDecimal budgetMax;

    @NotBlank(message = "Timeline is required")
    private String timeline;

    @NotBlank(message = "Scope is required")
    private String scope;
}
