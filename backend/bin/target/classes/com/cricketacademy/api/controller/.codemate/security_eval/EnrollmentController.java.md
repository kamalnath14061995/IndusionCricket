# Security Vulnerability Assessment Report

## File: `EnrollmentController.java`
**Package:** `com.cricketacademy.api.controller`

---

### Overview

The provided Java Spring Boot controller handles user enrollment for programs. It exposes endpoints to enroll a user and to check their enrollment status.

This report evaluates the code strictly for **security vulnerabilities**. Business logic, code style, and performance issues are not within scope.

---

## 1. Insecure Direct Object Reference (IDOR)

**Code:**
```java
public Enrollment getStatus(@RequestParam Long userId, @RequestParam Long programId) {
    return enrollmentService.getEnrollment(userId, programId);
}
```
**Explanation:**
- The API exposes a GET endpoint `/api/enrollments/status` that allows arbitrary reading of enrollment statuses by specifying `userId` and `programId` as request parameters.
- **Risk:** An attacker could query the enrollment status of any user/program combination by simply providing the relevant IDs, potentially exposing sensitive user information.
- **Mitigation:** Enforce authentication and authorization. Only allow users to access their own enrollment records, unless the user has explicit administrative privileges.

---

## 2. Lack of Authentication/Authorization

**Code:**
- No `@PreAuthorize`, `@Secured`, or similar Spring Security annotations on any controller method.
- No reference to authentication or user identity.

**Explanation:**
- All controller methods are exposed without authentication or access restrictions.
- **Risk:** Unauthenticated or unauthorized users can perform enrollments and query statuses, potentially leading to unauthorized actions and data disclosure.
- **Mitigation:** Integrate Spring Security and annotate methods to require proper authentication and role-based authorization.

---

## 3. Possible Mass Assignment

**Code:**
```java
public static class EnrollmentRequest {
    private Long userId;
    private Long programId;
    private String paymentMethod;
    private String programTitle;
    private String coachName;
}
```
**Explanation:**
- The request body allows the client to supply critical fields such as `userId`, `programId`, `paymentMethod`, `programTitle`, and `coachName`.
- **Risk:** If these fields are not validated server-side, a user can submit an enrollment on behalf of another user or assign themselves to unauthorized programs or coaches.
- **Mitigation:** Extract the authenticated user's identity from the security context instead of trusting a `userId` from the request body. Validate that the enrollment request matches the user's permissions.

---

## 4. Potential Information Disclosure

**Code:**
```java
return new EnrollmentResponse(enrollment.getStatus(), "Enrollment " + enrollment.getStatus());
```
and
```java
return enrollmentService.getEnrollment(userId, programId);
```
**Explanation:**
- Enrollment status and possibly other details are returned directly to the client.
- **Risk:** Without filtering or access controls, sensitive data could be exposed through detailed responses, especially if the `Enrollment` object includes more information than intended.
- **Mitigation:** Only return minimally required information in API responses and ensure sensitive fields are never serialized or exposed.

---

## 5. No Input Validation & Lack of CSRF Protection

**Details:**
- The controller assumes all incoming data (including `paymentMethod`, `programTitle`, `coachName`) are valid and safe.
- **Risk:** Accepting unvalidated input can aid injection attacks where downstream services are vulnerable (e.g., SQL injection, log injection).
- As a REST-API (stateless), CSRF is less concerning, but if accessed from browsers, ensure CSRF protections are in place.
- **Mitigation:** Validate all user input; consider whitelisting allowed values for enumerated fields (such as `paymentMethod`). Sanitize or encode as necessary before database/storage or output.

---

## Conclusion & Recommendations

### Summary Table

| Vulnerability                           | Description                                                      | Risk         | Mitigation                             |
|------------------------------------------|------------------------------------------------------------------|--------------|----------------------------------------|
| Insecure Direct Object Reference (IDOR)  | Anyone can query/enroll for any user by supplying userId         | High         | Enforce authN/authZ, context user IDs  |
| Lack of Authentication/Authorization     | No method-level restrictions or authentication                   | Critical     | Integrate and enforce Spring Security  |
| Mass Assignment                         | Critical properties supplied freely by user                      | High         | Use authenticated principal only       |
| Information Disclosure                  | Enrollment object(s) leaked; excessive info exposure             | Medium       | Filter/sanitize API responses          |
| No Input Validation                     | Data is not checked for correctness/safety                       | Medium       | Validate inputs, sanitize all fields   |

### Actionable Next Steps

1. **Integrate Spring Security** to require authentication for all endpoints.
2. **Restrict actions and queries to the authenticated user** unless privileged roles (e.g., admin) are present; never trust user-supplied IDs.
3. **Validate all incoming data**; accept only the strictly necessary fields from clients.
4. **Limit the information provided in responses** to clients to avoid unnecessary data leaks.
5. **Sanitize and validate all inputs/output** to prevent injection and other attacks.

---

> **NOTE:** The actual security of the endpoint also depends on the implementation of `EnrollmentService` and how the returned objects are serialized and stored. Review those components for further vulnerabilities.

---

**End of Security Vulnerability Report**