@echo off
echo Starting migration fix for bookings table...

REM Check if MySQL is available
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MySQL is not available. Please ensure MySQL is in your PATH.
    pause
    exit /b 1
)

REM Database configuration
set DB_NAME=cricket_academy
set DB_USER=root
set DB_PASS=Kamal@146

echo Checking current bookings table structure...
mysql -u %DB_USER% -p%DB_PASS% -e "USE %DB_NAME%; DESCRIBE bookings;"

echo Checking for duplicate columns...
mysql -u %DB_USER% -p%DB_PASS% -e "USE %DB_NAME%; SELECT 
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'facility_id') THEN 'facility_id exists' ELSE 'facility_id missing' END as facility_id_status,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'facility_name') THEN 'facility_name exists' ELSE 'facility_name missing' END as facility_name_status,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'ground_id') THEN 'ground_id exists' ELSE 'ground_id missing' END as ground_id_status,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'ground_name') THEN 'ground_name exists' ELSE 'ground_name missing' END as ground_name_status;"

echo Applying fix...
mysql -u %DB_USER% -p%DB_PASS% %DB_NAME% < fix_bookings_schema.sql

echo Verifying fix...
mysql -u %DB_USER% -p%DB_PASS% -e "USE %DB_NAME%; DESCRIBE bookings;"

echo Migration fix completed successfully!
pause
