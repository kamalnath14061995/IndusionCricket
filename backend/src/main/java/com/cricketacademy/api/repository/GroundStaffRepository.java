package com.cricketacademy.api.repository;

import com.cricketacademy.api.entity.GroundStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroundStaffRepository extends JpaRepository<GroundStaff, Long> {

    boolean existsByEmail(String email);

    List<GroundStaff> findByOrderByCreatedAtDesc();
    
    @Override
    List<GroundStaff> findAll();
}
