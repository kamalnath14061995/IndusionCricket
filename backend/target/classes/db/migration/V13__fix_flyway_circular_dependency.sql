-- Clean schema and ensure column naming in a MySQL-safe way

SET @db := DATABASE();

-- Ensure the table exists
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

-- Drop conflicting columns if any
SET @columns := 'expired_date,expired_at,expiry_date';
-- expired_date
SET @exists := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'password_reset_tokens' AND COLUMN_NAME = 'expired_date');
SET @sql := IF(@exists > 0, 'ALTER TABLE password_reset_tokens DROP COLUMN expired_date', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
-- expired_at
SET @exists := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'password_reset_tokens' AND COLUMN_NAME = 'expired_at');
SET @sql := IF(@exists > 0, 'ALTER TABLE password_reset_tokens DROP COLUMN expired_at', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
-- expiry_date
SET @exists := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'password_reset_tokens' AND COLUMN_NAME = 'expiry_date');
SET @sql := IF(@exists > 0, 'ALTER TABLE password_reset_tokens DROP COLUMN expiry_date', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Enforce final schema
SET @sql := 'ALTER TABLE password_reset_tokens MODIFY COLUMN expires_at DATETIME NOT NULL';
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;