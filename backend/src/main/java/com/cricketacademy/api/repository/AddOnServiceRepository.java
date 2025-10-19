package com.cricketacademy.api.repository;

import com.cricketacademy.api.entity.AddOnService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddOnServiceRepository extends JpaRepository<AddOnService, Long> {
    List<AddOnService> findByServiceCategoryAndIsAvailableTrue(String serviceCategory);

    List<AddOnService> findByIsAvailableTrue();
}
