package com.cricketacademy.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "star_player_stats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StarPlayerStat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    private StarPlayer player;

    @Column(nullable = false)
    private String year;

    @Column(nullable = false)
    private Integer runs;

    @Column(nullable = false)
    private Integer wickets;

    @Column(nullable = false)
    private Integer matches;

    @Column(nullable = false)
    private Integer centuries;

    @Column(nullable = false)
    private Integer halfCenturies;

    @Column(nullable = false)
    private Double strikeRate;

    @Column(nullable = false)
    private Double economyRate;

    @Column(nullable = false)
    private Double average;
}
