package com.cricketacademy.api.controller;

import com.cricketacademy.api.dto.ApiResponse;
import com.cricketacademy.api.dto.RegistrationRequest;
import com.cricketacademy.api.dto.LoginRequest;
import com.cricketacademy.api.dto.ForgotPasswordRequest;
import com.cricketacademy.api.entity.User;
import com.cricketacademy.api.service.UserService;
import com.cricketacademy.api.service.EmailService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Controller for authentication-related endpoints
 * Handles user registration, login, and other auth operations
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final EmailService emailService;
    private final com.cricketacademy.api.service.RefreshTokenService refreshTokenService;
    private final com.cricketacademy.api.util.JwtUtil jwtUtil;

    /**
     * Login user
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> loginUser(
            @Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {

        log.info("Login request received for email: {}", request.getEmail());

        try {
            String ipAddress = getClientIpAddress(httpRequest);
            String userAgent = httpRequest.getHeader("User-Agent");

            UserService.LoginResult result = userService.loginUser(
                    request.getEmail(),
                    request.getPassword(),
                    ipAddress,
                    userAgent);

            if (result.isSuccess()) {
                User user = result.getUser();

                // Allow both ACTIVE and PENDING users to login
                // Create response data (excluding sensitive information)
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", user.getId());
                userData.put("name", user.getName());
                userData.put("email", user.getEmail());
                userData.put("phone", user.getPhone());
                userData.put("age", user.getAge());
                userData.put("experienceLevel", user.getExperienceLevel());
                userData.put("role", user.getRole());
                userData.put("status", user.getStatus().toString());
                userData.put("createdAt", user.getCreatedAt());
                userData.put("token", result.getToken()); // legacy access token

                // Issue refresh + new access token
                var tokens = refreshTokenService.createTokensForUser(user);
                userData.put("accessToken", tokens.get("accessToken"));
                userData.put("refreshToken", tokens.get("refreshToken"));
                userData.put("expiresIn", tokens.get("expiresIn"));

                ApiResponse<Map<String, Object>> response = ApiResponse.success(
                        result.getMessage(), userData);

                log.info("User logged in successfully: {} (status: {})", user.getEmail(), user.getStatus());
                return ResponseEntity.ok(response);
            } else {
                ApiResponse<Map<String, Object>> response = ApiResponse.error(result.getMessage());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

        } catch (Exception e) {
            log.error("Login failed for email: {}", request.getEmail(), e);
            ApiResponse<Map<String, Object>> response = ApiResponse.error(
                    "Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Logout user
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logoutUser(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Authorization header required"));
            }

            String token = authHeader.substring(7);

            // Validate token format before attempting logout
            if (token == null || token.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Invalid token: Token is empty"));
            }

            // Check token format (should have exactly 2 periods)
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse
                                .error("Invalid token format: JWT strings must contain exactly 2 period characters"));
            }

            boolean logoutSuccess = userService.logoutUser(token);

            if (logoutSuccess) {
                ApiResponse<String> response = ApiResponse.success("Logout successful");
                return ResponseEntity.ok(response);
            } else {
                ApiResponse<String> response = ApiResponse.error("Logout failed: Invalid or expired token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

        } catch (Exception e) {
            log.error("Logout failed: {}", e.getMessage());
            ApiResponse<String> response = ApiResponse.error("Logout failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get client IP address
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0];
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }

    /**
     * Register a new user
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> registerUser(
            @Valid @RequestBody RegistrationRequest request) {

        log.info("Registration request received for email: {}", request.getEmail());

        try {
            User registeredUser = userService.registerUser(request);

            // Create response data (excluding sensitive information)
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", registeredUser.getId());
            userData.put("name", registeredUser.getName());
            userData.put("email", registeredUser.getEmail());
            userData.put("phone", registeredUser.getPhone());
            userData.put("age", registeredUser.getAge());
            userData.put("experienceLevel", registeredUser.getExperienceLevel());
            userData.put("role", registeredUser.getRole());
            userData.put("createdAt", registeredUser.getCreatedAt());

            ApiResponse<Map<String, Object>> response = ApiResponse.success(
                    "User registered successfully", userData);

            log.info("User registered successfully with ID: {}", registeredUser.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            log.error("Registration failed for email: {}", request.getEmail(), e);
            ApiResponse<Map<String, Object>> response = ApiResponse.error(
                    "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Test endpoint to verify application is working
     * GET /api/auth/test
     */
    @GetMapping("/test")
    public ResponseEntity<ApiResponse<String>> testEndpoint() {
        ApiResponse<String> response = ApiResponse.success("Application is running without JWT dependencies");
        return ResponseEntity.ok(response);
    }

    /**
     * Health check endpoint
     * GET /api/auth/health
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        ApiResponse<String> response = ApiResponse.success("Cricket Academy API is running");
        return ResponseEntity.ok(response);
    }

    /**
     * Refresh access token
     * POST /api/auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Map<String, Object>>> refreshToken(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("refreshToken is required"));
        }

        var valid = refreshTokenService.validateRefreshToken(refreshToken);
        if (valid.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid or expired refresh token"));
        }

        var rt = valid.get();
        var user = rt.getUser();

        // Re-issue tokens
        var tokens = refreshTokenService.createTokensForUser(user);
        Map<String, Object> data = new HashMap<>();
        data.put("accessToken", tokens.get("accessToken"));
        data.put("refreshToken", tokens.get("refreshToken"));
        data.put("expiresIn", tokens.get("expiresIn"));

        return ResponseEntity.ok(ApiResponse.success("Token refreshed", data));
    }

    /**
     * Forgot password - send verification link to email
     * POST /api/auth/forgot-password
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Map<String, String>>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        log.info("Forgot password requested for email: {}", request.getEmail());

        Optional<User> userOpt = userService.findByEmail(request.getEmail());

        // Return specific error for non-existent email
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Email does not exist. You need to register first."));
        }

        User user = userOpt.get();

        try {
            // Create a real token persisted with expiry
            String token = userService.createPasswordResetToken(user);
            String resetLink = "http://localhost:5173/reset-password?token=" + token;

            String subject = "Reset your Cricket Academy password";
            String body = "Hello " + user.getName() + ",\n\n" +
                    "We received a request to reset your password. Click the link below to proceed:\n" +
                    resetLink + "\n\n" +
                    "If you did not request this, you can ignore this email.\n\n" +
                    "Thanks,\nCricket Academy Team";

            emailService.send(user.getEmail(), subject, body);

            return ResponseEntity.ok(ApiResponse.success("Reset email sent successfully", Map.of("status", "sent")));
        } catch (Exception e) {
            log.error("Failed to process forgot-password email for {}: {}", user.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to send reset email. Please try again later."));
        }
    }

    /**
     * Get experience levels
     * GET /api/auth/experience-levels
     */
    @GetMapping("/experience-levels")
    public ResponseEntity<ApiResponse<User.ExperienceLevel[]>> getExperienceLevels() {
        User.ExperienceLevel[] levels = User.ExperienceLevel.values();
        ApiResponse<User.ExperienceLevel[]> response = ApiResponse.success(
                "Experience levels retrieved successfully", levels);
        return ResponseEntity.ok(response);
    }

    /**
     * Reset password using token
     * POST /api/auth/reset-password
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Map<String, String>>> resetPassword(
            @Valid @RequestBody com.cricketacademy.api.dto.ResetPasswordRequest request) {
        boolean ok = userService.resetPassword(request.getToken(), request.getNewPassword());
        if (ok) {
            return ResponseEntity.ok(ApiResponse.success("Password reset successful", Map.of("status", "ok")));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Invalid or expired token"));
    }

    /**
     * Validate email availability
     * GET /api/auth/validate-email?email={email}
     */
    @GetMapping("/validate-email")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> validateEmail(
            @RequestParam String email) {

        boolean isAvailable = !userService.findByEmail(email).isPresent();
        Map<String, Boolean> data = Map.of("available", isAvailable);

        String message = isAvailable ? "Email is available" : "Email is already taken";
        ApiResponse<Map<String, Boolean>> response = ApiResponse.success(message, data);

        return ResponseEntity.ok(response);
    }

    /**
     * Validate phone availability
     * GET /api/auth/validate-phone?phone={phone}
     */
    @GetMapping("/validate-phone")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> validatePhone(
            @RequestParam String phone) {

        boolean isAvailable = !userService.findByEmail(phone).isPresent();
        Map<String, Boolean> data = Map.of("available", isAvailable);

        String message = isAvailable ? "Phone number is available" : "Phone number is already taken";
        ApiResponse<Map<String, Boolean>> response = ApiResponse.success(message, data);

        return ResponseEntity.ok(response);
    }
}