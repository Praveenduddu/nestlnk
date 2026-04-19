package com.interiorcolab.controller;

import com.interiorcolab.dto.AuthResponse;
import com.interiorcolab.dto.LoginRequest;
import com.interiorcolab.dto.RegisterRequest;
import com.interiorcolab.service.AuthService;
import com.interiorcolab.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;

    @PostMapping("/otp/request")
    public ResponseEntity<Void> requestOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email != null)
            email = email.trim();
        otpService.generateOtp(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<Map<String, Boolean>> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email != null)
            email = email.trim();
        String otp = request.get("otp");
        if (otp != null)
            otp = otp.trim();

        log.info("Received OTP verify request: email={}, otp={}", email, otp);
        boolean isValid = otpService.verifyOtp(email, otp, false);
        return ResponseEntity.ok(Map.of("valid", isValid));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }

    @PostMapping("/password/reset")
    public ResponseEntity<Void> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email != null)
            email = email.trim();
        String otp = request.get("otp");
        if (otp != null)
            otp = otp.trim();
        String newPassword = request.get("newPassword");

        log.info("Received password reset request for email: {} with OTP: {}", email, otp);

        if (otpService.verifyOtp(email, otp, true)) {
            authService.resetPassword(email, newPassword);
            return ResponseEntity.ok().build();
        } else {
            log.warn("Password reset failed for {}: Invalid OTP", email);
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<AuthResponse> updateProfile(
            @RequestBody com.interiorcolab.dto.ProfileRequest request,
            Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(authService.updateProfile(auth.getName(), request));
    }

    @PutMapping("/gemini-key")
    public ResponseEntity<Void> updateGeminiKey(
            @RequestBody Map<String, String> request,
            Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        String apiKey = request.get("apiKey");
        authService.saveGeminiApiKey(auth.getName(), apiKey);
        return ResponseEntity.ok().build();
    }
}
