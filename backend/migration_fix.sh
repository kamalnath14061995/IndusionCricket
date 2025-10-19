#!/bin/bash

# Migration Fix Script for Bookings Table
# This script fixes the duplicate column error in V27 migration

echo "Starting migration fix for bookings table..."

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo "MySQL is not running. Please start MySQL and try again."
    exit 1
fi

# Database configuration
DB_NAME="cricket_academy"
DB_USER="root"
DB_PASS="Kamal@146"

# Function to execute MySQL commands
execute_mysql() {
    mysql -u $DB_USER -p$DB_PASS -e "$1" $DB_NAME
}

echo "Checking current bookings table structure..."
execute_mysql "DESCRIBE bookings;"

echo "Checking for duplicate columns..."
execute_mysql "SELECT 
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'facility_id') THEN 'facility_id exists' ELSE 'facility_id missing' END as facility_id_status,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'facility_name') THEN 'facility_name exists' ELSE 'facility_name missing' END as facility_name_status,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'ground_id') THEN 'ground_id exists' ELSE 'ground_id missing' END as ground_id_status,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'ground_name') THEN 'ground_name exists' ELSE 'ground_name missing' END as ground_name_status;"

echo "Applying fix..."
execute_mysql "source fix_bookings_schema.sql"

echo "Verifying fix..."
execute_mysql "DESCRIBE bookings;"

echo "Migration fix completed successfully!"
