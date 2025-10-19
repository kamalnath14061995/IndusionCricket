package com.cricketacademy.api.dto;

import lombok.Data;

import java.util.List;

@Data
public class StarPlayerDTO {
    private Long id; // optional for update
    private String name;
    private String photoUrl;
    private List<String> achievements;
    private List<String> playerType;
    private List<String> represents;
    private List<StarPlayerYearStatDTO> stats; // years list
    private List<StarPlayerTournamentDTO> tournaments;
    private Integer sortOrder;

    @Data
    public static class StarPlayerTournamentDTO {
        private String name;
        private String month;
        private String year;
        private Integer runs;
        private Integer wickets;
        private Integer matches;
    }

    @Data
    public static class StarPlayerYearStatDTO {
        private String year;
        private Integer runs;
        private Integer wickets;
        private Integer matches;
        private Integer centuries;
        private Integer halfCenturies;
        private Double strikeRate;
        private Double economyRate;
        private Double average;
    }
}