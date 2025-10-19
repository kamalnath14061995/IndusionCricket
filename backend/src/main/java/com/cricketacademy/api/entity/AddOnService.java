package com.cricketacademy.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "add_on_services")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddOnService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "service_name", nullable = false)
    private String serviceName;

    @Column(name = "service_category", nullable = false)
    private String serviceCategory; // EQUIPMENT, COACHING, FACILITY, TECHNOLOGY, CATERING, SECURITY

    @Column(name = "service_type", nullable = false)
    private String serviceType; // UMPIRE, SCORER, COACH, BOWLING_MACHINE, FLOODLIGHTS, etc.

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "base_price", nullable = false)
    private BigDecimal basePrice;

    @Column(name = "hourly_rate")
    private BigDecimal hourlyRate;

    @Column(name = "daily_rate")
    private BigDecimal dailyRate;

    @Column(name = "per_unit_rate")
    private BigDecimal perUnitRate;

    @Column(name = "quantity_available")
    private Integer quantityAvailable = 1;

    @Column(name = "max_quantity_per_booking")
    private Integer maxQuantityPerBooking = 1;

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    @Column(name = "requires_advance_booking")
    private Boolean requiresAdvanceBooking = false;

    @Column(name = "advance_booking_hours")
    private Integer advanceBookingHours = 0;

    @Column(name = "peak_hour_multiplier")
    private BigDecimal peakHourMultiplier = BigDecimal.ONE;

    @Column(name = "weekend_multiplier")
    private BigDecimal weekendMultiplier = BigDecimal.ONE;

    @Column(name = "holiday_multiplier")
    private BigDecimal holidayMultiplier = BigDecimal.ONE;

    @Column(name = "tax_rate")
    private BigDecimal taxRate = new BigDecimal("18.0");

    @Column(name = "currency")
    private String currency = "INR";

    @Column(name = "is_active")
    private Boolean isActive = true;

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
