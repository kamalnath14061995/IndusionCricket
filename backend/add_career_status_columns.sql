-- Add onboard_status and job_status columns to cricket_coaches table
ALTER TABLE cricket_coaches 
ADD COLUMN onboard_status VARCHAR(20) DEFAULT 'PENDING',
ADD COLUMN job_status VARCHAR(30) DEFAULT 'APPLIED';

-- Add onboard_status and job_status columns to ground_staff table  
ALTER TABLE ground_staff
ADD COLUMN onboard_status VARCHAR(20) DEFAULT 'PENDING',
ADD COLUMN job_status VARCHAR(30) DEFAULT 'APPLIED';

-- Update existing records to have default values
UPDATE cricket_coaches SET onboard_status = 'PENDING', job_status = 'APPLIED' WHERE onboard_status IS NULL;
UPDATE ground_staff SET onboard_status = 'PENDING', job_status = 'APPLIED' WHERE onboard_status IS NULL;