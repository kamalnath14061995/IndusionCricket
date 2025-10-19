package com.cricketacademy.api.dto;

import com.cricketacademy.api.entity.Net;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class NetDTO {
    private Long id;
    private String name;
    private String netNumber;
    private String description;
    private String imageUrl;
    private Integer capacity;
    private Net.LocationType locationType;
    private Net.SurfaceType surfaceType;
    private BigDecimal netLength;
    private BigDecimal netWidth;
    private BigDecimal netHeight;
    private Integer playerCapacityPerNet;
    private Boolean hasBowlingMachine;
    private String bowlingMachineSpeedRange;
    private Boolean hasFloodlights;
    private Integer floodlightLuxRating;
    private Boolean hasProtectiveNetting;
    private List<String> safetyGearAvailable;
    private List<String> equipmentRental;
    private Boolean hasWashrooms;
    private Boolean hasChangingRooms;
    private Boolean hasDrinkingWater;
    private Boolean hasSeatingArea;
    private Boolean hasParking;
    private Boolean hasFirstAid;
    private Boolean coachingAvailable;
    private BigDecimal coachingPricePerHour;
    private Boolean hasCctv;
    private Boolean cctvRecordingAvailable;
    private Integer slotDurationMinutes;
    private Boolean individualBookingAllowed;
    private Boolean groupBookingAllowed;
    private Integer maxGroupSize;
    private BigDecimal pricingPerNet;
    private BigDecimal pricingPerPlayer;
    private BigDecimal membershipDiscountPercentage;
    private Map<String, BigDecimal> bulkBookingDiscount;
    private String cancellationPolicy;
    private List<String> onlinePaymentMethods;
    private Map<String, BigDecimal> addOnServices;
    private List<String> compatibleBallTypes;
    private String safetyPaddingDetails;
    private String ventilationSystem;
    private Boolean bookingCalendarEnabled;
    private Boolean realTimeAvailability;
    private BigDecimal pricePerHour;
    private Boolean isAvailable;
    private List<String> features;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long groundId;
    private String groundName;
}
