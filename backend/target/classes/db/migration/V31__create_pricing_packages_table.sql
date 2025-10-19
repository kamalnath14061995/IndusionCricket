-- Create pricing packages table for flexible pricing options
CREATE TABLE IF NOT EXISTS pricing_packages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    package_name VARCHAR(100) NOT NULL,
    package_type VARCHAR(50) NOT NULL, -- 'GROUND', 'NET', 'COACHING', 'EVENT'
    duration_type VARCHAR(20) NOT NULL, -- 'HOURLY', 'HALF_DAY', 'FULL_DAY', 'WEEKLY', 'MONTHLY'
    duration_value DECIMAL(4,2) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    discounted_price DECIMAL(10,2),
    discount_percentage DECIMAL(5,2) DEFAULT 0.0,
    membership_discount DECIMAL(5,2) DEFAULT 0.0,
    peak_hour_multiplier DECIMAL(4,2) DEFAULT 1.0,
    off_peak_discount DECIMAL(5,2) DEFAULT 0.0,
    weekend_multiplier DECIMAL(4,2) DEFAULT 1.0,
    weekday_discount DECIMAL(5,2) DEFAULT 0.0,
    holiday_multiplier DECIMAL(4,2) DEFAULT 1.0,
    advance_booking_discount DECIMAL(5,2) DEFAULT 0.0,
    last_minute_discount DECIMAL(5,2) DEFAULT 0.0,
    group_discount_threshold INTEGER DEFAULT 1,
    group_discount_percentage DECIMAL(5,2) DEFAULT 0.0,
    corporate_discount_percentage DECIMAL(5,2) DEFAULT 0.0,
    student_discount_percentage DECIMAL(5,2) DEFAULT 0.0,
    senior_discount_percentage DECIMAL(5,2) DEFAULT 0.0,
    loyalty_discount_percentage DECIMAL(5,2) DEFAULT 0.0,
    referral_discount_percentage DECIMAL(5,2) DEFAULT 0.0,
    seasonal_discount_percentage DECIMAL(5,2) DEFAULT 0.0,
    promotional_discount_percentage DECIMAL(5,2) DEFAULT 0.0,
    tax_rate DECIMAL(5,2) DEFAULT 18.0,
    tax_inclusive BOOLEAN DEFAULT FALSE,
    currency VARCHAR(10) DEFAULT 'INR',
    min_booking_hours DECIMAL(4,2) DEFAULT 1.0,
    max_booking_hours DECIMAL(4,2) DEFAULT 24.0,
    min_advance_days INTEGER DEFAULT 0,
    max_advance_days INTEGER DEFAULT 365,
    cancellation_hours_before INTEGER DEFAULT 24,
    refund_percentage DECIMAL(5,2) DEFAULT 100.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create add-on services table
CREATE TABLE IF NOT EXISTS add_on_services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    service_category VARCHAR(50) NOT NULL, -- 'EQUIPMENT', 'COACHING', 'FACILITY', 'TECHNOLOGY', 'CATERING', 'SECURITY'
    service_type VARCHAR(50) NOT NULL, -- 'UMPIRE', 'SCORER', 'COACH', 'BOWLING_MACHINE', 'FLOODLIGHTS', etc.
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    hourly_rate DECIMAL(10,2),
    daily_rate DECIMAL(10,2),
    per_unit_rate DECIMAL(10,2),
    quantity_available INTEGER DEFAULT 1,
    max_quantity_per_booking INTEGER DEFAULT 1,
    is_available BOOLEAN DEFAULT TRUE,
    requires_advance_booking BOOLEAN DEFAULT FALSE,
    advance_booking_hours INTEGER DEFAULT 0,
    peak_hour_multiplier DECIMAL(4,2) DEFAULT 1.0,
    weekend_multiplier DECIMAL(4,2) DEFAULT 1.0,
    holiday_multiplier DECIMAL(4,2) DEFAULT 1.0,
    tax_rate DECIMAL(5,2) DEFAULT 18.0,
    currency VARCHAR(10) DEFAULT 'INR',
    applicable_facilities JSON, -- JSON array of facility types
    applicable_booking_types JSON, -- JSON array of booking types
    images JSON, -- JSON array of image URLs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create team management tables
