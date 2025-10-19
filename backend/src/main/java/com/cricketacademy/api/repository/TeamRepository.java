package com.cricketacademy.api.repository;

import com.cricketacademy.api.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByMembershipStatus(String membershipStatus);

    List<Team> findByTeamCaptainEmail(String email);
}
