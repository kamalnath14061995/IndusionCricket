package com.cricketacademy.api.controller;

import com.cricketacademy.api.entity.EmailVerificationToken;
import com.cricketacademy.api.entity.User;
import com.cricketacademy.api.service.EmailVerificationService;
import com.cricketacademy.api.service.UserService;
import com.cricketacademy.api.util.JwtUtil;
import com.cricketacademy.api.dto.VerifyOtpRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/verify")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class EmailVerificationController {

    private final EmailVerificationService emailVerificationService;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    /**
     * Send verification email with OTP
     */
    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, Object>> sendVerificationEmail(
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);

            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if already verified
            if (user.getStatus() == User.UserStatus.ACTIVE) {
                response.put("success", false);
                response.put("message", "Email already verified");
                return ResponseEntity.badRequest().body(response);
            }

            // Create and send verification token
            EmailVerificationToken verificationToken = emailVerificationService.createVerificationToken(user);

            response.put("success", true);
            response.put("message", "Verification email sent successfully");
            response.put("token", verificationToken.getToken());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to send verification email: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "Failed to send verification email: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Verify OTP and update user status
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOTP(
            @RequestBody VerifyOtpRequest request) {

        Map<String, Object> response = new HashMap<>();

        try {
            String token = request.getToken();
            String otp = request.getOtp();

            boolean isVerified = emailVerificationService.verifyOTP(token, otp);

            if (isVerified) {
                response.put("success", true);
                response.put("message", "Email verified successfully");
                response.put("status", "ACTIVE");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Invalid or expired OTP");
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            log.error("Failed to verify OTP: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "Failed to verify OTP: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Check email verification status
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getVerificationStatus(
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);

            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            boolean isVerified = emailVerificationService.isEmailVerified(user);

            response.put("success", true);
            response.put("verified", isVerified);
            response.put("status", user.getStatus().toString());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to get verification status: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "Failed to get verification status: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
