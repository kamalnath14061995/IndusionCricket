# Migration V16 Fix Guide

## Problem
The Flyway migration V16 has failed and left the database in a corrupted state, preventing the Spring Boot application from starting.

## Root Cause Analysis
Based on the error message: "Schema `cricket_academy` contains a failed migration to version 16"

## Step-by-Step Fix

### Step 1: Manual Database Repair (Required)

Since MySQL is not directly accessible from the command line, you'll need to:

1. **Open MySQL Workbench or MySQL Command Line Client**
2. **Connect to your database** using:
   - Host: localhost
   - Port: 3306
   - Username: root
   - Password: Kamal@146
   - Database: cricket_academy

3. **Check the failed migration status**:
```sql
USE cricket_academy;
SELECT version, description, script, success, installed_on 
FROM flyway_schema_history 
WHERE version = '16';
```

4. **Repair the failed migration**:
```sql
-- Option A: Mark the migration as failed and let it retry
UPDATE flyway_schema_history 
SET success = 0 
WHERE version = '16';

-- Option B: Delete the failed migration record (use with caution)
DELETE FROM flyway_schema_history 
WHERE version = '16';
```

5. **Check existing tables**:
```sql
SHOW TABLES LIKE '%coach%';
SHOW TABLES LIKE '%program%';
```

### Step 2: Fix Migration Script Issues

The original V16 migration has been updated to prevent conflicts:

1. **Replace the existing V16 file** with the fixed version:
   - File: `backend/src/main/resources/db/migration/V16__create_available_programs_table_fixed.sql`
   - This version uses `CREATE TABLE IF NOT EXISTS` to prevent conflicts

2. **Or manually update the existing V16 file** to use defensive SQL:
   - Add `IF NOT EXISTS` clauses
   - Add proper error handling

### Step 3: Alternative Solutions

#### Option A: Skip Failed Migration
1. Temporarily disable Flyway in application.yml:
```yaml
spring:
  flyway:
    enabled: false
```

2. Start the application to verify other components work

#### Option B: Baseline and Restart
1. Set a new baseline for Flyway:
```yaml
spring:
  flyway:
    baseline-on-migrate: true
    baseline-version: 16
```

### Step 4: Manual Table Creation (If Needed)

If the migration continues to fail, manually create the tables:

```sql
USE cricket_academy;

-- Create available_programs table
CREATE TABLE IF NOT EXISTS available_programs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    program_name VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    level VARCHAR(50),
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create expert_coaches table
CREATE TABLE IF NOT EXISTS expert_coaches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    specialization VARCHAR(255),
    experience_years INTEGER,
    certifications TEXT,
    bio TEXT,
    profile_image_url VARCHAR(500),
    hourly_rate DECIMAL(10,2),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create program_coaches mapping table
CREATE TABLE IF NOT EXISTS program_coaches (
    program_id BIGINT NOT NULL,
    coach_id BIGINT NOT NULL,
    PRIMARY KEY (program_id, coach_id),
    FOREIGN KEY (program_id) REFERENCES available_programs(id) ON DELETE CASCADE,
    FOREIGN KEY (coach_id) REFERENCES expert_coaches(id) ON DELETE CASCADE
);

-- Insert successful migration record
INSERT INTO flyway_schema_history (version, description, script, checksum, installed_by, installed_on, execution_time, success)
VALUES ('16', 'create available programs table', 'V16__create_available_programs_table.sql', 123456789, 'root', NOW(), 100, 1);
```

### Step 5: Verification Steps

1. **After fixing the migration**:
   - Run: `mvn -f backend/pom.xml spring-boot:run`
   - Check application starts without Flyway errors

2. **Verify tables were created**:
```sql
SHOW TABLES;
DESCRIBE available_programs;
DESCRIBE expert_coaches;
DESCRIBE program_coaches;
```

3. **Check application logs** for successful startup

## Troubleshooting

### Common Issues and Solutions

1. **"Table already exists" error**:
   - Use `CREATE TABLE IF NOT EXISTS` in migration scripts
   - Manually drop conflicting tables if safe to do so

2. **Foreign key constraint failures**:
   - Ensure referenced tables exist before creating foreign keys
   - Check data types match between referenced columns

3. **Migration checksum mismatches**:
   - Update the checksum in flyway_schema_history
   - Or use `mvn flyway:repair` after fixing the script

### Emergency Recovery

If all else fails:
1. Backup your database
2. Drop the cricket_academy database and recreate it
3. Run all migrations from scratch
4. Restore any necessary data from backup

## Next Steps

1. Follow the manual database repair steps above
2. Update the V16 migration script with the provided fixes
3. Restart the Spring Boot application
4. Verify the application starts successfully
