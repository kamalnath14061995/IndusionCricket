package com.cricketacademy.api.controller;

import com.cricketacademy.api.dto.FacilityItemDTO;
import com.cricketacademy.api.dto.StarPlayerDTO;
import com.cricketacademy.api.service.HomepageContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/homepage")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class AdminHomepageController {

    private final HomepageContentService service;

    // Players management
    @GetMapping("/players")
    public ResponseEntity<List<StarPlayerDTO>> getPlayers() {
        List<StarPlayerDTO> players = service.listPlayers();
        return ResponseEntity.ok(players);
    }

    @PostMapping("/players/create")
    public ResponseEntity<StarPlayerDTO> createPlayer(@RequestBody StarPlayerDTO player) {
        StarPlayerDTO created = service.createPlayer(player);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/players/edit/{id}")
    public ResponseEntity<StarPlayerDTO> updatePlayer(@PathVariable Long id, @RequestBody StarPlayerDTO player) {
        StarPlayerDTO updated = service.updatePlayer(id, player);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/players/delete/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
        service.deletePlayer(id);
        return ResponseEntity.ok().build();
    }

    // Facilities management
    @GetMapping("/facilities")
    public ResponseEntity<List<FacilityItemDTO>> getFacilities() {
        List<FacilityItemDTO> facilities = service.listFacilities();
        return ResponseEntity.ok(facilities);
    }

    @PostMapping("/facilities")
    public ResponseEntity<FacilityItemDTO> createFacility(@RequestBody FacilityItemDTO facility) {
        FacilityItemDTO created = service.createFacility(facility);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/facilities/{id}")
    public ResponseEntity<FacilityItemDTO> updateFacility(@PathVariable Long id, @RequestBody FacilityItemDTO facility) {
        FacilityItemDTO updated = service.updateFacility(id, facility);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/facilities/{id}")
    public ResponseEntity<Void> deleteFacility(@PathVariable Long id) {
        service.deleteFacility(id);
        return ResponseEntity.ok().build();
    }

    // Hero Image management
    @GetMapping("/hero-image")
    public ResponseEntity<String> getHeroImageUrl() {
        String imageUrl = service.getHeroImageUrl();
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            return ResponseEntity.ok("");
        }
        return ResponseEntity.ok(imageUrl);
    }

    @PutMapping("/hero-image")
    public ResponseEntity<String> setHeroImageUrl(@RequestBody Map<String, String> request) {
        try {
            String imageUrl = request.get("url");
            if (imageUrl == null || imageUrl.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("URL is required");
            }
            service.setHeroImageUrl(imageUrl.trim());
            return ResponseEntity.ok("Hero image URL updated successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Failed to update hero image URL: " + e.getMessage());
        }
    }

    @DeleteMapping("/hero-image")
    public ResponseEntity<String> deleteHeroImage() {
        try {
            service.deleteHeroImage();
            return ResponseEntity.ok("Hero image deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Failed to delete hero image: " + e.getMessage());
        }
    }

    // One-time seed endpoint to populate DB with default homepage content
    @PostMapping("/seed-once")
    public ResponseEntity<String> seedOnce() {
        service.seedDefaultsIfEmpty();
        return ResponseEntity.ok("Seed completed if empty");
    }
}
