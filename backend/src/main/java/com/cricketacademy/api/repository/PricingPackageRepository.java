package com.cricketacademy.api.repository;

import com.cricketacademy.api.entity.PricingPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PricingPackageRepository extends JpaRepository<PricingPackage, Long> {
    List<PricingPackage> findByPackageTypeAndIsActiveTrue(String packageType);

    List<PricingPackage> findByIsActiveTrue();
}
