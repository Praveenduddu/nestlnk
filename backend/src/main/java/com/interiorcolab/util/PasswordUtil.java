package com.interiorcolab.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Utility class for password management.
 * Uses BCrypt hashing for secure password storage.
 */
@Component
public class PasswordUtil {

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Hashes a raw password using BCrypt.
     * 
     * @param rawPassword The plain text password.
     * @return The hashed password.
     */
    public String encrypt(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    /**
     * Verifies a raw password against an existing hash.
     * 
     * @param rawPassword    The plain text password to check.
     * @param hashedPassword The stored hash.
     * @return true if matches, false otherwise.
     */
    public boolean decrypt(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }

    public static void main(String[] args) {
        PasswordUtil passwordUtil = new PasswordUtil();
        String password = "Pr@veen12";

        // One-way hashing (Encryption)
        String hashedPassword = passwordUtil.encrypt(password);
        System.out.println("Hashed Password: " + hashedPassword);

        // Verification (Decryption/Matching)
        boolean isMatch = passwordUtil.decrypt(password, hashedPassword);
        System.out.println("Password Match: " + isMatch);
    }
}
