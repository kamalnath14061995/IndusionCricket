-- Fix password reset tokens table schema to match entity
-- This migration ensures the table structure matches the PasswordResetToken entity

-- First, let's create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(100) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    used TINYINT(1) NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_prt_token (token),
    INDEX idx_prt_user (user_id)
);

-- Ensure used column exists with proper type
ALTER TABLE password_reset_tokens 
MODIFY COLUMN used TINYINT(1) NOT NULL DEFAULT 0;

-- Ensure used_at column allows NULL
ALTER TABLE password_reset_tokens 
MODIFY COLUMN used_at DATETIME NULL;

-- Ensure token column has proper length and is unique
ALTER TABLE password_reset_tokens 
MODIFY COLUMN token VARCHAR(100) NOT NULL UNIQUE;

-- Ensure user_id is properly defined
ALTER TABLE password_reset_tokens 
MODIFY COLUMN user_id BIGINT NOT NULL;
