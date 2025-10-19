package com.cricketacademy.api.controller;

import com.cricketacademy.api.dto.StarPlayerDTO;
import com.cricketacademy.api.service.HomepageContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/starplayers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class AdminStarPlayerController {

    private final HomepageContentService service;

    @GetMapping
    public ResponseEntity<List<StarPlayerDTO>> getAllStarPlayers() {
        return ResponseEntity.ok(service.listPlayers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StarPlayerDTO> getStarPlayerById(@PathVariable Long id) {
        try {
            StarPlayerDTO player = service.getPlayerById(id);
            return ResponseEntity.ok(player);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<StarPlayerDTO> createStarPlayer(@RequestBody StarPlayerDTO dto) {
        try {
            StarPlayerDTO created = service.createPlayer(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create star player: " + e.getMessage(), e);
        }
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<StarPlayerDTO> updateStarPlayer(@PathVariable Long id, @RequestBody StarPlayerDTO dto) {
        try {
            StarPlayerDTO updated = service.updatePlayer(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update star player: " + e.getMessage(), e);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteStarPlayer(@PathVariable Long id) {
        service.deletePlayer(id);
        return ResponseEntity.noContent().build();
    }
}