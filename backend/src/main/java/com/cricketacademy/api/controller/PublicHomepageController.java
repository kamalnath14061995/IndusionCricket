package com.cricketacademy.api.controller;

import com.cricketacademy.api.dto.FacilityItemDTO;
import com.cricketacademy.api.dto.StarPlayerDTO;
import com.cricketacademy.api.service.HomepageContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/homepage")
@RequiredArgsConstructor
public class PublicHomepageController {

    private final HomepageContentService service;

    @GetMapping("/players")
    public ResponseEntity<List<StarPlayerDTO>> getPlayers() {
        return ResponseEntity.ok(service.listPlayers());
    }

    @GetMapping("/facilities")
    public ResponseEntity<List<FacilityItemDTO>> getFacilities() {
        return ResponseEntity.ok(service.listFacilities());
    }

    @GetMapping("/hero-image")
    public ResponseEntity<String> getHeroImageUrl() {
        String imageUrl = service.getHeroImageUrl();
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            return ResponseEntity.ok("");
        }
        return ResponseEntity.ok(imageUrl);
    }
}