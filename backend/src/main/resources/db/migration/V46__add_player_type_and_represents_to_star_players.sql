-- Drop existing player_type column if exists
ALTER TABLE star_players DROP COLUMN IF EXISTS player_type;

-- Create star_player_types table for the @ElementCollection
CREATE TABLE star_player_types (
    player_id BIGINT NOT NULL,
    player_type VARCHAR(255),
    FOREIGN KEY (player_id) REFERENCES star_players(id) ON DELETE CASCADE
);

-- Create star_player_represents table for the @ElementCollection
CREATE TABLE star_player_represents (
    player_id BIGINT NOT NULL,
    represents VARCHAR(255),
    FOREIGN KEY (player_id) REFERENCES star_players(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_star_player_types_player_id ON star_player_types(player_id);
CREATE INDEX idx_star_player_represents_player_id ON star_player_represents(player_id);
