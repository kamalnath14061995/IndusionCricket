package com.cricketacademy.api.controller;

import com.cricketacademy.api.entity.ExpertCoach;
import com.cricketacademy.api.service.ExpertCoachService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public endpoints for viewing coaches
 */
@RestController
@RequestMapping("/api/coaches")
@RequiredArgsConstructor
public class PublicCoachController {

    private final ExpertCoachService coachService;

    /**
     * Get all coaches (public)
     */
    @GetMapping
    public ResponseEntity<List<ExpertCoach>> getAllCoaches() {
        return ResponseEntity.ok(coachService.getAllCoaches());
    }

    /**
     * Get only available coaches (public)
     */
    @GetMapping("/available")
    public ResponseEntity<List<ExpertCoach>> getAvailableCoaches() {
        return ResponseEntity.ok(coachService.getAvailableCoaches());
    }
}