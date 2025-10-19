package com.cricketacademy.api.controller;

import com.cricketacademy.api.dto.ApiResponse;
import com.cricketacademy.api.dto.ExpertCoachDTO;
import com.cricketacademy.api.entity.ExpertCoach;
import com.cricketacademy.api.service.ExpertCoachService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Admin controller for coach management
 * Handles admin-specific coach operations with consistent URL patterns
 */
@RestController
@RequestMapping("/api/admin/coaches")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Slf4j
@CrossOrigin(origins = "*")
public class AdminCoachController {

    private final ExpertCoachService coachService;

    /**
     * Get all coaches
     * GET /api/admin/coaches
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ExpertCoach>>> getAllCoaches() {
        List<ExpertCoach> coaches = coachService.getAllCoaches();
        ApiResponse<List<ExpertCoach>> response = ApiResponse.success(
                "Coaches retrieved successfully", coaches);
        return ResponseEntity.ok(response);
    }

    /**
     * Get available coaches
     * GET /api/admin/coaches/available
     */
    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<ExpertCoach>>> getAvailableCoaches() {
        List<ExpertCoach> coaches = coachService.getAvailableCoaches();
        ApiResponse<List<ExpertCoach>> response = ApiResponse.success(
                "Available coaches retrieved successfully", coaches);
        return ResponseEntity.ok(response);
    }

    /**
     * Get coach by ID
     * GET /api/admin/coaches/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpertCoach>> getCoachById(@PathVariable Long id) {
        try {
            ExpertCoach coach = coachService.getCoachById(id);
            ApiResponse<ExpertCoach> response = ApiResponse.success(
                    "Coach retrieved successfully", coach);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get coach with ID: {}", id, e);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Create new coach
     * POST /api/admin/coaches/create
     */
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<ExpertCoach>> createCoach(@RequestBody ExpertCoachDTO coachDTO) {
        try {
            ExpertCoach createdCoach = coachService.createCoach(coachDTO);
            ApiResponse<ExpertCoach> response = ApiResponse.success(
                    "Coach created successfully", createdCoach);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to create coach", e);
            ApiResponse<ExpertCoach> response = ApiResponse.error(
                    "Failed to create coach: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Update coach
     * PUT /api/admin/coaches/edit/{id}
     */
    @PutMapping("/edit/{id}")
    public ResponseEntity<ApiResponse<ExpertCoach>> updateCoach(
            @PathVariable Long id, @RequestBody ExpertCoachDTO coachDTO) {
        try {
            ExpertCoach updatedCoach = coachService.updateCoach(id, coachDTO);
            ApiResponse<ExpertCoach> response = ApiResponse.success(
                    "Coach updated successfully", updatedCoach);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to update coach with ID: {}", id, e);
            ApiResponse<ExpertCoach> response = ApiResponse.error(
                    "Failed to update coach: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Delete coach
     * DELETE /api/admin/coaches/delete/{id}
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCoach(@PathVariable Long id) {
        try {
            coachService.deleteCoach(id);
            ApiResponse<String> response = ApiResponse.success("Coach deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to delete coach with ID: {}", id, e);
            ApiResponse<String> response = ApiResponse.error(
                    "Failed to delete coach: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Search coaches
     * GET /api/admin/coaches/search
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ExpertCoach>>> searchCoaches(@RequestParam String keyword) {
        List<ExpertCoach> coaches = coachService.searchCoaches(keyword);
        ApiResponse<List<ExpertCoach>> response = ApiResponse.success(
                "Coaches search completed successfully", coaches);
        return ResponseEntity.ok(response);
    }

    /**
     * Get coaches by specialization
     * GET /api/admin/coaches/specialization/{specialization}
     */
    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<ApiResponse<List<ExpertCoach>>> getCoachesBySpecialization(@PathVariable String specialization) {
        List<ExpertCoach> coaches = coachService.getCoachesBySpecialization(specialization);
        ApiResponse<List<ExpertCoach>> response = ApiResponse.success(
                "Coaches by specialization retrieved successfully", coaches);
        return ResponseEntity.ok(response);
    }

    /**
     * Get coach specifications
     * GET /api/admin/coaches/specifications
     */
    @GetMapping("/specifications")
    public ResponseEntity<ApiResponse<CoachSpecifications>> getCoachSpecifications() {
        CoachSpecifications specifications = new CoachSpecifications();
        ApiResponse<CoachSpecifications> response = ApiResponse.success(
                "Coach specifications retrieved successfully", specifications);
        return ResponseEntity.ok(response);
    }

    public static class CoachSpecifications {
        public final java.util.Map<String, SpecificationCategory> categories;
        
        public CoachSpecifications() {
            categories = new java.util.HashMap<>();
            categories.put("Qualifications", new SpecificationCategory("👨🏫", java.util.Arrays.asList(
                "BCCI Certified", "ICC Certified", "State Cricket Association Certified", "Level 1 Certificate", "Level 2 Certificate", "Level 3 Certificate"
            )));
            categories.put("Experience", new SpecificationCategory("🏆", java.util.Arrays.asList(
                "Former State Player", "Former National Player", "Club Level Experience", "International Match Experience", "Domestic Tournament Experience"
            )));
            categories.put("Specialization", new SpecificationCategory("🎯", java.util.Arrays.asList(
                "Batting Coach", "Spin Bowling Expert", "Pace Bowling Expert", "Wicketkeeping Trainer", "Fitness Trainer", "All-Rounder Coach"
            )));
            categories.put("Age Groups", new SpecificationCategory("🧒", java.util.Arrays.asList(
                "Kids (5-12 years)", "Youth (13-17 years)", "Adults (18+ years)", "Women's Cricket", "Senior Citizens"
            )));
            categories.put("Technology", new SpecificationCategory("📹", java.util.Arrays.asList(
                "Video Analysis Tools", "AI Technique Analysis", "Performance Analytics", "Slow Motion Analysis", "3D Biomechanics"
            )));
            categories.put("Fitness & Health", new SpecificationCategory("💪", java.util.Arrays.asList(
                "Strength Training", "Conditioning Expert", "Injury Prevention", "Physiotherapy Support", "Nutrition Planning", "Mental Health Support"
            )));
            categories.put("Communication", new SpecificationCategory("🌍", java.util.Arrays.asList(
                "English Fluent", "Hindi Fluent", "Regional Languages", "Sign Language", "Multilingual"
            )));
            categories.put("Availability", new SpecificationCategory("🕰️", java.util.Arrays.asList(
                "Hourly Sessions", "Weekend Coaching", "Online Coaching", "Seasonal Camps", "Flexible Timings", "Emergency Sessions"
            )));
            categories.put("Training Methods", new SpecificationCategory("🏟️", java.util.Arrays.asList(
                "Match Simulation", "Scenario-based Drills", "Mental Skills Training", "Pressure Handling", "Game Awareness", "Leadership Development"
            )));
            categories.put("Support Services", new SpecificationCategory("📊", java.util.Arrays.asList(
                "Performance Tracking", "Progress Reports", "Skill Assessments", "Career Guidance", "Motivational Support", "Parent Consultation"
            )));
        }
    }

    public static class SpecificationCategory {
        public final String icon;
        public final java.util.List<String> features;

        public SpecificationCategory(String icon, java.util.List<String> features) {
            this.icon = icon;
            this.features = features;
        }
    }
}
