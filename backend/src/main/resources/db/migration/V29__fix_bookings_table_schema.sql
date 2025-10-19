-- Fix bookings table schema after failed V27 migration
-- This migration handles the transition from facility-based to ground-based booking system
-- It is idempotent and handles partial states

-- Step 1: Check current table structure and apply fixes conditionally

-- Check if we need to add ground columns (only if they don't exist)
SELECT CASE 
    WHEN NOT EXISTS (
        SELECT 1 FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'bookings' 
        AND COLUMN_NAME = 'ground_id'
    ) THEN
        'ALTER TABLE bookings ADD COLUMN ground_id VARCHAR(50) NOT NULL'
    ELSE
        'SELECT ''ground_id column already exists'''
END INTO @add_ground_id_sql;

PREPARE stmt1 FROM @add_ground_id_sql;
EXECUTE stmt1;
DEALLOCATE PREPARE stmt1;

SELECT CASE 
    WHEN NOT EXISTS (
        SELECT 1 FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'bookings' 
        AND COLUMN_NAME = 'ground_name'
    ) THEN
        'ALTER TABLE bookings ADD COLUMN ground_name VARCHAR(100) NOT NULL'
    ELSE
        'SELECT ''ground_name column already exists'''
END INTO @add_ground_name_sql;

PREPARE stmt2 FROM @add_ground_name_sql;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

SELECT CASE 
    WHEN NOT EXISTS (
        SELECT 1 FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'bookings' 
        AND COLUMN_NAME = 'ground_description'
    ) THEN
        'ALTER TABLE bookings ADD COLUMN ground_description TEXT'
    ELSE
        'SELECT ''ground_description column already exists'''
END INTO @add_ground_desc_sql;

PREPARE stmt3 FROM @add_ground_desc_sql;
EXECUTE stmt3;
DEALLOCATE PREPARE stmt3;

-- Step 2: Migrate data from facility columns to ground columns (only if facility columns exist)
SELECT CASE 
    WHEN EXISTS (
        SELECT 1 FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'bookings' 
        AND COLUMN_NAME = 'facility_id'
    ) THEN
        'UPDATE bookings SET ground_id = facility_id, ground_name = facility_name, ground_description = CONCAT(''Facility: '', facility_name)'
    ELSE
        'SELECT ''No facility columns to migrate from'''
END INTO @migrate_data_sql;

PREPARE stmt4 FROM @migrate_data_sql;
EXECUTE stmt4;
DEALLOCATE PREPARE stmt4;

-- Step 3: Drop facility columns (only if they exist)
SELECT CASE 
    WHEN EXISTS (
        SELECT 1 FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'bookings' 
        AND COLUMN_NAME = 'facility_id'
    ) THEN
        'ALTER TABLE bookings DROP COLUMN facility_id'
    ELSE
        'SELECT ''facility_id column does not exist'''
END INTO @drop_facility_id_sql;

PREPARE stmt5 FROM @drop_facility_id_sql;
EXECUTE stmt5;
DEALLOCATE PREPARE stmt5;

SELECT CASE 
    WHEN EXISTS (
        SELECT 1 FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'bookings' 
        AND COLUMN_NAME = 'facility_name'
    ) THEN
        'ALTER TABLE bookings DROP COLUMN facility_name'
    ELSE
        'SELECT ''facility_name column does not exist'''
END INTO @drop_facility_name_sql;

PREPARE stmt6 FROM @drop_facility_name_sql;
EXECUTE stmt6;
DEALLOCATE PREPARE stmt6;

-- Step 4: Create indexes for new ground columns (idempotent)
SELECT CASE 
    WHEN NOT EXISTS (
        SELECT 1 FROM information_schema.statistics 
        WHERE table_schema = DATABASE() 
        AND table_name = 'bookings' 
        AND index_name = 'idx_ground_id'
    ) THEN
        'CREATE INDEX idx_ground_id ON bookings(ground_id)'
    ELSE
        'SELECT ''idx_ground_id already exists'''
END INTO @create_idx_ground_id_sql;

PREPARE stmt7 FROM @create_idx_ground_id_sql;
EXECUTE stmt7;
DEALLOCATE PREPARE stmt7;

SELECT CASE 
    WHEN NOT EXISTS (
        SELECT 1 FROM information_schema.statistics 
        WHERE table_schema = DATABASE() 
        AND table_name = 'bookings' 
        AND index_name = 'idx_ground_name'
    ) THEN
        'CREATE INDEX idx_ground_name ON bookings(ground_name)'
    ELSE
        'SELECT ''idx_ground_name already exists'''
END INTO @create_idx_ground_name_sql;

PREPARE stmt8 FROM @create_idx_ground_name_sql;
EXECUTE stmt8;
DEALLOCATE PREPARE stmt8;

-- Step 5: Clean up old indexes (idempotent)
SELECT CASE 
    WHEN EXISTS (
        SELECT 1 FROM information_schema.statistics 
        WHERE table_schema = DATABASE() 
        AND table_name = 'bookings' 
        AND index_name = 'idx_facility_id'
    ) THEN
        'DROP INDEX idx_facility_id ON bookings'
    ELSE
        'SELECT ''idx_facility_id does not exist'''
END INTO @drop_idx_facility_id_sql;

PREPARE stmt9 FROM @drop_idx_facility_id_sql;
EXECUTE stmt9;
DEALLOCATE PREPARE stmt9;

SELECT CASE 
    WHEN EXISTS (
        SELECT 1 FROM information_schema.statistics 
        WHERE table_schema = DATABASE() 
        AND table_name = 'bookings' 
        AND index_name = 'idx_facility_name'
    ) THEN
        'DROP INDEX idx_facility_name ON bookings'
    ELSE
        'SELECT ''idx_facility_name does not exist'''
END INTO @drop_idx_facility_name_sql;

PREPARE stmt10 FROM @drop_idx_facility_name_sql;
EXECUTE stmt10;
DEALLOCATE PREPARE stmt10;

-- Ensure ground_id and ground_name have default values for existing records
UPDATE bookings 
SET ground_id = COALESCE(ground_id, 'unknown'),
    ground_name = COALESCE(ground_name, 'Unknown Ground')
WHERE ground_id IS NULL OR ground_name IS NULL;
