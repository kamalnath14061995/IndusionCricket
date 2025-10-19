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
 * Entity representing an available cricket training program
 */
@Entity
@Table(name = "available_programs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailableProgram {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Program name is required")
    @Size(min = 2, max = 255, message = "Program name must be between 2 and 255 characters")
    @Column(name = "program_name", nullable = false)
    private String programName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Size(max = 100, message = "Duration must be less than 100 characters")
    @Column(name = "duration")
    private String duration;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Column(name = "price", precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    @Size(max = 50, message = "Level must be less than 50 characters")
    @Column(name = "level")
    private String level;

    @Size(max = 100, message = "Category must be less than 100 characters")
    @Column(name = "category")
    private String category;

    @Size(max = 10, message = "Icon must be less than 10 characters")
    @Column(name = "icon")
    private String icon;

    @Size(max = 100, message = "Age group must be less than 100 characters")
    @Column(name = "age_group")
    private String ageGroup;

    @Column(name = "focus_areas", columnDefinition = "TEXT")
    private String focusAreas;

    @Size(max = 100, message = "Format must be less than 100 characters")
    @Column(name = "format")
    private String format;

    @Column(name = "is_suggested", nullable = false)
    private Boolean isSuggested = false;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToMany
    @JoinTable(name = "program_coaches", joinColumns = @JoinColumn(name = "program_id"), inverseJoinColumns = @JoinColumn(name = "coach_id"))
    private Set<ExpertCoach> coaches = new HashSet<>();
}
