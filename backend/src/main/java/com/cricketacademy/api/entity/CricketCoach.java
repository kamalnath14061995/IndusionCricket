package com.cricketacademy.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing a cricket coach registration
 */
@Entity
@Table(name = "cricket_coaches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CricketCoach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Column(name = "name", nullable = false)
    private String name;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[+]?[0-9\\s\\-\\(\\)]{10,15}$", message = "Phone number should be valid")
    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "career_details", columnDefinition = "TEXT", nullable = false)
    private String careerDetails;

    @Column(name = "home_address", columnDefinition = "TEXT", nullable = false)
    private String homeAddress;

    @Column(name = "certifications", columnDefinition = "TEXT")
    private String certifications;

    @Min(value = 0, message = "Experience years must be non-negative")
    @Column(name = "experience_years", nullable = false)
    private Integer experienceYears;

    @Transient
    private String photoUrl; // URL for the coach's photo

    @Enumerated(EnumType.STRING)
    @Column(name = "onboard_status")
    private OnboardStatus onboardStatus = OnboardStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_status")
    private JobStatus jobStatus = JobStatus.APPLIED;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum OnboardStatus {
        PENDING, APPROVED, REJECTED, ONBOARDED
    }

    public enum JobStatus {
        APPLIED, UNDER_REVIEW, INTERVIEW_SCHEDULED, SELECTED, REJECTED, HIRED
    }
}
