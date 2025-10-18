-- Manual Fix for Failed Flyway Migration V16
-- Execute these commands in MySQL Workbench or MySQL CLI

-- Step 1: Check current state
USE cricket_academy;

-- Check the failed migration
SELECT version, description, script, success, installed_on 
FROM flyway_schema_history 
WHERE version = '16';

-- Check if tables already exist
SHOW TABLES LIKE '%program%';
SHOW TABLES LIKE '%coach%';

-- Step 2: Backup existing data (if any)
CREATE TABLE IF NOT EXISTS available_programs_backup LIKE available_programs;
CREATE TABLE IF NOT EXISTS expert_coaches_backup LIKE expert_coaches;
CREATE TABLE IF NOT EXISTS program_coaches_backup LIKE program_coaches;

-- Step 3: Drop existing tables if they exist (only if empty or corrupted)
-- WARNING: This will delete existing data in these tables
-- Only run these if you're sure it's safe
-- DROP TABLE IF EXISTS program_coaches;
-- DROP TABLE IF EXISTS expert_coaches;
-- DROP TABLE IF EXISTS available_programs;

-- Step 4: Mark migration as failed so it can be retried
UPDATE flyway_schema_history 
SET success = 0 
WHERE version = '16';

-- Alternative: Remove the failed migration record entirely
-- DELETE FROM flyway_schema_history 
-- WHERE version = '16';

-- Step 5: Create tables manually (if migration continues to fail)
CREATE TABLE IF NOT EXISTS available_programs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    program_name VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    level VARCHAR(50),
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS expert_coaches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    specialization VARCHAR(255),
    experience_years INTEGER,
    certifications TEXT,
    bio TEXT,
    profile_image_url VARCHAR(500),
    hourly_rate DECIMAL(10,2),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS program_coaches (
    program_id BIGINT NOT NULL,
    coach_id BIGINT NOT NULL,
    PRIMARY KEY (program_id, coach_id),
    FOREIGN KEY (program_id) REFERENCES available_programs(id) ON DELETE CASCADE,
    FOREIGN KEY (coach_id) REFERENCES expert_coaches(id) ON DELETE CASCADE
);

-- Step 6: Create indexes
CREATE INDEX IF NOT EXISTS idx_programs_active ON available_programs(is_active);
CREATE INDEX IF NOT EXISTS idx_coaches_available ON expert_coaches(is_available);
CREATE INDEX IF NOT EXISTS idx_coaches_email ON expert_coaches(email);

-- Step 7: Manually mark migration as successful (if tables created manually)
-- Only run this if you've manually created the tables
/*
INSERT INTO flyway_schema_history (version, description, script, checksum, installed_by, installed_on, execution_time, success)
VALUES ('16', 'create available programs table', 'V16__create_available_programs_table.sql', 123456789, 'root', NOW(), 100, 1)
ON DUPLICATE KEY UPDATE success = 1;
*/

-- Step 8: Verify the fix
SELECT version, description, success, installed_on 
FROM flyway_schema_history 
WHERE version = '16';

SHOW TABLES;
<environment_details>
# VSCode Visible Files
backend/src/main/java/com/cricketacademy/api/exception/GlobalExceptionHandler.java

# VSCode Open Tabs
backend/src/main/java/com/cricketacademy/api/exception/GlobalExceptionHandler.java
</environment_details>
