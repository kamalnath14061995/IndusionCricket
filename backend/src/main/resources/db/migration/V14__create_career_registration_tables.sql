-- Create cricket_coaches table
CREATE TABLE cricket_coaches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    career_details TEXT NOT NULL,
    home_address TEXT NOT NULL,
    certifications TEXT,
    experience_years INT NOT NULL CHECK (experience_years >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- Create ground_staff table
CREATE TABLE ground_staff (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    background_details TEXT NOT NULL,
    home_address TEXT NOT NULL,
    skills TEXT,
    experience_years INT NOT NULL CHECK (experience_years >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- Create audit log table for tracking changes
CREATE TABLE career_registration_audit (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    registration_type ENUM('CRICKET_COACH', 'GROUND_STAFF') NOT NULL,
    registration_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL,
    action_by VARCHAR(255),
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    old_values JSON,
    new_values JSON
);
