# Fix star_player_types Table Missing Error

## Issue
JsonMappingException: Table 'cricket_academy.star_player_types' doesn't exist

## Root Cause
V46 migration creates the star_player_types table, but Flyway checksum mismatch prevented it from being applied.

## Steps to Fix
- [ ] Run `mvn flyway:repair` to fix checksum mismatches
- [ ] Run `mvn flyway:migrate` to apply pending migrations
- [ ] Verify star_player_types table exists in database
- [ ] Test application to ensure error is resolved
- [ ] Update main TODO.md with resolution

## Frontend Fix
- [x] Updated StarPlayerDTO.playerType from string to string[]
- [x] Fixed mapPlayerDTOToUI to handle array instead of splitting string
- [x] Fixed mapUIToPlayerDTO to pass array directly instead of joining

## Status
The frontend type mismatch has been fixed. The original database table issue may still exist if the migration wasn't applied. Please verify the database state and apply the migration if needed.
