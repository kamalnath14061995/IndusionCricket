## High-Level Documentation: JwtAuthenticationFilter

### Overview

`JwtAuthenticationFilter` is a custom security filter for authenticating HTTP API requests in a Spring Boot application using JWT (JSON Web Token) tokens. It extends `OncePerRequestFilter`, meaning it executes once per request. This filter is responsible for:

- Skipping authentication on certain public endpoints.
- Extracting JWT tokens from HTTP request headers.
- Validating JWT tokens and verifying the associated user's roles/authorities.
- Setting the Spring Security authentication context if the token is valid.

### Key Features and Design Details

#### **1. Public Endpoints**

- The filter defines a static list (`PUBLIC_ENDPOINTS`) of URI patterns that are publicly accessible and do not require JWT authentication.
- Requests to these endpoints or to `OPTIONS` requests (for CORS preflight) **bypass the filter**.

#### **2. JWT Extraction and Validation**

- For non-public endpoints, the filter:
  - Extracts the JWT token from the `Authorization` header (`Bearer ...`).
  - Validates the token using the provided `JwtUtil` component.
  - Handles token expiration and potential validation errors.
  - Logs relevant information for debugging and security.

#### **3. Security Context Population**

- If the token is valid, it:
  - Parses user roles/authorities from the JWT claims (supports both list and comma-separated string formats).
  - Constructs one or more `SimpleGrantedAuthority` objects mapped with a `ROLE_` prefix.
  - Sets a `UsernamePasswordAuthenticationToken` in the `SecurityContextHolder`, so downstream code and security filters know the user is authenticated.

#### **4. Error Handling and Security Practices**

- If the token is missing, invalid, expired, or fails role parsing, the filter responds with an error and clears the security context.
- **Token Revocation Placeholder:** The filter provides a stub for checking if a JWT token is blacklisted/revoked but leaves the implementation to the developer.
- Logs are carefully managed to avoid leaking sensitive information.

#### **5. Security Recommendations**

- **CSRF:** The filter itself does **not** handle CSRF protection. If JWTs are stored in cookies, CSRF mitigation must be handled elsewhere (e.g., use SameSite cookies or explicit CSRF tokens).
- **Rate Limiting:** The filter does **not** implement rate limiting or brute force protection. These protections should be enforced at a higher level (such as the API gateway).
- **Logging:** Take care not to log sensitive user information in production.

### **Extension Points**

- **Token Revocation/Blacklist:** The method `isTokenRevoked` should be implemented to check against a revoked/blacklist tokens pool if needed.
- **Role Parsing:** Handles conversion between claim formats; only supports string lists and comma-separated strings.

### **Testing Recommendations**

- Unit tests are recommended to cover all logic branches, with particular focus on error and edge cases.

---

**Summary:**  
This filter forms a core part of a JWT-based API authentication system, mediating access to secured endpoints, enforcing role-based authorization, and integrating with Spring Security's context model. It is designed for extensibility and includes explicit caveats about its limitations regarding CSRF, rate limiting, and sensitive data handling.