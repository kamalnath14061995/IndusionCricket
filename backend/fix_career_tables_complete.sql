-- Complete fix for cricket_coaches table - add all missing columns
ALTER TABLE cricket_coaches 
ADD COLUMN IF NOT EXISTS onboard_status VARCHAR(20) DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS job_status VARCHAR(30) DEFAULT 'APPLIED',
ADD COLUMN IF NOT EXISTS photo_url VARCHAR(500);

-- Complete fix for ground_staff table - add all missing columns  
ALTER TABLE ground_staff
ADD COLUMN IF NOT EXISTS onboard_status VARCHAR(20) DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS job_status VARCHAR(30) DEFAULT 'APPLIED',
ADD COLUMN IF NOT EXISTS photo_url VARCHAR(500);

-- Update existing records to have default values
UPDATE cricket_coaches SET onboard_status = 'PENDING' WHERE onboard_status IS NULL;
UPDATE cricket_coaches SET job_status = 'APPLIED' WHERE job_status IS NULL;

UPDATE ground_staff SET onboard_status = 'PENDING' WHERE onboard_status IS NULL;
UPDATE ground_staff SET job_status = 'APPLIED' WHERE job_status IS NULL;