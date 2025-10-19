package com.cricketacademy.api.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Data
public class EnhancedBookingRequestDTO {
    private String bookingType;
    private String facilityId;
    private String facilityName;
    private String facilityType;
    private Long pricingPackageId;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Long teamId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private Integer numberOfPlayers;
    private String specialRequirements;
    private List<Long> addOnServices;
    private Double totalPrice;
    private String paymentMethod;
    private Map<String, Object> additionalFeatures;
}
