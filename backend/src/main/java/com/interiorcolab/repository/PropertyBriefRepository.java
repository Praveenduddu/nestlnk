package com.interiorcolab.repository;

import com.interiorcolab.model.PropertyBrief;
import com.interiorcolab.model.PropertyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PropertyBriefRepository extends JpaRepository<PropertyBrief, UUID> {
    List<PropertyBrief> findByCustomerIdOrderByCreatedAtDesc(UUID customerId);
    List<PropertyBrief> findByStatusOrderByCreatedAtDesc(PropertyStatus status);
    long countByStatus(PropertyStatus status);
}
