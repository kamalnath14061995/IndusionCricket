-- Create nets table for dynamic net management
CREATE TABLE nets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ground_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    capacity INTEGER,
    price_per_hour DECIMAL(10,2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    features JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ground_id) REFERENCES grounds(id) ON DELETE CASCADE,
    UNIQUE KEY unique_net_per_ground (ground_id, name)
);

-- Create index for available nets lookup
CREATE INDEX idx_nets_available ON nets(is_available);
CREATE INDEX idx_nets_ground ON nets(ground_id);

-- Insert sample nets data
INSERT INTO nets (ground_id, name, description, capacity, price_per_hour, features) VALUES
(1, 'Net 1-3', 'Premium nets with bowling machine', 6, 150.00, '["Bowling Machine", "Video Analysis", "Professional Setup"]'),
(1, 'Net 4-6', 'Standard practice nets', 4, 100.00, '["Standard Setup", "Equipment Available"]'),
(2, 'Net 7-9', 'Practice nets with coaching', 5, 120.00, '["Coaching Support", "Basic Equipment"]'),
(3, 'Net 10-12', 'Youth practice nets', 3, 80.00, '["Youth-Friendly", "Safety Features"]'),
(4, 'Net 13-15', 'Training nets with analysis', 4, 130.00, '["Video Analysis", "Performance Tracking"]');
