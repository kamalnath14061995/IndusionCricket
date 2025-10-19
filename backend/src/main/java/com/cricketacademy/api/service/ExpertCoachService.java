package com.cricketacademy.api.service;

import com.cricketacademy.api.dto.ExpertCoachDTO;
import com.cricketacademy.api.entity.ExpertCoach;
import com.cricketacademy.api.repository.ExpertCoachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ExpertCoachService {

    private final ExpertCoachRepository coachRepository;

    public List<ExpertCoach> getAllCoaches() {
        return coachRepository.findAll();
    }

    public List<ExpertCoach> getAvailableCoaches() {
        return coachRepository.findByIsAvailableTrue();
    }

    public ExpertCoach getCoachById(Long id) {
        return coachRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coach not found with id: " + id));
    }

    public ExpertCoach createCoach(ExpertCoachDTO coachDTO) {
        ExpertCoach coach = new ExpertCoach();
        updateCoachFromDTO(coach, coachDTO);
        return coachRepository.save(coach);
    }

    public ExpertCoach updateCoach(Long id, ExpertCoachDTO coachDTO) {
        ExpertCoach coach = getCoachById(id);
        updateCoachFromDTO(coach, coachDTO);
        return coachRepository.save(coach);
    }

    public void deleteCoach(Long id) {
        if (!coachRepository.existsById(id)) {
            throw new RuntimeException("Coach not found with id: " + id);
        }
        coachRepository.deleteById(id);
    }

    public List<ExpertCoach> searchCoaches(String keyword) {
        return coachRepository.searchByKeyword(keyword);
    }

    public List<ExpertCoach> getCoachesBySpecialization(String specialization) {
        return coachRepository.findBySpecialization(specialization);
    }

    private void updateCoachFromDTO(ExpertCoach coach, ExpertCoachDTO dto) {
        coach.setName(dto.getName());
        coach.setEmail(dto.getEmail());
        coach.setPhone(dto.getPhone());
        coach.setSpecialization(dto.getSpecialization());
        coach.setExperienceYears(dto.getExperienceYears());
        coach.setCertifications(dto.getCertifications());
        coach.setBio(dto.getBio());
        coach.setProfileImageUrl(dto.getProfileImageUrl());
        coach.setHourlyRate(dto.getHourlyRate());
        coach.setIsAvailable(dto.getIsAvailable());
        coach.setSpecifications(dto.getSpecifications());
    }
}
