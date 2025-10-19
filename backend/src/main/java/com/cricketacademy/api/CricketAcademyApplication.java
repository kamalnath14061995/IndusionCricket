package com.cricketacademy.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

/**
 * Main Spring Boot Application class for Cricket Academy API
 * This class serves as the entry point for the application
 */
@SpringBootApplication
@EnableConfigurationProperties
@EnableJpaRepositories(basePackages = "com.cricketacademy.api.repository")
@EntityScan(basePackages = "com.cricketacademy.api.entity")
public class CricketAcademyApplication {

    public static void main(String[] args) {
        SpringApplication.run(CricketAcademyApplication.class, args);
    }
}
