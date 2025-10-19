package com.cricketacademy.api.repository;

import com.cricketacademy.api.entity.ExpertCoach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpertCoachRepository extends JpaRepository<ExpertCoach, Long> {

    List<ExpertCoach> findByIsAvailableTrue();

    List<ExpertCoach> findBySpecialization(String specialization);

    @Query("SELECT c FROM ExpertCoach c WHERE c.name LIKE %:keyword% OR c.specialization LIKE %:keyword%")
    List<ExpertCoach> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT c FROM ExpertCoach c JOIN c.programs p WHERE p.id = :programId")
    List<ExpertCoach> findByProgramId(@Param("programId") Long programId);
}
