package com.interiorcolab.controller;

import com.interiorcolab.dto.QuotationRequest;
import com.interiorcolab.dto.QuotationResponse;
import com.interiorcolab.service.QuotationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/quotes")
@RequiredArgsConstructor
public class QuotationController {

    private final QuotationService quotationService;

    @PostMapping
    @PreAuthorize("hasRole('FIRM')")
    public ResponseEntity<QuotationResponse> submitQuotation(
            @Valid @RequestPart("quotation") QuotationRequest request,
            @RequestPart(value = "pdf", required = false) MultipartFile pdf,
            Authentication auth) {
        return ResponseEntity.ok(quotationService.submitQuotation(request, auth.getName(), pdf));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('FIRM')")
    public ResponseEntity<List<QuotationResponse>> getMyQuotes(Authentication auth) {
        return ResponseEntity.ok(quotationService.getMyQuotes(auth.getName()));
    }
}
