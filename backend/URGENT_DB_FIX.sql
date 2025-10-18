-- URGENT: Run this SQL to fix the missing columns causing 500 errors

-- Fix cricket_coaches table
ALTER TABLE cricket_coaches 
ADD COLUMN IF NOT EXISTS onboard_status VARCHAR(20) DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS job_status VARCHAR(30) DEFAULT 'APPLIED',
ADD COLUMN IF NOT EXISTS photo_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Fix ground_staff table  
ALTER TABLE ground_staff
ADD COLUMN IF NOT EXISTS onboard_status VARCHAR(20) DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS job_status VARCHAR(30) DEFAULT 'APPLIED',
ADD COLUMN IF NOT EXISTS photo_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Update existing records
UPDATE cricket_coaches SET 
    onboard_status = 'PENDING', 
    job_status = 'APPLIED',
    created_at = COALESCE(created_at, NOW()),
    updated_at = COALESCE(updated_at, NOW())
WHERE onboard_status IS NULL OR job_status IS NULL;

UPDATE ground_staff SET 
    onboard_status = 'PENDING', 
    job_status = 'APPLIED',
    created_at = COALESCE(created_at, NOW()),
    updated_at = COALESCE(updated_at, NOW())
WHERE onboard_status IS NULL OR job_status IS NULL;