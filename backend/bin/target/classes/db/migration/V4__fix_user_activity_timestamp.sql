-- Fix user_activity table structure to ensure timestamp column exists
-- This migration addresses the "Unknown column 'timestamp'" error

-- First, check if the timestamp column exists and add it if missing
ALTER TABLE user_activity 
ADD COLUMN IF NOT EXISTS timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Ensure all required indexes exist
CREATE INDEX IF NOT EXISTS idx_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_type ON user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_timestamp ON user_activity(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity(user_id, activity_type);
