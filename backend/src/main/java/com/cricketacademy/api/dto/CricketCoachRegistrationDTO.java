package com.cricketacademy.api.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CricketCoachRegistrationDTO {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[+]?[0-9\\s\\-\\(\\)]{10,15}$", message = "Phone number should be valid")
    private String phone;

    @NotBlank(message = "Career details are required")
    @Size(max = 2000, message = "Career details must not exceed 2000 characters")
    private String careerDetails;

    @NotBlank(message = "Home address is required")
    @Size(max = 500, message = "Home address must not exceed 500 characters")
    private String homeAddress;

    @Size(max = 1000, message = "Certifications must not exceed 1000 characters")
    private String certifications;

    @Min(value = 0, message = "Experience years must be non-negative")
    @Max(value = 50, message = "Experience years must be reasonable")
    private Integer experienceYears;

    private String photoUrl; // URL for the coach's photo
}
