package com.cricketacademy.api.service;

import com.cricketacademy.api.dto.FacilityItemDTO;
import com.cricketacademy.api.dto.StarPlayerDTO;
import com.cricketacademy.api.entity.FacilityItem;
import com.cricketacademy.api.entity.StarPlayer;
import com.cricketacademy.api.entity.StarPlayerStat;
import com.cricketacademy.api.entity.StarPlayerTournament;
import com.cricketacademy.api.repository.FacilityItemRepository;
import com.cricketacademy.api.repository.HeroImageRepository;
import com.cricketacademy.api.repository.StarPlayerRepository;
import com.cricketacademy.api.repository.StarPlayerTournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class HomepageContentService {

    private final StarPlayerRepository starPlayerRepository;
    private final StarPlayerTournamentRepository starPlayerTournamentRepository;
    private final FacilityItemRepository facilityItemRepository;
    private final HeroImageRepository heroImageRepository;
    
    @PersistenceContext
    private EntityManager entityManager;

    // ---- Star Players ----
    @Transactional(readOnly = true)
    public List<StarPlayerDTO> listPlayers() {
        List<StarPlayer> players = starPlayerRepository.findAllByOrderBySortOrderAscIdAsc();
        
        // Initialize all collections for each player
        players.forEach(player -> {
            player.getStats().size();
            player.getTournaments().size();
            player.getAchievements().size();
            player.getPlayerType().size();
            player.getRepresents().size();
        });
        
        log.info("Loaded {} players for public display", players.size());
        
        return players.stream().map(player -> {
            StarPlayerDTO dto = toDTO(player);
            log.info("Player {} has {} tournaments", dto.getName(), dto.getTournaments() != null ? dto.getTournaments().size() : 0);
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public StarPlayerDTO createPlayer(StarPlayerDTO dto) {
        StarPlayer entity = new StarPlayer();
        apply(dto, entity);
        return toDTO(starPlayerRepository.save(entity));
    }

    @Transactional
    public StarPlayerDTO updatePlayer(Long id, StarPlayerDTO dto) {
        log.info("Updating player with id: {}", id);
        
        StarPlayer entity = starPlayerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Player not found with id: " + id));
        
        // Initialize collections to avoid lazy loading issues
        entity.getStats().size();
        entity.getTournaments().size();
        entity.getAchievements().size();
        entity.getPlayerType().size();
        entity.getRepresents().size();
        
        // Clear existing collections
        entity.getStats().clear();
        entity.getAchievements().clear();
        entity.getPlayerType().clear();
        entity.getRepresents().clear();
        entity.getTournaments().clear();
        
        entityManager.flush();
        
        // Apply new data
        apply(dto, entity);
        
        StarPlayer saved = starPlayerRepository.save(entity);
        entityManager.flush();
        entityManager.refresh(saved);
        
        // Initialize collections after refresh
        saved.getStats().size();
        saved.getTournaments().size();
        saved.getAchievements().size();
        saved.getPlayerType().size();
        saved.getRepresents().size();
        
        log.info("Updated player {} now has {} tournaments", saved.getName(), saved.getTournaments().size());
        
        return toDTO(saved);
    }

    @Transactional
    public StarPlayerDTO getPlayerById(Long id) {
        StarPlayer entity = starPlayerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Player not found with id: " + id));
        
        // Initialize collections to avoid lazy loading issues
        entity.getStats().size();
        entity.getTournaments().size();
        entity.getAchievements().size();
        entity.getPlayerType().size();
        entity.getRepresents().size();
        
        return toDTO(entity);
    }

    @Transactional
    public void deletePlayer(Long id) {
        starPlayerRepository.deleteById(id);
    }

    private void apply(StarPlayerDTO dto, StarPlayer entity) {
        entity.setName(dto.getName());
        entity.setPhotoUrl(dto.getPhotoUrl());
        entity.setSortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0);

        // Achievements: modify the existing collection in-place to avoid replacing it
        entity.getAchievements().clear();
        if (dto.getAchievements() != null) {
            entity.getAchievements().addAll(dto.getAchievements());
        }

        entity.getPlayerType().clear();
        if (dto.getPlayerType() != null) {
            entity.getPlayerType().addAll(dto.getPlayerType());
        }

        entity.getRepresents().clear();
        if (dto.getRepresents() != null) {
            entity.getRepresents().addAll(dto.getRepresents());
        }

        // Stats: with orphanRemoval, never replace the list instance; clear and add
        entity.getStats().clear();
        if (dto.getStats() != null) {
            for (StarPlayerDTO.StarPlayerYearStatDTO s : dto.getStats()) {
                StarPlayerStat st = new StarPlayerStat();
                st.setPlayer(entity);
                st.setYear(s.getYear());
                st.setRuns(s.getRuns() != null ? s.getRuns() : 0);
                st.setWickets(s.getWickets() != null ? s.getWickets() : 0);
                st.setMatches(s.getMatches() != null ? s.getMatches() : 0);
                // Set new metrics with null safety
                st.setCenturies(s.getCenturies() != null ? s.getCenturies() : 0);
                st.setHalfCenturies(s.getHalfCenturies() != null ? s.getHalfCenturies() : 0);
                st.setStrikeRate(s.getStrikeRate() != null ? s.getStrikeRate() : 0.0);
                st.setEconomyRate(s.getEconomyRate() != null ? s.getEconomyRate() : 0.0);
                st.setAverage(s.getAverage() != null ? s.getAverage() : 0.0);
                entity.getStats().add(st);
            }
        }

        // Tournaments: with orphanRemoval, never replace the list instance; clear and add
        entity.getTournaments().clear();
        if (dto.getTournaments() != null && !dto.getTournaments().isEmpty()) {
            log.info("Processing {} tournaments for player", dto.getTournaments().size());
            for (StarPlayerDTO.StarPlayerTournamentDTO t : dto.getTournaments()) {
                if (t.getName() != null && !t.getName().trim().isEmpty()) {
                    StarPlayerTournament tr = new StarPlayerTournament();
                    tr.setPlayer(entity);
                    tr.setName(t.getName());
                    tr.setMonth(t.getMonth() != null ? t.getMonth() : "");
                    tr.setYear(t.getYear() != null ? t.getYear() : "");
                    tr.setRuns(t.getRuns() != null ? t.getRuns() : 0);
                    tr.setWickets(t.getWickets() != null ? t.getWickets() : 0);
                    tr.setMatches(t.getMatches() != null ? t.getMatches() : 0);
                    entity.getTournaments().add(tr);
                    log.info("Added tournament: {} - {} {}", t.getName(), t.getMonth(), t.getYear());
                }
            }
        } else {
            log.info("No tournaments to process for player");
        }
    }

    private StarPlayerDTO toDTO(StarPlayer p) {
        StarPlayerDTO dto = new StarPlayerDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setPhotoUrl(p.getPhotoUrl());
        dto.setAchievements(new ArrayList<>(p.getAchievements()));
        dto.setPlayerType(new ArrayList<>(p.getPlayerType()));
        dto.setRepresents(new ArrayList<>(p.getRepresents()));
        dto.setSortOrder(p.getSortOrder());
        List<StarPlayerDTO.StarPlayerYearStatDTO> stats = new ArrayList<>();
        for (StarPlayerStat st : p.getStats()) {
            StarPlayerDTO.StarPlayerYearStatDTO s = new StarPlayerDTO.StarPlayerYearStatDTO();
            s.setYear(st.getYear());
            s.setRuns(st.getRuns());
            s.setWickets(st.getWickets());
            s.setMatches(st.getMatches());
            // Set new metrics
            s.setCenturies(st.getCenturies());
            s.setHalfCenturies(st.getHalfCenturies());
            s.setStrikeRate(st.getStrikeRate());
            s.setEconomyRate(st.getEconomyRate());
            s.setAverage(st.getAverage());
            stats.add(s);
        }
        dto.setStats(stats);
        List<StarPlayerDTO.StarPlayerTournamentDTO> tournaments = new ArrayList<>();
        if (p.getTournaments() != null) {
            for (StarPlayerTournament tr : p.getTournaments()) {
                if (tr != null && tr.getName() != null && !tr.getName().trim().isEmpty()) {
                    StarPlayerDTO.StarPlayerTournamentDTO t = new StarPlayerDTO.StarPlayerTournamentDTO();
                    t.setName(tr.getName());
                    t.setMonth(tr.getMonth());
                    t.setYear(tr.getYear());
                    t.setRuns(tr.getRuns());
                    t.setWickets(tr.getWickets());
                    t.setMatches(tr.getMatches());
                    tournaments.add(t);
                }
            }
        }
        dto.setTournaments(tournaments);
        log.debug("Converted {} tournaments for player {}", tournaments.size(), p.getName());
        return dto;
    }

    // ---- Facilities ----
    @Transactional(readOnly = true)
    public List<FacilityItemDTO> listFacilities() {
        return facilityItemRepository.findAllByOrderBySortOrderAscIdAsc().stream().map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public FacilityItemDTO createFacility(FacilityItemDTO dto) {
        FacilityItem entity = new FacilityItem();
        apply(dto, entity);
        return toDTO(facilityItemRepository.save(entity));
    }

    @Transactional
    public FacilityItemDTO updateFacility(Long id, FacilityItemDTO dto) {
        FacilityItem entity = facilityItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found"));
        entity.getFeatures().clear();
        apply(dto, entity);
        return toDTO(facilityItemRepository.save(entity));
    }

    @Transactional
    public void deleteFacility(Long id) {
        facilityItemRepository.deleteById(id);
    }

    private void apply(FacilityItemDTO dto, FacilityItem entity) {
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setImageUrl(dto.getImageUrl());
        entity.setFeatures(dto.getFeatures() != null ? new ArrayList<>(dto.getFeatures()) : new ArrayList<>());
        entity.setSortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0);
    }

    private FacilityItemDTO toDTO(FacilityItem f) {
        FacilityItemDTO dto = new FacilityItemDTO();
        dto.setId(f.getId());
        dto.setTitle(f.getTitle());
        dto.setDescription(f.getDescription());
        dto.setImageUrl(f.getImageUrl());
        dto.setFeatures(new ArrayList<>(f.getFeatures()));
        dto.setSortOrder(f.getSortOrder());
        return dto;
    }

    // ---- Hero Image ----
    @Transactional(readOnly = true)
    public String getHeroImageUrl() {
        List<com.cricketacademy.api.entity.HeroImage> images = heroImageRepository.findAll();
        if (images.isEmpty()) {
            return null;
        }
        // Return the first (and typically only) hero image
        return images.get(0).getImageUrl();
    }

    @Transactional
    public void setHeroImageUrl(String imageUrl) {
        List<com.cricketacademy.api.entity.HeroImage> images = heroImageRepository.findAll();
        com.cricketacademy.api.entity.HeroImage heroImage;

        if (images.isEmpty()) {
            // Create new hero image entry
            heroImage = new com.cricketacademy.api.entity.HeroImage();
        } else {
            // Update existing hero image entry
            heroImage = images.get(0);
        }

        heroImage.setImageUrl(imageUrl);
        heroImageRepository.save(heroImage);
    }

    @Transactional
    public void deleteHeroImage() {
        List<com.cricketacademy.api.entity.HeroImage> images = heroImageRepository.findAll();
        if (!images.isEmpty()) {
            heroImageRepository.delete(images.get(0));
        }
    }

    /**
     * Seed default homepage content (players, facilities, and hero image) if tables
     * are
     * empty.
     * This is idempotent and will no-op if data already exists.
     */
    @Transactional
    public void seedDefaultsIfEmpty() {
        if (starPlayerRepository.count() > 0 || facilityItemRepository.count() > 0) {
            return; // already seeded
        }

        // ---- Default Hero Image ----
        if (heroImageRepository.count() == 0) {
            com.cricketacademy.api.entity.HeroImage heroImage = new com.cricketacademy.api.entity.HeroImage();
            heroImage.setImageUrl(
                    "https://drive.google.com/drive/folders/12yu1Q0A8o8oylAVVc_C68UcG8iciMinx");
            heroImageRepository.save(heroImage);
        }

        // ---- Default Star Players ----
        List<StarPlayerDTO> players = new ArrayList<>();

        StarPlayerDTO p1 = new StarPlayerDTO();
        p1.setName("Rahul Sharma");
        p1.setPhotoUrl(
                "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=300");
        p1.setAchievements(java.util.List.of("State Player", "Best Batsman 2023", "500+ Matches"));
        p1.setPlayerType(java.util.List.of("STATE"));
        p1.setRepresents(java.util.List.of("Tamil Nadu", "South Zone"));
        p1.setSortOrder(0);
        java.util.List<StarPlayerDTO.StarPlayerYearStatDTO> p1Stats = new ArrayList<>();
        {
            StarPlayerDTO.StarPlayerYearStatDTO s = new StarPlayerDTO.StarPlayerYearStatDTO();
            s.setYear("2021");
            s.setRuns(1200);
            s.setWickets(5);
            s.setMatches(25);
            p1Stats.add(s);
        }
        {
            StarPlayerDTO.StarPlayerYearStatDTO s = new StarPlayerDTO.StarPlayerYearStatDTO();
            s.setYear("2022");
            s.setRuns(1450);
            s.setWickets(8);
            s.setMatches(28);
            p1Stats.add(s);
        }
        {
            StarPlayerDTO.StarPlayerYearStatDTO s = new StarPlayerDTO.StarPlayerYearStatDTO();
            s.setYear("2023");
            s.setRuns(1650);
            s.setWickets(12);
            s.setMatches(32);
            p1Stats.add(s);
        }
        p1.setStats(p1Stats);
        players.add(p1);

        StarPlayerDTO p2 = new StarPlayerDTO();
        p2.setName("Priya Patel");
        p2.setPhotoUrl(
                "https://images.pexels.com/photos/3621227/pexels-photo-3621227.jpeg?auto=compress&cs=tinysrgb&w=300");
        p2.setAchievements(java.util.List.of("National Player", "Best Bowler 2022", "300+ Wickets"));
        p2.setPlayerType(java.util.List.of("NATIONAL"));
        p2.setRepresents(java.util.List.of("India", "Tamil Nadu"));
        p2.setSortOrder(1);
        java.util.List<StarPlayerDTO.StarPlayerYearStatDTO> p2Stats = new ArrayList<>();
        {
            StarPlayerDTO.StarPlayerYearStatDTO s = new StarPlayerDTO.StarPlayerYearStatDTO();
            s.setYear("2021");
            s.setRuns(800);
            s.setWickets(45);
            s.setMatches(22);
            p2Stats.add(s);
        }
        {
            StarPlayerDTO.StarPlayerYearStatDTO s = new StarPlayerDTO.StarPlayerYearStatDTO();
            s.setYear("2022");
            s.setRuns(950);
            s.setWickets(52);
            s.setMatches(25);
            p2Stats.add(s);
        }
        {
            StarPlayerDTO.StarPlayerYearStatDTO s = new StarPlayerDTO.StarPlayerYearStatDTO();
            s.setYear("2023");
            s.setRuns(1100);
            s.setWickets(48);
            s.setMatches(28);
            p2Stats.add(s);
        }
        p2.setStats(p2Stats);
        players.add(p2);

        StarPlayerDTO p3 = new StarPlayerDTO();
        p3.setName("Arjun Singh");
        p3.setPhotoUrl(
                "https://images.pexels.com/photos/3621227/pexels-photo-3621227.jpeg?auto=compress&cs=tinysrgb&w=300");
        p3.setAchievements(java.util.List.of("District Captain", "All-rounder 2023", "200+ Matches"));
        p3.setPlayerType(java.util.List.of("DISTRICT_LEAGUE"));
        p3.setRepresents(java.util.List.of("Chennai District", "TNCA"));
        p3.setSortOrder(2);
        java.util.List<StarPlayerDTO.StarPlayerYearStatDTO> p3Stats = new ArrayList<>();
        {
            StarPlayerDTO.StarPlayerYearStatDTO s = new StarPlayerDTO.StarPlayerYearStatDTO();
            s.setYear("2021");
            s.setRuns(1000);
            s.setWickets(25);
            s.setMatches(20);
            p3Stats.add(s);
        }
        {
            StarPlayerDTO.StarPlayerYearStatDTO s = new StarPlayerDTO.StarPlayerYearStatDTO();
            s.setYear("2022");
            s.setRuns(1300);
            s.setWickets(30);
            s.setMatches(24);
            p3Stats.add(s);
        }
        {
            StarPlayerDTO.StarPlayerYearStatDTO s = new StarPlayerDTO.StarPlayerYearStatDTO();
            s.setYear("2023");
            s.setRuns(1500);
            s.setWickets(35);
            s.setMatches(26);
            p3Stats.add(s);
        }
        p3.setStats(p3Stats);
        players.add(p3);

        for (int i = 0; i < players.size(); i++) {
            StarPlayerDTO dto = players.get(i);
            dto.setSortOrder(i);
            createPlayer(dto);
        }

        // ---- Default Facilities ----
        java.util.List<FacilityItemDTO> facilities = new ArrayList<>();

        FacilityItemDTO f1 = new FacilityItemDTO();
        f1.setTitle("Professional Grounds");
        f1.setDescription("Multiple well-maintained cricket grounds with modern facilities");
        f1.setImageUrl(
                "https://images.pexels.com/photos/3621227/pexels-photo-3621227.jpeg?auto=compress&cs=tinysrgb&w=400");
        f1.setFeatures(java.util.List.of("3 Match Grounds", "Professional Pitch", "Floodlights"));
        f1.setSortOrder(0);
        facilities.add(f1);

        FacilityItemDTO f2 = new FacilityItemDTO();
        f2.setTitle("Practice Nets");
        f2.setDescription("State-of-the-art practice nets for skill development");
        f2.setImageUrl(
                "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400");
        f2.setFeatures(java.util.List.of("10 Practice Nets", "Bowling Machines", "Video Analysis"));
        f2.setSortOrder(1);
        facilities.add(f2);

        FacilityItemDTO f3 = new FacilityItemDTO();
        f3.setTitle("Modern Equipment");
        f3.setDescription("Latest cricket equipment and training aids available");
        f3.setImageUrl(
                "https://images.pexels.com/photos/3621227/pexels-photo-3621227.jpeg?auto=compress&cs=tinysrgb&w=400");
        f3.setFeatures(java.util.List.of("Premium Bats", "Safety Gear", "Training Equipment"));
        f3.setSortOrder(2);
        facilities.add(f3);

        for (int i = 0; i < facilities.size(); i++) {
            FacilityItemDTO dto = facilities.get(i);
            dto.setSortOrder(i);
            createFacility(dto);
        }
    }
}