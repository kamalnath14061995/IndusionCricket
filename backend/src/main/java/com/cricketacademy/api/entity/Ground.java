package com.cricketacademy.api.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "grounds")
@Data
public class Ground {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;
    private Integer capacity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerHour;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    // Basic Ground Specs
    @Column(name = "ground_type", length = 20)
    private String groundType = "Cricket";

    @Column(name = "ground_size", length = 50)
    private String groundSize;

    @Column(name = "boundary_dimensions", length = 100)
    private String boundaryDimensions;

    @Column(name = "pitch_type", columnDefinition = "JSON")
    private String pitchType;

    @Column(name = "number_of_pitches")
    private Integer numberOfPitches = 1;

    // Cricket Specs
    @Column(name = "turf_type", length = 20)
    private String turfType = "Natural Grass";

    @Column(name = "pitch_quality", length = 10)
    private String pitchQuality = "Medium";

    @Column(name = "grass_type", length = 30)
    private String grassType = "Bermuda";

    @Column(name = "drainage_system")
    private Boolean drainageSystem = false;

    @Column(name = "lighting_quality", length = 20)
    private String lightingQuality = "Standard";

    @Column(name = "seating_types", columnDefinition = "JSON")
    private String seatingTypes;

    @Column(name = "media_facilities", columnDefinition = "JSON")
    private String mediaFacilities;

    @Column(name = "practice_facilities", columnDefinition = "JSON")
    private String practiceFacilities;

    @Column(name = "safety_features", columnDefinition = "JSON")
    private String safetyFeatures;

    // Facilities
    @Column(name = "has_floodlights")
    private Boolean hasFloodlights = false;

    @Column(name = "has_pavilion")
    private Boolean hasPavilion = false;

    @Column(name = "has_dressing_rooms")
    private Boolean hasDressingRooms = false;

    @Column(name = "has_washrooms")
    private Boolean hasWashrooms = false;

    @Column(name = "has_showers")
    private Boolean hasShowers = false;

    @Column(name = "has_drinking_water")
    private Boolean hasDrinkingWater = true;

    @Column(name = "has_first_aid")
    private Boolean hasFirstAid = true;

    @Column(name = "has_parking_two_wheeler")
    private Boolean hasParkingTwoWheeler = true;

    @Column(name = "has_parking_four_wheeler")
    private Boolean hasParkingFourWheeler = true;

    @Column(name = "has_refreshments")
    private Boolean hasRefreshments = false;

    @Column(name = "seating_capacity")
    private Integer seatingCapacity;

    @Column(name = "has_practice_nets")
    private Boolean hasPracticeNets = false;

    @Column(name = "scoreboard_type", length = 20)
    private String scoreboardType = "Manual";

    @Column(name = "has_live_streaming")
    private Boolean hasLiveStreaming = false;

    // Specs
    @Column(name = "ground_dimensions", length = 50)
    private String groundDimensions;

    @Column(name = "pitch_length", length = 20)
    private String pitchLength = "22 yards";

    @Column(name = "overs_per_slot", length = 10)
    private String oversPerSlot = "20";

    @Column(name = "ball_type", length = 10)
    private String ballType = "Tennis";

    @Column(name = "has_safety_nets")
    private Boolean hasSafetyNets = false;

    @Column(name = "has_rain_covers")
    private Boolean hasRainCovers = false;

    @Column(name = "has_ground_staff_available")
    private Boolean hasGroundStaffAvailable = false;

    @Column(columnDefinition = "JSON")
    private String facilities; // Keep for backward compatibility

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "ground", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Net> nets;
}
