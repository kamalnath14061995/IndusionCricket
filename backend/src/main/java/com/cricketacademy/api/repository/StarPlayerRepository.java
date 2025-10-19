package com.cricketacademy.api.repository;

import com.cricketacademy.api.entity.StarPlayer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface StarPlayerRepository extends JpaRepository<StarPlayer, Long> {
    java.util.List<StarPlayer> findAllByOrderBySortOrderAscIdAsc();
    
    @Query("SELECT DISTINCT p FROM StarPlayer p LEFT JOIN FETCH p.stats ORDER BY p.sortOrder ASC, p.id ASC")
    java.util.List<StarPlayer> findAllWithStats();
    
    @Query("SELECT DISTINCT p FROM StarPlayer p LEFT JOIN FETCH p.tournaments WHERE p.id IN :ids ORDER BY p.sortOrder ASC, p.id ASC")
    java.util.List<StarPlayer> findAllWithTournamentsByIds(@org.springframework.data.repository.query.Param("ids") java.util.List<Long> ids);
}