package com.interiorcolab.controller;

import com.interiorcolab.dto.ApiResponse;
import com.interiorcolab.dto.PropertyBriefRequest;
import com.interiorcolab.dto.PropertyBriefResponse;
import com.interiorcolab.dto.QuotationResponse;
import com.interiorcolab.service.PropertyService;
import com.interiorcolab.service.QuotationService;
import com.interiorcolab.service.AIComparisonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@Slf4j
public class PropertyController {

    private final PropertyService propertyService;
    private final QuotationService quotationService;
    private final AIComparisonService aiComparisonService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<PropertyBriefResponse> createProperty(
            @Valid @RequestPart("property") PropertyBriefRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            Authentication auth) {
        return ResponseEntity.ok(propertyService.createProperty(request, auth.getName(), images));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<PropertyBriefResponse>> getMyProperties(Authentication auth) {
        return ResponseEntity.ok(propertyService.getMyProperties(auth.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyBriefResponse> getProperty(@PathVariable("id") UUID id, Authentication auth) {
        return ResponseEntity.ok(propertyService.getPropertyById(id, auth.getName()));
    }

    @GetMapping("/open")
    @PreAuthorize("hasRole('FIRM')")
    public ResponseEntity<List<PropertyBriefResponse>> getOpenProperties(Authentication auth) {
        return ResponseEntity.ok(propertyService.getOpenProperties(auth.getName()));
    }

    @GetMapping("/firm/withdrawn")
    @PreAuthorize("hasRole('FIRM')")
    public ResponseEntity<List<PropertyBriefResponse>> getWithdrawnProperties(Authentication auth) {
        return ResponseEntity.ok(propertyService.getWithdrawnProperties(auth.getName()));
    }

    @PutMapping("/{id}/close")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse> closeProperty(@PathVariable("id") UUID id, Authentication auth) {
        propertyService.closeProperty(id, auth.getName());
        return ResponseEntity.ok(new ApiResponse(true, "Property closed successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<PropertyBriefResponse> updateProperty(
            @PathVariable("id") UUID id,
            @Valid @RequestBody PropertyBriefRequest request,
            Authentication auth) {
        return ResponseEntity.ok(propertyService.updateProperty(id, request, auth.getName()));
    }

    @GetMapping("/{id}/quotes")
    public ResponseEntity<List<QuotationResponse>> getPropertyQuotes(
            @PathVariable("id") UUID id, Authentication auth) {
        return ResponseEntity.ok(quotationService.getQuotesByProperty(id, auth.getName()));
    }

    @PostMapping("/{id}/shortlist")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse> shortlistFirm(
            @PathVariable("id") UUID id,
            @RequestBody Map<String, String> request,
            Authentication auth) {
        UUID firmId = UUID.fromString(request.get("firmId"));
        propertyService.shortlistFirm(id, firmId, auth.getName());
        return ResponseEntity.ok(new ApiResponse(true, "Firm shortlisted successfully"));
    }

    @GetMapping("/firms/list")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<Map<String, Object>>> getVerifiedFirms() {
        return ResponseEntity.ok(propertyService.getVerifiedFirms());
    }

    @PostMapping("/{id}/assign-firms")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse> assignFirms(
            @PathVariable("id") UUID id,
            @RequestBody Map<String, List<String>> request,
            Authentication auth) {
        List<UUID> firmIds = request.get("firmIds").stream()
                .map(UUID::fromString)
                .collect(Collectors.toList());
        propertyService.assignFirmsToProperty(id, firmIds, auth.getName());
        return ResponseEntity.ok(new ApiResponse(true, "Firms assigned successfully"));
    }

    @PostMapping("/{id}/ai-compare")
    @PreAuthorize("hasRole('CUSTOMER')")
    public org.springframework.web.servlet.mvc.method.annotation.SseEmitter aiCompare(
            @PathVariable("id") UUID id,
            @RequestBody com.interiorcolab.dto.AIRequest request,
            Authentication auth) {
        log.info("Starting AI stream for property {} by user {}", id, auth.getName());
        org.springframework.web.servlet.mvc.method.annotation.SseEmitter emitter = new org.springframework.web.servlet.mvc.method.annotation.SseEmitter(300000L); // 5 minutes timeout
        
        emitter.onCompletion(() -> log.debug("SseEmitter completed for property {}", id));
        emitter.onTimeout(() -> {
            log.warn("SseEmitter timeout for property {}", id);
            emitter.complete();
        });
        emitter.onError((ex) -> {
            log.error("SseEmitter error for property {}: {}", id, ex.getMessage());
            emitter.completeWithError(ex);
        });

        // Use DelegatingSecurityContextRunnable to propagate security context to the background thread
        Runnable runnable = new org.springframework.security.concurrent.DelegatingSecurityContextRunnable(() -> {
            try {
                emitter.send(org.springframework.web.servlet.mvc.method.annotation.SseEmitter.event()
                    .data("established"));
                
                aiComparisonService.streamCompareQuotations(id, auth.getName(), request.getQuestion(), chunk -> {
                    try {
                        emitter.send(org.springframework.web.servlet.mvc.method.annotation.SseEmitter.event()
                            .data(chunk));
                    } catch (Exception e) {
                        log.error("Failed to send SSE chunk: {}", e.getMessage());
                    }
                });
                log.info("AI stream completed successfully for property {}", id);
                emitter.complete();
            } catch (Exception e) {
                log.error("AI Streaming failed for property {}: {}", id, e.getMessage());
                try {
                    emitter.send(org.springframework.web.servlet.mvc.method.annotation.SseEmitter.event()
                        .data("Error: " + e.getMessage()));
                } catch (Exception ex) {
                    // Ignore
                }
                emitter.completeWithError(e);
            }
        });

        new Thread(runnable).start();
        
        return emitter;
    }
}
