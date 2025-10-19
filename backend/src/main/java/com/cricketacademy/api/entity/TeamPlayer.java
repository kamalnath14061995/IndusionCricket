package com.cricketacademy.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "team_players")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamPlayer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Column(name = "player_name", nullable = false)
    private String playerName;

    @Column(name = "player_email")
    private String playerEmail;

    @Column(name = "player_phone")
    private String playerPhone;

    @Column(name = "player_age")
    private Integer playerAge;

    @Column(name = "player_role")
    private String playerRole; // BATSMAN, BOWLER, ALL_ROUNDER, WICKET_KEEPER

    @Column(name = "player_skill_level")
    private String playerSkillLevel = "AMATEUR";

    @Column(name = "jersey_number")
    private Integer jerseyNumber;

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
