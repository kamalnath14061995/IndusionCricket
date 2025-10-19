@echo off
echo Running manual fix for bookings table schema...
echo.

REM Check if MySQL is available
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MySQL is not in PATH. Please ensure MySQL is installed and accessible.
    pause
    exit /b 1
)

REM Run the manual fix script
mysql -u root -pKamal@146 cricket_academy < fix_bookings_schema.sql

if %errorlevel% neq 0 (
    echo Error running the fix script. Please check MySQL connection.
    pause
    exit /b 1
)

echo.
echo Manual fix completed successfully!
echo.
echo Now you can run: mvn spring-boot:run
pause
