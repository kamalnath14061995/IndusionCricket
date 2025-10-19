-- Add detailed specifications to grounds table
ALTER TABLE grounds ADD COLUMN image_url TEXT;

-- Basic Ground Specs
ALTER TABLE grounds ADD COLUMN ground_type VARCHAR(20) DEFAULT 'Cricket';
ALTER TABLE grounds ADD COLUMN ground_size VARCHAR(50);
ALTER TABLE grounds ADD COLUMN boundary_dimensions VARCHAR(100);
ALTER TABLE grounds ADD COLUMN pitch_type JSON;
ALTER TABLE grounds ADD COLUMN number_of_pitches INT DEFAULT 1;

-- Cricket Specs
ALTER TABLE grounds ADD COLUMN turf_type VARCHAR(20) DEFAULT 'Natural Grass';
ALTER TABLE grounds ADD COLUMN pitch_quality VARCHAR(10) DEFAULT 'Medium';
ALTER TABLE grounds ADD COLUMN grass_type VARCHAR(30) DEFAULT 'Bermuda';
ALTER TABLE grounds ADD COLUMN drainage_system BOOLEAN DEFAULT FALSE;
ALTER TABLE grounds ADD COLUMN lighting_quality VARCHAR(20) DEFAULT 'Standard';
ALTER TABLE grounds ADD COLUMN seating_types JSON;
ALTER TABLE grounds ADD COLUMN media_facilities JSON;
ALTER TABLE grounds ADD COLUMN practice_facilities JSON;
ALTER TABLE grounds ADD COLUMN safety_features JSON;

-- Facilities
ALTER TABLE grounds ADD COLUMN has_floodlights BOOLEAN DEFAULT FALSE;
ALTER TABLE grounds ADD COLUMN has_pavilion BOOLEAN DEFAULT FALSE;
ALTER TABLE grounds ADD COLUMN has_dressing_rooms BOOLEAN DEFAULT FALSE;
ALTER TABLE grounds ADD COLUMN has_washrooms BOOLEAN DEFAULT FALSE;
ALTER TABLE grounds ADD COLUMN has_showers BOOLEAN DEFAULT FALSE;
ALTER TABLE grounds ADD COLUMN has_drinking_water BOOLEAN DEFAULT TRUE;
ALTER TABLE grounds ADD COLUMN has_first_aid BOOLEAN DEFAULT TRUE;
ALTER TABLE grounds ADD COLUMN has_parking_two_wheeler BOOLEAN DEFAULT TRUE;
ALTER TABLE grounds ADD COLUMN has_parking_four_wheeler BOOLEAN DEFAULT TRUE;
ALTER TABLE grounds ADD COLUMN has_refreshments BOOLEAN DEFAULT FALSE;
ALTER TABLE grounds ADD COLUMN seating_capacity INT;
ALTER TABLE grounds ADD COLUMN has_practice_nets BOOLEAN DEFAULT FALSE;
ALTER TABLE grounds ADD COLUMN scoreboard_type VARCHAR(20) DEFAULT 'Manual';
ALTER TABLE grounds ADD COLUMN has_live_streaming BOOLEAN DEFAULT FALSE;

-- Specs
ALTER TABLE grounds ADD COLUMN ground_dimensions VARCHAR(50);
ALTER TABLE grounds ADD COLUMN pitch_length VARCHAR(20) DEFAULT '22 yards';
ALTER TABLE grounds ADD COLUMN overs_per_slot VARCHAR(10) DEFAULT '20';
ALTER TABLE grounds ADD COLUMN ball_type VARCHAR(10) DEFAULT 'Tennis';
ALTER TABLE grounds ADD COLUMN has_safety_nets BOOLEAN DEFAULT FALSE;
ALTER TABLE grounds ADD COLUMN has_rain_covers BOOLEAN DEFAULT FALSE;
ALTER TABLE grounds ADD COLUMN has_ground_staff_available BOOLEAN DEFAULT FALSE;
