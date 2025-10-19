-- Enhanced Cricket Nets Table with Comprehensive Features
-- This migration adds all required cricket-specific fields and facilities

ALTER TABLE nets 
ADD COLUMN net_number VARCHAR(20),
ADD COLUMN location_type ENUM('INDOOR', 'OUTDOOR') DEFAULT 'OUTDOOR',
ADD COLUMN surface_type ENUM('TURF', 'MATTING', 'CEMENT') DEFAULT 'TURF',
ADD COLUMN net_length DECIMAL(5,2),
ADD COLUMN net_width DECIMAL(5,2),
ADD COLUMN net_height DECIMAL(5,2),
ADD COLUMN player_capacity_per_net INTEGER,
ADD COLUMN has_bowling_machine BOOLEAN DEFAULT FALSE,
ADD COLUMN bowling_machine_speed_range VARCHAR(50),
ADD COLUMN has_floodlights BOOLEAN DEFAULT FALSE,
ADD COLUMN floodlight_lux_rating INTEGER,
ADD COLUMN has_protective_netting BOOLEAN DEFAULT TRUE,
ADD COLUMN safety_gear_available JSON,
ADD COLUMN equipment_rental JSON,
ADD COLUMN has_washrooms BOOLEAN DEFAULT FALSE,
ADD COLUMN has_changing_rooms BOOLEAN DEFAULT FALSE,
ADD COLUMN has_drinking_water BOOLEAN DEFAULT TRUE,
ADD COLUMN has_seating_area BOOLEAN DEFAULT TRUE,
ADD COLUMN has_parking BOOLEAN DEFAULT TRUE,
ADD COLUMN has_first_aid BOOLEAN DEFAULT TRUE,
ADD COLUMN coaching_available BOOLEAN DEFAULT FALSE,
ADD COLUMN coaching_price_per_hour DECIMAL(10,2),
ADD COLUMN has_cctv BOOLEAN DEFAULT FALSE,
ADD COLUMN cctv_recording_available BOOLEAN DEFAULT FALSE,
ADD COLUMN slot_duration_minutes INTEGER DEFAULT 60,
ADD COLUMN individual_booking_allowed BOOLEAN DEFAULT TRUE,
ADD COLUMN group_booking_allowed BOOLEAN DEFAULT TRUE,
ADD COLUMN max_group_size INTEGER,
ADD COLUMN pricing_per_net DECIMAL(10,2),
ADD COLUMN pricing_per_player DECIMAL(10,2),
ADD COLUMN membership_discount_percentage DECIMAL(5,2),
ADD COLUMN bulk_booking_discount JSON,
ADD COLUMN cancellation_policy TEXT,
ADD COLUMN online_payment_methods JSON,
ADD COLUMN add_on_services JSON,
ADD COLUMN compatible_ball_types JSON,
ADD COLUMN safety_padding_details TEXT,
ADD COLUMN ventilation_system VARCHAR(100),
ADD COLUMN booking_calendar_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN real_time_availability BOOLEAN DEFAULT TRUE;

-- Create indexes for enhanced search capabilities
CREATE INDEX idx_nets_location_type ON nets(location_type);
CREATE INDEX idx_nets_surface_type ON nets(surface_type);
CREATE INDEX idx_nets_bowling_machine ON nets(has_bowling_machine);
CREATE INDEX idx_nets_floodlights ON nets(has_floodlights);
CREATE INDEX idx_nets_coaching ON nets(coaching_available);

