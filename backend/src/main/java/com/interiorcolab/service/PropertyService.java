package com.interiorcolab.service;

import com.interiorcolab.dto.PropertyBriefRequest;
import com.interiorcolab.dto.PropertyBriefResponse;
import com.interiorcolab.model.*;
import com.interiorcolab.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyService {

        private final PropertyBriefRepository propertyRepository;
        private final UserRepository userRepository;
        private final QuotationRepository quotationRepository;
        private final ShortlistRepository shortlistRepository;
        private final PropertyImageRepository imageRepository;
        private final FileStorageService fileStorageService;

        @Transactional
        public PropertyBriefResponse createProperty(PropertyBriefRequest request, String customerEmail,
                        List<MultipartFile> images) {
                User customer = userRepository.findByEmail(customerEmail)
                                .orElseThrow(() -> new RuntimeException("Customer not found"));

                PropertyBrief property = PropertyBrief.builder()
                                .customer(customer)
                                .propertyType(request.getPropertyType())
                                .city(request.getCity())
                                .sizeSqft(request.getSizeSqft())
                                .budgetMin(request.getBudgetMin())
                                .budgetMax(request.getBudgetMax())
                                .timeline(request.getTimeline())
                                .scope(request.getScope())
                                .status(PropertyStatus.OPEN)
                                .build();

                property = propertyRepository.save(property);

                List<String> imageUrls = new ArrayList<>();
                if (images != null) {
                        for (MultipartFile image : images) {
                                String url = fileStorageService.storeFile(image, "properties");
                                PropertyImage propertyImage = PropertyImage.builder()
                                                .property(property)
                                                .imageUrl(url)
                                                .build();
                                imageRepository.save(propertyImage);
                                imageUrls.add(url);
                        }
                }

                return toResponse(property, imageUrls, true);
        }

        @Transactional(readOnly = true)
        public List<PropertyBriefResponse> getMyProperties(String customerEmail) {
                User customer = userRepository.findByEmail(customerEmail)
                                .orElseThrow(() -> new RuntimeException("Customer not found"));

                return propertyRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId())
                                .stream()
                                .map(p -> {
                                        List<String> urls = imageRepository.findByPropertyId(p.getId())
                                                        .stream().map(PropertyImage::getImageUrl)
                                                        .collect(Collectors.toList());
                                        return toResponse(p, urls, true);
                                })
                                .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public PropertyBriefResponse getPropertyById(UUID id, String userEmail) {
                PropertyBrief property = propertyRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Property not found"));

                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                boolean isOwner = property.getCustomer().getId().equals(user.getId());
                List<String> urls = imageRepository.findByPropertyId(id)
                                .stream().map(PropertyImage::getImageUrl).collect(Collectors.toList());

                return toResponse(property, urls, isOwner);
        }

        @Transactional(readOnly = true)
        public List<PropertyBriefResponse> getOpenProperties(String firmEmail) {
                User firm = userRepository.findByEmail(firmEmail)
                                .orElseThrow(() -> new RuntimeException("Firm not found"));

                if (!firm.isVerified()) {
                        throw new RuntimeException("Firm must be verified to view briefs");
                }

                return propertyRepository.findByStatusOrderByCreatedAtDesc(PropertyStatus.OPEN)
                                .stream()
                                .filter(p -> {
                                        // Hide if the firm already submitted a quote
                                        if (quotationRepository.existsByPropertyIdAndFirmId(p.getId(), firm.getId())) {
                                                return false;
                                        }
                                        
                                        // Enforce targeted firms constraint
                                        List<User> targeted = p.getTargetedFirms();
                                        if (targeted != null && !targeted.isEmpty()) {
                                                // If this property has targeted firms, only those firms can see it
                                                return targeted.stream().anyMatch(t -> t.getId().equals(firm.getId()));
                                        }
                                        
                                        // If no targeted firms, it's a public brief
                                        return true;
                                })
                                .map(p -> {
                                        List<String> urls = imageRepository.findByPropertyId(p.getId())
                                                        .stream().map(PropertyImage::getImageUrl)
                                                        .collect(Collectors.toList());
                                        return toResponse(p, urls, false); // Hide customer identity
                                })
                                .collect(Collectors.toList());
        }

        @Transactional
        public void closeProperty(UUID id, String customerEmail) {
                PropertyBrief property = propertyRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Property not found"));
                User customer = userRepository.findByEmail(customerEmail)
                                .orElseThrow(() -> new RuntimeException("Customer not found"));
                if (!property.getCustomer().getId().equals(customer.getId())) {
                        throw new RuntimeException("You can only close your own properties");
                }
                property.setStatus(PropertyStatus.CLOSED);
                propertyRepository.save(property);

                quotationRepository.findByPropertyIdOrderByEstimatedCostAsc(id)
                                .forEach(q -> {
                                        q.setStatus(QuotationStatus.WITHDRAWN);
                                        quotationRepository.save(q);
                                });
        }

        @Transactional(readOnly = true)
        public List<PropertyBriefResponse> getWithdrawnProperties(String firmEmail) {
                User firm = userRepository.findByEmail(firmEmail)
                                .orElseThrow(() -> new RuntimeException("Firm not found"));

                if (!firm.isVerified()) {
                        throw new RuntimeException("Firm must be verified to view briefs");
                }

                return propertyRepository.findByStatusOrderByCreatedAtDesc(PropertyStatus.CLOSED)
                                .stream()
                                .filter(p -> {
                                        if (quotationRepository.existsByPropertyIdAndFirmId(p.getId(), firm.getId())) {
                                                return false;
                                        }
                                        List<User> targeted = p.getTargetedFirms();
                                        if (targeted != null && !targeted.isEmpty()) {
                                                return targeted.stream().anyMatch(t -> t.getId().equals(firm.getId()));
                                        }
                                        return true;
                                })
                                .map(p -> {
                                        List<String> urls = imageRepository.findByPropertyId(p.getId())
                                                        .stream().map(PropertyImage::getImageUrl)
                                                        .collect(Collectors.toList());
                                        return toResponse(p, urls, false);
                                })
                                .collect(Collectors.toList());
        }

        @Transactional
        public PropertyBriefResponse updateProperty(UUID id, PropertyBriefRequest request, String customerEmail) {
                PropertyBrief property = propertyRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Property not found"));
                User customer = userRepository.findByEmail(customerEmail)
                                .orElseThrow(() -> new RuntimeException("Customer not found"));
                if (!property.getCustomer().getId().equals(customer.getId())) {
                        throw new RuntimeException("You can only update your own properties");
                }

                property.setPropertyType(request.getPropertyType());
                property.setCity(request.getCity());
                property.setSizeSqft(request.getSizeSqft());
                property.setBudgetMin(request.getBudgetMin());
                property.setBudgetMax(request.getBudgetMax());
                property.setTimeline(request.getTimeline());
                property.setScope(request.getScope());

                property = propertyRepository.save(property);

                List<String> urls = imageRepository.findByPropertyId(id)
                                .stream().map(PropertyImage::getImageUrl).collect(Collectors.toList());
                return toResponse(property, urls, true);
        }

        @Transactional
        public void shortlistFirm(UUID propertyId, UUID firmId, String customerEmail) {
                PropertyBrief property = propertyRepository.findById(propertyId)
                                .orElseThrow(() -> new RuntimeException("Property not found"));

                User customer = userRepository.findByEmail(customerEmail)
                                .orElseThrow(() -> new RuntimeException("Customer not found"));

                if (!property.getCustomer().getId().equals(customer.getId())) {
                        throw new RuntimeException("You can only shortlist for your own properties");
                }

                long quoteCount = quotationRepository.countByPropertyId(propertyId);
                if (quoteCount < 1) {
                        throw new RuntimeException("At least 1 quote required before shortlisting");
                }

                if (shortlistRepository.existsByPropertyIdAndFirmId(propertyId, firmId)) {
                        throw new RuntimeException("Firm already shortlisted for this property");
                }

                User firm = userRepository.findById(firmId)
                                .orElseThrow(() -> new RuntimeException("Firm not found"));

                Shortlist shortlist = Shortlist.builder()
                                .property(property)
                                .firm(firm)
                                .build();

                shortlistRepository.save(shortlist);

                property.setStatus(PropertyStatus.SHORTLISTED);
                propertyRepository.save(property);

                // Update the quotation status for the shortlisted firm
                quotationRepository.findByPropertyIdOrderByEstimatedCostAsc(propertyId)
                                .stream()
                                .forEach(q -> {
                                        if (q.getFirm().getId().equals(firmId)) {
                                                q.setStatus(QuotationStatus.SHORTLISTED);
                                        } else {
                                                q.setStatus(QuotationStatus.REJECTED);
                                        }
                                        quotationRepository.save(q);
                                });
        }

        @Transactional(readOnly = true)
        public List<PropertyBriefResponse> getAllProperties() {
                return propertyRepository.findAll()
                                .stream()
                                .map(p -> {
                                        List<String> urls = imageRepository.findByPropertyId(p.getId())
                                                        .stream().map(PropertyImage::getImageUrl)
                                                        .collect(Collectors.toList());
                                        return toResponse(p, urls, true);
                                })
                                .collect(Collectors.toList());
        }

        @Transactional
        public void deleteProperty(UUID id) {
                if (!propertyRepository.existsById(id)) {
                        throw new RuntimeException("Property not found");
                }
                propertyRepository.deleteById(id);
        }

        private PropertyBriefResponse toResponse(PropertyBrief property, List<String> imageUrls,
                        boolean includeCustomer) {
                long quoteCount = quotationRepository.countByPropertyId(property.getId());

                List<String> targetedFirmIds = property.getTargetedFirms() != null ? 
                        property.getTargetedFirms().stream().map(f -> f.getId().toString()).collect(Collectors.toList()) : 
                        new ArrayList<>();

                return PropertyBriefResponse.builder()
                                .id(property.getId())
                                .propertyType(property.getPropertyType())
                                .city(property.getCity())
                                .sizeSqft(property.getSizeSqft())
                                .budgetMin(property.getBudgetMin())
                                .budgetMax(property.getBudgetMax())
                                .timeline(property.getTimeline())
                                .scope(property.getScope())
                                .status(property.getStatus().name())
                                .createdAt(property.getCreatedAt())
                                .quoteCount((int) quoteCount)
                                .imageUrls(imageUrls)
                                .customerName(includeCustomer ? property.getCustomer().getName() : null)
                                .targetedFirmIds(targetedFirmIds)
                                .build();
        }

        public List<java.util.Map<String, Object>> getVerifiedFirms() {
                return userRepository.findByRoleAndIsVerified(Role.FIRM, true)
                        .stream()
                        .map(firm -> {
                                java.util.Map<String, Object> map = new java.util.HashMap<>();
                                map.put("id", firm.getId().toString());
                                map.put("name", firm.getName());
                                map.put("companyName", firm.getCompanyName());
                                map.put("email", firm.getEmail());
                                map.put("phone", firm.getPhone());
                                return map;
                        })
                        .collect(Collectors.toList());
        }

        @Transactional
        public void assignFirmsToProperty(UUID propertyId, List<UUID> firmIds, String customerEmail) {
                PropertyBrief property = propertyRepository.findById(propertyId)
                        .orElseThrow(() -> new RuntimeException("Property not found"));

                User customer = userRepository.findByEmail(customerEmail)
                        .orElseThrow(() -> new RuntimeException("Customer not found"));

                if (!property.getCustomer().getId().equals(customer.getId())) {
                        throw new RuntimeException("You can only assign firms to your own properties");
                }

                List<User> newFirms = firmIds.stream()
                        .map(id -> userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Firm not found: " + id)))
                        .collect(Collectors.toList());

                List<User> existingFirms = property.getTargetedFirms();
                if (existingFirms == null) {
                        existingFirms = new ArrayList<>();
                }
                
                for (User newFirm : newFirms) {
                        if (!existingFirms.contains(newFirm)) {
                                existingFirms.add(newFirm);
                        }
                }

                property.setTargetedFirms(existingFirms);
                property.setStatus(PropertyStatus.OPEN);
                propertyRepository.save(property);
        }
}
