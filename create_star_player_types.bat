@echo off
echo Creating star_player_types table...

mysql -u root -pKamal@146 -e "USE cricket_academy; ALTER TABLE star_players DROP COLUMN IF EXISTS player_type; CREATE TABLE star_player_types (player_id BIGINT NOT NULL, player_type VARCHAR(255), FOREIGN KEY (player_id) REFERENCES star_players(id) ON DELETE CASCADE); CREATE TABLE star_player_represents (player_id BIGINT NOT NULL, represents VARCHAR(255), FOREIGN KEY (player_id) REFERENCES star_players(id) ON DELETE CASCADE); CREATE INDEX idx_star_player_types_player_id ON star_player_types(player_id); CREATE INDEX idx_star_player_represents_player_id ON star_player_represents(player_id);"

if %errorlevel% equ 0 (
    echo Table created successfully!
) else (
    echo Failed to create table.
)

pause
