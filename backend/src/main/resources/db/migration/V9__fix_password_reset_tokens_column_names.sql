-- Fix column names in password_reset_tokens table to match entity
-- This migration handles the transition from legacy column names to new ones

-- Create the table with correct schema if it doesn't exist
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(100) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    used TINYINT(1) NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_prt_token (token),
    INDEX idx_prt_user (user_id),
    INDEX idx_prt_expires_at (expires_at)
);

-- Drop any conflicting columns that might exist using MySQL compatible syntax
-- We need to check if columns exist before dropping them

-- Drop expiry_date column if it exists
SET @column_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
                      WHERE TABLE_SCHEMA = DATABASE() 
                      AND TABLE_NAME = 'password_reset_tokens' 
                      AND COLUMN_NAME = 'expiry_date');
SET @sql = IF(@column_exists > 0, 
              'ALTER TABLE password_reset_tokens DROP COLUMN expiry_date', 
              'SELECT ''Column expiry_date does not exist''');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop expired_date column if it exists
SET @column_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
                      WHERE TABLE_SCHEMA = DATABASE() 
                      AND TABLE_NAME = 'password_reset_tokens' 
                      AND COLUMN_NAME = 'expired_date');
SET @sql = IF(@column_exists > 0, 
              'ALTER TABLE password_reset_tokens DROP COLUMN expired_date', 
              'SELECT ''Column expired_date does not exist''');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop expired_at column if it exists
SET @column_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
                      WHERE TABLE_SCHEMA = DATABASE() 
                      AND TABLE_NAME = 'password_reset_tokens' 
                      AND COLUMN_NAME = 'expired_at');
SET @sql = IF(@column_exists > 0, 
              'ALTER TABLE password_reset_tokens DROP COLUMN expired_at', 
              'SELECT ''Column expired_at does not exist''');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ensure expires_at is NOT NULL
ALTER TABLE password_reset_tokens 
MODIFY COLUMN expires_at DATETIME NOT NULL;

-- Ensure used column exists with proper default
ALTER TABLE password_reset_tokens 
MODIFY COLUMN used TINYINT(1) NOT NULL DEFAULT 0;

-- Ensure used_at column allows NULL
ALTER TABLE password_reset_tokens 
MODIFY COLUMN used_at DATETIME NULL;
