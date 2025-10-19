package com.cricketacademy.api.service;

import com.cricketacademy.api.dto.CricketCoachRegistrationDTO;
import com.cricketacademy.api.dto.GroundStaffRegistrationDTO;
import com.cricketacademy.api.entity.CricketCoach;
import com.cricketacademy.api.entity.GroundStaff;
import com.cricketacademy.api.repository.CricketCoachRepository;
import com.cricketacademy.api.repository.GroundStaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CareerRegistrationService {

    private final CricketCoachRepository cricketCoachRepository;
    private final GroundStaffRepository groundStaffRepository;

    public CricketCoach registerCricketCoach(CricketCoachRegistrationDTO dto) {
        if (cricketCoachRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already registered as cricket coach");
        }

        CricketCoach coach = new CricketCoach();
        coach.setName(dto.getName());
        coach.setEmail(dto.getEmail());
        coach.setPhone(dto.getPhone());
        coach.setCareerDetails(dto.getCareerDetails());
        coach.setHomeAddress(dto.getHomeAddress());
        coach.setCertifications(dto.getCertifications());
        coach.setExperienceYears(dto.getExperienceYears());

        return cricketCoachRepository.save(coach);
    }

    public GroundStaff registerGroundStaff(GroundStaffRegistrationDTO dto) {
        if (groundStaffRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already registered as ground staff");
        }

        GroundStaff staff = new GroundStaff();
        staff.setName(dto.getName());
        staff.setEmail(dto.getEmail());
        staff.setPhone(dto.getPhone());
        staff.setBackgroundDetails(dto.getBackgroundDetails());
        staff.setHomeAddress(dto.getHomeAddress());
        staff.setSkills(dto.getSkills());
        staff.setExperienceYears(dto.getExperienceYears());

        return groundStaffRepository.save(staff);
    }

    public List<CricketCoach> getAllCricketCoaches() {
        try {
            return cricketCoachRepository.findByOrderByCreatedAtDesc();
        } catch (Exception e) {
            // Fallback if createdAt column doesn't exist
            return cricketCoachRepository.findAll();
        }
    }

    public List<GroundStaff> getAllGroundStaff() {
        try {
            return groundStaffRepository.findByOrderByCreatedAtDesc();
        } catch (Exception e) {
            // Fallback if createdAt column doesn't exist
            return groundStaffRepository.findAll();
        }
    }

    public long getTotalCricketCoaches() {
        return cricketCoachRepository.count();
    }

    public long getTotalGroundStaff() {
        return groundStaffRepository.count();
    }

    // CRUD Operations for Cricket Coaches
    public Optional<CricketCoach> getCricketCoachById(Long id) {
        return cricketCoachRepository.findById(id);
    }

    public CricketCoach updateCricketCoach(Long id, CricketCoachRegistrationDTO dto) {
        CricketCoach coach = cricketCoachRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Cricket coach not found"));
        
        coach.setName(dto.getName());
        coach.setEmail(dto.getEmail());
        coach.setPhone(dto.getPhone());
        coach.setCareerDetails(dto.getCareerDetails());
        coach.setHomeAddress(dto.getHomeAddress());
        coach.setCertifications(dto.getCertifications());
        coach.setExperienceYears(dto.getExperienceYears());
        
        return cricketCoachRepository.save(coach);
    }

    public void deleteCricketCoach(Long id) {
        cricketCoachRepository.deleteById(id);
    }

    public CricketCoach updateCoachOnboardStatus(Long id, CricketCoach.OnboardStatus status) {
        CricketCoach coach = cricketCoachRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Cricket coach not found"));
        coach.setOnboardStatus(status);
        return cricketCoachRepository.save(coach);
    }

    public CricketCoach updateCoachJobStatus(Long id, CricketCoach.JobStatus status) {
        CricketCoach coach = cricketCoachRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Cricket coach not found"));
        coach.setJobStatus(status);
        return cricketCoachRepository.save(coach);
    }

    // CRUD Operations for Ground Staff
    public Optional<GroundStaff> getGroundStaffById(Long id) {
        return groundStaffRepository.findById(id);
    }

    public GroundStaff updateGroundStaff(Long id, GroundStaffRegistrationDTO dto) {
        GroundStaff staff = groundStaffRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Ground staff not found"));
        
        staff.setName(dto.getName());
        staff.setEmail(dto.getEmail());
        staff.setPhone(dto.getPhone());
        staff.setBackgroundDetails(dto.getBackgroundDetails());
        staff.setHomeAddress(dto.getHomeAddress());
        staff.setSkills(dto.getSkills());
        staff.setExperienceYears(dto.getExperienceYears());
        
        return groundStaffRepository.save(staff);
    }

    public void deleteGroundStaff(Long id) {
        groundStaffRepository.deleteById(id);
    }

    public GroundStaff updateStaffOnboardStatus(Long id, GroundStaff.OnboardStatus status) {
        GroundStaff staff = groundStaffRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Ground staff not found"));
        staff.setOnboardStatus(status);
        return groundStaffRepository.save(staff);
    }

    public GroundStaff updateStaffJobStatus(Long id, GroundStaff.JobStatus status) {
        GroundStaff staff = groundStaffRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Ground staff not found"));
        staff.setJobStatus(status);
        return groundStaffRepository.save(staff);
    }
}
