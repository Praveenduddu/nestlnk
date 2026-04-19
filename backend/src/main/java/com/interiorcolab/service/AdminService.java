package com.interiorcolab.service;

import com.interiorcolab.dto.AnalyticsResponse;
import com.interiorcolab.dto.UserResponse;
import com.interiorcolab.model.PropertyStatus;
import com.interiorcolab.model.Role;
import com.interiorcolab.model.User;
import com.interiorcolab.repository.PropertyBriefRepository;
import com.interiorcolab.repository.QuotationRepository;
import com.interiorcolab.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PropertyBriefRepository propertyRepository;
    private final QuotationRepository quotationRepository;

    public List<UserResponse> getAllFirms() {
        return userRepository.findByRole(Role.FIRM)
                .stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    public void verifyFirm(UUID firmId) {
        User firm = userRepository.findById(firmId)
                .orElseThrow(() -> new RuntimeException("Firm not found"));

        if (firm.getRole() != Role.FIRM) {
            throw new RuntimeException("User is not a firm");
        }

        firm.setVerified(true);
        userRepository.save(firm);
    }

    public AnalyticsResponse getAnalytics() {
        return AnalyticsResponse.builder()
                .totalCustomers(userRepository.countByRole(Role.CUSTOMER))
                .totalFirms(userRepository.countByRole(Role.FIRM))
                .verifiedFirms(userRepository.findByRoleAndIsVerified(Role.FIRM, true).size())
                .totalProperties(propertyRepository.count())
                .openProperties(propertyRepository.countByStatus(PropertyStatus.OPEN))
                .totalQuotations(quotationRepository.count())
                .build();
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .companyName(user.getCompanyName())
                .phone(user.getPhone())
                .verified(user.isVerified())
                .createdAt(user.getCreatedAt().toString())
                .build();
    }
}
