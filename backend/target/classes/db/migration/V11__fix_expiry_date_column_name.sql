-- Fix the expiry_date column name issue in a MySQL-safe, idempotent way

SET @db := DATABASE();

-- If expiry_date exists, rename to expires_at with NOT NULL
SET @legacy_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'password_reset_tokens' AND COLUMN_NAME = 'expiry_date'
);
SET @sql := IF(@legacy_exists > 0,
  'ALTER TABLE password_reset_tokens CHANGE COLUMN expiry_date expires_at DATETIME NOT NULL',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Ensure expires_at is NOT NULL
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'password_reset_tokens' AND COLUMN_NAME = 'expires_at'
);
SET @sql := IF(@col_exists > 0,
  'ALTER TABLE password_reset_tokens MODIFY COLUMN expires_at DATETIME NOT NULL',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Create index on expires_at if missing
SET @index_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'password_reset_tokens' AND INDEX_NAME = 'idx_prt_expires_at'
);
SET @sql := IF(@index_exists = 0,
  'CREATE INDEX idx_prt_expires_at ON password_reset_tokens(expires_at)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;