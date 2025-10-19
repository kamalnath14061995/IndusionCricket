-- Create payment management tables
CREATE TABLE payment_methods (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    method_key VARCHAR(50) NOT NULL UNIQUE,
    label VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('OFFLINE', 'ONLINE')),
    provider VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create user payment access table
CREATE TABLE user_payment_access (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    method_key VARCHAR(50) NOT NULL,
    is_allowed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (method_key) REFERENCES payment_methods(method_key) ON DELETE CASCADE,
    UNIQUE KEY unique_user_method (user_id, method_key)
);

-- Create payment restrictions table
CREATE TABLE payment_restrictions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    is_blocked BOOLEAN DEFAULT FALSE,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_restriction (user_id)
);

-- Create payment configuration table
CREATE TABLE payment_configuration (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default payment methods
INSERT INTO payment_methods (method_key, label, type, provider) VALUES
('CASH', 'Cash (Offline)', 'OFFLINE', NULL),
('BANK_TRANSFER', 'Bank Transfer (Offline)', 'OFFLINE', NULL),
('UPI', 'UPI', 'ONLINE', 'UPI'),
('CARD_STRIPE', 'Card (Stripe)', 'ONLINE', 'STRIPE'),
('CARD_RAZORPAY', 'Card/UPI (Razorpay)', 'ONLINE', 'RAZORPAY'),
('PAYPAL', 'PayPal', 'ONLINE', 'PAYPAL');

-- Insert default payment configuration
INSERT INTO payment_configuration (config_key, config_value) VALUES
('global_enabled', '{"CASH": true, "BANK_TRANSFER": true, "UPI": true, "CARD_STRIPE": false, "CARD_RAZORPAY": false, "PAYPAL": false}'),
('per_user_allowed', '{}'),
('restrictions', '{}');
