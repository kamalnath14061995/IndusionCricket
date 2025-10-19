@echo off
echo Starting Java-based migration fix for bookings table...

REM Check if Maven is available
mvn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Maven is not available. Please ensure Maven is in your PATH.
    pause
    exit /b 1
)

echo Running Spring Boot database fix...
cd backend
mvn spring-boot:run -Dspring-boot.run.arguments="--fix-migration=true"

echo.
echo If the above fails, try manual approach:
echo 1. Start the Spring Boot application
echo 2. Access: http://localhost:8080/api/fix-migration
echo 3. This will run the database fix automatically

pause
