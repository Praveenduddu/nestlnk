package com.interiorcolab.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "property_briefs")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PropertyBrief {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Column(name = "property_type", nullable = false, length = 50)
    private String propertyType;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(name = "size_sqft", nullable = false)
    private Integer sizeSqft;

    @Column(name = "budget_min", nullable = false, precision = 12, scale = 2)
    private BigDecimal budgetMin;

    @Column(name = "budget_max", nullable = false, precision = 12, scale = 2)
    private BigDecimal budgetMax;

    @Column(nullable = false, length = 100)
    private String timeline;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String scope;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PropertyStatus status = PropertyStatus.OPEN;

    @ManyToMany
    @JoinTable(
        name = "property_targeted_firms",
        joinColumns = @JoinColumn(name = "property_id"),
        inverseJoinColumns = @JoinColumn(name = "firm_id")
    )
    private List<User> targetedFirms;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
