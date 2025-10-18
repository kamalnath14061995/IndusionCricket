@echo off
echo Checking database state...
mysql -u root -pKamal@146 -e "USE cricket_academy; SHOW TABLES LIKE '%coach%';"

echo.
echo Checking flyway schema history...
mysql -u root -pKamal@146 -e "USE cricket_academy; SELECT version, description, script, success, installed_on FROM flyway_schema_history WHERE version = '16';"

echo.
echo Showing all tables...
mysql -u root -pKamal@146 -e "USE cricket_academy; SHOW TABLES;"

echo.
echo Attempting to repair migration...
cd backend
mvn flyway:repair -Dflyway.url=jdbc:mysql://localhost:3306/cricket_academy -Dflyway.user=root -Dflyway.password=Kamal@146

pause
