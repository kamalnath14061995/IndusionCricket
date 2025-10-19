# CareerController: High-Level Documentation

## Overview

The `CareerController` is a REST controller for handling career application functionalities in a cricket academy system. It provides endpoints for registering career applications, retrieving applications by various criteria, updating application status, and fetching approved coaches. The controller delegates business logic to a service layer (`CareerApplicationService`) and manages validation, error handling, and standard REST HTTP responses.

---

## Main Functionalities

### 1. Application Registration

- **Endpoint:** `POST /career/register`
- **Purpose:** Accepts new career applications.
- **Validation:** Ensures name, email, phone, and position type are present and non-empty.
- **Success Response:** Returns the created application with HTTP 201.
- **Failure Response:** Bad request for missing fields; HTTP 500 for internal errors.

### 2. Retrieve All Applications

- **Endpoint:** `GET /career/applications`
- **Purpose:** Lists all submitted career applications.
- **Response:** HTTP 200 with a list of applications.

### 3. Retrieve Applications by Status

- **Pending Applications:**  
  - **Endpoint:** `GET /career/applications/pending`  
  - **Purpose:** Lists all applications with `PENDING` status.
- **Approved Applications:**  
  - **Endpoint:** `GET /career/applications/approved`  
  - **Purpose:** Lists all applications with `APPROVED` status.

### 4. Update Application Status

- **Endpoint:** `PUT /career/applications/{id}/status?status=APPROVED|PENDING|...`
- **Purpose:** Updates the status of a given application by ID.
- **Response:** Return the updated application or HTTP 404 if not found.

### 5. Fetch Approved Coaches

- **Endpoint:** `GET /career/coaches`
- **Purpose:** Retrieves all approved coach applications.
- **Response:** HTTP 200 with a list of approved coaches.

### 6. Get Application by ID

- **Endpoint:** `GET /career/applications/{id}`
- **Purpose:** Fetches details for a specific application via its ID.
- **Response:** Application if found, HTTP 404 if not.

---

## Notes

- The controller uses Cross-Origin Resource Sharing (`@CrossOrigin(origins = "*")`) to allow requests from any origin.
- All endpoints are prefixed by `/career`.
- Logging is present for request handling and error tracing.
- Delegates business logic and data operations to a `CareerApplicationService` (not shown).
- Handles both success and error cases with proper HTTP status codes and messages.

---

**Intended Audience:**  
Any developer or API consumer seeking to understand or integrate the career application management endpoints for the cricket academy system. No implementation or service layer specifics are included in this documentation.