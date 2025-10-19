-- Add user status column to users table
ALTER TABLE users 
ADD COLUMN status ENUM('PENDING', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'PENDING';

-- Update existing users to have ACTIVE status (maintaining backward compatibility)
UPDATE users SET status = 'ACTIVE' WHERE is_active = 1;
UPDATE users SET status = 'INACTIVE' WHERE is_active = 0;

-- Create index on status for better query performance
CREATE INDEX idx_user_status ON users(status);

-- Add status column to user statistics view (if exists)
-- Note: This assumes the is_active column will be deprecated in favor of status
-- We'll keep is_active for backward compatibility during transition
