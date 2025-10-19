-- V34: Add missing booking columns to align DB with Booking entity
-- Idempotent MySQL script (5.7+ / 8.0+)

-- seating_arrangement_requested (BOOLEAN DEFAULT FALSE)
SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'bookings'
    AND COLUMN_NAME = 'seating_arrangement_requested'
);
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN seating_arrangement_requested BOOLEAN DEFAULT FALSE',
  'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- cancellation_reason (TEXT)
SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'bookings'
    AND COLUMN_NAME = 'cancellation_reason'
);
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE bookings ADD COLUMN cancellation_reason TEXT',
  'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;