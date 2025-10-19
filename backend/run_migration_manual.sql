-- Manual migration to add status columns
USE cricket_academy;

-- Check if columns exist first
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'cricket_academy' 
AND TABLE_NAME = 'cricket_coaches' 
AND COLUMN_NAME IN ('onboard_status', 'job_status');

-- Add columns to cricket_coaches if they don't exist
ALTER TABLE cricket_coaches 
ADD COLUMN IF NOT EXISTS onboard_status VARCHAR(20) DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS job_status VARCHAR(30) DEFAULT 'APPLIED';

-- Add columns to ground_staff if they don't exist
ALTER TABLE ground_staff
ADD COLUMN IF NOT EXISTS onboard_status VARCHAR(20) DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS job_status VARCHAR(30) DEFAULT 'APPLIED';

-- Update existing records
UPDATE cricket_coaches SET onboard_status = 'PENDING' WHERE onboard_status IS NULL;
UPDATE cricket_coaches SET job_status = 'APPLIED' WHERE job_status IS NULL;
UPDATE ground_staff SET onboard_status = 'PENDING' WHERE onboard_status IS NULL;
UPDATE ground_staff SET job_status = 'APPLIED' WHERE job_status IS NULL;

-- Verify the columns were added
DESCRIBE cricket_coaches;
DESCRIBE ground_staff;