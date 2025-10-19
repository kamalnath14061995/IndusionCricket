-- V33 Part 2: Enhanced booking features - Idempotent & MySQL-compatible
-- This script conditionally adds each column using prepared statements so it can be re-run safely
-- Works with MySQL 5.7+ and 8.0+

-- Helper pattern per column:
--   1) Check information_schema for existence
--   2) Build DDL only if missing
--   3) Execute via PREPARE/EXECUTE

-- refund_amount
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'refund_amount');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN refund_amount DECIMAL(10,2) DEFAULT 0.0', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- booking_source
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'booking_source');
SET @ddl := IF(@col_exists = 0,
  "ALTER TABLE bookings ADD COLUMN booking_source VARCHAR(20) DEFAULT 'ADMIN'", 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- notes
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'notes');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN notes TEXT', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- weather_conditions
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'weather_conditions');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN weather_conditions VARCHAR(50)', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- equipment_requested (JSON)
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'equipment_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN equipment_requested JSON', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- coach_assigned
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'coach_assigned');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN coach_assigned VARCHAR(100)', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- live_streaming_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'live_streaming_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN live_streaming_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- recording_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'recording_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN recording_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ground_sharing_enabled
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'ground_sharing_enabled');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN ground_sharing_enabled BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- shared_team_name
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'shared_team_name');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN shared_team_name VARCHAR(100)', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- umpire_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'umpire_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN umpire_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- scorer_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'scorer_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN scorer_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- bowling_machine_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'bowling_machine_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN bowling_machine_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- floodlights_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'floodlights_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN floodlights_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- pavilion_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'pavilion_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN pavilion_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- refreshments_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'refreshments_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN refreshments_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- parking_spaces
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'parking_spaces');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN parking_spaces INTEGER DEFAULT 0', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- first_aid_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'first_aid_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN first_aid_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- security_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'security_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN security_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- cleaning_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'cleaning_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN cleaning_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- sound_system_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'sound_system_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN sound_system_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- scoreboard_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'scoreboard_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN scoreboard_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- seating_capacity
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'seating_capacity');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN seating_capacity INTEGER DEFAULT 0', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- vip_seating_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'vip_seating_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN vip_seating_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- media_coverage_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'media_coverage_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN media_coverage_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- photography_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'photography_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN photography_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- videography_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'videography_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN videography_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- catering_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'catering_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN catering_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- decoration_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'decoration_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN decoration_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- branding_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'branding_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN branding_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- signage_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'signage_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN signage_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- wifi_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'wifi_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN wifi_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- air_conditioning_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'air_conditioning_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN air_conditioning_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- heating_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'heating_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN heating_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- generator_backup_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'generator_backup_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN generator_backup_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- storage_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'storage_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN storage_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- changing_rooms_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'changing_rooms_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN changing_rooms_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- shower_facilities_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'shower_facilities_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN shower_facilities_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- washroom_facilities_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'washroom_facilities_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN washroom_facilities_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- drinking_water_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'drinking_water_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN drinking_water_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- waste_management_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'waste_management_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN waste_management_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- recycling_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'recycling_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN recycling_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- green_initiatives_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'green_initiatives_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN green_initiatives_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- sustainability_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'sustainability_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN sustainability_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- accessibility_requested
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'accessibility_requested');
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN accessibility_requested BOOLEAN DEFAULT FALSE', 'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;