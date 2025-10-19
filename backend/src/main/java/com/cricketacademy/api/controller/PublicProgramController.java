package com.cricketacademy.api.controller;

import com.cricketacademy.api.entity.AvailableProgram;
import com.cricketacademy.api.service.AvailableProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public endpoints for viewing available coaching programs
 */
@RestController
@RequestMapping("/api/programs")
@RequiredArgsConstructor
public class PublicProgramController {

    private final AvailableProgramService programService;

    /**
     * Get all active programs (public)
     */
    @GetMapping("/active")
    public ResponseEntity<List<AvailableProgram>> getActivePrograms() {
        return ResponseEntity.ok(programService.getActivePrograms());
    }

    /**
     * Get all programs (public)
     */
    @GetMapping
    public ResponseEntity<List<AvailableProgram>> getAllPrograms() {
        return ResponseEntity.ok(programService.getAllPrograms());
    }

    /**
     * Search programs by keyword (program name or description)
     */
    @GetMapping("/search")
    public ResponseEntity<List<AvailableProgram>> searchPrograms(@RequestParam("keyword") String keyword) {
        return ResponseEntity.ok(programService.searchPrograms(keyword));
    }

    /**
     * Filter programs by category
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<AvailableProgram>> getProgramsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(programService.getProgramsByCategory(category));
    }

    /**
     * Filter programs by level
     */
    @GetMapping("/level/{level}")
    public ResponseEntity<List<AvailableProgram>> getProgramsByLevel(@PathVariable String level) {
        return ResponseEntity.ok(programService.getProgramsByLevel(level));
    }
}