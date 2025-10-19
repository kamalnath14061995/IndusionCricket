package com.cricketacademy.api.service;

import com.cricketacademy.api.entity.Ground;
import com.cricketacademy.api.repository.GroundRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class GroundService {
    private final GroundRepository groundRepository;

    public List<Ground> getAllActiveGrounds() {
        return groundRepository.findByIsActiveTrue();
    }

    public List<Ground> getAllGrounds() {
        try {
            log.debug("Fetching all grounds from repository");
            List<Ground> grounds = groundRepository.findAll();
            log.debug("Successfully fetched {} grounds", grounds.size());
            
            // Log first ground details for debugging
            if (!grounds.isEmpty()) {
                Ground firstGround = grounds.get(0);
                log.debug("First ground details - Name: {}, Type: {}, Floodlights: {}, Pavilion: {}", 
                    firstGround.getName(), firstGround.getGroundType(), 
                    firstGround.getHasFloodlights(), firstGround.getHasPavilion());
            }
            
            return grounds;
        } catch (Exception e) {
            log.error("Error fetching all grounds: {}", e.getMessage(), e);
            throw e;
        }
    }

    public Optional<Ground> getGroundById(Long id) {
        return groundRepository.findById(id);
    }

    public Ground createGround(Ground ground) {
        // Validate unique name
        if (groundRepository.findAll().stream()
                .anyMatch(g -> g.getName().equalsIgnoreCase(ground.getName()))) {
            throw new IllegalArgumentException("Ground with name '" + ground.getName() + "' already exists");
        }
        return groundRepository.save(ground);
    }

    public Ground updateGround(Long id, Ground groundDetails) {
        Ground ground = groundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ground not found with id: " + id));

        // Check for duplicate name (excluding current ground)
        if (groundRepository.findAll().stream()
                .anyMatch(g -> g.getName().equalsIgnoreCase(groundDetails.getName())
                        && !g.getId().equals(id))) {
            throw new IllegalArgumentException("Ground with name '" + groundDetails.getName() + "' already exists");
        }

        // Basic fields
        ground.setName(groundDetails.getName());
        ground.setDescription(groundDetails.getDescription());
        ground.setLocation(groundDetails.getLocation());
        ground.setCapacity(groundDetails.getCapacity());
        ground.setPricePerHour(groundDetails.getPricePerHour());
        ground.setIsActive(groundDetails.getIsActive());
        ground.setImageUrl(groundDetails.getImageUrl());
        
        // Basic Ground Specs
        ground.setGroundType(groundDetails.getGroundType());
        ground.setGroundSize(groundDetails.getGroundSize());
        ground.setBoundaryDimensions(groundDetails.getBoundaryDimensions());
        ground.setPitchType(groundDetails.getPitchType());
        ground.setNumberOfPitches(groundDetails.getNumberOfPitches());
        
        // Cricket Specs
        ground.setTurfType(groundDetails.getTurfType());
        ground.setPitchQuality(groundDetails.getPitchQuality());
        ground.setGrassType(groundDetails.getGrassType());
        ground.setDrainageSystem(groundDetails.getDrainageSystem());
        ground.setLightingQuality(groundDetails.getLightingQuality());
        ground.setSeatingTypes(groundDetails.getSeatingTypes());
        ground.setMediaFacilities(groundDetails.getMediaFacilities());
        ground.setPracticeFacilities(groundDetails.getPracticeFacilities());
        ground.setSafetyFeatures(groundDetails.getSafetyFeatures());
        
        // Facilities - handle null values properly
        if (groundDetails.getHasFloodlights() != null) ground.setHasFloodlights(groundDetails.getHasFloodlights());
        if (groundDetails.getHasPavilion() != null) ground.setHasPavilion(groundDetails.getHasPavilion());
        if (groundDetails.getHasDressingRooms() != null) ground.setHasDressingRooms(groundDetails.getHasDressingRooms());
        if (groundDetails.getHasWashrooms() != null) ground.setHasWashrooms(groundDetails.getHasWashrooms());
        if (groundDetails.getHasShowers() != null) ground.setHasShowers(groundDetails.getHasShowers());
        if (groundDetails.getHasDrinkingWater() != null) ground.setHasDrinkingWater(groundDetails.getHasDrinkingWater());
        if (groundDetails.getHasFirstAid() != null) ground.setHasFirstAid(groundDetails.getHasFirstAid());
        if (groundDetails.getHasParkingTwoWheeler() != null) ground.setHasParkingTwoWheeler(groundDetails.getHasParkingTwoWheeler());
        if (groundDetails.getHasParkingFourWheeler() != null) ground.setHasParkingFourWheeler(groundDetails.getHasParkingFourWheeler());
        if (groundDetails.getHasRefreshments() != null) ground.setHasRefreshments(groundDetails.getHasRefreshments());
        if (groundDetails.getSeatingCapacity() != null) ground.setSeatingCapacity(groundDetails.getSeatingCapacity());
        if (groundDetails.getHasPracticeNets() != null) ground.setHasPracticeNets(groundDetails.getHasPracticeNets());
        if (groundDetails.getScoreboardType() != null) ground.setScoreboardType(groundDetails.getScoreboardType());
        if (groundDetails.getHasLiveStreaming() != null) ground.setHasLiveStreaming(groundDetails.getHasLiveStreaming());
        
        // Specs - handle null values properly
        if (groundDetails.getGroundDimensions() != null) ground.setGroundDimensions(groundDetails.getGroundDimensions());
        if (groundDetails.getPitchLength() != null) ground.setPitchLength(groundDetails.getPitchLength());
        if (groundDetails.getOversPerSlot() != null) ground.setOversPerSlot(groundDetails.getOversPerSlot());
        if (groundDetails.getBallType() != null) ground.setBallType(groundDetails.getBallType());
        if (groundDetails.getHasSafetyNets() != null) ground.setHasSafetyNets(groundDetails.getHasSafetyNets());
        if (groundDetails.getHasRainCovers() != null) ground.setHasRainCovers(groundDetails.getHasRainCovers());
        if (groundDetails.getHasGroundStaffAvailable() != null) ground.setHasGroundStaffAvailable(groundDetails.getHasGroundStaffAvailable());
        if (groundDetails.getDrainageSystem() != null) ground.setDrainageSystem(groundDetails.getDrainageSystem());
        
        // Keep for backward compatibility
        ground.setFacilities(groundDetails.getFacilities());

        return groundRepository.save(ground);
    }

    public void deleteGround(Long id) {
        if (!groundRepository.existsById(id)) {
            throw new RuntimeException("Ground not found with id: " + id);
        }
        groundRepository.deleteById(id);
    }

    public void toggleGroundStatus(Long id) {
        Ground ground = groundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ground not found with id: " + id));
        ground.setIsActive(!ground.getIsActive());
        groundRepository.save(ground);
    }
}
