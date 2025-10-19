package com.cricketacademy.api.controller;

import com.cricketacademy.api.entity.Ground;
import com.cricketacademy.api.service.GroundService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/grounds")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class GroundController {
    private final GroundService groundService;

    @GetMapping
    public ResponseEntity<List<Ground>> getAllGrounds() {
        return ResponseEntity.ok(groundService.getAllActiveGrounds());
    }

    @GetMapping("/all")
    public ResponseEntity<List<Ground>> getAllGroundsAdmin() {
        return ResponseEntity.ok(groundService.getAllGrounds());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ground> getGroundById(@PathVariable Long id) {
        return groundService.getGroundById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<Ground> createGround(@RequestBody Ground ground) {
        return ResponseEntity.status(HttpStatus.CREATED).body(groundService.createGround(ground));
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<Ground> updateGround(@PathVariable Long id, @RequestBody Ground groundDetails) {
        return ResponseEntity.ok(groundService.updateGround(id, groundDetails));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteGround(@PathVariable Long id) {
        groundService.deleteGround(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Void> toggleGroundStatus(@PathVariable Long id) {
        groundService.toggleGroundStatus(id);
        return ResponseEntity.noContent().build();
    }
}
