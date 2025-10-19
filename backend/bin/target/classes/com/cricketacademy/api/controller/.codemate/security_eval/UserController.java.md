# Security Vulnerability Report for UserController

## Overview

This report analyzes the provided `UserController` code, focusing **only on security vulnerabilities**. Key focus areas include authentication, authorization, data exposure, input validation, and general security best practices for a REST API handling user operations.

---

## Security Vulnerabilities Identified

### 1. **Missing Access Control and Authorization Checks**

**Vulnerability:**  
Most endpoints that accept a user `id` via the URL, such as `/users/{id}/send-otp`, `/users/{id}/verify-otp`, `/users/{id}/profile`, `/users/{id}`, `/users/{id}`, and `/users/{id}` (DELETE), do **not** verify whether the caller is authorized to access or modify the data for that particular user.

**Impact:**  
An authenticated attacker could perform actions (update/deactivate/get) against arbitrary users by providing their user IDs, leading to direct account takeover, unauthorized updates, or data leakage.

**Example:**
```java
@PutMapping("/{id}")
public ResponseEntity<ApiResponse<Map<String, Object>>> updateUser(
        @PathVariable Long id, @RequestBody User updatedUser) {
    // No check if current user matches id or is admin
}
```

**Recommendation:**  
- Extract the authenticated user (from `SecurityContextHolder`). Check if the caller is modifying/accessing their own profile, or if they have an admin role for admin-level operations.
- Add annotations (e.g., `@PreAuthorize("hasRole('ADMIN')")`) or explicit code-based role checks.

---
### 2. **Sensitive Data Exposure**

**Vulnerability:**  
Returning **full user objects** (e.g., in `getAllUsers`, `getUsersByExperienceLevel`) may expose sensitive data (such as hashed passwords or internal user attributes), depending on what is returned by `UserService` and how the `User` entity is defined.

**Impact:**  
Leakage of PII or sensitive application metadata.

**Example:**
```java
@GetMapping
public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
    List<User> users = userService.getAllActiveUsers();
    ApiResponse<List<User>> response = ApiResponse.success(
            "Users retrieved successfully", users);
    return ResponseEntity.ok(response);
}
```

**Recommendation:**  
- Never serialize and expose entity objects directly. Use DTOs containing only non-sensitive, necessary fields.
- Double-check what fields the `User` object exposes in its JSON serialization.

---
### 3. **Account Takeover via OTP Endpoints**

**Vulnerability:**  
`/users/{id}/send-otp` and `/users/{id}/verify-otp` accept a user ID as a path variable with no check that the ID matches the current, authenticated user.

**Impact:**  
Any authenticated user can attempt to change another user's email or phone number by guessing or iterating IDs, and possibly receive the OTP (depending on system configuration), or brute-force OTPs for another user.

**Example:**
```java
@PostMapping("/{id}/send-otp")
public ResponseEntity<ApiResponse<Object>> sendOtp(@PathVariable Long id, ...)
```

**Recommendation:**  
- Ensure users can only send/verify OTPs for themselves.
- Do **not** use path parameters for IDs on self-service operations; infer the user from the authentication context.

---
### 4. **Improper Input Validation and Type Handling**

**Vulnerability:**  
Handling of user-supplied data from JSON payloads (`Map<String, Object> updates`, or `User updatedUser` from request body) is performed without explicit validation or sanitization.

**Impact:**  
Attackers might submit data types or values leading to unexpected behavior (for example, purposely crafted invalid or malicious payloads). May also lead to over-posting attacks if the `User` entity is mapped directly.

**Example:**
```java
@PutMapping("/{id}")
public ResponseEntity<ApiResponse<Map<String, Object>>> updateUser(
        @PathVariable Long id, @RequestBody User updatedUser)
```

**Recommendation:**  
- Use DTOs for request payloads, not domain entities.
- Validate and sanitize input for type, length, and content.
- Employ bean validation (JSR-380, e.g., `@Valid`) and input constraints.

---
### 5. **Missing Cross-Site Request Forgery (CSRF) Protection**

**Vulnerability:**  
No evidence of CSRF protection for state-changing operations. This is especially relevant if the API can be used from browsers by authenticated users.

**Impact:**  
Possible for an attacker to forge requests on behalf of authenticated users, especially when `@CrossOrigin(origins = "*")` is enabled.

**Recommendation:**  
- If only used as a pure API (with stateless authentication like JWT, and not session cookies), this may be lower risk.
- Otherwise, ensure CSRF protection is enabled in Spring Security.

---
### 6. **Excessive Cross-Origin Resource Sharing (CORS) Permissions**

**Vulnerability:**  
`@CrossOrigin(origins = "*")` opens all endpoints to any origin, increasing the attack surface for XSS/phishing and impacts CSRF (see above).

**Impact:**  
Allows requests from any domain, regardless of their origin.

**Recommendation:**  
- Restrict allowed origins to trusted domains only (`@CrossOrigin(origins = {"https://yourdomain.com"})`).
- Avoid global wildcards for production.

---
### 7. **Insufficient Logging of Security Events**

**Vulnerability:**  
Logging is used for operational info but may also log sensitive information. For example, logs include email/phone and OTP events.

**Impact:**  
Sensitive data may enter log files, which could be accessed by unauthorized internal users or attackers.

**Recommendation:**  
- Avoid logging sensitive information (such as OTPs, emails, or phone numbers).
- Log only what is necessary for auditing security events.

---

## Summary Table

| Vulnerability                                            | Severity | Recommendation                                    |
|----------------------------------------------------------|----------|---------------------------------------------------|
| Missing authorization checks on user-modifying endpoints | HIGH     | Enforce authentication and authorization checks   |
| Sensitive data exposure via User entity                  | HIGH     | Use DTOs; never expose full entity objects        |
| OTP endpoints allow account takeover                     | CRITICAL | Only allow OTP ops for logged-in user             |
| Input validation and over-posting                        | MEDIUM   | Use DTOs and validate all input                   |
| CSRF protection (w/CORS wildcard)                        | MEDIUM   | Restrict CORS; enable CSRF if session used        |
| CORS wildcard                                            | MEDIUM   | Whitelist trusted origins                         |
| Logging sensitive information                            | LOW      | Redact sensitive data from logs                   |

---

## References

- [Spring Security Documentation](https://docs.spring.io/spring-security/site/docs/current/reference/html5/)
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Java Bean Validation (JSR-380)](https://beanvalidation.org/2.0/)

---

## Conclusion

To secure this controller, **add strict authentication and authorization checks**, refactor data exposure, validate/sanitize all inputs, restrict CORS properly, and handle logging with care. Review your security configuration holistically with the above in mind.