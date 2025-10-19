# Security Vulnerability Report

## File: `User.java` (Entity)

### Summary

This report reviews security vulnerabilities found in the provided `User` entity implementation for a Cricket Academy API, particularly in the context of sensitive data management and integration with Spring Security. Aspects such as password handling, sensitive information exposure, role/authority assignment, and validation are considered.

---

## 1. Plaintext Password Storage

**Issue:**
- The `password` field is stored directly as a `String` in the entity with no indication of hashing or encryption.
- No evidence of password hashing/salting in this entity or via JPA/Jackson annotations.
  
**Risk:**
- If the password is persisted as-is, it will be stored in plaintext in the `users` table, leading to a severe security breach if the database is ever leaked or accessed by attackers.

**Recommendation:**
- Passwords must **never** be stored in plaintext.
- Always hash passwords client-side (or in the service layer) using a strong hashing algorithm (e.g., BCrypt, Argon2).
- Mark the field as sensitive. Avoid serializing the password when returning entities via API.

---

## 2. Unrestricted Role Assignment

**Issue:**
- The `role` field (`UserRole`) can be set via the entity directly, and in absence of security at the DTO/service/controller layers, mass assignment vulnerabilities may allow privilege escalation (e.g., registering as `ADMIN`).

**Risk:**
- Attackers may be able to create users with elevated roles (e.g., `ADMIN`, `COACH`) by tampering registration requests (if, e.g., registration DTO maps all fields blindly).

**Recommendation:**
- Lock down role assignment in the service/controller layers.
- Ignore the `role` property on public registration endpoints or default it server-side.
- Consider using custom deserialization logic or validation to block unapproved role assignments.

---

## 3. Exposure of Sensitive User Information

**Issue:**
- The entity uses `@Data` (Lombok) which generates getters, setters, `toString()`, `equals()`, and `hashCode()`.
- The default `toString()` method will include **all fields**, including password, email, phone, etc.
- If this entity (or logs using `toString()`) are ever serialized in logs, or returned through APIs, sensitive info may leak.

**Risk:**
- Sensitive information (especially password!) may be inadvertently exposed in logs, traces, exceptions, or APIs.

**Recommendation:**
- Exclude password (and other sensitive fields) from `toString()`. 
    - Use Lombok's `@ToString(exclude = {"password"})`.
- Consider DTO mapping (do not expose the entity directly in API responses).
- Mark password as `@JsonIgnore` to prevent serialization.

---

## 4. Missing Account Lock/Expiration Checks

**Issue:**
- The entity contracts set `isAccountNonExpired` and `isCredentialsNonExpired` to always `true`.
- No mechanism is provided to implement expiry, lockout, or credential reset flows.

**Risk:**
- Accounts with compromised credentials may never expire.
- Inability to lock or force credential updates may increase vulnerability duration.

**Recommendation:**
- Consider extending the entity with fields and logic to handle:
    - Account expiration
    - Credential expiration/reset requirements
    - Account lockout after failed attempts (not shown in this entity)

---

## 5. Potential for Mass Assignment

**Issue:**
- Public setters for all fields (via @Data) means any field (e.g., `isActive`, `role`, `id`) can be set if the entity is bound directly to input, introducing a risk for mass-assignment vulnerabilities.

**Risk:**
- External clients might set fields that should only ever be controlled internally (e.g., Admins setting their account to inactive, or privilege escalation).

**Recommendation:**
- Never bind this entity directly to controller endpoints accepting user input.
- Use DTOs (Data Transfer Objects) for requests, map fields explicitly, and only accept the intended properties.

---

## 6. No Password Constraints on Complexity

**Issue:**
- Only a minimal length check on password is in place (`@Size(min = 6, message = "Password must be at least 6 characters")`).
- No checks on password complexity (e.g., use of numbers, symbols, letter cases, etc.).

**Risk:**
- Weak passwords are more easily guessable, especially if not hashed/salted, compounding the risk.

**Recommendation:**
- Enforce stronger password validation rules using regex or a password strength library.

---

## 7. No Audit or Logging Fields

**Issue:**
- While `createdAt` and `updatedAt` exist, there are no fields for tracking critical actions (e.g., last login, password change date, failed login counters).

**Risk:**
- Weak auditability; security incidents are harder to investigate.

**Recommendation:**
- Consider extending with audit fields in line with security policy (last login, failed login attempts, last password change, etc.).

---

## Summary Table

| Vulnerability                        | Severity | Recommendation                                   |
|-------------------------------------- |----------|--------------------------------------------------|
| Plaintext password storage           | Critical | Hash/salt password before persistence            |
| Role assignment via public fields    | High     | Lock role assignment in code, validate inputs    |
| Sensitive data in toString/getters   | High     | Exclude sensitive fields, use @JsonIgnore        |
| No account lock/expiry mechanism     | Medium   | Extend with lockout/expiration as needed         |
| Mass assignment risk                 | High     | Never use entity as input, employ DTOs           |
| Weak password complexity check       | Medium   | Enforce stronger password policies               |
| Missing audit fields                 | Low      | Add audit fields for security-critical events    |

---

## Final Recommendations

- **NEVER** bind this entity directly to user input in controllers.
- **Hash and salt** passwords at registration and update, using proven libraries.
- **Limit sensitive field exposure** using DTOs and serialization controls.
- **Validate and sanitize** inputs well above entity-level constraints.
- **Add auditing** and security event tracking to cover broader threat vectors.

---

**This review covers code-level issues only and does not guarantee overall security. Ensure a complete, defense-in-depth approach at all architectural layers.**