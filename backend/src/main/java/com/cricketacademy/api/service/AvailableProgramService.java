package com.cricketacademy.api.service;

import com.cricketacademy.api.dto.AvailableProgramDTO;
import com.cricketacademy.api.entity.AvailableProgram;
import com.cricketacademy.api.entity.ExpertCoach;
import com.cricketacademy.api.repository.AvailableProgramRepository;
import com.cricketacademy.api.repository.ExpertCoachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AvailableProgramService {

    private final AvailableProgramRepository programRepository;
    private final ExpertCoachRepository coachRepository;

    public List<AvailableProgram> getAllPrograms() {
        return programRepository.findAll();
    }

    public List<AvailableProgram> getActivePrograms() {
        return programRepository.findByIsActiveTrue();
    }

    public AvailableProgram getProgramById(Long id) {
        return programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Program not found with id: " + id));
    }

    public AvailableProgram createProgram(AvailableProgramDTO programDTO) {
        AvailableProgram program = new AvailableProgram();
        updateProgramFromDTO(program, programDTO);
        return programRepository.save(program);
    }

    public AvailableProgram updateProgram(Long id, AvailableProgramDTO programDTO) {
        AvailableProgram program = getProgramById(id);

        // Validate coach IDs if provided
        if (programDTO.getCoachIds() != null && !programDTO.getCoachIds().isEmpty()) {
            Set<ExpertCoach> coaches = coachRepository.findAllById(programDTO.getCoachIds())
                    .stream()
                    .collect(Collectors.toSet());
            if (coaches.size() != programDTO.getCoachIds().size()) {
                throw new RuntimeException("One or more coach IDs are invalid");
            }
        }

        updateProgramFromDTO(program, programDTO);
        return programRepository.save(program);
    }

    public void deleteProgram(Long id) {
        if (!programRepository.existsById(id)) {
            throw new RuntimeException("Program not found with id: " + id);
        }
        programRepository.deleteById(id);
    }

    public List<AvailableProgram> searchPrograms(String keyword) {
        return programRepository.searchByKeyword(keyword);
    }

    public List<AvailableProgram> getProgramsByCategory(String category) {
        return programRepository.findByCategory(category);
    }

    public List<AvailableProgram> getProgramsByLevel(String level) {
        return programRepository.findByLevel(level);
    }

    @Transactional
    public void initializeSuggestedPrograms() {
        if (programRepository.findByIsSuggestedTrue().isEmpty()) {
            createSuggestedPrograms();
        }
    }

    public void createSuggestedPrograms() {
        List<AvailableProgram> suggestedPrograms = List.of(
            createSuggestedProgram("👶", "Beginner Coaching", "Kids (5–10 yrs)", "Basics: rules, grip, stance, basic batting/bowling, simple fielding", "Weekly / Seasonal", "Beginner", "Youth"),
            createSuggestedProgram("🧒", "Junior Coaching", "Youth (11–15 yrs)", "Technique, fielding drills, fitness basics, match awareness", "Weekly / Seasonal", "Intermediate", "Youth"),
            createSuggestedProgram("👦", "Senior Coaching", "Teens (16–19 yrs)", "Advanced technique, game plans, S&C, match simulations", "Seasonal / Annual", "Advanced", "Youth"),
            createSuggestedProgram("🏆", "Professional Academy Coaching", "Elite (19+ / Pro pathway)", "High-performance, analytics, nutrition, mental skills", "Full-time / Contract", "Professional", "Elite"),
            createSuggestedProgram("🎯", "One-on-One Coaching", "All ages", "Personalized skill plan, video analysis, focused correction", "Hourly / Customized", "All Levels", "Individual"),
            createSuggestedProgram("🎳", "Specialized Bowling", "All levels", "Pace & swing, seam work, spin variations, run-up mechanics", "Short-term / Camps", "All Levels", "Specialized"),
            createSuggestedProgram("🏏", "Specialized Batting", "All levels", "Footwork, shot selection, power-hitting, facing pace/spin", "Short-term / Camps", "All Levels", "Specialized"),
            createSuggestedProgram("🧤", "Wicketkeeping Programs", "All levels", "Glovework, footwork, quickness, stumpings & reactivity", "Short-term / Customized", "All Levels", "Specialized"),
            createSuggestedProgram("💪", "Fitness & Conditioning", "All levels", "Strength, speed & agility, flexibility, injury prevention", "Ongoing / Seasonal", "All Levels", "Fitness"),
            createSuggestedProgram("👩", "Women's Cricket Coaching", "Girls & Women", "Skill development, team play, fitness tailored for women", "Seasonal / Camps", "All Levels", "Women"),
            createSuggestedProgram("⚡", "T20 / Short Format Coaching", "Youth & Adults", "Power-hitting, death bowling, situational tactics, fielding", "Camps / Short-term", "Intermediate", "Format-Specific"),
            createSuggestedProgram("🕰️", "Test / Long Format Coaching", "Advanced players", "Patience, concentration, long bowling spells, endurance", "Seasonal / Block programs", "Advanced", "Format-Specific"),
            createSuggestedProgram("🎉", "Holiday Camps", "Kids & Youth", "Fun skill sessions, mini-matches, teamwork & games", "Short-term (1–4 weeks)", "Beginner", "Camps"),
            createSuggestedProgram("🌞", "Summer Camps", "Kids, Youth & Teens", "Intensive daily training, match practice + fun activities", "Short-term (2–8 weeks)", "All Levels", "Camps"),
            createSuggestedProgram("👔", "Corporate / Weekend Programs", "Adults (Amateur)", "Basics, team-building, light fitness, social matches", "Weekend / Short-term", "Beginner", "Corporate"),
            createSuggestedProgram("💻", "Online / Virtual Coaching", "All ages", "Remote video analysis, drills, training plans & nutrition", "Subscription / Customized", "All Levels", "Virtual")
        );
        
        programRepository.saveAll(suggestedPrograms);
    }

    private AvailableProgram createSuggestedProgram(String icon, String name, String ageGroup, String focusAreas, String format, String level, String category) {
        AvailableProgram program = new AvailableProgram();
        program.setIcon(icon);
        program.setProgramName(name);
        program.setAgeGroup(ageGroup);
        program.setFocusAreas(focusAreas);
        program.setFormat(format);
        program.setLevel(level);
        program.setCategory(category);
        program.setIsSuggested(true);
        program.setIsActive(true);
        program.setPrice(new java.math.BigDecimal("100.00")); // Default price
        program.setDescription("Suggested program: " + focusAreas);
        program.setDuration(format);
        return program;
    }

    public List<AvailableProgram> getSuggestedPrograms() {
        return programRepository.findByIsSuggestedTrue();
    }

    public List<AvailableProgram> getAllProgramsWithSuggested() {
        // Initialize suggested programs if they don't exist
        initializeSuggestedPrograms();
        return programRepository.findAll();
    }

    private void updateProgramFromDTO(AvailableProgram program, AvailableProgramDTO dto) {
        program.setProgramName(dto.getProgramName());
        program.setDescription(dto.getDescription());
        program.setDuration(dto.getDuration());
        program.setPrice(dto.getPrice());
        program.setLevel(dto.getLevel());
        program.setCategory(dto.getCategory());
        program.setIcon(dto.getIcon());
        program.setAgeGroup(dto.getAgeGroup());
        program.setFocusAreas(dto.getFocusAreas());
        program.setFormat(dto.getFormat());
        program.setIsSuggested(dto.getIsSuggested());
        program.setIsActive(dto.getIsActive());

        if (dto.getCoachIds() != null && !dto.getCoachIds().isEmpty()) {
            Set<ExpertCoach> coaches = coachRepository.findAllById(dto.getCoachIds())
                    .stream()
                    .collect(Collectors.toSet());
            program.setCoaches(coaches);
        }
    }
}
