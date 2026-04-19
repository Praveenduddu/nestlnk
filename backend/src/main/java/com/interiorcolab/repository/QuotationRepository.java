package com.interiorcolab.repository;

import com.interiorcolab.model.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuotationRepository extends JpaRepository<Quotation, UUID> {
    @org.springframework.data.jpa.repository.Query("SELECT q FROM Quotation q JOIN FETCH q.firm WHERE q.property.id = :propertyId ORDER BY q.estimatedCost ASC")
    List<Quotation> findByPropertyIdOrderByEstimatedCostAsc(@org.springframework.data.repository.query.Param("propertyId") UUID propertyId);

    List<Quotation> findByFirmIdOrderByCreatedAtDesc(UUID firmId);
    long countByPropertyId(UUID propertyId);
    long countByFirmId(UUID firmId);
    boolean existsByPropertyIdAndFirmId(UUID propertyId, UUID firmId);
}
