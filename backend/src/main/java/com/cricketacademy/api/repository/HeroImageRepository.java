package com.cricketacademy.api.repository;

import com.cricketacademy.api.entity.HeroImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for HeroImage entity
 * Provides data access methods for hero image operations
 */
@Repository
public interface HeroImageRepository extends JpaRepository<HeroImage, Long> {
    // JpaRepository provides: save, findAll, findById, deleteById, existsById,
    // count
}
