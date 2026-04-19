package com.interiorcolab.service;

import com.interiorcolab.dto.QuotationRequest;
import com.interiorcolab.dto.QuotationResponse;
import com.interiorcolab.model.*;
import com.interiorcolab.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuotationService {

    private final QuotationRepository quotationRepository;
    private final PropertyBriefRepository propertyRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public QuotationResponse submitQuotation(QuotationRequest request, String firmEmail, MultipartFile pdf) {
        User firm = userRepository.findByEmail(firmEmail)
                .orElseThrow(() -> new RuntimeException("Firm not found"));

        if (!firm.isVerified()) {
            throw new RuntimeException("Firm must be verified to submit quotes");
        }

        PropertyBrief property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        if (property.getStatus() != PropertyStatus.OPEN) {
            throw new RuntimeException("Property is no longer accepting quotes");
        }

        if (quotationRepository.existsByPropertyIdAndFirmId(request.getPropertyId(), firm.getId())) {
            throw new RuntimeException("You have already submitted a quote for this property");
        }

        String pdfUrl = null;
        if (pdf != null && !pdf.isEmpty()) {
            pdfUrl = fileStorageService.storeFile(pdf, "quotations");
        }

        Quotation quotation = Quotation.builder()
                .property(property)
                .firm(firm)
                .estimatedCost(request.getEstimatedCost())
                .designCost(request.getDesignCost())
                .materialCost(request.getMaterialCost())
                .laborCost(request.getLaborCost())
                .otherCost(request.getOtherCost())
                .timeline(request.getTimeline())
                .coverNote(request.getCoverNote())
                .pdfUrl(pdfUrl)
                .status(QuotationStatus.SUBMITTED)
                .build();

        quotation = quotationRepository.save(quotation);
        return toResponse(quotation);
    }

    public List<QuotationResponse> getQuotesByProperty(UUID propertyId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PropertyBrief property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        // Only property owner (customer) can see all quotes
        if (user.getRole() == Role.CUSTOMER && !property.getCustomer().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        // Firms can only see their own quotes (filtered below)
        if (user.getRole() == Role.FIRM) {
            return quotationRepository.findByPropertyIdOrderByEstimatedCostAsc(propertyId)
                    .stream()
                    .filter(q -> q.getFirm().getId().equals(user.getId()))
                    .map(this::toResponse)
                    .collect(Collectors.toList());
        }

        return quotationRepository.findByPropertyIdOrderByEstimatedCostAsc(propertyId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<QuotationResponse> getMyQuotes(String firmEmail) {
        User firm = userRepository.findByEmail(firmEmail)
                .orElseThrow(() -> new RuntimeException("Firm not found"));

        return quotationRepository.findByFirmIdOrderByCreatedAtDesc(firm.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<QuotationResponse> getAllQuotes() {
        return quotationRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private QuotationResponse toResponse(Quotation quotation) {
        boolean isShortlisted = quotation.getStatus() == QuotationStatus.SHORTLISTED;
        User customer = quotation.getProperty().getCustomer();

        return QuotationResponse.builder()
                .id(quotation.getId())
                .propertyId(quotation.getProperty().getId())
                .propertyType(quotation.getProperty().getPropertyType())
                .city(quotation.getProperty().getCity())
                .firmId(quotation.getFirm().getId())
                .firmName(quotation.getFirm().getName())
                .firmCompany(quotation.getFirm().getCompanyName())
                .estimatedCost(quotation.getEstimatedCost())
                .designCost(quotation.getDesignCost())
                .materialCost(quotation.getMaterialCost())
                .laborCost(quotation.getLaborCost())
                .otherCost(quotation.getOtherCost())
                .timeline(quotation.getTimeline())
                .coverNote(quotation.getCoverNote())
                .pdfUrl(quotation.getPdfUrl())
                .status(quotation.getStatus().name())
                .propertyStatus(quotation.getProperty().getStatus().name())
                .createdAt(quotation.getCreatedAt())
                .customerName(isShortlisted ? customer.getName() : null)
                .customerEmail(isShortlisted ? customer.getEmail() : null)
                .customerPhone(isShortlisted ? customer.getPhone() : null)
                .build();
    }
}
