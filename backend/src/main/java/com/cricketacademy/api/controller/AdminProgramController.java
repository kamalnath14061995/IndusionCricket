package com.cricketacademy.api.controller;

import com.cricketacademy.api.dto.ApiResponse;
import com.cricketacademy.api.dto.AvailableProgramDTO;
import com.cricketacademy.api.entity.AvailableProgram;
import com.cricketacademy.api.service.AvailableProgramService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/programs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
@Slf4j
public class AdminProgramController {

    private final AvailableProgramService programService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AvailableProgram>>> getAllPrograms() {
        try {
            List<AvailableProgram> programs = programService.getAllProgramsWithSuggested();
            ApiResponse<List<AvailableProgram>> response = ApiResponse.success(
                    "Programs retrieved successfully", programs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get programs", e);
            // Fallback to basic findAll if there's an issue
            List<AvailableProgram> programs = programService.getAllPrograms();
            ApiResponse<List<AvailableProgram>> response = ApiResponse.success(
                    "Programs retrieved successfully", programs);
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<AvailableProgram>>> getActivePrograms() {
        List<AvailableProgram> programs = programService.getActivePrograms();
        ApiResponse<List<AvailableProgram>> response = ApiResponse.success(
                "Active programs retrieved successfully", programs);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AvailableProgram>> getProgramById(@PathVariable Long id) {
        try {
            AvailableProgram program = programService.getProgramById(id);
            ApiResponse<AvailableProgram> response = ApiResponse.success(
                    "Program retrieved successfully", program);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get program with ID: {}", id, e);
            ApiResponse<AvailableProgram> response = ApiResponse.error(
                    "Failed to get program: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<AvailableProgram>> createProgram(@RequestBody AvailableProgramDTO programDTO) {
        try {
            AvailableProgram createdProgram = programService.createProgram(programDTO);
            ApiResponse<AvailableProgram> response = ApiResponse.success(
                    "Program created successfully", createdProgram);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Failed to create program", e);
            ApiResponse<AvailableProgram> response = ApiResponse.error(
                    "Failed to create program: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<ApiResponse<AvailableProgram>> updateProgram(
            @PathVariable Long id,
            @RequestBody AvailableProgramDTO programDTO) {
        try {
            AvailableProgram updatedProgram = programService.updateProgram(id, programDTO);
            ApiResponse<AvailableProgram> response = ApiResponse.success(
                    "Program updated successfully", updatedProgram);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to update program with ID: {}", id, e);
            ApiResponse<AvailableProgram> response = ApiResponse.error(
                    "Failed to update program: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProgram(@PathVariable Long id) {
        try {
            programService.deleteProgram(id);
            ApiResponse<String> response = ApiResponse.success("Program deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to delete program with ID: {}", id, e);
            ApiResponse<String> response = ApiResponse.error(
                    "Failed to delete program: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/suggested")
    public ResponseEntity<ApiResponse<List<AvailableProgram>>> getSuggestedPrograms() {
        List<AvailableProgram> programs = programService.getSuggestedPrograms();
        ApiResponse<List<AvailableProgram>> response = ApiResponse.success(
                "Suggested programs retrieved successfully", programs);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/initialize-suggested")
    public ResponseEntity<ApiResponse<String>> initializeSuggestedPrograms() {
        try {
            programService.initializeSuggestedPrograms();
            ApiResponse<String> response = ApiResponse.success("Suggested programs initialized successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to initialize suggested programs", e);
            ApiResponse<String> response = ApiResponse.error(
                    "Failed to initialize suggested programs: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/force-create-suggested")
    public ResponseEntity<ApiResponse<String>> forceCreateSuggestedPrograms() {
        try {
            programService.createSuggestedPrograms();
            ApiResponse<String> response = ApiResponse.success("Suggested programs created successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to create suggested programs", e);
            ApiResponse<String> response = ApiResponse.error(
                    "Failed to create suggested programs: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
