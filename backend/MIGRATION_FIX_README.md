# Migration V30 Fix Guide

## Problem
The V30 migration (`V30__enhance_bookings_table.sql`) failed because it attempted to add 100+ columns in a single migration, exceeding MySQL's row size limits.

## Solution
We've split the original V30 migration into three smaller, manageable parts:
- **V30__enhance_bookings_table_part1.sql** - Essential booking enhancements (10 columns)
- **V31__enhance_bookings_table_part2.sql** - Additional features (30 columns)  
- **V32__enhance_bookings_table_part3.sql** - Financial and contact info (remaining columns)

## Fix Steps

### Option 1: Automatic Fix (Recommended)
1. **Run the fix script**:
   ```bash
   cd backend
   fix_failed_migration.bat
   ```

### Option 2: Manual Fix
1. **Stop the application** if running
2. **Remove the failed V30 migration**:
   ```bash
   rm src/main/resources/db/migration/V30__enhance_bookings_table.sql
   ```
3. **Repair Flyway**:
   ```bash
   mvn flyway:repair -Dflyway.url=jdbc:mysql://localhost:3306/cricket_academy -Dflyway.user=root -Dflyway.password=root
   ```
4. **Run migrations**:
   ```bash
   mvn flyway:migrate -Dflyway.url=jdbc:mysql://localhost:3306/cricket_academy -Dflyway.user=root -Dflyway.password=root
   ```
5. **Start the application**:
   ```bash
   mvn spring-boot:run
   ```

### Option 3: Database Manual Fix
If the above options don't work, use the SQL script:
1. **Connect to MySQL**:
   ```bash
   mysql -u root -p cricket_academy
   ```
2. **Run the manual fix**:
   ```sql
   source manual_migration_fix.sql
   ```

## Verification
After applying the fix, verify:
1. **Check migration status**:
   ```sql
   SELECT * FROM flyway_schema_history WHERE version IN ('30', '31', '32');
   ```
2. **Check table structure**:
   ```sql
   DESCRIBE bookings;
   ```
3. **Test application startup**:
   ```bash
   mvn spring-boot:run
   ```

## Troubleshooting
- **If columns already exist**: The new migrations use safe `ADD COLUMN` statements
- **If Flyway repair fails**: Use the manual SQL approach
- **If MySQL row size exceeded**: The split migrations ensure we stay within limits
- **Check MySQL version**: Ensure MySQL 5.7+ for JSON support

## Database Configuration
Ensure your `application.yml` has:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/cricket_academy
    username: root
    password: Kamal@146
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
