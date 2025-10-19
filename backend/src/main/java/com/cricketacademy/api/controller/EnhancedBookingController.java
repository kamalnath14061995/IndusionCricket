package com.cricketacademy.api.controller;

import com.cricketacademy.api.dto.EnhancedBookingRequestDTO;
import com.cricketacademy.api.entity.Booking;
import com.cricketacademy.api.entity.PricingPackage;
import com.cricketacademy.api.entity.AddOnService;
import com.cricketacademy.api.entity.Team;
import com.cricketacademy.api.service.BookingService;
import com.cricketacademy.api.repository.BookingRepository;
import com.cricketacademy.api.repository.PricingPackageRepository;
import com.cricketacademy.api.repository.AddOnServiceRepository;
import com.cricketacademy.api.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EnhancedBookingController {
    private final BookingService bookingService;
    private final PricingPackageRepository pricingPackageRepository;
    private final AddOnServiceRepository addOnServiceRepository;
    private final TeamRepository teamRepository;

    @PostMapping("/enhanced")
    public ResponseEntity<Booking> createEnhancedBooking(@RequestBody EnhancedBookingRequestDTO request) {
        return ResponseEntity.ok(new Booking());
    }

    @GetMapping("/pricing-packages")
    public ResponseEntity<List<PricingPackage>> getPricingPackages(@RequestParam String type) {
        return ResponseEntity.ok(pricingPackageRepository.findByPackageTypeAndIsActiveTrue(type));
    }

    @GetMapping("/add-on-services")
    public ResponseEntity<List<AddOnService>> getAddOnServices() {
        return ResponseEntity.ok(addOnServiceRepository.findByIsAvailableTrue());
    }

    @GetMapping("/teams")
    public ResponseEntity<List<Team>> getTeams() {
        return ResponseEntity.ok(teamRepository.findAll());
    }
}
