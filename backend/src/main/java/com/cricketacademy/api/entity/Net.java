package com.cricketacademy.api.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "nets")
@Data
public class Net {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "net_number", length = 20)
    private String netNumber;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    private Integer capacity;

    @Column(name = "location_type", length = 10)
    @Enumerated(EnumType.STRING)
    private LocationType locationType;

    @Column(name = "surface_type", length = 10)
    @Enumerated(EnumType.STRING)
    private SurfaceType surfaceType;

    @Column(name = "net_length", precision = 5, scale = 2)
    private BigDecimal netLength;

    @Column(name = "net_width", precision = 5, scale = 2)
    private BigDecimal netWidth;

    @Column(name = "net_height", precision = 5, scale = 2)
    private BigDecimal netHeight;

    @Column(name = "player_capacity_per_net")
    private Integer playerCapacityPerNet;

    @Column(name = "has_bowling_machine")
    private Boolean hasBowlingMachine = false;

    @Column(name = "bowling_machine_speed_range", length = 50)
    private String bowlingMachineSpeedRange;

    @Column(name = "has_floodlights")
    private Boolean hasFloodlights = false;

    @Column(name = "floodlight_lux_rating")
    private Integer floodlightLuxRating;

    @Column(name = "has_protective_netting")
    private Boolean hasProtectiveNetting = true;

    @Column(name = "safety_gear_available", columnDefinition = "JSON")
    private String safetyGearAvailable;

    @Column(name = "equipment_rental", columnDefinition = "JSON")
    private String equipmentRental;

    @Column(name = "has_washrooms")
    private Boolean hasWashrooms = false;

    @Column(name = "has_changing_rooms")
    private Boolean hasChangingRooms = false;

    @Column(name = "has_drinking_water")
    private Boolean hasDrinkingWater = true;

    @Column(name = "has_seating_area")
    private Boolean hasSeatingArea = true;

    @Column(name = "has_parking")
    private Boolean hasParking = true;

    @Column(name = "has_first_aid")
    private Boolean hasFirstAid = true;

    @Column(name = "coaching_available")
    private Boolean coachingAvailable = false;

    @Column(name = "coaching_price_per_hour", precision = 10, scale = 2)
    private BigDecimal coachingPricePerHour;

    @Column(name = "has_cctv")
    private Boolean hasCctv = false;

    @Column(name = "cctv_recording_available")
    private Boolean cctvRecordingAvailable = false;

    @Column(name = "slot_duration_minutes")
    private Integer slotDurationMinutes = 60;

    @Column(name = "individual_booking_allowed")
    private Boolean individualBookingAllowed = true;

    @Column(name = "group_booking_allowed")
    private Boolean groupBookingAllowed = true;

    @Column(name = "max_group_size")
    private Integer maxGroupSize;

    @Column(name = "pricing_per_net", precision = 10, scale = 2)
    private BigDecimal pricingPerNet;

    @Column(name = "pricing_per_player", precision = 10, scale = 2)
    private BigDecimal pricingPerPlayer;

    @Column(name = "membership_discount_percentage", precision = 5, scale = 2)
    private BigDecimal membershipDiscountPercentage;

    @Column(name = "bulk_booking_discount", columnDefinition = "JSON")
    private String bulkBookingDiscount;

    @Column(name = "cancellation_policy", columnDefinition = "TEXT")
    private String cancellationPolicy;

    @Column(name = "online_payment_methods", columnDefinition = "JSON")
    private String onlinePaymentMethods;

    @Column(name = "add_on_services", columnDefinition = "JSON")
    private String addOnServices;

    @Column(name = "compatible_ball_types", columnDefinition = "JSON")
    private String compatibleBallTypes;

    @Column(name = "safety_padding_details", columnDefinition = "TEXT")
    private String safetyPaddingDetails;

    @Column(name = "ventilation_system", length = 100)
    private String ventilationSystem;

    @Column(name = "booking_calendar_enabled")
    private Boolean bookingCalendarEnabled = true;

    @Column(name = "real_time_availability")
    private Boolean realTimeAvailability = true;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerHour;

    @Column(nullable = false)
    private Boolean isAvailable = true;

    @Column(columnDefinition = "JSON")
    private String features;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ground_id", nullable = false)
    @JsonBackReference
    private Ground ground;

    public enum LocationType {
        INDOOR, OUTDOOR
    }

    public enum SurfaceType {
        TURF, MATTING, CEMENT
    }
}
