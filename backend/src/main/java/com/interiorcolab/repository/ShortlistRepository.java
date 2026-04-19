package com.interiorcolab.repository;

import com.interiorcolab.model.Shortlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ShortlistRepository extends JpaRepository<Shortlist, UUID> {
    List<Shortlist> findByPropertyId(UUID propertyId);
    boolean existsByPropertyIdAndFirmId(UUID propertyId, UUID firmId);
}
