package com.cricketacademy.api.controller;

import com.cricketacademy.api.dto.NetDTO;
import com.cricketacademy.api.dto.NetRequestDTO;
import com.cricketacademy.api.service.NetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NetController {

    private final NetService netService;

    @GetMapping
    public ResponseEntity<List<NetDTO>> getAllAvailableNets() {
        return ResponseEntity.ok(netService.getAllAvailableNets());
    }

    @GetMapping("/all")
    public ResponseEntity<List<NetDTO>> getAllNets() {
        return ResponseEntity.ok(netService.getAllNets());
    }

    @GetMapping("/available")
    public ResponseEntity<List<NetDTO>> getAllAvailableNetsExplicit() {
        return ResponseEntity.ok(netService.getAllAvailableNets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NetDTO> getNetById(@PathVariable Long id) {
        return ResponseEntity.ok(netService.getNetById(id));
    }

    @GetMapping("/ground/{groundId}")
    public ResponseEntity<List<NetDTO>> getNetsByGroundId(@PathVariable Long groundId) {
        return ResponseEntity.ok(netService.getNetsByGroundId(groundId));
    }

    @GetMapping("/ground/{groundId}/available")
    public ResponseEntity<List<NetDTO>> getAvailableNetsByGroundId(@PathVariable Long groundId) {
        return ResponseEntity.ok(netService.getAvailableNetsByGroundId(groundId));
    }

    @PostMapping
    public ResponseEntity<NetDTO> createNet(@Valid @RequestBody NetRequestDTO netRequestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(netService.createNet(netRequestDTO));
    }

    @PostMapping("/ground/{groundId}")
    public ResponseEntity<NetDTO> createNetWithGround(
            @Valid @RequestBody NetRequestDTO netRequestDTO,
            @PathVariable Long groundId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(netService.createNet(netRequestDTO, groundId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NetDTO> updateNet(
            @PathVariable Long id,
            @Valid @RequestBody NetRequestDTO netRequestDTO) {
        return ResponseEntity.ok(netService.updateNet(id, netRequestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNet(@PathVariable Long id) {
        netService.deleteNet(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Void> toggleNetStatus(@PathVariable Long id) {
        netService.toggleNetStatus(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<List<NetDTO>> getAvailableNetsByDate(@PathVariable Long id) {
        return ResponseEntity.ok(netService.getAvailableNetsByDate(id));
    }

    @GetMapping("/{id}/bookings")
    public ResponseEntity<List<NetDTO>> getNetsByDate(@PathVariable Long id) {
        return ResponseEntity.ok(netService.getNetsByDate(id));
    }

    @GetMapping("/{id}/bookings/{date}/available")
    public ResponseEntity<List<NetDTO>> getAvailableNetsByDate(
            @PathVariable Long id,
            @PathVariable String date) {
        return ResponseEntity.ok(netService.getAvailableNetsByDate(id));
    }

    @GetMapping("/{id}/bookings/{date}/available/{time}")
    public ResponseEntity<List<NetDTO>> getAvailableNetsByDateAndTime(
            @PathVariable Long id,
            @PathVariable String date,
            @PathVariable String time) {
        return ResponseEntity.ok(netService.getAvailableNetsByDateAndTime(id, date, time));
    }
}
