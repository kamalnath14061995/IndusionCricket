# High-Level Documentation: GlobalExceptionHandler

## Overview

The `GlobalExceptionHandler` class provides centralized and consistent error handling for all controllers in the application. It intercepts exceptions thrown during request processing and returns standardized error responses, making error management and client communication uniform throughout the API.

This class uses Spring Boot's `@RestControllerAdvice` to globally catch exceptions and handle them accordingly. Logging is integrated via SLF4J to track and record error occurrences.

---

## Key Responsibilities

- **Centralized Exception Handling**: Captures and processes exceptions thrown in any controller without redundant code.
- **Uniform Error Responses**: Returns errors in a consistent structure using the `ApiResponse` wrapper.
- **Detailed Validation Feedback**: Extracts field-specific validation errors to aid clients in correcting input.
- **Appropriate HTTP Status Codes**: Responds with status codes that align with the nature of the error (`400`, `404`, `409`, `500`, etc).
- **Clear Logging**: Logs errors and warnings to facilitate debugging and system monitoring.

---

## Exception Handlers

| Exception Type                           | HTTP Code  | Description                                                        |
|------------------------------------------|------------|--------------------------------------------------------------------|
| MethodArgumentNotValidException          | 400        | Handles validation failures; provides field-level error details.    |
| UserAlreadyExistsException               | 409        | Handles user registration conflicts (user already exists).          |
| ValidationException                      | 400        | Handles business or data validation errors.                        |
| UsernameNotFoundException                | 404        | Handles user not found scenarios (e.g., during authentication).     |
| IllegalArgumentException                 | 400        | Handles illegal or malformed arguments supplied by client.          |
| Exception (catch-all)                    | 500        | Handles all unanticipated exceptions (generic/server errors).       |

---

## Response Structure

All error responses are wrapped in an `ApiResponse` object, potentially including error messages and detailed error maps (for validation failures).

---

## Example Usage Scenario

- **Validation failure**: A client sends an invalid request payload. The handler responds with a `400 Bad Request`, listing fields and reasons for each validation error.
- **Duplicate user registration**: A client tries to create an account with an existing username/email. The handler returns a `409 Conflict` with an appropriate message.
- **Unexpected system error**: An unhandled exception occurs. The handler logs the error and returns a `500 Internal Server Error` with a generic message.

---

## Summary

`GlobalExceptionHandler` ensures consistent, meaningful, and traceable error responses across the application's REST API, improving client interactions and simplifying error management for the development team.