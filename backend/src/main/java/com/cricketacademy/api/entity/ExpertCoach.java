package com.cricketacademy.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing an expert cricket coach
 */
@Entity
@Table(name = "expert_coaches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpertCoach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 255, message = "Name must be between 2 and 255 characters")
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

    @Size(max = 255, message = "Specialization must be less than 255 characters")
    @Column(name = "specialization")
    private String specialization;

    @Min(value = 0, message = "Experience years must be non-negative")
    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "certifications", columnDefinition = "TEXT")
    private String certifications;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Size(max = 500, message = "Profile image URL must be less than 500 characters")
    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @DecimalMin(value = "0.0", inclusive = false, message = "Hourly rate must be greater than 0")
    @Column(name = "hourly_rate", precision = 10, scale = 2)
    private BigDecimal hourlyRate;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    @Column(name = "specifications", columnDefinition = "TEXT")
    private String specifications; // JSON string of selected specifications

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToMany(mappedBy = "coaches")
    private Set<AvailableProgram> programs = new HashSet<>();
}
