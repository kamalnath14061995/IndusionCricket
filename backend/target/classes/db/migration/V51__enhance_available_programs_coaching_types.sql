-- Add new columns to support coaching program types
ALTER TABLE available_programs 
ADD COLUMN icon VARCHAR(10),
ADD COLUMN age_group VARCHAR(100),
ADD COLUMN focus_areas TEXT,
ADD COLUMN format VARCHAR(100),
ADD COLUMN is_suggested BOOLEAN NOT NULL DEFAULT FALSE;