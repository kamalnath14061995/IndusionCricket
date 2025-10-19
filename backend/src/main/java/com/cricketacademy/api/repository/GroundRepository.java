package com.cricketacademy.api.repository;

import com.cricketacademy.api.entity.Ground;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroundRepository extends JpaRepository<Ground, Long> {
    List<Ground> findByIsActiveTrue();

    @Query("SELECT g FROM Ground g WHERE g.isActive = true ORDER BY g.name")
    List<Ground> findAllActiveGrounds();
}
