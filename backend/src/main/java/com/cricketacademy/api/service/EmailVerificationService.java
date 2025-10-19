package com.cricketacademy.api.service;

import com.cricketacademy.api.entity.EmailVerificationToken;
import com.cricketacademy.api.entity.User;
import com.cricketacademy.api.repository.EmailVerificationTokenRepository;
import com.cricketacademy.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailVerificationService {

    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    /**
     * Generate OTP for email verification
     */
    public String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    /**
     * Create and send verification email with OTP
     */
    public EmailVerificationToken createVerificationToken(User user) {
        log.info("Creating verification token for user: {}", user.getEmail());

        // Generate OTP
        String otp = generateOTP();

        // Create token
        EmailVerificationToken token = new EmailVerificationToken();
        token.setToken(UUID.randomUUID().toString());
        token.setUser(user);
        token.setOtp(otp);
        token.setExpiryDate(LocalDateTime.now().plusMinutes(30));
        token.setUsed(false);

        EmailVerificationToken savedToken = emailVerificationTokenRepository.save(token);

        // Send verification email
        emailService.sendVerificationEmail(user.getEmail(), otp);

        log.info("Verification token created for user: {}", user.getEmail());
        return savedToken;
    }

    /**
     * Verify OTP and update user status
     */
    public boolean verifyOTP(String token, String otp) {
        log.info("Verifying OTP for token: {}", token);

        Optional<EmailVerificationToken> tokenOpt = emailVerificationTokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            log.warn("Token not found: {}", token);
            return false;
        }

        EmailVerificationToken verificationToken = tokenOpt.get();

        // Check if token is expired
        if (verificationToken.isExpired()) {
            log.warn("Token expired: {}", token);
            return false;
        }

        // Check if token is already used
        if (verificationToken.getUsed()) {
            log.warn("Token already used: {}", token);
            return false;
        }

        // Check if OTP matches
        if (!verificationToken.getOtp().equals(otp)) {
            log.warn("Invalid OTP for token: {}", token);
            return false;
        }

        // Mark token as used
        verificationToken.setUsed(true);
        emailVerificationTokenRepository.save(verificationToken);

        // Update user status
        User user = verificationToken.getUser();
        user.setStatus(User.UserStatus.ACTIVE);
        userRepository.save(user);

        log.info("Email verified for user: {}", user.getEmail());
        return true;
    }

    /**
     * Check if user has verified email
     */
    public boolean isEmailVerified(User user) {
        return user.getStatus() == User.UserStatus.ACTIVE;
    }
}
