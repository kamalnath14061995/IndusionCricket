-- Create star_player_tournaments table
CREATE TABLE star_player_tournaments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    player_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    month VARCHAR(255) NOT NULL,
    year VARCHAR(255) NOT NULL,
    runs INT NOT NULL DEFAULT 0,
    wickets INT NOT NULL DEFAULT 0,
    matches INT NOT NULL DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES star_players(id) ON DELETE CASCADE
);

-- Create index for better performance
CREATE INDEX idx_star_player_tournaments_player_id ON star_player_tournaments(player_id);
