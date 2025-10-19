-- Add login_time column to user_activity table to resolve constraint violation
-- This migration addresses the "Field 'login_time' doesn't have a default value" error

ALTER TABLE user_activity 
ADD COLUMN IF NOT EXISTS login_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing records to set login_time to timestamp value
UPDATE user_activity 
SET login_time = timestamp 
WHERE login_time IS NULL;

-- Add index for login_time if needed
CREATE INDEX IF NOT EXISTS idx_login_time ON user_activity(login_time);
