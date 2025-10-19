# High-Level Documentation: Application Configuration

This code represents a comprehensive application configuration file for a Spring Boot-based Cricket Academy API service. Below is a high-level overview of its purpose and features.

---

## 1. Server Configuration
- **Port**: The API server will listen on port **8080**.
- **Context Path**: All endpoints are prefixed with **/api** (e.g., `/api/players`).

---

## 2. Database Configuration
- **Database**: Connects to a **MySQL** database named `cricket_academy`.
- **Credentials**: Uses the provided username and password for authentication.
- **JPA Settings**:
  - Auto-updates database schema (`ddl-auto: update`).
  - SQL statements are logged and formatted for readability.
  - Uses the **MySQL dialect** for Hibernate.
  - Disables Open Session in View for transactional safety.
  - Allows deferred datasource initialization.

---

## 3. JSON Handling (Jackson)
- **Non-null Serialization**: Only serializes properties with non-null values.
- **Human-readable Dates**: Dates are written in ISO-8601 format, not as timestamps.

---

## 4. Logging Configuration
- **Log Levels**:
  - Detailed debug logs enabled for the application, Spring Security, and Hibernate SQL.
  - SQL parameter bindings logged at TRACE level.
- **Log Pattern**: Console output includes a timestamp for each log message.

---

## 5. Application-Specific Configuration
- **JWT Properties**:
  - A secret key for signing JWT tokens.
  - Token expiration set to 24 hours.

---

### Summary

This configuration ensures the application:
- Runs under a consistent, versioned API path.
- Uses a local MySQL database with automatic schema management.
- Has robust, detailed logging (including SQL and security events).
- Serializes JSON efficiently and in a readable format.
- Secures API endpoints with JWT-based authentication.

**Note:** In a production setting, sensitive values such as database credentials and JWT secrets should be externalized and securely managed.