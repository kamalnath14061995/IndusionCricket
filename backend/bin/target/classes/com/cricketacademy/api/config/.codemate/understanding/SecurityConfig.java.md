# SecurityConfig Class – High-Level Documentation

This class provides the security configuration for a Spring Boot-based cricket academy application. The configuration manages authentication, authorization, CORS settings, and custom security behaviors.

---

## Key Responsibilities

### 1. **Authentication and JWT Integration**
- Integrates a custom JWT (JSON Web Token) authentication filter into the Spring Security filter chain, ensuring all requests are checked for valid JWTs before username/password authentication occurs.

### 2. **Authorization Rules**
- Configures access control for endpoints:
  - **Public Endpoints:** Whitelists specific endpoints (authentication, registration, health checks, static resources, payment, enrollments, OTP handling, and some career-related endpoints) to be accessible without authentication.
  - **Role-Based Access:** Restricts admin and coach endpoints to users with the appropriate roles (`ADMIN`, `COACH`).
  - **Authenticated Endpoints:** Secures other endpoints so users must be authenticated to access them.
  - **Catch-All:** Any request not explicitly permitted or restricted still requires authentication.

### 3. **CORS (Cross-Origin Resource Sharing)**
- Globally configures CORS to:
  - Allow requests from any origin.
  - Allow typical HTTP methods (GET, POST, PUT, DELETE, OPTIONS).
  - Accept any headers and permit credentials.
  - Set preflight cache to 1 hour.
  - **Special handling for all OPTIONS requests** to ensure CORS preflight is simply allowed.

### 4. **CSRF Protection**
- Disables CSRF (as is typical in stateless, token-based APIs).

### 5. **Password Encoding**
- Provides a bean for secure password hashing using BCrypt.

### 6. **Authentication Manager**
- Exposes the `AuthenticationManager` bean, typically required for custom auth flows or services.

### 7. **Custom Exception Handling**
- Configures custom responses for:
  - **Authentication Failure** – Sends a 403 with a structured JSON message on unauthenticated access.
  - **Access Denial** – Sends a 403 with a structured JSON message when the user lacks required permissions.

---

## Summary

This configuration ensures the application’s security requirements are met by combining JWT authentication, fine-grained authorization (including role-based access), open CORS policy for flexibility during development and integration, and standard secure password management. Custom error responses improve developer and client feedback on authorization errors.