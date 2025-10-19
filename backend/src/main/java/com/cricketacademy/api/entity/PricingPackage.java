package com.cricketacademy.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pricing_packages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PricingPackage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "package_name", nullable = false)
    private String packageName;

    @Column(name = "package_type", nullable = false)
    private String packageType; // GROUND, NET, COACHING, EVENT

    @Column(name = "duration_type", nullable = false)
    private String durationType; // HOURLY, HALF_DAY, FULL_DAY, WEEKLY, MONTHLY

    @Column(name = "duration_value", nullable = false)
    private BigDecimal durationValue;

    @Column(name = "base_price", nullable = false)
    private BigDecimal basePrice;

    @Column(name = "discounted_price")
    private BigDecimal discountedPrice;

    @Column(name = "discount_percentage")
    private BigDecimal discountPercentage = BigDecimal.ZERO;

    @Column(name = "membership_discount")
    private BigDecimal membershipDiscount = BigDecimal.ZERO;

    @Column(name = "peak_hour_multiplier")
    private BigDecimal peakHourMultiplier = BigDecimal.ONE;

    @Column(name = "off_peak_discount")
    private BigDecimal offPeakDiscount = BigDecimal.ZERO;

    @Column(name = "weekend_multiplier")
    private BigDecimal weekendMultiplier = BigDecimal.ONE;

    @Column(name = "weekday_discount")
    private BigDecimal weekdayDiscount = BigDecimal.ZERO;

    @Column(name = "holiday_multiplier")
    private BigDecimal holidayMultiplier = BigDecimal.ONE;

    @Column(name = "advance_booking_discount")
    private BigDecimal advanceBookingDiscount = BigDecimal.ZERO;

    @Column(name = "group_discount_threshold")
    private Integer groupDiscountThreshold = 1;

    @Column(name = "group_discount_percentage")
    private BigDecimal groupDiscountPercentage = BigDecimal.ZERO;

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
