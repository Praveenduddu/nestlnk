package com.interiorcolab.service;

import com.interiorcolab.dto.AuthResponse;
import com.interiorcolab.dto.LoginRequest;
import com.interiorcolab.dto.RegisterRequest;
import com.interiorcolab.model.Role;
import com.interiorcolab.model.User;
import com.interiorcolab.repository.UserRepository;
import com.interiorcolab.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final com.interiorcolab.util.PasswordUtil passwordUtil;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final EncryptionService encryptionService;

    public AuthResponse register(RegisterRequest request) {
        log.info("Received registration request for email: {}", request.getEmail());
        try {
            if (userRepository.existsByEmail(request.getEmail())) {
                log.warn("Registration failed: Email {} already exists", request.getEmail());
                throw new RuntimeException("Email already registered");
            }

            Role role;
            try {
                role = Role.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                log.error("Invalid role provided: {}", request.getRole());
                throw new RuntimeException("Invalid role. Must be CUSTOMER or FIRM");
            }

            if (role == Role.ADMIN) {
                throw new RuntimeException("Cannot register as ADMIN");
            }

            User user = User.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .password(passwordUtil.encrypt(request.getPassword()))
                    .role(role)
                    .companyName(request.getCompanyName())
                    .phone(request.getPhone())
                    .isVerified(true) // Set to true after OTP verification
                    .build();

            user = userRepository.save(user);
            log.info("User {} saved successfully", user.getEmail());

            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            String token = jwtUtil.generateToken(userDetails, user.getRole().name(), user.getId().toString());
            String refreshToken = jwtUtil.generateRefreshToken(userDetails);

            return AuthResponse.builder()
                    .token(token)
                    .refreshToken(refreshToken)
                    .role(user.getRole().name())
                    .name(user.getName())
                    .email(user.getEmail())
                    .userId(user.getId().toString())
                    .companyName(user.getCompanyName())
                    .phone(user.getPhone())
                    .verified(user.isVerified())
                    .hasGeminiKey(user.getGeminiApiKeyEncrypted() != null)
                    .build();
        } catch (Exception e) {
            log.error("Critical error during registration for {}: {}", request.getEmail(), e.getMessage(), e);
            throw e;
        }
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails, user.getRole().name(), user.getId().toString());
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .role(user.getRole().name())
                .name(user.getName())
                .email(user.getEmail())
                .userId(user.getId().toString())
                .companyName(user.getCompanyName())
                .phone(user.getPhone())
                .verified(user.isVerified())
                .hasGeminiKey(user.getGeminiApiKeyEncrypted() != null)
                .build();
    }

    public AuthResponse refreshToken(String refreshToken) {
        String email = jwtUtil.extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        if (!jwtUtil.validateToken(refreshToken, userDetails)) {
            throw new RuntimeException("Invalid refresh token");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newToken = jwtUtil.generateToken(userDetails, user.getRole().name(), user.getId().toString());

        return AuthResponse.builder()
                .token(newToken)
                .refreshToken(refreshToken)
                .role(user.getRole().name())
                .name(user.getName())
                .email(user.getEmail())
                .userId(user.getId().toString())
                .companyName(user.getCompanyName())
                .phone(user.getPhone())
                .verified(user.isVerified())
                .hasGeminiKey(user.getGeminiApiKeyEncrypted() != null)
                .build();
    }

    public void resetPassword(String email, String newPassword) {
        log.info("Resetting password for user: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordUtil.encrypt(newPassword));
        userRepository.save(user);
        log.info("Password updated successfully for: {}", email);
    }

    public AuthResponse updateProfile(String email, com.interiorcolab.dto.ProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName().trim());
        }
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            user.setPhone(request.getPhone().trim());
        }
        if (request.getCompanyName() != null && !request.getCompanyName().trim().isEmpty()) {
            user.setCompanyName(request.getCompanyName().trim());
        }

        user = userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails, user.getRole().name(), user.getId().toString());
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .role(user.getRole().name())
                .name(user.getName())
                .email(user.getEmail())
                .userId(user.getId().toString())
                .companyName(user.getCompanyName())
                .phone(user.getPhone())
                .verified(user.isVerified())
                .hasGeminiKey(user.getGeminiApiKeyEncrypted() != null)
                .build();
    }

    public void saveGeminiApiKey(String email, String apiKey) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        try {
            String iv = encryptionService.generateIv();
            String encryptedKey = encryptionService.encrypt(apiKey, iv);
            user.setGeminiApiKeyEncrypted(encryptedKey);
            user.setGeminiApiKeyIv(iv);
            userRepository.save(user);
            log.info("Gemini API Key saved and encrypted for user: {}", email);
        } catch (Exception e) {
            log.error("Failed to encrypt/save Gemini API Key for {}: {}", email, e.getMessage());
            throw new RuntimeException("Encryption failed");
        }
    }

    public String getGeminiApiKey(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getGeminiApiKeyEncrypted() == null) {
            return null;
        }
        try {
            return encryptionService.decrypt(user.getGeminiApiKeyEncrypted(), user.getGeminiApiKeyIv());
        } catch (Exception e) {
            log.error("Failed to decrypt Gemini API Key for {}: {}", email, e.getMessage());
            throw new RuntimeException("Decryption failed");
        }
    }
}
