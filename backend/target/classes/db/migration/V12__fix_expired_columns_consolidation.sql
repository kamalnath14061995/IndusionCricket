-- Consolidate expired/expiry/expires columns in a MySQL-safe, idempotent way

SET @db := DATABASE();

-- Ensure base table exists
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

-- Drop legacy columns if present
SET @expired_date_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'password_reset_tokens' AND COLUMN_NAME = 'expired_date'
);
SET @sql := IF(@expired_date_exists > 0,
  'ALTER TABLE password_reset_tokens DROP COLUMN expired_date',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @expired_at_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'password_reset_tokens' AND COLUMN_NAME = 'expired_at'
);
SET @sql := IF(@expired_at_exists > 0,
  'ALTER TABLE password_reset_tokens DROP COLUMN expired_at',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @expiry_date_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'password_reset_tokens' AND COLUMN_NAME = 'expiry_date'
);
SET @sql := IF(@expiry_date_exists > 0,
  'ALTER TABLE password_reset_tokens DROP COLUMN expiry_date',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Ensure expires_at is NOT NULL
SET @expires_at_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'password_reset_tokens' AND COLUMN_NAME = 'expires_at'
);
SET @sql := IF(@expires_at_exists > 0,
  'ALTER TABLE password_reset_tokens MODIFY COLUMN expires_at DATETIME NOT NULL',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Ensure other columns
SET @used_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'password_reset_tokens' AND COLUMN_NAME = 'used'
);
SET @sql := IF(@used_exists > 0,
  'ALTER TABLE password_reset_tokens MODIFY COLUMN used TINYINT(1) NOT NULL DEFAULT 0',
  'ALTER TABLE password_reset_tokens ADD COLUMN used TINYINT(1) NOT NULL DEFAULT 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @used_at_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'password_reset_tokens' AND COLUMN_NAME = 'used_at'
);
SET @sql := IF(@used_at_exists > 0,
  'ALTER TABLE password_reset_tokens MODIFY COLUMN used_at DATETIME NULL',
  'ALTER TABLE password_reset_tokens ADD COLUMN used_at DATETIME NULL');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Ensure token uniqueness
SET @sql := 'ALTER TABLE password_reset_tokens MODIFY COLUMN token VARCHAR(100) NOT NULL UNIQUE';
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Ensure FK exists (safe check)
SET @fk_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
  JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME AND tc.TABLE_SCHEMA = kcu.TABLE_SCHEMA
  WHERE tc.TABLE_SCHEMA = @db AND tc.TABLE_NAME = 'password_reset_tokens' AND tc.CONSTRAINT_TYPE = 'FOREIGN KEY' AND tc.CONSTRAINT_NAME = 'fk_prt_user'
);
SET @sql := IF(@fk_exists = 0,
  'ALTER TABLE password_reset_tokens ADD CONSTRAINT fk_prt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;