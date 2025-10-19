# EnrollmentController Documentation (High-Level Overview)

## Overview
`EnrollmentController` is a Spring Boot REST controller responsible for managing enrollment operations in a cricket academy web application. It exposes endpoints to enroll a user in a program and to retrieve the status of a user's enrollment.

## Endpoints

### 1. Enroll in a Program

- **URL**: `/api/enrollments/enroll`
- **HTTP Method**: POST
- **Request Body**: `EnrollmentRequest` JSON object containing:
  - `userId`: ID of the user enrolling
  - `programId`: ID of the program
  - `paymentMethod`: Payment method used
  - `programTitle`: Title of the program (for record-keeping or messaging)
  - `coachName`: Name of the coach (for record-keeping or messaging)
- **Response**: `EnrollmentResponse` JSON object:
  - `status`: The status of the enrollment (e.g., "success", "failed")
  - `message`: Confirmation or status message
- **Behavior**: Delegates to an `EnrollmentService` to handle the actual enrollment logic, then returns a status response.

### 2. Get Enrollment Status

- **URL**: `/api/enrollments/status`
- **HTTP Method**: GET
- **Query Parameters**:
  - `userId`: ID of the user
  - `programId`: ID of the program
- **Response**: `Enrollment` object with details about the user's enrollment in the specified program.
- **Behavior**: Queries the `EnrollmentService` for the enrollment details.

## Supporting Classes

- **EnrollmentRequest**: Data transfer object (DTO) for enrollment requests, contains all necessary parameters to enroll a user.
- **EnrollmentResponse**: DTO used for enrollment responses, encapsulating the status and a message.
- **Enrollment**: (Imported model) Represents the enrollment entity with properties such as status.

## Dependencies

- Uses a service layer (`EnrollmentService`) to encapsulate business logic.
- Uses Lombok's `@Data` to generate boilerplate code in DTOs.
- Managed by Spring's dependency injection (`@Autowired`).

## Purpose

This controller serves as the main entry point for clients (such as front-end apps or third parties) to enroll users into programs and fetch enrollment status within the cricket academy system.