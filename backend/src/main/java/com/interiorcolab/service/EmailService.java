package com.interiorcolab.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationCode(String to, String code) {
        log.info("Dispatching verification code to {}", to);
        try {

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("support@interiorcolab.com");
            message.setTo(to);
            message.setSubject("NestLnk | Identity Verification Code");
            message.setText("Greetings from NestLnk,\n\n" +
                    "Your identity verification protocol has been initialized.\n" +
                    "Secure Protocol Code: " + code + "\n\n" +
                    "This code will expire in 5 minutes.\n" +
                    "If you did not initiate this request, please ignore this message.\n\n" +
                    "Best regards,\n" +
                    "NestLnk Security Team");

            mailSender.send(message);
            log.info("Verification code dispatched successfully to: {}", to);
        } catch (Exception e) {
            log.error("SMTP Error: Failed to dispatch verification code to {}. Reason: {}", to, e.getMessage(), e);
            // We don't throw here to avoid blocking the UI flow in dev,

            // but in production we might want to handle this differently.
        }
    }
}
