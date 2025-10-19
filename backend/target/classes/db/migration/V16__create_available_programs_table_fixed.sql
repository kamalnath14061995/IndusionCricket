-- Create available programs table
CREATE TABLE IF NOT EXISTS available_programs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    program_name VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    level VARCHAR(50),
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create expert coaches table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS expert_coaches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    specialization VARCHAR(255),
    experience_years INTEGER,
    certifications TEXT,
    bio TEXT,
    profile_image_url VARCHAR(500),
    hourly_rate DECIMAL(10,2),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create program_coach mapping table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS program_coaches (
    program_id BIGINT NOT NULL,
    coach_id BIGINT NOT NULL,
    PRIMARY KEY (program_id, coach_id),
    FOREIGN KEY (program_id) REFERENCES available_programs(id) ON DELETE CASCADE,
    FOREIGN KEY (coach_id) REFERENCES expert_coaches(id) ON DELETE CASCADE
);

-- Create indexes (MySQL compatible - without IF NOT EXISTS)
CREATE INDEX idx_programs_active ON available_programs(is_active);
CREATE INDEX idx_coaches_available ON expert_coaches(is_available);
CREATE INDEX idx_coaches_email ON expert_coaches(email);
