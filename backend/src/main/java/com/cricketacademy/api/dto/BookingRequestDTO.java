package com.cricketacademy.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequestDTO {

    private String bookingType; // "ground" or "net"
    private String groundId;
    private String groundName;
    private String groundDescription;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    // Match inputs
    private String matchType; // Practice, Tournament, One-day, Multi-day, T20, T10
    private Integer matchOvers; // optional
    private Double price;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private Long userId; // Optional for logged-in users
    private String status; // For admin updates: "PENDING", "CONFIRMED", "CANCELLED"
}
