package com.cricketacademy.api.controller;

import com.cricketacademy.api.entity.AvailableProgram;
import com.cricketacademy.api.service.AvailableProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for coach-accessible program viewing
 * Provides read-only access to coaching programs for COACH role
 */
@RestController
@RequestMapping("/api/coach/programs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('COACH')")
public class CoachProgramController {

    private final AvailableProgramService programService;

    /**
     * Get all active programs for coaches
     */
    @GetMapping
    public ResponseEntity<List<AvailableProgram>> getAllActivePrograms() {
        return ResponseEntity.ok(programService.getActivePrograms());
    }

    /**
     * Get program by ID for coaches
     */
    @GetMapping("/{id}")
    public ResponseEntity<AvailableProgram> getProgramById(@PathVariable Long id) {
        return ResponseEntity.ok(programService.getProgramById(id));
    }

    /**
     * Search programs by keyword for coaches
     */
    @GetMapping("/search")
    public ResponseEntity<List<AvailableProgram>> searchPrograms(@RequestParam String keyword) {
        return ResponseEntity.ok(programService.searchPrograms(keyword));
    }

    /**
     * Get programs by category for coaches
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<AvailableProgram>> getProgramsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(programService.getProgramsByCategory(category));
    }

    /**
     * Get programs by level for coaches
     */
    @GetMapping("/level/{level}")
    public ResponseEntity<List<AvailableProgram>> getProgramsByLevel(@PathVariable String level) {
        return ResponseEntity.ok(programService.getProgramsByLevel(level));
    }
}
