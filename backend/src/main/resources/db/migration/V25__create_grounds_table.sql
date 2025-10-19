-- Create grounds table for dynamic ground management
CREATE TABLE grounds (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    location VARCHAR(255),
    capacity INTEGER,
    price_per_hour DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    facilities JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index for active grounds lookup
CREATE INDEX idx_grounds_active ON grounds(is_active);

-- Insert sample grounds data
INSERT INTO grounds (name, description, location, capacity, price_per_hour, facilities) VALUES
('Main Ground A', 'Premium match ground with floodlights and pavilion', 'Main Campus', 22, 500.00, '["Floodlights", "Pavilion", "Scoreboard", "Changing Rooms"]'),
('Practice Ground B', 'Practice ground with net facilities', 'East Wing', 15, 350.00, '["Floodlights", "Equipment Storage", "Water Cooler"]'),
('Youth Ground C', 'Youth-friendly ground with smaller boundaries', 'West Wing', 12, 300.00, '["Smaller Boundaries", "Safety Features", "Youth Equipment"]'),
('Training Ground D', 'Training ground with coaching facilities', 'North Wing', 18, 400.00, '["Coaching Area", "Video Analysis", "Bowling Machine"]');
