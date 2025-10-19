-- Add photo_url column to cricket_coaches table
ALTER TABLE cricket_coaches 
ADD COLUMN photo_url VARCHAR(500);

-- Add photo_url column to ground_staff table (if needed)
ALTER TABLE ground_staff
ADD COLUMN photo_url VARCHAR(500);