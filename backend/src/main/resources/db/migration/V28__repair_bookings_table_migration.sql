-- Repair migration for failed V27
-- This migration fixes the failed V27 migration by handling edge cases and ensuring idempotency

-- Check if we need to repair the bookings table structure
-- This migration handles three possible states:
-- 1. V27 never ran (facility_* columns exist)
-- 2. V27 partially ran (some ground_* columns exist, some facility_* columns exist)
-- 3. V27 failed after dropping facility_* columns but before completing

-- Step 1: Check current table structure and act accordingly
DELIMITER $$

CREATE PROCEDURE repair_bookings_table()
BEGIN
    DECLARE facility_id_exists INT DEFAULT 0;
    DECLARE facility_name_exists INT DEFAULT 0;
    DECLARE ground_id_exists INT DEFAULT 0;
    DECLARE ground_name_exists INT DEFAULT 0;
    
    -- Check which columns exist
    SELECT COUNT(*) INTO facility_id_exists
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'bookings' 
    AND COLUMN_NAME = 'facility_id';
    
    SELECT COUNT(*) INTO facility_name_exists
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'bookings' 
    AND COLUMN_NAME = 'facility_name';
    
    SELECT COUNT(*) INTO ground_id_exists
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'bookings' 
    AND COLUMN_NAME = 'ground_id';
    
    SELECT COUNT(*) INTO ground_name_exists
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'bookings' 
    AND COLUMN_NAME = 'ground_name';
    
    -- Case 1: Both facility columns exist and ground columns don't exist
    IF facility_id_exists > 0 AND facility_name_exists > 0 AND ground_id_exists = 0 AND ground_name_exists = 0 THEN
        -- Add new ground columns
        ALTER TABLE bookings 
        ADD COLUMN ground_id VARCHAR(50) NOT NULL,
        ADD COLUMN ground_name VARCHAR(100) NOT NULL,
        ADD COLUMN ground_description TEXT;
        
        -- Copy data from facility to ground columns
        UPDATE bookings 
        SET ground_id = facility_id,
            ground_name = facility_name,
            ground_description = CONCAT('Facility: ', facility_name);
        
        -- Drop old facility columns
        ALTER TABLE bookings 
        DROP COLUMN facility_id,
        DROP COLUMN facility_name;
        
    -- Case 2: Mixed state - some columns exist
    ELSEIF facility_id_exists > 0 OR facility_name_exists > 0 THEN
        -- Add missing ground columns if they don't exist
        IF ground_id_exists = 0 THEN
            ALTER TABLE bookings ADD COLUMN ground_id VARCHAR(50) NOT NULL;
        END IF;
        
        IF ground_name_exists = 0 THEN
            ALTER TABLE bookings ADD COLUMN ground_name VARCHAR(100) NOT NULL;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS 
                      WHERE TABLE_SCHEMA = DATABASE() 
                      AND TABLE_NAME = 'bookings' 
                      AND COLUMN_NAME = 'ground_description') THEN
            ALTER TABLE bookings ADD COLUMN ground_description TEXT;
        END IF;
        
        -- Copy data from facility to ground columns
        UPDATE bookings 
        SET ground_id = facility_id,
            ground_name = facility_name,
            ground_description = CONCAT('Facility: ', facility_name)
        WHERE facility_id IS NOT NULL AND facility_name IS NOT NULL;
        
        -- Drop facility columns
        IF facility_id_exists > 0 THEN
            ALTER TABLE bookings DROP COLUMN facility_id;
        END IF;
        
        IF facility_name_exists > 0 THEN
            ALTER TABLE bookings DROP COLUMN facility_name;
        END IF;
        
    -- Case 3: Ground columns exist but might need fixing
    ELSEIF ground_id_exists > 0 AND ground_name_exists > 0 THEN
        -- Ensure ground_description exists
        IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS 
                      WHERE TABLE_SCHEMA = DATABASE() 
                      AND TABLE_NAME = 'bookings' 
                      AND COLUMN_NAME = 'ground_description') THEN
            ALTER TABLE bookings ADD COLUMN ground_description TEXT;
        END IF;
    END IF;
    
    -- Ensure proper indexes exist
    -- Drop old indexes if they exist
    SET @exist := (SELECT COUNT(*) FROM information_schema.statistics 
                   WHERE table_schema = DATABASE() 
                   AND table_name = 'bookings' 
                   AND index_name = 'idx_facility_id');
    SET @sqlstmt := IF(@exist > 0, 'DROP INDEX idx_facility_id ON bookings', 'SELECT ''Index does not exist''');
    PREPARE stmt FROM @sqlstmt;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
    SET @exist := (SELECT COUNT(*) FROM information_schema.statistics 
                   WHERE table_schema = DATABASE() 
                   AND table_name = 'bookings' 
                   AND index_name = 'idx_facility_name');
    SET @sqlstmt := IF(@exist > 0, 'DROP INDEX idx_facility_name ON bookings', 'SELECT ''Index does not exist''');
    PREPARE stmt FROM @sqlstmt;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
    -- Create new indexes if they don't exist
    SET @exist := (SELECT COUNT(*) FROM information_schema.statistics 
                   WHERE table_schema = DATABASE() 
                   AND table_name = 'bookings' 
                   AND index_name = 'idx_ground_id');
    IF @exist = 0 THEN
        CREATE INDEX idx_ground_id ON bookings(ground_id);
    END IF;
    
    SET @exist := (SELECT COUNT(*) FROM information_schema.statistics 
                   WHERE table_schema = DATABASE() 
                   AND table_name = 'bookings' 
                   AND index_name = 'idx_ground_name');
    IF @exist = 0 THEN
        CREATE INDEX idx_ground_name ON bookings(ground_name);
    END IF;
    
END$$

DELIMITER ;

-- Execute the repair procedure
CALL repair_bookings_table();

-- Drop the procedure after use
DROP PROCEDURE IF EXISTS repair_bookings_table;
