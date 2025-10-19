package com.cricketacademy.api.config;

import com.cricketacademy.api.service.AvailableProgramService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Data initializer to set up suggested coaching programs on application startup
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final AvailableProgramService programService;

    @Override
    public void run(String... args) throws Exception {
        try {
            log.info("Initializing suggested coaching programs...");
            programService.initializeSuggestedPrograms();
            log.info("Suggested coaching programs initialized successfully");
        } catch (Exception e) {
            log.error("Failed to initialize suggested coaching programs", e);
        }
    }
}