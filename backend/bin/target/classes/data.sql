-- Initial data population after removing Flyway
-- This script populates the database with initial test data

-- Insert initial admin user (password: admin123)
INSERT INTO users (name, email, password, age, phone, experience_level, email_verified, role, is_active) 
VALUES 
('Admin User', 'admin@cricketacademy.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBaUKk7h.T0mUO', 30, '1234567890', 'EXPERT', true, 'ADMIN', true);

-- Insert test users (password: password123)
INSERT INTO users (name, email, password, age, phone, experience_level, email_verified, role, is_active) 
VALUES 
('John Doe', 'john@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBaUKk7h.T0mUO', 25, '9876543210', 'INTERMEDIATE', true, 'USER', true),
('Jane Smith', 'jane@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBaUKk7h.T0mUO', 22, '5551234567', 'BEGINNER', true, 'USER', true),
('Mike Johnson', 'mike@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBaUKk7h.T0mUO', 28, '4449876543', 'ADVANCED', true, 'USER', true);

-- Insert sample career applications
INSERT INTO career_applications (full_name, email, phone, age, experience_level, preferred_role, batting_style, bowling_style, additional_info, status) 
VALUES 
('Alex Wilson', 'alex@example.com', '3332221111', 24, 'INTERMEDIATE', 'Batsman', 'Right-handed', 'Medium pace', 'Looking to join as a professional batsman', 'PENDING'),
('Sarah Brown', 'sarah@example.com', '2223334444', 26, 'ADVANCED', 'All-rounder', 'Left-handed', 'Spin bowler', 'Experienced player seeking advanced coaching', 'APPROVED'),
('David Lee', 'david@example.com', '1114445555', 20, 'BEGINNER', 'Bowler', 'Right-handed', 'Fast bowler', 'New to cricket, eager to learn bowling techniques', 'PENDING');

-- Insert sample user activities - simplified
INSERT INTO user_activity (user_id, login_time, ip_address, user_agent) 
VALUES (1, CURRENT_TIMESTAMP, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

INSERT INTO user_activity (user_id, login_time, ip_address, user_agent) 
VALUES (2, CURRENT_TIMESTAMP, '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');

INSERT INTO user_activity (user_id, login_time, ip_address, user_agent) 
VALUES (3, CURRENT_TIMESTAMP, '192.168.1.102', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36');
