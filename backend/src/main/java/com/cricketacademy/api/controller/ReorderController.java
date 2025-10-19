package com.cricketacademy.api.controller;

import com.cricketacademy.api.repository.FacilityItemRepository;
import com.cricketacademy.api.repository.StarPlayerRepository;
import com.cricketacademy.api.entity.FacilityItem;
import com.cricketacademy.api.entity.StarPlayer;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/homepage/reorder")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ReorderController {

    private final StarPlayerRepository starRepo;
    private final FacilityItemRepository facRepo;

    @Data
    public static class ReorderItem {
        public Long id;
        public Integer sortOrder;
    }

    @PostMapping("/players")
    @Transactional
    public ResponseEntity<Void> reorderPlayers(@RequestBody List<ReorderItem> order) {
        for (ReorderItem item : order) {
            StarPlayer p = starRepo.findById(item.id).orElse(null);
            if (p != null) {
                p.setSortOrder(item.sortOrder);
            }
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/facilities")
    @Transactional
    public ResponseEntity<Void> reorderFacilities(@RequestBody List<ReorderItem> order) {
        for (ReorderItem item : order) {
            FacilityItem f = facRepo.findById(item.id).orElse(null);
            if (f != null) {
                f.setSortOrder(item.sortOrder);
            }
        }
        return ResponseEntity.noContent().build();
    }
}