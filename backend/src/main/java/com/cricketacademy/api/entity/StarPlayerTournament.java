package com.cricketacademy.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "star_player_tournaments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StarPlayerTournament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    private StarPlayer player;

    @Column(nullable = false)
    private String name;

    @Column(nullable = true)
    private String month;

    @Column(nullable = true)
    private String year;

    @Column(nullable = false)
    private Integer runs;

    @Column(nullable = false)
    private Integer wickets;

    @Column(nullable = false)
    private Integer matches;
}
