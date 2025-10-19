package com.cricketacademy.api.repository;

import com.cricketacademy.api.entity.FacilityItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityItemRepository extends JpaRepository<FacilityItem, Long> {
    java.util.List<FacilityItem> findAllByOrderBySortOrderAscIdAsc();
}