# UserController Documentation

## Overview

The `UserController` class is a Spring REST controller responsible for managing user-related operations in a cricket academy application. It provides various endpoints for users and administrators to interact with user data, update profiles, handle OTP (One-Time Password) processes, and retrieve user-related statistics.

---

## Endpoints

### 1. Get Current User Profile
- **GET** `/users/profile`
- Returns the profile details of the currently authenticated user.

### 2. Send OTP for Email or Phone Change
- **POST** `/users/{id}/send-otp`
- Sends an OTP to the email or phone when a user intends to update these fields.
- Payload specifies which field ("email" or "phone") and the new value.

### 3. Verify OTP and Update Email or Phone
- **POST** `/users/{id}/verify-otp`
- Verifies the received OTP, then updates the user's email or phone field if valid.

### 4. Update User Profile (Name and Age Only)
- **PUT** `/users/{id}/profile`
- Allows updating only the user’s `name` and `age` fields.

### 5. Get User by ID
- **GET** `/users/{id}`
- Retrieves user details by user ID. Intended for admin access.

### 6. Get All Active Users
- **GET** `/users`
- Returns a list of all active users. Intended for admin use.

### 7. Get Users by Experience Level
- **GET** `/users/experience-level/{level}`
- Lists users filtered by experience level.

### 8. Get User Statistics
- **GET** `/users/statistics`
- Returns user statistics such as count of users, grouped by certain attributes. Admin only.

### 9. Update User (General)
- **PUT** `/users/{id}`
- Update full user profile by ID. Accepts an updated `User` object.

### 10. Deactivate User Account
- **DELETE** `/users/{id}`
- Deactivates the user account by setting an "isActive" status to false or similar logic.

---

## Features & Responsibilities

- **User Data Security**: Current user's details are determined via Spring Security context.
- **OTP Handling**: Central functionality for email/phone changes uses OTP verification and sending logic.
- **Partial & Full Updates**: Supports partial updates (name/age only) and full updates via separate endpoints.
- **Admin Features**: User management and statistics endpoints are intended for administrators.
- **Error Handling**: Returns appropriate API responses and logs errors for debugging.
- **Standardized API Responses**: All responses are wrapped in a custom `ApiResponse` DTO, providing success/error codes and messages.

---

## Dependencies

- `UserService` for core user operations (find, update, deactivate, etc).
- `OtpService` for generating and validating OTP codes, as well as sending via email or SMS.
- Utilizes `ApiResponse` as a response wrapper.
- Uses SLF4J for logging and Lombok for boilerplate code reduction.

---

## Notes

- Cross-origin requests are allowed (`@CrossOrigin(origins = "*")`).
- All returned results are encapsulated in HTTP `ResponseEntity` objects for integration with HTTP status codes and headers.
- Some endpoints assume the presence of authentication and role management (i.e., admin-only operations).

---

## Security Considerations

- Although comments mention admin-only for some endpoints, actual security restrictions (e.g., annotations for role checks) are presumed to be elsewhere or implemented at a broader configuration level.
- Update and deactivate actions require a user ID as input; proper authorization/permission checks are expected in service/business logic.

---

This controller is central to user management and handles a range of tasks relating to user profiles, contact information updates via OTP, and administrative user analytics.