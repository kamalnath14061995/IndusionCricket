package com.cricketacademy.api.controller;

import com.cricketacademy.api.dto.CricketCoachRegistrationDTO;
import com.cricketacademy.api.dto.GroundStaffRegistrationDTO;
import com.cricketacademy.api.entity.CricketCoach;
import com.cricketacademy.api.entity.GroundStaff;
import com.cricketacademy.api.service.CareerRegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/career")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CareerController {

    private final CareerRegistrationService careerRegistrationService;

    @PostMapping("/cricket-coach")
    public ResponseEntity<?> registerCricketCoach(@Valid @RequestBody CricketCoachRegistrationDTO dto) {
        try {
            CricketCoach coach = careerRegistrationService.registerCricketCoach(dto);
            return ResponseEntity.ok(coach);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/ground-staff")
    public ResponseEntity<GroundStaff> registerGroundStaff(@Valid @RequestBody GroundStaffRegistrationDTO dto) {
        try {
            GroundStaff staff = careerRegistrationService.registerGroundStaff(dto);
            return ResponseEntity.ok(staff);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/cricket-coaches")
    public List<CricketCoach> getAllCricketCoaches() {
        return careerRegistrationService.getAllCricketCoaches();
    }

    @GetMapping("/ground-staff")
    public List<GroundStaff> getAllGroundStaff() {
        return careerRegistrationService.getAllGroundStaff();
    }

    // CRUD Operations for Cricket Coaches
    @GetMapping("/cricket-coach/{id}")
    public ResponseEntity<CricketCoach> getCricketCoachById(@PathVariable Long id) {
        return careerRegistrationService.getCricketCoachById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/cricket-coach/{id}")
    public ResponseEntity<CricketCoach> updateCricketCoach(@PathVariable Long id,
            @Valid @RequestBody CricketCoachRegistrationDTO dto) {
        try {
            CricketCoach coach = careerRegistrationService.updateCricketCoach(id, dto);
            return ResponseEntity.ok(coach);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/cricket-coach/{id}")
    public ResponseEntity<Void> deleteCricketCoach(@PathVariable Long id) {
        careerRegistrationService.deleteCricketCoach(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/cricket-coach/{id}/onboard-status")
    public ResponseEntity<CricketCoach> updateCoachOnboardStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            CricketCoach.OnboardStatus onboardStatus = CricketCoach.OnboardStatus.valueOf(status.toUpperCase());
            CricketCoach coach = careerRegistrationService.updateCoachOnboardStatus(id, onboardStatus);
            return ResponseEntity.ok(coach);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/cricket-coach/{id}/job-status")
    public ResponseEntity<CricketCoach> updateCoachJobStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            CricketCoach.JobStatus jobStatus = CricketCoach.JobStatus.valueOf(status.toUpperCase());
            CricketCoach coach = careerRegistrationService.updateCoachJobStatus(id, jobStatus);
            return ResponseEntity.ok(coach);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // CRUD Operations for Ground Staff
    @GetMapping("/ground-staff/{id}")
    public ResponseEntity<GroundStaff> getGroundStaffById(@PathVariable Long id) {
        return careerRegistrationService.getGroundStaffById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/ground-staff/{id}")
    public ResponseEntity<GroundStaff> updateGroundStaff(@PathVariable Long id,
            @Valid @RequestBody GroundStaffRegistrationDTO dto) {
        try {
            GroundStaff staff = careerRegistrationService.updateGroundStaff(id, dto);
            return ResponseEntity.ok(staff);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/ground-staff/{id}")
    public ResponseEntity<Void> deleteGroundStaff(@PathVariable Long id) {
        careerRegistrationService.deleteGroundStaff(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/ground-staff/{id}/onboard-status")
    public ResponseEntity<GroundStaff> updateStaffOnboardStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            GroundStaff.OnboardStatus onboardStatus = GroundStaff.OnboardStatus.valueOf(status.toUpperCase());
            GroundStaff staff = careerRegistrationService.updateStaffOnboardStatus(id, onboardStatus);
            return ResponseEntity.ok(staff);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/ground-staff/{id}/job-status")
    public ResponseEntity<GroundStaff> updateStaffJobStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            GroundStaff.JobStatus jobStatus = GroundStaff.JobStatus.valueOf(status.toUpperCase());
            GroundStaff staff = careerRegistrationService.updateStaffJobStatus(id, jobStatus);
            return ResponseEntity.ok(staff);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
