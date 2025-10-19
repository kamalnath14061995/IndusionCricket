package com.cricketacademy.api.controller;

import com.cricketacademy.api.entity.Ground;
import com.cricketacademy.api.service.GroundService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grounds")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PublicGroundController {
    private final GroundService groundService;

    @GetMapping
    public ResponseEntity<List<Ground>> getAllActiveGrounds() {
        return ResponseEntity.ok(groundService.getAllActiveGrounds());
    }

    @GetMapping("/all")
    public ResponseEntity<List<Ground>> getAllGrounds() {
        return ResponseEntity.ok(groundService.getAllGrounds());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ground> getGroundById(@PathVariable Long id) {
        return groundService.getGroundById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Ground> createGround(@RequestBody Ground ground) {
        return ResponseEntity.ok(groundService.createGround(ground));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ground> updateGround(@PathVariable Long id, @RequestBody Ground groundDetails) {
        return ResponseEntity.ok(groundService.updateGround(id, groundDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGround(@PathVariable Long id) {
        groundService.deleteGround(id);
        return ResponseEntity.noContent().build();
    }
}