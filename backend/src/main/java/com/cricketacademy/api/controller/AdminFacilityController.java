package com.cricketacademy.api.controller;

import com.cricketacademy.api.dto.FacilityItemDTO;
import com.cricketacademy.api.service.HomepageContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/facilities")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class AdminFacilityController {

    private final HomepageContentService service;

    @GetMapping
    public ResponseEntity<List<FacilityItemDTO>> getAllFacilities() {
        return ResponseEntity.ok(service.listFacilities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FacilityItemDTO> getFacilityById(@PathVariable Long id) {
        // Implementation would need to be added to service
        return ResponseEntity.ok().build();
    }

    @PostMapping("/create")
    public ResponseEntity<FacilityItemDTO> createFacility(@RequestBody FacilityItemDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createFacility(dto));
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<FacilityItemDTO> updateFacility(@PathVariable Long id, @RequestBody FacilityItemDTO dto) {
        return ResponseEntity.ok(service.updateFacility(id, dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteFacility(@PathVariable Long id) {
        service.deleteFacility(id);
        return ResponseEntity.noContent().build();
    }
}