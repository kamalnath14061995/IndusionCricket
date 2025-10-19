@echo off
echo Running career status columns migration...

REM Update these variables with your actual database connection details
set DB_HOST=localhost
set DB_PORT=3306
set DB_NAME=cricket_academy
set DB_USER=root
set DB_PASSWORD=root

REM Run the migration
mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% < add_career_status_columns.sql

if %ERRORLEVEL% EQU 0 (
    echo Migration completed successfully!
) else (
    echo Migration failed with error code %ERRORLEVEL%
)

pause