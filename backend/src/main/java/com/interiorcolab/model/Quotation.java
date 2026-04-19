package com.interiorcolab.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "quotations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quotation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private PropertyBrief property;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "firm_id", nullable = false)
    private User firm;

    @Column(name = "estimated_cost", nullable = false, precision = 19, scale = 2)
    private BigDecimal estimatedCost;

    @Column(name = "design_cost", precision = 19, scale = 2)
    private BigDecimal designCost;

    @Column(name = "material_cost", precision = 19, scale = 2)
    private BigDecimal materialCost;

    @Column(name = "labor_cost", precision = 19, scale = 2)
    private BigDecimal laborCost;

    @Column(name = "other_cost", precision = 19, scale = 2)
    private BigDecimal otherCost;

    @Column(nullable = false, length = 100)
    private String timeline;

    @Column(name = "cover_note", length = 1000)
    private String coverNote;

    @Column(name = "pdf_url", length = 500)
    private String pdfUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private QuotationStatus status = QuotationStatus.SUBMITTED;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
