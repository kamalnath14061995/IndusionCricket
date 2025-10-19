package com.cricketacademy.api.repository;

import com.cricketacademy.api.entity.StarPlayerTournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StarPlayerTournamentRepository extends JpaRepository<StarPlayerTournament, Long> {
    List<StarPlayerTournament> findByPlayerIdOrderByYearAsc(Long playerId);
}
