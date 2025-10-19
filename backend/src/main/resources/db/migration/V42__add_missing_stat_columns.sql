-- Add missing columns to star_player_stats table for enhanced statistics
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'star_player_stats'
    AND COLUMN_NAME = 'centuries'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE star_player_stats ADD COLUMN centuries INT NOT NULL DEFAULT 0',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'star_player_stats'
    AND COLUMN_NAME = 'half_centuries'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE star_player_stats ADD COLUMN half_centuries INT NOT NULL DEFAULT 0',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'star_player_stats'
    AND COLUMN_NAME = 'strike_rate'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE star_player_stats ADD COLUMN strike_rate DOUBLE NOT NULL DEFAULT 0.0',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'star_player_stats'
    AND COLUMN_NAME = 'economy_rate'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE star_player_stats ADD COLUMN economy_rate DOUBLE NOT NULL DEFAULT 0.0',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'star_player_stats'
    AND COLUMN_NAME = 'average'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE star_player_stats ADD COLUMN average DOUBLE NOT NULL DEFAULT 0.0',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
