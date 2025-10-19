package com.cricketacademy.api.repository;

import com.cricketacademy.api.entity.AvailableProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvailableProgramRepository extends JpaRepository<AvailableProgram, Long> {

    List<AvailableProgram> findByIsActiveTrue();

    List<AvailableProgram> findByCategory(String category);

    List<AvailableProgram> findByLevel(String level);

    @Query("SELECT p FROM AvailableProgram p WHERE p.programName LIKE %:keyword% OR p.description LIKE %:keyword%")
    List<AvailableProgram> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT p FROM AvailableProgram p JOIN p.coaches c WHERE c.id = :coachId")
    List<AvailableProgram> findByCoachId(@Param("coachId") Long coachId);

    List<AvailableProgram> findByIsSuggestedTrue();
}
