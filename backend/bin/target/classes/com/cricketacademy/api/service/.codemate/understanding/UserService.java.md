# UserService Class - High-Level Documentation

## Overview
The `UserService` class is a Spring `@Service` component responsible for managing user-related operations within the Cricket Academy API. It orchestrates user CRUD operations, authentication, registration, profile management, and statistics aggregation. The class integrates with the `UserRepository` for data access, employs `PasswordEncoder` for security, and leverages `JwtUtil` for authentication tokens.

---

## Key Responsibilities

### 1. User Retrieval
- **Find by Email**: Retrieves a user entity by email.
- **Find by ID**: Retrieves a user entity by ID.
- **Get All Active Users**: Lists all currently active users (users who are not deactivated).
- **Get Users by Experience Level**: Fetches users filtered by their experience level and active status.

### 2. User Statistics
- **UserStatistics Inner Class**: Aggregates and exposes user statistics, such as total users and active users.
- **Get User Statistics**: Provides summarized user count metrics.

### 3. User Profile and Update Operations
- **Update User**: Updates an existing user's details (including secure password update and activation status) by ID.
- **Update Current User Profile**: Allows a user to update their own profile (name, phone, age, experience level) based on their email.
- **Deactivate User**: Soft-deletes a user by marking them as inactive.
- **Reset User Password**: Securely resets and updates a user's password via email lookup.

### 4. Authentication and Registration
- **Authenticate User**: Verifies credentials and issues a JWT token if authentication is successful.
- **Register User**: Creates a new user account after validating for unique email and phone. Assigns default role and encodes password.

---

## Exception Handling
- Throws custom exceptions like `UserAlreadyExistsException` and `ValidationException` for business validation failures.
- Handles Spring Security's `BadCredentialsException` for authentication failures.

---

## Security
- Uses `PasswordEncoder` for hashing and verifying passwords.
- Employs JWT-based authentication for secure user sessions.

---

## Logging
- Uses SLF4J (`@Slf4j`) for logging significant operations, such as user registration and authentication errors.

---

## Design Notes
- **Transactional**: The class is annotated with `@Transactional` to ensure database atomicity.
- **Spring Integration**: Leverages Spring's dependency injection for repository, encoder, and JWT utilities.
- **DTO Usage**: Accepts and returns Data Transfer Objects (`RegistrationRequest`, `ProfileUpdateRequest`) to decouple API models from entities.

---

## Summary Table

| Feature Category        | Methods                                                                                    |
|------------------------|--------------------------------------------------------------------------------------------|
| User Retrieval         | `findByEmail`, `findById`, `getAllActiveUsers`, `getUsersByExperienceLevel`                |
| Statistics             | `getUserStatistics`, `UserStatistics` inner class                                          |
| Profile Management     | `updateUser`, `updateCurrentUserProfile`, `deactivateUser`, `resetUserPassword`            |
| Auth/Registration      | `authenticateUser`, `registerUser`                                                         |

---

## Usage Scenarios
- Registering new users with role-based defaults and validation.
- Authenticating users and providing JWT tokens for session management.
- Allowing users/admins to update and manage profile and status.
- Aggregating user base statistics for reporting/monitoring.

---

This service is central to user management within the Cricket Academy application, ensuring secure handling, validation, and modular access to user-centric operations.