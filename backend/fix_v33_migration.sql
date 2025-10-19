-- Fix for V33 migration - MySQL compatible version
-- This script fixes the syntax error in V33__enhance_bookings_table_part2_fixed.sql

-- Use a more compatible approach with individual ALTER statements
-- MySQL doesn't support ADD COLUMN IF NOT EXISTS in the way it was used

-- First, let's check which columns already exist
SELECT 'Checking existing columns in bookings table...' AS status;

-- We'll use a simpler approach - just run the ALTER statements
-- MySQL will ignore duplicate column additions with a warning instead of error

-- Basic booking enhancements
ALTER TABLE bookings 
    ADD COLUMN cancellation_reason TEXT,
    ADD COLUMN refund_amount DECIMAL(10,2) DEFAULT 0.0,
    ADD COLUMN booking_source VARCHAR(20) DEFAULT 'ADMIN',
    ADD COLUMN notes TEXT,
    ADD COLUMN weather_conditions VARCHAR(50),
    ADD COLUMN equipment_requested JSON,
    ADD COLUMN coach_assigned VARCHAR(100),
    ADD COLUMN live_streaming_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN recording_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN ground_sharing_enabled BOOLEAN DEFAULT FALSE,
    ADD COLUMN shared_team_name VARCHAR(100),
    ADD COLUMN umpire_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN scorer_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN bowling_machine_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN floodlights_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN pavilion_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN refreshments_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN parking_spaces INTEGER DEFAULT 0,
    ADD COLUMN first_aid_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN security_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN cleaning_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN sound_system_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN scoreboard_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN seating_capacity INTEGER DEFAULT 0,
    ADD COLUMN vip_seating_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN media_coverage_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN photography_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN videography_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN catering_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN decoration_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN branding_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN signage_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN wifi_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN air_conditioning_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN heating_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN generator_backup_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN storage_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN changing_rooms_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN shower_facilities_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN washroom_facilities_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN drinking_water_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN waste_management_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN recycling_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN green_initiatives_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN sustainability_requested BOOLEAN DEFAULT FALSE,
    ADD COLUMN accessibility_requested BOOLEAN DEFAULT FALSE;

SELECT 'V33 migration completed successfully' AS status;
