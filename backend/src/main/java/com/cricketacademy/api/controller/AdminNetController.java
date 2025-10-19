package com.cricketacademy.api.controller;

import com.cricketacademy.api.dto.NetDTO;
import com.cricketacademy.api.dto.NetRequestDTO;
import com.cricketacademy.api.entity.Net;
import com.cricketacademy.api.service.NetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/nets")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class AdminNetController {

    private final NetService netService;

    @GetMapping
    public ResponseEntity<List<NetDTO>> getAllNets() {
        return ResponseEntity.ok(netService.getAllNets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NetDTO> getNetById(@PathVariable Long id) {
        return ResponseEntity.ok(netService.getNetById(id));
    }

    @PostMapping("/create")
    public ResponseEntity<NetDTO> createNet(@Valid @RequestBody NetRequestDTO netRequestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(netService.createNet(netRequestDTO));
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<NetDTO> updateNet(
            @PathVariable Long id,
            @Valid @RequestBody NetRequestDTO netRequestDTO) {
        return ResponseEntity.ok(netService.updateNet(id, netRequestDTO));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteNet(@PathVariable Long id) {
        netService.deleteNet(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<Void> toggleNetStatus(@PathVariable Long id) {
        netService.toggleNetStatus(id);
        return ResponseEntity.noContent().build();
    }
}
