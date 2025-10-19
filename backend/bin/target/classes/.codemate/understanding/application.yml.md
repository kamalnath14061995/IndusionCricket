# High-Level Documentation: Application Configuration

## Overview
This configuration file sets up a Spring Boot application backend for a Cricket Academy system, focusing on web, database, logging, and security (JWT) configurations. The file is structured using YAML syntax.

---

## Key Sections

### 1. Server Configuration
- **Port**: The application runs on port `8080`.
- **Context Path**: All REST endpoints are exposed under `/api`.

### 2. Database Configuration (Spring Datasource & JPA)
- **Datasource**: Connects to a local MySQL instance (database name: `cricket_academy`) using the specified JDBC URL, username, and password.
- **JPA (Hibernate)**:
    - Automatically updates the DB schema (`ddl-auto: update`).
    - SQL statements are shown in logs for debugging (`show-sql: true`).
    - MySQL dialect is used.
    - SQL formatting is enabled for readability.
    - Prevents lazy loading issues with `open-in-view: false`.
    - Delays DB initialization until the datasource is ready.

### 3. JSON Serialization (Jackson)
- Configures the application to ignore `null` properties in JSON output.
- Dates are serialized in ISO format instead of timestamps.

### 4. Logging Configuration
- **Logging Levels**: Enables DEBUG or TRACE level logging for application, security, web, and Hibernate SQL details to facilitate debugging.
- **Console Format**: Customizes log output with timestamp, thread, log level, and logger class.

### 5. Application Properties (JWT Authentication)
- **JWT Secret**: Defines a long, secure secret key used for signing JWT tokens (recommended to keep at least 64 characters for HS512 algorithm).
- **JWT Expiration**: Sets token validity to 24 hours (in milliseconds).

---

## Usage Context
This configuration is suitable for a development or staging environment (given the exposure of username/password), providing full-stack tracing, readable logging, and database auto-migration. Security-related keys (e.g., JWT secret) should be further secured before production deployment.