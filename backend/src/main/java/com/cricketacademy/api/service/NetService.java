package com.cricketacademy.api.service;

import com.cricketacademy.api.dto.NetDTO;
import com.cricketacademy.api.dto.NetRequestDTO;
import com.cricketacademy.api.entity.Ground;
import com.cricketacademy.api.entity.Net;
import com.cricketacademy.api.repository.GroundRepository;
import com.cricketacademy.api.repository.NetRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NetService {
    private final NetRepository netRepository;
    private final GroundRepository groundRepository;
    private final ObjectMapper objectMapper;
    private static final Logger log = LoggerFactory.getLogger(NetService.class);

    public List<NetDTO> getAllAvailableNets() {
        return netRepository.findByIsAvailableTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<NetDTO> getNetsByGroundId(Long groundId) {
        return netRepository.findByGroundIdAndIsAvailableTrue(groundId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<NetDTO> getAllNets() {
        return netRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public NetDTO getNetById(Long id) {
        return netRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Net not found with id: " + id));
    }

    public NetDTO createNet(NetRequestDTO netRequestDTO) {
        Ground ground = groundRepository.findById(netRequestDTO.getGroundId())
                .orElseThrow(() -> new RuntimeException("Ground not found with id: " + netRequestDTO.getGroundId()));

        // Validate unique name within ground
        if (netRepository.findAll().stream()
                .anyMatch(n -> n.getName().equalsIgnoreCase(netRequestDTO.getName())
                        && n.getGround().getId().equals(netRequestDTO.getGroundId()))) {
            throw new IllegalArgumentException(
                    "Net with name '" + netRequestDTO.getName() + "' already exists for this ground");
        }

        Net net = convertToEntity(netRequestDTO);
        net.setGround(ground);
        return convertToDTO(netRepository.save(net));
    }

    public NetDTO createNet(NetRequestDTO netRequestDTO, Long groundId) {
        Ground ground = groundRepository.findById(groundId)
                .orElseThrow(() -> new RuntimeException("Ground not found with id: " + groundId));

        // Validate unique name within ground
        if (netRepository.findAll().stream()
                .anyMatch(n -> n.getName().equalsIgnoreCase(netRequestDTO.getName())
                        && n.getGround().getId().equals(groundId))) {
            throw new IllegalArgumentException(
                    "Net with name '" + netRequestDTO.getName() + "' already exists for this ground");
        }

        Net net = convertToEntity(netRequestDTO);
        net.setGround(ground);
        return convertToDTO(netRepository.save(net));
    }

    public NetDTO updateNet(Long id, NetRequestDTO netRequestDTO) {
        Net net = netRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Net not found with id: " + id));

        // Validate ground exists if groundId is provided
        Ground ground = null;
        if (netRequestDTO.getGroundId() != null) {
            ground = groundRepository.findById(netRequestDTO.getGroundId())
                    .orElseThrow(
                            () -> new RuntimeException("Ground not found with id: " + netRequestDTO.getGroundId()));
        }

        // Check for duplicate name within ground (excluding current net)
        Long groundIdToCheck = ground != null ? ground.getId() : net.getGround().getId();
        if (netRepository.findAll().stream()
                .anyMatch(n -> n.getName().equalsIgnoreCase(netRequestDTO.getName())
                        && n.getGround().getId().equals(groundIdToCheck)
                        && !n.getId().equals(id))) {
            throw new IllegalArgumentException(
                    "Net with name '" + netRequestDTO.getName() + "' already exists for this ground");
        }

        updateEntityFromDTO(net, netRequestDTO, ground);
        return convertToDTO(netRepository.save(net));
    }

    public void deleteNet(Long id) {
        if (!netRepository.existsById(id)) {
            throw new RuntimeException("Net not found with id: " + id);
        }
        netRepository.deleteById(id);
    }

    public void toggleNetStatus(Long id) {
        Net net = netRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Net not found with id: " + id));
        net.setIsAvailable(!net.getIsAvailable());
        netRepository.save(net);
    }

    public List<NetDTO> getAvailableNetsByGroundId(Long groundId) {
        return netRepository.findByGroundIdAndIsAvailableTrue(groundId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<NetDTO> getAvailableNetsByDate(Long id) {
        return netRepository.findByIsAvailableTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<NetDTO> getNetsByDate(Long id) {
        return netRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<NetDTO> getAvailableNetsByDateAndTime(Long id, String date, String time) {
        return netRepository.findByIsAvailableTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private NetDTO convertToDTO(Net net) {
        NetDTO dto = new NetDTO();
        dto.setId(net.getId());
        dto.setName(net.getName());
        dto.setNetNumber(net.getNetNumber());
        dto.setDescription(net.getDescription());
        dto.setImageUrl(net.getImageUrl());
        dto.setCapacity(net.getCapacity());
        dto.setLocationType(net.getLocationType());
        dto.setSurfaceType(net.getSurfaceType());
        dto.setNetLength(net.getNetLength());
        dto.setNetWidth(net.getNetWidth());
        dto.setNetHeight(net.getNetHeight());
        dto.setPlayerCapacityPerNet(net.getPlayerCapacityPerNet());
        dto.setHasBowlingMachine(net.getHasBowlingMachine());
        dto.setBowlingMachineSpeedRange(net.getBowlingMachineSpeedRange());
        dto.setHasFloodlights(net.getHasFloodlights());
        dto.setFloodlightLuxRating(net.getFloodlightLuxRating());
        dto.setHasProtectiveNetting(net.getHasProtectiveNetting());
        dto.setHasWashrooms(net.getHasWashrooms());
        dto.setHasChangingRooms(net.getHasChangingRooms());
        dto.setHasDrinkingWater(net.getHasDrinkingWater());
        dto.setHasSeatingArea(net.getHasSeatingArea());
        dto.setHasParking(net.getHasParking());
        dto.setHasFirstAid(net.getHasFirstAid());
        dto.setCoachingAvailable(net.getCoachingAvailable());
        dto.setCoachingPricePerHour(net.getCoachingPricePerHour());
        dto.setHasCctv(net.getHasCctv());
        dto.setCctvRecordingAvailable(net.getCctvRecordingAvailable());
        dto.setSlotDurationMinutes(net.getSlotDurationMinutes());
        dto.setIndividualBookingAllowed(net.getIndividualBookingAllowed());
        dto.setGroupBookingAllowed(net.getGroupBookingAllowed());
        dto.setMaxGroupSize(net.getMaxGroupSize());
        dto.setPricingPerNet(net.getPricingPerNet());
        dto.setPricingPerPlayer(net.getPricingPerPlayer());
        dto.setMembershipDiscountPercentage(net.getMembershipDiscountPercentage());
        dto.setPricePerHour(net.getPricePerHour());
        dto.setIsAvailable(net.getIsAvailable());
        dto.setCreatedAt(net.getCreatedAt());
        dto.setUpdatedAt(net.getUpdatedAt());
        dto.setGroundId(net.getGround().getId());
        dto.setGroundName(net.getGround().getName());

        try {
            if (net.getSafetyGearAvailable() != null) {
                dto.setSafetyGearAvailable(objectMapper.readValue(net.getSafetyGearAvailable(), List.class));
            }
            if (net.getEquipmentRental() != null) {
                dto.setEquipmentRental(objectMapper.readValue(net.getEquipmentRental(), List.class));
            }
            if (net.getFeatures() != null) {
                dto.setFeatures(objectMapper.readValue(net.getFeatures(), List.class));
            }
            if (net.getBulkBookingDiscount() != null) {
                dto.setBulkBookingDiscount(objectMapper.readValue(net.getBulkBookingDiscount(), Map.class));
            }
            if (net.getOnlinePaymentMethods() != null) {
                dto.setOnlinePaymentMethods(objectMapper.readValue(net.getOnlinePaymentMethods(), List.class));
            }
            if (net.getAddOnServices() != null) {
                dto.setAddOnServices(objectMapper.readValue(net.getAddOnServices(), Map.class));
            }
            if (net.getCompatibleBallTypes() != null) {
                dto.setCompatibleBallTypes(objectMapper.readValue(net.getCompatibleBallTypes(), List.class));
            }
        } catch (JsonProcessingException e) {
            log.error("Failed to process JSON for net ID: {}", net.getId(), e);
            throw new RuntimeException("Error processing JSON data for net ID: " + net.getId(), e);
        }

        return dto;
    }

    private Net convertToEntity(NetRequestDTO dto) {
        Net net = new Net();
        net.setName(dto.getName());
        net.setNetNumber(dto.getNetNumber());
        net.setDescription(dto.getDescription());
        net.setImageUrl(dto.getImageUrl());
        net.setCapacity(dto.getCapacity());
        net.setLocationType(dto.getLocationType());
        net.setSurfaceType(dto.getSurfaceType());
        net.setNetLength(dto.getNetLength());
        net.setNetWidth(dto.getNetWidth());
        net.setNetHeight(dto.getNetHeight());
        net.setPlayerCapacityPerNet(dto.getPlayerCapacityPerNet());
        net.setHasBowlingMachine(dto.getHasBowlingMachine());
        net.setBowlingMachineSpeedRange(dto.getBowlingMachineSpeedRange());
        net.setHasFloodlights(dto.getHasFloodlights());
        net.setFloodlightLuxRating(dto.getFloodlightLuxRating());
        net.setHasProtectiveNetting(dto.getHasProtectiveNetting());
        net.setHasWashrooms(dto.getHasWashrooms());
        net.setHasChangingRooms(dto.getHasChangingRooms());
        net.setHasDrinkingWater(dto.getHasDrinkingWater());
        net.setHasSeatingArea(dto.getHasSeatingArea());
        net.setHasParking(dto.getHasParking());
        net.setHasFirstAid(dto.getHasFirstAid());
        net.setCoachingAvailable(dto.getCoachingAvailable());
        net.setCoachingPricePerHour(dto.getCoachingPricePerHour());
        net.setHasCctv(dto.getHasCctv());
        net.setCctvRecordingAvailable(dto.getCctvRecordingAvailable());
        net.setSlotDurationMinutes(dto.getSlotDurationMinutes());
        net.setIndividualBookingAllowed(dto.getIndividualBookingAllowed());
        net.setGroupBookingAllowed(dto.getGroupBookingAllowed());
        net.setMaxGroupSize(dto.getMaxGroupSize());
        net.setPricingPerNet(dto.getPricingPerNet());
        net.setPricingPerPlayer(dto.getPricingPerPlayer());
        net.setMembershipDiscountPercentage(dto.getMembershipDiscountPercentage());
        net.setPricePerHour(dto.getPricePerHour());
        net.setIsAvailable(dto.getIsAvailable());
        net.setCancellationPolicy(dto.getCancellationPolicy());
        net.setVentilationSystem(dto.getVentilationSystem());

        try {
            if (dto.getSafetyGearAvailable() != null) {
                net.setSafetyGearAvailable(objectMapper.writeValueAsString(dto.getSafetyGearAvailable()));
            }
            if (dto.getEquipmentRental() != null) {
                net.setEquipmentRental(objectMapper.writeValueAsString(dto.getEquipmentRental()));
            }
            if (dto.getFeatures() != null) {
                net.setFeatures(objectMapper.writeValueAsString(dto.getFeatures()));
            }
            if (dto.getBulkBookingDiscount() != null) {
                net.setBulkBookingDiscount(objectMapper.writeValueAsString(dto.getBulkBookingDiscount()));
            }
            if (dto.getOnlinePaymentMethods() != null) {
                net.setOnlinePaymentMethods(objectMapper.writeValueAsString(dto.getOnlinePaymentMethods()));
            }
            if (dto.getAddOnServices() != null) {
                net.setAddOnServices(objectMapper.writeValueAsString(dto.getAddOnServices()));
            }
            if (dto.getCompatibleBallTypes() != null) {
                net.setCompatibleBallTypes(objectMapper.writeValueAsString(dto.getCompatibleBallTypes()));
            }
        } catch (JsonProcessingException e) {
            log.error("Failed to process JSON for net ID: {}", net.getId(), e);
            throw new RuntimeException("Error processing JSON data for net ID: " + net.getId(), e);
        }

        return net;
    }

    private void updateEntityFromDTO(Net net, NetRequestDTO dto, Ground ground) {
        net.setName(dto.getName());
        net.setNetNumber(dto.getNetNumber());
        net.setDescription(dto.getDescription());
        net.setImageUrl(dto.getImageUrl());
        net.setCapacity(dto.getCapacity());
        net.setLocationType(dto.getLocationType());
        net.setSurfaceType(dto.getSurfaceType());
        net.setNetLength(dto.getNetLength());
        net.setNetWidth(dto.getNetWidth());
        net.setNetHeight(dto.getNetHeight());
        net.setPlayerCapacityPerNet(dto.getPlayerCapacityPerNet());
        net.setHasBowlingMachine(dto.getHasBowlingMachine());
        net.setBowlingMachineSpeedRange(dto.getBowlingMachineSpeedRange());
        net.setHasFloodlights(dto.getHasFloodlights());
        net.setFloodlightLuxRating(dto.getFloodlightLuxRating());
        net.setHasProtectiveNetting(dto.getHasProtectiveNetting());
        net.setHasWashrooms(dto.getHasWashrooms());
        net.setHasChangingRooms(dto.getHasChangingRooms());
        net.setHasDrinkingWater(dto.getHasDrinkingWater());
        net.setHasSeatingArea(dto.getHasSeatingArea());
        net.setHasParking(dto.getHasParking());
        net.setHasFirstAid(dto.getHasFirstAid());
        net.setCoachingAvailable(dto.getCoachingAvailable());
        net.setCoachingPricePerHour(dto.getCoachingPricePerHour());
        net.setHasCctv(dto.getHasCctv());
        net.setCctvRecordingAvailable(dto.getCctvRecordingAvailable());
        net.setSlotDurationMinutes(dto.getSlotDurationMinutes());
        net.setIndividualBookingAllowed(dto.getIndividualBookingAllowed());
        net.setGroupBookingAllowed(dto.getGroupBookingAllowed());
        net.setMaxGroupSize(dto.getMaxGroupSize());
        net.setPricingPerNet(dto.getPricingPerNet());
        net.setPricingPerPlayer(dto.getPricingPerPlayer());
        net.setMembershipDiscountPercentage(dto.getMembershipDiscountPercentage());
        net.setPricePerHour(dto.getPricePerHour());
        net.setIsAvailable(dto.getIsAvailable());
        net.setCancellationPolicy(dto.getCancellationPolicy());
        net.setVentilationSystem(dto.getVentilationSystem());

        // Update ground association if a new ground is provided
        if (ground != null) {
            net.setGround(ground);
        }

        try {
            if (dto.getSafetyGearAvailable() != null) {
                net.setSafetyGearAvailable(objectMapper.writeValueAsString(dto.getSafetyGearAvailable()));
            }
            if (dto.getEquipmentRental() != null) {
                net.setEquipmentRental(objectMapper.writeValueAsString(dto.getEquipmentRental()));
            }
            if (dto.getFeatures() != null) {
                net.setFeatures(objectMapper.writeValueAsString(dto.getFeatures()));
            }
            if (dto.getBulkBookingDiscount() != null) {
                net.setBulkBookingDiscount(objectMapper.writeValueAsString(dto.getBulkBookingDiscount()));
            }
            if (dto.getOnlinePaymentMethods() != null) {
                net.setOnlinePaymentMethods(objectMapper.writeValueAsString(dto.getOnlinePaymentMethods()));
            }
            if (dto.getAddOnServices() != null) {
                net.setAddOnServices(objectMapper.writeValueAsString(dto.getAddOnServices()));
            }
            if (dto.getCompatibleBallTypes() != null) {
                net.setCompatibleBallTypes(objectMapper.writeValueAsString(dto.getCompatibleBallTypes()));
            }
        } catch (JsonProcessingException e) {
            log.error("Failed to process JSON for net ID: {}", net.getId(), e);
            throw new RuntimeException("Error processing JSON data for net ID: " + net.getId(), e);
        }
    }
}
