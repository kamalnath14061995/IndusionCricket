package com.cricketacademy.api.controller;

import com.cricketacademy.api.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MigrationFixController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private DataSource dataSource;

    @GetMapping("/fix-migration")
    public ResponseEntity<String> fixMigration() {
        try {
            String result = performMigrationFix();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Migration fix failed: " + e.getMessage());
        }
    }

    @GetMapping("/migration-status")
    public ResponseEntity<Map<String, Object>> checkMigrationStatus() {
        Map<String, Object> status = checkCurrentMigrationStatus();
        return ResponseEntity.ok(status);
    }

    private String performMigrationFix() throws SQLException {
        StringBuilder result = new StringBuilder();

        try (Connection conn = dataSource.getConnection();
                Statement stmt = conn.createStatement()) {

            result.append("Starting migration fix...\n");

            // Check current table structure
            String checkQuery = """
                        SELECT
                            CASE WHEN EXISTS(SELECT 1 FROM information_schema.COLUMNS
                                WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'ground_id')
                                THEN 'EXISTS' ELSE 'MISSING' END as ground_id_status,
                            CASE WHEN EXISTS(SELECT 1 FROM information_schema.COLUMNS
                                WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'ground_name')
                                THEN 'EXISTS' ELSE 'MISSING' END as ground_name_status,
                            CASE WHEN EXISTS(SELECT 1 FROM information_schema.COLUMNS
                                WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'facility_id')
                                THEN 'EXISTS' ELSE 'MISSING' END as facility_id_status,
                            CASE WHEN EXISTS(SELECT 1 FROM information_schema.COLUMNS
                                WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'facility_name')
                                THEN 'EXISTS' ELSE 'MISSING' END as facility_name_status
                    """;

            Map<String, Object> status = jdbcTemplate.queryForMap(checkQuery);
            result.append("Current status: ").append(status).append("\n");

            // Apply fixes based on current state
            if ("MISSING".equals(status.get("ground_id_status"))) {
                stmt.execute("ALTER TABLE bookings ADD COLUMN ground_id VARCHAR(50) NOT NULL DEFAULT 'unknown'");
                result.append("Added ground_id column\n");
            }

            if ("MISSING".equals(status.get("ground_name_status"))) {
                stmt.execute(
                        "ALTER TABLE bookings ADD COLUMN ground_name VARCHAR(100) NOT NULL DEFAULT 'Unknown Ground'");
                result.append("Added ground_name column\n");
            }

            if ("MISSING".equals(status.get("facility_id_status"))) {
                stmt.execute("ALTER TABLE bookings ADD COLUMN facility_id VARCHAR(50)");
                result.append("Added facility_id column\n");
            }

            if ("MISSING".equals(status.get("facility_name_status"))) {
                stmt.execute("ALTER TABLE bookings ADD COLUMN facility_name VARCHAR(100)");
                result.append("Added facility_name column\n");
            }

            // Create indexes
            try {
                stmt.execute("CREATE INDEX idx_ground_id ON bookings(ground_id)");
                result.append("Created index idx_ground_id\n");
            } catch (Exception e) {
                result.append("Index idx_ground_id already exists or failed: ").append(e.getMessage()).append("\n");
            }

            try {
                stmt.execute("CREATE INDEX idx_ground_name ON bookings(ground_name)");
                result.append("Created index idx_ground_name\n");
            } catch (Exception e) {
                result.append("Index idx_ground_name already exists or failed: ").append(e.getMessage()).append("\n");
            }

            // Update any NULL values
            stmt.execute("UPDATE bookings SET ground_id = 'unknown' WHERE ground_id IS NULL OR ground_id = ''");
            stmt.execute(
                    "UPDATE bookings SET ground_name = 'Unknown Ground' WHERE ground_name IS NULL OR ground_name = ''");

            result.append("Migration fix completed successfully!\n");

            // Verify final structure
            List<Map<String, Object>> describeResult = jdbcTemplate.queryForList("DESCRIBE bookings");
            result.append("Final table structure:\n");
            describeResult.forEach(col -> {
                result.append(col.get("Field")).append(" - ").append(col.get("Type")).append("\n");
            });

            return result.toString();
        }
    }

    private Map<String, Object> checkCurrentMigrationStatus() {
        String query = """
                    SELECT
                        CASE WHEN EXISTS(SELECT 1 FROM information_schema.COLUMNS
                            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'ground_id')
                            THEN 'EXISTS' ELSE 'MISSING' END as ground_id_status,
                        CASE WHEN EXISTS(SELECT 1 FROM information_schema.COLUMNS
                            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'ground_name')
                            THEN 'EXISTS' ELSE 'MISSING' END as ground_name_status,
                        CASE WHEN EXISTS(SELECT 1 FROM information_schema.COLUMNS
                            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'facility_id')
                            THEN 'EXISTS' ELSE 'MISSING' END as facility_id_status,
                        CASE WHEN EXISTS(SELECT 1 FROM information_schema.COLUMNS
                            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'facility_name')
                            THEN 'EXISTS' ELSE 'MISSING' END as facility_name_status,
                        (SELECT COUNT(*) FROM flyway_schema_history WHERE script LIKE '%bookings%' AND success = 0) as failed_bookings_migrations
                """;

        return jdbcTemplate.queryForMap(query);
    }
}
