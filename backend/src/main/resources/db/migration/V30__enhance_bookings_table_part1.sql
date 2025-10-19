-- V30 Part 1: Essential booking enhancements
-- Split the original V30 into multiple parts to avoid MySQL limitations

-- booking_category
ALTER TABLE bookings ADD COLUMN booking_category VARCHAR(50) DEFAULT 'STANDARD';

-- duration_type
ALTER TABLE bookings ADD COLUMN duration_type VARCHAR(20) DEFAULT 'HOURLY';

-- total_hours
ALTER TABLE bookings ADD COLUMN total_hours DECIMAL(4,2) DEFAULT 1.0;

-- team_name
ALTER TABLE bookings ADD COLUMN team_name VARCHAR(100);

-- number_of_players
ALTER TABLE bookings ADD COLUMN number_of_players INTEGER DEFAULT 1;

-- special_requirements
ALTER TABLE bookings ADD COLUMN special_requirements TEXT;

-- add_on_services
ALTER TABLE bookings ADD COLUMN add_on_services JSON;

-- discount_applied
ALTER TABLE bookings ADD COLUMN discount_applied DECIMAL(10,2) DEFAULT 0.0;

-- membership_id
ALTER TABLE bookings ADD COLUMN membership_id VARCHAR(50);

-- event_type
ALTER TABLE bookings ADD COLUMN event_type VARCHAR(50) DEFAULT 'REGULAR';
