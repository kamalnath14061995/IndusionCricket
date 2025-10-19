@echo off
echo ========================================
echo Simple Migration Fix for V30
echo ========================================

cd backend

echo Removing failed V30 migration...
del src\main\resources\db\migration\V30__enhance_bookings_table.sql 2>nul

echo Running Flyway repair...
call mvn flyway:repair -Dflyway.url=jdbc:mysql://localhost:3306/cricket_academy -Dflyway.user=root -Dflyway.password=Kamal@146

echo Running migrations...
call mvn flyway:migrate -Dflyway.url=jdbc:mysql://localhost:3306/cricket_academy -Dflyway.user=root -Dflyway.password=Kamal@146

echo Starting application...
call mvn spring-boot:run

pause
