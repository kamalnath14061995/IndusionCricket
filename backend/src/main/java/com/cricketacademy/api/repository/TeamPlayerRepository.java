package com.cricketacademy.api.repository;

import com.cricketacademy.api.entity.TeamPlayer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamPlayerRepository extends JpaRepository<TeamPlayer, Long> {
    List<TeamPlayer> findByTeamId(Long teamId);

    List<TeamPlayer> findByPlayerEmail(String email);
}
