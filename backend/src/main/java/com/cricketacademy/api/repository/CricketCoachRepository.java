package com.cricketacademy.api.repository;

import com.cricketacademy.api.entity.CricketCoach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CricketCoachRepository extends JpaRepository<CricketCoach, Long> {

    boolean existsByEmail(String email);

    List<CricketCoach> findByOrderByCreatedAtDesc();
    
    @Override
    List<CricketCoach> findAll();
}
