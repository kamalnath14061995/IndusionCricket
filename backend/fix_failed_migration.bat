@echo off
echo ========================================
echo Fixing Failed Flyway Migration V30
echo ========================================

echo 1. Stopping any running application...
taskkill /f /im java.exe 2>nul

echo 2. Backing up current migration files...
cd backend
mkdir backup_migrations 2>nul
copy src\main\resources\db\migration\V30__enhance_bookings_table.sql backup_migrations\V30__enhance_bookings_table.sql.bak 2>nul

echo 3. Removing failed V30 migration...
del src\main\resources\db\migration\V30__enhance_bookings_table.sql

echo 4. Running Flyway repair...
mvn flyway:repair -Dflyway.url=jdbc:mysql://localhost:3306/cricket_academy -Dflyway.user=root -Dflyway.password=Kamal@146

echo 5. Running Flyway migrate with new split migrations...
mvn flyway:migrate -Dflyway.url=jdbc:mysql://localhost:3306/cricket_academy -Dflyway.user=root -Dflyway.password=Kamal@146
echo 6. Starting application...
mvn spring-boot:run

pause
