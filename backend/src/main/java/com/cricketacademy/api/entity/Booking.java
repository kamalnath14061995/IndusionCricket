package com.cricketacademy.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Map;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String bookingType; // "ground" or "net"

    @Column(nullable = false)
    private String groundId;

    @Column(nullable = false)
    private String groundName;

    @Column(columnDefinition = "TEXT")
    private String groundDescription;

    @Column(nullable = false)
    private LocalDate bookingDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    // Match details
    private String matchType; // Practice, Tournament, One-day, Multi-day, T20, T10
    private Integer matchOvers; // e.g., 20, 50; optional

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String customerEmail;

    @Column(nullable = false)
    private String customerPhone;

    @Column(nullable = true)
    private Long userId;

    @Column(nullable = false)
    private String status; // "PENDING", "CONFIRMED", "CANCELLED"

    @Column(nullable = false)
    private String paymentStatus; // "PENDING", "PAID", "FAILED"

    @Column(nullable = false)
    private String paymentId;

    // Enhanced booking features
    @Column(nullable = false)
    private String bookingCategory = "STANDARD";

    @Column(nullable = false)
    private String durationType = "HOURLY";

    @Column(nullable = false)
    private Double totalHours = 1.0;

    private String teamName;
    private Integer numberOfPlayers = 1;
    private String specialRequirements;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "json")
    private Map<String, Object> addOnServices;

    private Double discountApplied = 0.0;
    private String membershipId;
    private String eventType = "REGULAR";
    private String cancellationReason;
    private Double refundAmount = 0.0;
    private String bookingSource = "ADMIN";
    private String notes;

    // Facility-specific features
    private Boolean floodlightsRequested = false;
    private Boolean pavilionRequested = false;
    private Boolean refreshmentsRequested = false;
    private Boolean securityRequested = false;
    private Boolean firstAidRequested = false;
    private Boolean liveStreamingRequested = false;
    private Boolean recordingRequested = false;
    private Boolean soundSystemRequested = false;
    private Boolean scoreboardRequested = false;
    private Boolean seatingArrangementRequested = false;
    private Boolean vipSeatingRequested = false;
    private Boolean mediaCoverageRequested = false;
    private Boolean photographyRequested = false;
    private Boolean videographyRequested = false;
    private Boolean cateringRequested = false;
    private Boolean decorationRequested = false;
    private Boolean brandingRequested = false;
    private Boolean signageRequested = false;
    private Boolean wifiRequested = false;
    private Boolean airConditioningRequested = false;
    private Boolean heatingRequested = false;
    private Boolean generatorBackupRequested = false;
    private Boolean storageRequested = false;
    private Boolean changingRoomsRequested = false;
    private Boolean showerFacilitiesRequested = false;
    private Boolean washroomFacilitiesRequested = false;
    private Boolean drinkingWaterRequested = false;
    private Boolean wasteManagementRequested = false;
    private Boolean recyclingRequested = false;
    private Boolean greenInitiativesRequested = false;
    private Boolean sustainabilityRequested = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
