-- Star players main table
CREATE TABLE IF NOT EXISTS star_players (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    photo_url VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Star player achievements as simple list
CREATE TABLE IF NOT EXISTS star_player_achievements (
    player_id BIGINT NOT NULL,
    achievement VARCHAR(255) NOT NULL,
    FOREIGN KEY (player_id) REFERENCES star_players(id) ON DELETE CASCADE
);

-- Yearly stats per player
CREATE TABLE IF NOT EXISTS star_player_stats (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    player_id BIGINT NOT NULL,
    year VARCHAR(10) NOT NULL,
    runs INT NOT NULL,
    wickets INT NOT NULL,
    matches INT NOT NULL,
    FOREIGN KEY (player_id) REFERENCES star_players(id) ON DELETE CASCADE
);

-- Facilities main table
CREATE TABLE IF NOT EXISTS facility_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Facility features list
CREATE TABLE IF NOT EXISTS facility_features (
    facility_id BIGINT NOT NULL,
    feature VARCHAR(255) NOT NULL,
    FOREIGN KEY (facility_id) REFERENCES facility_items(id) ON DELETE CASCADE
);