package com.cricketacademy.api.repository;

import com.cricketacademy.api.entity.SessionActivity;
import com.cricketacademy.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SessionActivityRepository extends JpaRepository<SessionActivity, Long> {

    SessionActivity findBySessionToken(String sessionToken);

    List<SessionActivity> findByUserAndIsActiveTrue(User user);

    List<SessionActivity> findByIsActiveTrue();

    List<SessionActivity> findBySessionExpiryTimeBefore(LocalDateTime time);

    @Query("SELECT sa FROM SessionActivity sa WHERE sa.user.id = :userId AND sa.isActive = true")
    List<SessionActivity> findActiveSessionsByUserId(@Param("userId") Long userId);

    @Query("SELECT sa FROM SessionActivity sa WHERE sa.sessionExpiryTime < :currentTime AND sa.isActive = true")
    List<SessionActivity> findExpiredSessions(@Param("currentTime") LocalDateTime currentTime);
}
