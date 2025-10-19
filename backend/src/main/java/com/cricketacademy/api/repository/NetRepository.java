package com.cricketacademy.api.repository;

import com.cricketacademy.api.entity.Net;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NetRepository extends JpaRepository<Net, Long> {
    List<Net> findByGroundIdAndIsAvailableTrue(Long groundId);

    List<Net> findByIsAvailableTrue();

    @Query("SELECT n FROM Net n WHERE n.ground.id = :groundId AND n.isAvailable = true ORDER BY n.name")
    List<Net> findAllAvailableNetsByGroundId(Long groundId);
}
