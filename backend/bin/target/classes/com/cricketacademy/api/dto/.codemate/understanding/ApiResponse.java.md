# ApiResponse<T> Class Documentation

## Overview

The `ApiResponse<T>` class provides a standardized structure for API responses in the Cricket Academy application. It is a generic wrapper that ensures consistency in the response format returned from various API endpoints.

## Features

- **Generic Type:** Supports response data of any type with the generic parameter `<T>`.
- **Response Fields:**
  - `success`: Indicates if the operation was successful.
  - `message`: Human-readable status or error description.
  - `data`: The main payload of the response, can be any object.
  - `timestamp`: Time when the response was created.
- **Lombok Annotations:** Uses `@Data`, `@NoArgsConstructor`, and `@AllArgsConstructor` to auto-generate getters, setters, constructors, and utility methods.
- **Static Factory Methods:** Provides convenient static methods for quickly building standardized success and error responses.

## Usage Pattern

API controllers can use this class to return responses such as:

- `ApiResponse.success("Operation successful", responseData)` — for successful operations with data.
- `ApiResponse.success("No data found")` — for successful operations with no data.
- `ApiResponse.error("Resource not found")` — for error responses without additional data.
- `ApiResponse.error("Validation failed", errorDetails)` — for error responses with extra information.

## Example

```java
return ApiResponse.success("Player created successfully", playerDto);
```

```java
return ApiResponse.error("Player not found");
```

## Purpose

The primary goal is to ensure that all API responses follow a consistent structure, making it easier for frontend applications or API consumers to parse and handle responses reliably.