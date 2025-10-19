package com.cricketacademy.api.repository;

import com.cricketacademy.api.entity.ContactInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for ContactInfo entity
 * Provides data access methods for contact info operations
 * Supports full CRUD operations for multiple contact info entries
 */
@Repository
public interface ContactInfoRepository extends JpaRepository<ContactInfo, Long> {
    // JpaRepository provides: save, findAll, findById, deleteById, existsById,
    // count
}
