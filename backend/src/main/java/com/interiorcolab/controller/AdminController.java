package com.interiorcolab.controller;

import com.interiorcolab.dto.AnalyticsResponse;
import com.interiorcolab.dto.ApiResponse;
import com.interiorcolab.dto.PropertyBriefResponse;
import com.interiorcolab.dto.QuotationResponse;
import com.interiorcolab.dto.UserResponse;
import com.interiorcolab.service.AdminService;
import com.interiorcolab.service.PropertyService;
import com.interiorcolab.service.QuotationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final PropertyService propertyService;
    private final QuotationService quotationService;

    @GetMapping("/firms")
    public ResponseEntity<List<UserResponse>> getAllFirms() {
        return ResponseEntity.ok(adminService.getAllFirms());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/verify/{firmId}")
    public ResponseEntity<ApiResponse> verifyFirm(@PathVariable("firmId") UUID firmId) {
        adminService.verifyFirm(firmId);
        return ResponseEntity.ok(new ApiResponse(true, "Firm verified successfully"));
    }

    @GetMapping("/properties")
    public ResponseEntity<List<PropertyBriefResponse>> getAllProperties() {
        return ResponseEntity.ok(propertyService.getAllProperties());
    }

    @DeleteMapping("/property/{id}")
    public ResponseEntity<ApiResponse> deleteProperty(@PathVariable("id") UUID id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.ok(new ApiResponse(true, "Property deleted successfully"));
    }

    @GetMapping("/quotes")
    public ResponseEntity<List<QuotationResponse>> getAllQuotes() {
        return ResponseEntity.ok(quotationService.getAllQuotes());
    }

    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsResponse> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }
}
