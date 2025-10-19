package com.cricketacademy.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "star_players")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StarPlayer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "photo_url")
    private String photoUrl;

    @ElementCollection
    @CollectionTable(name = "star_player_achievements", joinColumns = @JoinColumn(name = "player_id"))
    @Column(name = "achievement")
    private List<String> achievements = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "star_player_types", joinColumns = @JoinColumn(name = "player_id"))
    @Column(name = "player_type")
    private List<String> playerType = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "star_player_represents", joinColumns = @JoinColumn(name = "player_id"))
    @Column(name = "represents")
    private List<String> represents = new ArrayList<>();

    @OneToMany(mappedBy = "player", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<StarPlayerStat> stats = new ArrayList<>();

    @OneToMany(mappedBy = "player", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<StarPlayerTournament> tournaments = new ArrayList<>();

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}