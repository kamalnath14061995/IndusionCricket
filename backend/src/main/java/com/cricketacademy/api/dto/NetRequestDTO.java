package com.cricketacademy.api.dto;

import com.cricketacademy.api.entity.Net;
import lombok.Data;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class NetRequestDTO {
    @NotNull(message = "Ground ID is required")
    private Long groundId;

    @NotBlank(message = "Net name is required")
    @Size(max = 100, message = "Net name must be less than 100 characters")
    private String name;

    @Size(max = 20, message = "Net number must be less than 20 characters")
    private String netNumber;

    @Size(max = 1000, message = "Description must be less than 1000 characters")
    private String description;

    private String imageUrl;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    @Max(value = 50, message = "Capacity must be less than 50")
    private Integer capacity;

    @NotNull(message = "Location type is required")
    private Net.LocationType locationType;

    @NotNull(message = "Surface type is required")
    private Net.SurfaceType surfaceType;

    @DecimalMin(value = "10.0", message = "Net length must be at least 10 meters")
    @DecimalMax(value = "50.0", message = "Net length must be less than 50 meters")
    private BigDecimal netLength;

    @DecimalMin(value = "5.0", message = "Net width must be at least 5 meters")
    @DecimalMax(value = "25.0", message = "Net width must be less than 25 meters")
    private BigDecimal netWidth;

    @DecimalMin(value = "5.0", message = "Net height must be at least 5 meters")
    @DecimalMax(value = "20.0", message = "Net height must be less than 20 meters")
    private BigDecimal netHeight;

    @NotNull(message = "Player capacity per net is required")
    @Min(value = 1, message = "Player capacity must be at least 1")
    @Max(value = 20, message = "Player capacity must be less than 20")
    private Integer playerCapacityPerNet;

    private Boolean hasBowlingMachine = false;

    @Size(max = 50, message = "Bowling machine speed range must be less than 50 characters")
    private String bowlingMachineSpeedRange;

    private Boolean hasFloodlights = false;

    @Min(value = 100, message = "Floodlight lux rating must be at least 100")
    @Max(value = 2000, message = "Floodlight lux rating must be less than 2000")
    private Integer floodlightLuxRating;

    private Boolean hasProtectiveNetting = true;

    private List<String> safetyGearAvailable;

    private List<String> equipmentRental;

    private Boolean hasWashrooms = false;

    private Boolean hasChangingRooms = false;

    private Boolean hasDrinkingWater = true;

    private Boolean hasSeatingArea = true;

    private Boolean hasParking = true;

    private Boolean hasFirstAid = true;

    private Boolean coachingAvailable = false;

    @DecimalMin(value = "0.0", message = "Coaching price must be non-negative")
    private BigDecimal coachingPricePerHour;

    private Boolean hasCctv = false;

    private Boolean cctvRecordingAvailable = false;

    @NotNull(message = "Slot duration is required")
    @Min(value = 30, message = "Slot duration must be at least 30 minutes")
    @Max(value = 480, message = "Slot duration must be less than 480 minutes")
    private Integer slotDurationMinutes = 60;

    private Boolean individualBookingAllowed = true;

    private Boolean groupBookingAllowed = true;

    @Min(value = 1, message = "Max group size must be at least 1")
    @Max(value = 50, message = "Max group size must be less than 50")
    private Integer maxGroupSize;

    @NotNull(message = "Pricing per net is required")
    @DecimalMin(value = "0.0", message = "Pricing must be non-negative")
    private BigDecimal pricingPerNet;

    @DecimalMin(value = "0.0", message = "Pricing per player must be non-negative")
    private BigDecimal pricingPerPlayer;

    @DecimalMin(value = "0.0", message = "Membership discount must be non-negative")
    @DecimalMax(value = "100.0", message = "Membership discount must be less than 100%")
    private BigDecimal membershipDiscountPercentage;

    private Map<String, BigDecimal> bulkBookingDiscount;

    @Size(max = 1000, message = "Cancellation policy must be less than 1000 characters")
    private String cancellationPolicy;

    private List<String> onlinePaymentMethods;

    private Map<String, BigDecimal> addOnServices;

    private List<String> compatibleBallTypes;

    @Size(max = 500, message = "Safety padding details must be less than 500 characters")
    private String safetyPaddingDetails;

    @Size(max = 100, message = "Ventilation system must be less than 100 characters")
    private String ventilationSystem;

    private Boolean bookingCalendarEnabled = true;

    private Boolean realTimeAvailability = true;

    @NotNull(message = "Base price per hour is required")
    @DecimalMin(value = "0.0", message = "Price must be non-negative")
    private BigDecimal pricePerHour;

    private Boolean isAvailable = true;

    private List<String> features;
}
