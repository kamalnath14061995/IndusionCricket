-- Add sort_order to star_players if missing
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'star_players'
    AND COLUMN_NAME = 'sort_order'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE star_players ADD COLUMN sort_order INT NOT NULL DEFAULT 0',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add sort_order to facility_items if missing
SET @col_exists2 := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'facility_items'
    AND COLUMN_NAME = 'sort_order'
);
SET @sql2 := IF(@col_exists2 = 0,
  'ALTER TABLE facility_items ADD COLUMN sort_order INT NOT NULL DEFAULT 0',
  'SELECT 1'
);
PREPARE stmt2 FROM @sql2;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;