CREATE TABLE IF NOT EXISTS teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL,
    team_captain_name VARCHAR(100) NOT NULL,
    team_captain_email VARCHAR(100) NOT NULL,
    team_captain_phone VARCHAR(20) NOT NULL,
    team_size INTEGER DEFAULT 11,
    team_type VARCHAR(50) DEFAULT 'CRICKET', -- 'CRICKET', 'FOOTBALL', 'BASKETBALL', etc.
    skill_level VARCHAR(20) DEFAULT 'AMATEUR', -- 'BEGINNER', 'AMATEUR', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL'
    age_group VARCHAR(20) DEFAULT 'ADULT', -- 'UNDER_12', 'UNDER_16', 'UNDER_19', 'ADULT', 'SENIOR'
    home_ground VARCHAR(100),
    preferred_time_slots JSON, -- JSON array of preferred time slots
    membership_status VARCHAR(20) DEFAULT 'ACTIVE', -- 'ACTIVE', 'INACTIVE', 'SUSPENDED'
    loyalty_points INTEGER DEFAULT 0,
    discount_percentage DECIMAL(5,2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_players (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_id BIGINT NOT NULL,
    player_name VARCHAR(100) NOT NULL,
    player_email VARCHAR(100),
    player_phone VARCHAR(20),
    player_age INTEGER,
    player_role VARCHAR(50), -- 'BATSMAN', 'BOWLER', 'ALL_ROUNDER', 'WICKET_KEEPER'
    player_skill_level VARCHAR(20) DEFAULT 'AMATEUR',
    jersey_number INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

-- Create payment transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'WALLET', 'NET_BANKING'
    payment_provider VARCHAR(50) NOT NULL, -- 'RAZORPAY', 'PAYTM', 'PHONEPE', etc.
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    payment_status VARCHAR(20) NOT NULL, -- 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'
    payment_gateway_response JSON,
    refund_amount DECIMAL(10,2) DEFAULT 0.0,
    refund_reason TEXT,
    refund_transaction_id VARCHAR(100),
    failure_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    notification_type VARCHAR(50) NOT NULL, -- 'SMS', 'EMAIL', 'WHATSAPP', 'PUSH'
    recipient VARCHAR(100) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'SENT', 'FAILED', 'DELIVERED'
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    failed_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Create booking add-ons junction table
CREATE TABLE IF NOT EXISTS booking_add_ons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    add_on_service_id BIGINT NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (add_on_service_id) REFERENCES add_on_services(id) ON DELETE CASCADE
);

-- Create membership plans table
CREATE TABLE IF NOT EXISTS membership_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(100) NOT NULL,
    plan_type VARCHAR(50) NOT NULL, -- 'BASIC', 'PREMIUM', 'ELITE', 'CORPORATE', 'STUDENT'
    description TEXT,
    monthly_fee DECIMAL(10,2),
    annual_fee DECIMAL(10,2),
    discount_percentage DECIMAL(5,2) DEFAULT 0.0,
    free_hours_per_month DECIMAL(4,2) DEFAULT 0.0,
    priority_booking BOOLEAN DEFAULT FALSE,
    exclusive_access BOOLEAN DEFAULT FALSE,
    free_add_ons JSON, -- JSON array of free add-on services
    loyalty_multiplier DECIMAL(4,2) DEFAULT 1.0,
    referral_bonus DECIMAL(10,2) DEFAULT 0.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create membership subscriptions table
CREATE TABLE IF NOT EXISTS membership_subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    team_id BIGINT,
    membership_plan_id BIGINT NOT NULL,
    subscription_start_date DATE NOT NULL,
    subscription_end_date DATE NOT NULL,
    auto_renew BOOLEAN DEFAULT TRUE,
    payment_method VARCHAR(50),
    subscription_status VARCHAR(20) DEFAULT 'ACTIVE', -- 'ACTIVE', 'EXPIRED', 'CANCELLED', 'SUSPENDED'
    remaining_free_hours DECIMAL(4,2) DEFAULT 0.0,
    loyalty_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (membership_plan_id) REFERENCES membership_plans(id) ON DELETE CASCADE
);

-- Insert default pricing packages
INSERT INTO pricing_packages (package_name, package_type, duration_type, duration_value, base_price, discounted_price) VALUES
('Standard Hourly - Ground', 'GROUND', 'HOURLY', 1.0, 1000.00, 850.00),
('Half Day - Ground', 'GROUND', 'HALF_DAY', 4.0, 3500.00, 3000.00),
('Full Day - Ground', 'GROUND', 'FULL_DAY', 8.0, 6500.00, 5500.00),
('Standard Hourly - Net', 'NET', 'HOURLY', 1.0, 500.00, 425.00),
('Half Day - Net', 'NET', 'HALF_DAY', 4.0, 1800.00, 1500.00),
('Full Day - Net', 'NET', 'FULL_DAY', 8.0, 3200.00, 2700.00);

-- Insert default add-on services
INSERT INTO add_on_services (service_name, service_category, service_type, description, base_price, hourly_rate, daily_rate) VALUES
('Professional Umpire', 'COACHING', 'UMPIRE', 'Certified professional umpire for matches', 1500.00, 500.00, 2000.00),
('Match Scorer', 'COACHING', 'SCORER', 'Professional scorer for matches and tournaments', 800.00, 300.00, 1200.00),
('Bowling Machine', 'EQUIPMENT', 'BOWLING_MACHINE', 'Professional bowling machine with speed control', 500.00, 200.00, 800.00),
('Floodlights', 'FACILITY', 'FLOODLIGHTS', 'High-mast floodlights for night matches', 1000.00, 300.00, 1500.00),
('Live Streaming', 'TECHNOLOGY', 'LIVE_STREAMING', 'HD live streaming with multiple camera angles', 2000.00, 800.00, 5000.00),
('Video Recording', 'TECHNOLOGY', 'RECORDING', 'Professional video recording of matches', 1500.00, 500.00, 3000.00),
('Professional Coach', 'COACHING', 'COACH', 'Certified cricket coach for training sessions', 2000.00, 1000.00, 5000.00),
('Pavilion Access', 'FACILITY', 'PAVILION', 'Access to air-conditioned pavilion with seating', 1000.00, 300.00, 1200.00),
('Refreshments', 'CATERING', 'REFRESHMENTS', 'Assorted refreshments and beverages', 500.00, 200.00, 800.00),
('Security Personnel', 'SECURITY', 'SECURITY', 'Professional security for events', 1200.00, 400.00, 2000.00);

-- Insert default membership plans
INSERT INTO membership_plans (plan_name, plan_type, description, monthly_fee, annual_fee, discount_percentage, free_hours_per_month) VALUES
('Basic Plan', 'BASIC', 'Basic membership with 10% discount and 5 free hours monthly', 999.00, 9999.00, 10.0, 5.0),
('Premium Plan', 'PREMIUM', 'Premium membership with 20% discount and 15 free hours monthly', 1999.00, 19999.00, 20.0, 15.0),
('Elite Plan', 'ELITE', 'Elite membership with 30% discount and 30 free hours monthly', 2999.00, 29999.00, 30.0, 30.0),
('Student Plan', 'STUDENT', 'Special student membership with 25% discount and 10 free hours monthly', 499.00, 4999.00, 25.0, 10.0);
