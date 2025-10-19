package com.cricketacademy.api.controller;

import com.cricketacademy.api.entity.SessionActivity;
import com.cricketacademy.api.entity.User;
import com.cricketacademy.api.service.SessionService;
import com.cricketacademy.api.service.UserService;
import com.cricketacademy.api.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/session")
@CrossOrigin(origins = "http://localhost:5173")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/activity")
    public ResponseEntity<Map<String, Object>> recordActivity(
            @RequestHeader("Authorization") String authHeader,
            HttpServletRequest request) {

        Map<String, Object> response = new HashMap<>();

        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "Invalid authorization header");
                return ResponseEntity.badRequest().body(response);
            }

            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);

            if (email == null || !jwtUtil.validateToken(token)) {
                response.put("success", false);
                response.put("message", "Invalid token");
                return ResponseEntity.badRequest().body(response);
            }

            // Update session activity
            sessionService.updateSessionActivity(token);

            response.put("success", true);
            response.put("message", "Activity recorded successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error recording activity: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/extend")
    public ResponseEntity<Map<String, Object>> extendSession(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "30") int minutes,
            HttpServletRequest request) {

        Map<String, Object> response = new HashMap<>();

        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "Invalid authorization header");
                return ResponseEntity.badRequest().body(response);
            }

            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);

            if (email == null || !jwtUtil.validateToken(token)) {
                response.put("success", false);
                response.put("message", "Invalid token");
                return ResponseEntity.badRequest().body(response);
            }

            // Extend session
            sessionService.extendSession(token, minutes);

            response.put("success", true);
            response.put("message", "Session extended successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error extending session: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getSessionStatus(
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "Invalid authorization header");
                return ResponseEntity.badRequest().body(response);
            }

            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);

            if (email == null || !jwtUtil.validateToken(token)) {
                response.put("success", false);
                response.put("message", "Invalid token");
                return ResponseEntity.badRequest().body(response);
            }

            SessionActivity session = sessionService.getSession(token);
            if (session == null) {
                response.put("success", false);
                response.put("message", "Session not found");
                return ResponseEntity.badRequest().body(response);
            }

            response.put("success", true);
            response.put("session", session);
            response.put("timeRemaining",
                    java.time.Duration.between(LocalDateTime.now(), session.getSessionExpiryTime()).toMinutes());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error getting session status: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
