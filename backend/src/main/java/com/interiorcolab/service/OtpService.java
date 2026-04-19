package com.interiorcolab.service;

import com.interiorcolab.model.Otp;
import com.interiorcolab.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final OtpRepository otpRepository;
    private final EmailService emailService; // Added EmailService injection

    @Transactional // Keep @Transactional as it was in the original
    public void generateOtp(String email) {
        String code = String.format("%06d", (int) (Math.random() * 1000000)); // Changed OTP generation
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(5); // Changed variable name

        otpRepository.deleteByEmail(email);

        Otp otp = new Otp(); // Changed to direct instantiation and setters
        otp.setEmail(email);
        otp.setOtpCode(code);
        otp.setExpiryTime(expiry);
        otpRepository.save(otp);

        log.info("------------------------------------------");
        log.info("OTP FOR {}: {}", email, code); // Updated log to use 'code'
        log.info("EXPIRES AT: {}", expiry); // Updated log to use 'expiry'
        log.info("------------------------------------------");

        // Dispatch real email
        emailService.sendVerificationCode(email, code); // Called EmailService
    }

    public boolean verifyOtp(String email, String otpCode, boolean deleteOnSuccess) {
        log.info("Verifying OTP for {}: code={}, deleteOnSuccess={}", email, otpCode, deleteOnSuccess);
        return otpRepository.findByEmail(email)
                .map(otp -> {
                    boolean isMatch = otp.getOtpCode().equals(otpCode);
                    boolean isNotExpired = otp.getExpiryTime().isAfter(LocalDateTime.now());
                    boolean isValid = isMatch && isNotExpired;

                    log.info("OTP verification results for {}: match={}, notExpired={}, isValid={}",
                            email, isMatch, isNotExpired, isValid);

                    if (isValid && deleteOnSuccess) {
                        otpRepository.delete(otp);
                        log.info("Deleted OTP for {} after successful verification", email);
                    }
                    return isValid;
                })
                .orElseGet(() -> {
                    log.warn("No OTP found for email: {}", email);
                    return false;
                });
    }
}
