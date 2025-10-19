package com.cricketacademy.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDTO {

    private Long id;
    private String bookingType;
    private String groundId;
    private String groundName;
    private String groundDescription;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String matchType;
    private Integer matchOvers;
    private Double price;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private Long userId;
    private String status;
    private String paymentStatus;
    private String paymentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
