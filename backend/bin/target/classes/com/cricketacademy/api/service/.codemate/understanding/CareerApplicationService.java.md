# CareerApplicationService – High-Level Documentation

## Overview
`CareerApplicationService` is a Spring-managed service that handles the business logic for managing career applications within a Cricket Academy system. It provides methods to submit, retrieve, update, and query career applications based on various criteria. The service acts as an intermediary between controllers and the data repository.

## Key Responsibilities

- **Submit Applications:** Accept and persist new career application submissions.
- **Retrieve Applications:** Fetch all applications, get applications by specific statuses, and obtain details for individual applications.
- **Update Application Status:** Change the status (e.g., PENDING, APPROVED) of an application based on workflow requirements.
- **Filter Approved Coaches:** Provide a way to list all applications for coaches who have already received approval.

## Main Methods

1. **submitApplication(CareerApplication application)**
   - Persists a new career application.
   - Logs the submission process and related events.
   - Throws a runtime exception if saving fails.

2. **getAllApplications()**
   - Retrieves all career applications from the repository.

3. **getApplicationsByStatus(ApplicationStatus status)**
   - Returns all applications matching a given status (e.g., PENDING, APPROVED).

4. **updateApplicationStatus(Long id, ApplicationStatus status)**
   - Finds an application by ID and updates its status.
   - Throws an exception if the application does not exist.

5. **getApprovedCoaches()**
   - Returns all applications with a status of APPROVED (for use cases like listing approved coaches).

6. **getApplicationById(Long id)**
   - Retrieves a specific application by its identifier.
   - Throws an exception if not found.

## Transactionality & Logging

- **Transactional:** The service is transactional; operations are executed within a transaction context.
- **Logging:** Important events such as submissions, errors, and saves are logged using SLF4J.

## Dependencies

- `CareerApplicationRepository` (Spring Data repository for database access).
- `CareerApplication` Entity and its embedded `ApplicationStatus` enum.

---

**In summary:**  
`CareerApplicationService` provides the main interface for managing the workflow and status of career applications within the academy system, abstracting and encapsulating the interaction with the persistence layer.