-- Insert initial test users for login testing
-- Password for all test users: Test@123

INSERT INTO users (
    name, email, phone, age, experience_level, password, role, 
    email_verified, phone_verified, created_at, updated_at, is_active
) VALUES 
(
    'Test Student',
    'test.student@cricketacademy.com',
    '9876543210',
    25,
    'INTERMEDIATE',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iOEcalwu',
    'STUDENT',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    true
),
(
    'Test Coach',
    'test.coach@cricketacademy.com',
    '9876543211',
    35,
    'PROFESSIONAL',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iOEcalwu',
    'COACH',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    true
),
(
    'Test Admin',
    'test.admin@cricketacademy.com',
    '9876543212',
    30,
    'ADVANCED',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iOEcalwu',
    'ADMIN',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    true
);
