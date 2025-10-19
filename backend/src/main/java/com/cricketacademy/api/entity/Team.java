package com.cricketacademy.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "teams")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "team_name", nullable = false)
    private String teamName;

    @Column(name = "team_captain_name", nullable = false)
    private String teamCaptainName;

    @Column(name = "team_captain_email", nullable = false)
    private String teamCaptainEmail;

    @Column(name = "team_captain_phone", nullable = false)
    private String teamCaptainPhone;

    @Column(name = "team_size")
    private Integer teamSize = 11;

    @Column(name = "team_type")
    private String teamType = "CRICKET"; // CRICKET, FOOTBALL, BASKETBALL, etc.

    @Column(name = "skill_level")
    private String skillLevel = "AMATEUR"; // BEGINNER, AMATEUR, INTERMEDIATE, ADVANCED, PROFESSIONAL

    @Column(name = "age_group")
    private String ageGroup = "ADULT"; // UNDER_12, UNDER_16, UNDER_19, ADULT, SENIOR

    @Column(name = "home_ground")
    private String homeGround;

    @Column(name = "membership_status")
    private String membershipStatus = "ACTIVE"; // ACTIVE, INACTIVE, SUSPENDED

    @Column(name = "loyalty_points")
    private Integer loyaltyPoints = 0;

    @Column(name = "discount_percentage")
    private Double discountPercentage = 0.0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TeamPlayer> players;

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
