-- Manual fix for bookings table schema
-- This script should be run manually to fix the database state

-- Step 1: Check current table structure
SELECT 
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'facility_id') THEN 'facility_id exists' ELSE 'facility_id missing' END as facility_id_status,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'facility_name') THEN 'facility_name exists' ELSE 'facility_name missing' END as facility_name_status,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'ground_id') THEN 'ground_id exists' ELSE 'ground_id missing' END as ground_id_status,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'ground_name') THEN 'ground_name exists' ELSE 'ground_name missing' END as ground_name_status;

-- Step 2: Fix the schema based on current state

-- If ground columns don't exist, add them
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS ground_id VARCHAR(50) NOT NULL DEFAULT 'unknown',
ADD COLUMN IF NOT EXISTS ground_name VARCHAR(100) NOT NULL DEFAULT 'Unknown Ground',
ADD COLUMN IF NOT EXISTS ground_description TEXT;

-- If facility columns exist, migrate data and drop them
UPDATE bookings 
SET ground_id = COALESCE(facility_id, 'unknown'),
    ground_name = COALESCE(facility_name, 'Unknown Ground'),
    ground_description = CONCAT('Facility: ', COALESCE(facility_name, 'Unknown'))
WHERE facility_id IS NOT NULL OR facility_name IS NOT NULL;

-- Drop facility columns if they exist
ALTER TABLE bookings 
DROP COLUMN IF EXISTS facility_id,
DROP COLUMN IF EXISTS facility_name;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_ground_id ON bookings(ground_id);
CREATE INDEX IF NOT EXISTS idx_ground_name ON bookings(ground_name);

-- Drop old indexes if they exist
DROP INDEX IF EXISTS idx_facility_id ON bookings;
DROP INDEX IF EXISTS idx_facility_name ON bookings;

-- Ensure all existing records have valid ground_id and ground_name
UPDATE bookings 
SET ground_id = COALESCE(ground_id, 'unknown'),
    ground_name = COALESCE(ground_name, 'Unknown Ground')
WHERE ground_id IS NULL OR ground_name IS NULL;

-- Final verification
SELECT 'Schema fix completed successfully' as status;
