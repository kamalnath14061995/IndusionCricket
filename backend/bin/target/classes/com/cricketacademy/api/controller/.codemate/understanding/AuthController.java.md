# AuthController High-Level Documentation

## Overview

The `AuthController` is a REST API controller for handling user authentication and registration-related operations in the Cricket Academy system. It provides public endpoints for user registration, login, health checks, experience levels retrieval, validation of email and phone availability, and handling user logout.

## Main Endpoints

- **POST `/auth/register`**  
  Registers a new user.  
  - Expects: Registration details in the request body.
  - Handles: User creation, duplicate email detection, and error responses.

- **POST `/auth/login`**  
  Authenticates a user and returns login credentials (e.g., JWT token).  
  - Expects: Email and password in the request body.
  - Responds: User data and authentication token if successful.

- **GET `/auth/health`**  
  Health check endpoint for API monitoring.  
  - Responds: A confirmation that the API is running.

- **GET `/auth/experience-levels`**  
  Returns all possible user experience levels as defined in the system.

- **GET `/auth/validate-email?email={email}`**  
  Checks if a given email is available (not in use).

- **GET `/auth/validate-phone?phone={phone}`**  
  Checks if a given phone number is available (not in use).

- **POST `/auth/logout`**  
  Handles user logout.  
  - In stateless JWT authentication, this informs the client to remove the token.

## Common Features

- Returns a structured `ApiResponse` object with a message and result payload for consistency.
- Handles and logs errors, returning appropriate HTTP status codes and error messages.
- Uses constructor-based dependency injection with Lombok's `@RequiredArgsConstructor`.
- Annotated with `@RestController`, `@RequestMapping`, and `@CrossOrigin` for Spring Boot REST API conventions.
- All endpoints are accessible from any origin (CORS enabled with `"*"`).

## Notable Implementation Details

- **Validation:** Incoming registration requests are validated.
- **Error Handling:** Specific checks for duplicate users and authentication errors.
- **Token Handling:** Authentication returns a token; logout provides guidance for clients.
- **Sensitive Data Management:** Sensitive information (like passwords) is not returned in API responses.
- **Extensibility:** Designed for easy extension with additional authentication features.

---

**Intended Consumers:**  
Frontend applications, admin panels, or any client requiring user authentication and registration with the Cricket Academy backend.