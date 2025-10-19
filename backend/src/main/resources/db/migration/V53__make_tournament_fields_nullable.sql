-- Make month and year nullable in star_player_tournaments table
ALTER TABLE star_player_tournaments 
MODIFY COLUMN month VARCHAR(255) NULL,
MODIFY COLUMN year VARCHAR(255) NULL;