-- Insert sample enhanced cricket nets data
INSERT INTO nets (
    ground_id, name, description, capacity, price_per_hour, is_available, features,
    net_number, location_type, surface_type, net_length, net_width, net_height, 
    player_capacity_per_net, has_bowling_machine, bowling_machine_speed_range, 
    has_floodlights, floodlight_lux_rating, has_protective_netting, 
    safety_gear_available, equipment_rental, has_washrooms, has_changing_rooms,
    has_drinking_water, has_seating_area, has_parking, has_first_aid,
    coaching_available, coaching_price_per_hour, has_cctv, cctv_recording_available,
    slot_duration_minutes, individual_booking_allowed, group_booking_allowed,
    max_group_size, pricing_per_net, pricing_per_player, membership_discount_percentage,
    bulk_booking_discount, cancellation_policy, online_payment_methods,
    add_on_services, compatible_ball_types, safety_padding_details,
    ventilation_system, booking_calendar_enabled, real_time_availability
) VALUES
(1, 'Premium Net A1', 'Professional cricket net with bowling machine and video analysis', 6, 200.00, TRUE, 
 '["Bowling Machine", "Video Analysis", "Professional Setup", "Floodlights", "Coaching Available"]',
 'A1', 'OUTDOOR', 'TURF', 22.00, 12.00, 12.00, 6, TRUE, '40-150 kmph', TRUE, 500, TRUE,
 '["Helmets", "Pads", "Gloves", "Abdominal Guards"]',
 '["Bats", "Balls", "Stumps", "Bowling Machine Balls"]',
 TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 500.00, TRUE, TRUE, 60, TRUE, TRUE, 6, 200.00, 50.00, 15.00,
 '{"weekly": 10, "monthly": 20}', 'Free cancellation up to 24 hours before booking',
 '["UPI", "Credit Card", "Debit Card", "Net Banking", "Wallets"]',
 '{"bowling_machine": 100, "coach": 500, "video_analysis": 200, "extra_equipment": 50}',
 '["Leather", "Tennis", "Synthetic"]', 'Full safety padding on all sides', 'Natural ventilation with fans', TRUE, TRUE),

(1, 'Standard Net B2', 'Standard practice net suitable for all skill levels', 4, 120.00, TRUE,
 '["Standard Setup", "Basic Equipment", "Protective Netting"]',
 'B2', 'OUTDOOR', 'MATTING', 20.00, 10.00, 10.00, 4, FALSE, NULL, FALSE, NULL, TRUE,
 '["Helmets", "Pads"]',
 '["Bats", "Balls", "Stumps"]',
 TRUE, FALSE, TRUE, TRUE, TRUE, TRUE, FALSE, NULL, FALSE, FALSE, 30, TRUE, TRUE, 4, 120.00, 40.00, 10.00,
 '{"weekly": 5, "monthly": 15}', 'Free cancellation up to 12 hours before booking',
 '["UPI", "Credit Card", "Cash"]',
 '{"extra_equipment": 30, "drinks": 20}', '["Tennis", "Synthetic"]', 'Basic safety padding', 'Open air', TRUE, TRUE),

(2, 'Indoor Net C1', 'Climate-controlled indoor net with professional setup', 5, 180.00, TRUE,
 '["Indoor Facility", "Climate Control", "Professional Setup", "Bowling Machine"]',
 'C1', 'INDOOR', 'CEMENT', 22.00, 12.00, 12.00, 5, TRUE, '50-160 kmph', TRUE, 600, TRUE,
 '["Helmets", "Pads", "Gloves", "Thigh Guards", "Arm Guards"]',
 '["Bats", "Balls", "Stumps", "Bowling Machine Balls", "Cones", "Markers"]',
 TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 600.00, TRUE, TRUE, 60, TRUE, TRUE, 5, 180.00, 45.00, 20.00,
 '{"weekly": 15, "monthly": 25}', 'Free cancellation up to 48 hours before booking',
 '["UPI", "Credit Card", "Debit Card", "Net Banking", "Wallets", "PayPal"]',
 '{"bowling_machine": 150, "coach": 600, "video_analysis": 250, "extra_equipment": 75, "drinks": 30}',
 '["Leather", "Tennis", "Synthetic", "Practice Balls"]', 'Full safety padding with foam flooring', 'HVAC system with air conditioning', TRUE, TRUE);
