@echo off
echo ========================================
echo Flyway V16 Migration Fix Verification
echo ========================================

echo.
echo 1. Checking MySQL connection...
mysql -u root -pKamal@146 -e "SELECT 'MySQL connection successful' as status;" 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Cannot connect to MySQL
    echo Please ensure MySQL is running and accessible
    pause
    exit /b 1
)

echo.
echo 2. Checking database state...
mysql -u root -pKamal@146 -e "USE cricket_academy; SELECT version, description, success, installed_on FROM flyway_schema_history WHERE version = '16';"

echo.
echo 3. Checking existing tables...
mysql -u root -pKamal@146 -e "USE cricket_academy; SHOW TABLES LIKE '%program%';"
mysql -u root -pKamal@146 -e "USE cricket_academy; SHOW TABLES LIKE '%coach%';"

echo.
echo 4. Attempting Flyway repair...
cd backend
mvn flyway:repair -Dflyway.url=jdbc:mysql://localhost:3306/cricket_academy -Dflyway.user=root -Dflyway.password=Kamal@146

echo.
echo 5. Checking repair status...
mysql -u root -pKamal@146 -e "USE cricket_academy; SELECT version, description, success FROM flyway_schema_history WHERE version = '16';"

echo.
echo ========================================
echo Next Steps:
echo 1. If repair successful, run: mvn spring-boot:run
echo 2. If repair failed, follow TODO.md manual steps
echo ========================================
pause
