-- Manual fix for failed Flyway migration V30
-- Run this script to repair the database and skip the failed migration

-- Step 1: Check current state of flyway_schema_history
SELECT * FROM cricket_academy.flyway_schema_history WHERE version = '30';

-- Step 2: If V30 is marked as failed, update its status
UPDATE cricket_academy.flyway_schema_history 
SET success = 1, checksum = -1 
WHERE version = '30' AND success = 0;

-- Step 3: If V30 doesn't exist, insert it as successful
INSERT IGNORE INTO cricket_academy.flyway_schema_history 
(version, description, type, script, checksum, installed_by, execution_time, success)
VALUES 
('30', 'enhance bookings table', 'SQL', 'V30__enhance_bookings_table.sql', -1, 'root', 0, 1);

-- Step 4: Manually add the essential columns from V30
-- Check if columns already exist before adding
SELECT COUNT(*) as column_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'cricket_academy' 
AND TABLE_NAME = 'bookings' 
AND COLUMN_NAME = 'booking_category';

-- Add essential columns only if they don't exist
ALTER TABLE cricket_academy.bookings 
ADD COLUMN IF NOT EXISTS booking_category VARCHAR(50) DEFAULT 'STANDARD',
ADD COLUMN IF NOT EXISTS duration_type VARCHAR(20) DEFAULT 'HOURLY',
ADD COLUMN IF NOT EXISTS total_hours DECIMAL(4,2) DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS team_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS number_of_players INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS special_requirements TEXT,
ADD COLUMN IF NOT EXISTS discount_applied DECIMAL(10,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS event_type VARCHAR(50) DEFAULT 'REGULAR',
ADD COLUMN IF NOT EXISTS booking_source VARCHAR(20) DEFAULT 'ADMIN',
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS confirmation_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS booking_confirmed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS booking_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS booking_cancelled BOOLEAN DEFAULT FALSE;

-- Step 5: Verify the fix
SELECT version, description, success, installed_on 
FROM cricket_academy.flyway_schema_history 
WHERE version IN ('30', '31', '32') 
ORDER BY version;
