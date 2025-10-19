-- Insert admin user for testing (fixed version)
-- Password is 'password' encoded with BCrypt
INSERT IGNORE INTO users (
    name, email, phone, age, experience_level, password, role, 
    created_at, updated_at, is_active, email_verified, phone_verified
) VALUES (
    'Admin User', 
    'admin@cricketacademy.com', 
    '+1234567890', 
    30, 
    'PROFESSIONAL', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 
    'ADMIN', 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP, 
    1, 
    1, 
    1
);