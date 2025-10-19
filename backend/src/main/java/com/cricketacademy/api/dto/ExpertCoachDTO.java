package com.cricketacademy.api.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpertCoachDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 255, message = "Name must be between 2 and 255 characters")
    private String name;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[+]?[0-9\\s\\-\\(\\)]{10,15}$", message = "Phone number should be valid")
    private String phone;

    @Size(max = 255, message = "Specialization must be less than 255 characters")
    private String specialization;

    @Min(value = 0, message = "Experience years must be non-negative")
    private Integer experienceYears;

    private String certifications;

    private String bio;

    @Size(max = 500, message = "Profile image URL must be less than 500 characters")
    private String profileImageUrl;

    @DecimalMin(value = "0.0", inclusive = false, message = "Hourly rate must be greater than 0")
    private BigDecimal hourlyRate;

    private Boolean isAvailable = true;

    private String specifications;

    private Set<Long> programIds;
}
