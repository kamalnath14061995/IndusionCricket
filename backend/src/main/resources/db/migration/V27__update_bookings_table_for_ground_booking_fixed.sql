-- Update bookings table to use ground-based booking instead of facility-based
-- This version handles duplicate column errors by checking existence first

-- Drop old indexes if they exist (MySQL 5.7 compatible approach)
SET @exist := (SELECT COUNT(*) FROM information_schema.statistics 
               WHERE table_schema = DATABASE() 
               AND table_name = 'bookings' 
               AND index_name = 'idx_facility_id');
SET @sqlstmt := IF(@exist > 0, 'DROP INDEX idx_facility_id ON bookings', 'SELECT ''Index does not exist''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop idx_facility_name if it exists
SET @exist := (SELECT COUNT(*) FROM information_schema.statistics 
               WHERE table_schema = DATABASE() 
               AND table_name = 'bookings' 
               AND index_name = 'idx_facility_name');
SET @sqlstmt := IF(@exist > 0, 'DROP INDEX idx_facility_name ON bookings', 'SELECT ''Index does not exist''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add new columns for ground booking only if they don't exist
SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'bookings' 
               AND COLUMN_NAME = 'ground_id');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE bookings ADD COLUMN ground_id VARCHAR(50) NOT NULL', 'SELECT ''ground_id already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'bookings' 
               AND COLUMN_NAME = 'ground_name');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE bookings ADD COLUMN ground_name VARCHAR(100) NOT NULL', 'SELECT ''ground_name already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'bookings' 
               AND COLUMN_NAME = 'ground_description');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE bookings ADD COLUMN ground_description TEXT', 'SELECT ''ground_description already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Copy existing facility data to ground columns (only if facility columns exist)
SET @facility_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS 
                         WHERE TABLE_SCHEMA = DATABASE() 
                         AND TABLE_NAME = 'bookings' 
                         AND COLUMN_NAME = 'facility_id');

-- Use dynamic SQL for the conditional update
SET @update_sql := IF(@facility_exists > 0, 
    'UPDATE bookings 
     SET ground_id = facility_id,
         ground_name = facility_name,
         ground_description = CONCAT(''Facility: '', facility_name)',
    'SELECT ''facility columns do not exist, skipping update''');
PREPARE stmt FROM @update_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop old facility columns (only if they exist)
SET @sqlstmt := IF(@facility_exists > 0, 'ALTER TABLE bookings DROP COLUMN facility_id', 'SELECT ''facility_id does not exist''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @facility_name_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS 
                              WHERE TABLE_SCHEMA = DATABASE() 
                              AND TABLE_NAME = 'bookings' 
                              AND COLUMN_NAME = 'facility_name');
SET @sqlstmt := IF(@facility_name_exists > 0, 'ALTER TABLE bookings DROP COLUMN facility_name', 'SELECT ''facility_name does not exist''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create indexes for new ground columns (only if they don't exist)
SET @exist := (SELECT COUNT(*) FROM information_schema.statistics 
               WHERE table_schema = DATABASE() 
               AND table_name = 'bookings' 
               AND index_name = 'idx_ground_id');
SET @sqlstmt := IF(@exist = 0, 'CREATE INDEX idx_ground_id ON bookings(ground_id)', 'SELECT ''idx_ground_id already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(*) FROM information_schema.statistics 
               WHERE table_schema = DATABASE() 
               AND table_name = 'bookings' 
               AND index_name = 'idx_ground_name');
SET @sqlstmt := IF(@exist = 0, 'CREATE INDEX idx_ground_name ON bookings(ground_name)', 'SELECT ''idx_ground_name already exists''');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
