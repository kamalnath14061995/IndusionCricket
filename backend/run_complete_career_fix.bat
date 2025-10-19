@echo off
echo Running complete career tables fix...

REM Update these variables with your actual database connection details
set DB_HOST=localhost
set DB_PORT=3306
set DB_NAME=cricket_academy
set DB_USER=root
set DB_PASSWORD=root

REM Run the migration
mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% < fix_career_tables_complete.sql

if %ERRORLEVEL% EQU 0 (
    echo Complete career tables fix completed successfully!
    echo All missing columns have been added.
) else (
    echo Migration failed with error code %ERRORLEVEL%
    echo Please check your database connection and try again.
)

pause