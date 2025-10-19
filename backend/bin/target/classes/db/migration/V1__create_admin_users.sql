-- Create admin users for testing
INSERT INTO users (name, email, phone, password, role, age, experience_level, category, is_active, created_at, updated_at, email_verified, phone_verified)
VALUES 
('Admin User', 'admin@cricketacademy.com', '1234567890', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVemJe', 'ADMIN', 30, 'ADVANCED', 'adult', true, NOW(), NOW(), true, true);
