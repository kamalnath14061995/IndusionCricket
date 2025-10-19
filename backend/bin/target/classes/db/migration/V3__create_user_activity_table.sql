-- Create user_activity table for tracking user activities like login, logout, etc.
CREATE TABLE user_activity (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    activity_type ENUM('LOGIN', 'LOGOUT', 'LOGIN_FAILED', 'PASSWORD_CHANGED', 'PROFILE_UPDATED', 'ACCOUNT_LOCKED', 'ACCOUNT_UNLOCKED') NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(255),
    additional_info TEXT,
    INDEX idx_user_id (user_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_timestamp (timestamp),
    INDEX idx_user_activity_type (user_id, activity_type),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
