-- Add logout_time column to user_activity table to track when users log out
ALTER TABLE user_activity 
ADD COLUMN logout_time DATETIME NULL AFTER login_time;

-- Update existing records to set logout_time for LOGOUT activities
UPDATE user_activity 
SET logout_time = timestamp 
WHERE activity_type = 'LOGOUT';

-- Add index for logout_time queries
CREATE INDEX idx_logout_time ON user_activity(logout_time);
