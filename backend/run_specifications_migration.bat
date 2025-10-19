@echo off
echo Adding specifications column to expert_coaches table...

mysql -u root -p cricket_academy < add_specifications_column.sql

if %errorlevel% equ 0 (
    echo Migration completed successfully!
) else (
    echo Migration failed!
)

pause