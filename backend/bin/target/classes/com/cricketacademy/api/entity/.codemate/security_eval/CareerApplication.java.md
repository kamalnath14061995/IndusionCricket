# Security Vulnerability Report

## Code Analyzed

Entity: `CareerApplication`  
Package: `com.cricketacademy.api.entity`  
Frameworks: Spring Boot (assumed), Jakarta Persistence API (JPA), Lombok

---

## Summary

This report reviews the provided `CareerApplication` entity for potential security vulnerabilities from a persistence, data validation, and design standpoint.

---

## Identified Vulnerabilities

### 1. **Lack of Input Sanitization/Escaping - Risk of Injection Attacks**
- **Issue:**
    - Fields such as `name`, `email`, `qualifications`, `experience`, and `availability` are stored as plain strings.
    - There is no explicit handling to sanitize or escape content before persistence.
    - If these fields are incorporated into queries (via JPQL/HQL, native queries, or string concatenation in repository/service/controller layers) or output (to logs or frontend), this could contribute to SQL Injection or Cross-Site Scripting (XSS) risks in other application layers.
- **Example:**
    - Qualifying characters in `qualifications` or `experience` fields (like `'`, `;--`, `<script>`, etc.) could be abused if not properly handled elsewhere.
- **Recommendation:**
    - Ensure that:
        - All user input is validated and sanitized/escaped both at the API layer and prior to output/display.
        - Use parameterized queries at all times.
        - Employ frameworks/libraries for output encoding when displaying data in views.

### 2. **Lack of Field-level Encryption/Protection for Sensitive Data**
- **Issue:**
    - Sensitive PII (Personally Identifiable Information) fields: `name`, `email`, and `phone` are stored in plain text.
    - There's no indication that these fields are encrypted at rest or masked.
    - If the database is compromised, attacker can retrieve all PII easily.
- **Recommendation:**
    - Use column-level or field-level encryption for PII, especially `email` and `phone`.
    - Mask or hash sensitive fields when displaying or logging.
    - Annotate or handle such fields as sensitive in compliance with relevant data protection standards (GDPR, etc.).

### 3. **No Constraints on `phone` Field Format**
- **Issue:**
    - Only `@NotBlank` is used on `phone`.
    - No regex or format validation is applied.
    - Attackers could inject malicious payloads or non-numeric data into this field, which may affect log files or further downstream systems.
- **Recommendation:**
    - Add strict validation (e.g., `@Pattern`) for expected phone number formats.

### 4. **Excessive Field Length in User-Controlled Input**
- **Issue:**
    - `qualifications` and `experience` allow up to 1000 characters, `availability` up to 500.
    - No application-level limit is enforced besides the DB column length.
    - Can be abused to attempt buffer overflows, or stress logs and interfaces.
- **Recommendation:**
    - Add `@Size(max = ...)` validations to these fields as appropriate.

### 5. **Missing Audit/Modification Tracking**
- **Issue:**
    - Only creation timestamp (`createdAt`) is tracked.
    - No fields for modification or info on "who" created/updated the entry.
    - Lack of tracking prevents auditing and accountability, which are important for detecting unauthorized or suspicious activity.
- **Recommendation:**
    - Implement fields and logic for tracking created/modified users and times.

### 6. **No Protection Against Mass Assignment/Overposting**
- **Issue:**
    - Lombok's `@Data` generates setters for all fields, including critical status fields like `status` and timestamp fields like `createdAt`.
    - If a controller directly binds incoming requests to this entity, attackers could overwrite fields like `status` (approving/rejecting their own applications) or manipulate `createdAt`.
- **Recommendation:**
    - Do NOT expose entities directly as request bodies in controllers.
    - Use DTOs for input and output.
    - Use restricted setter access or mark `setStatus`/`setCreatedAt` methods as protected/private.

---

## Additional Recommendations

- **Do not output or log unescaped contents from string fields.**
- **Ensure all validation is duplicated at the API/controller layer, not just in the entity.**
- **Review all entities for similar patterns.**

---

## Summary Table

| Field             | Issue                               | Recommendation                                  |
|-------------------|-------------------------------------|-------------------------------------------------|
| `name`, `email`, `phone` | PII as plain text                    | Encrypt/mask at rest                            |
| `qualifications`, `experience`, `availability` | Excessive length, no validation/sanitization | Add `@Size`, sanitize inputs, validate on entry |
| `phone`           | No format validation                | Add `@Pattern` for phone numbers                |
| `status`, `createdAt` | Exposed setters (mass assignment)     | Use DTOs & restrict setter access               |
| —                 | No modification tracking            | Add fields for updated by/at auditing           |

---

**Overall Security Risk Rating:**
> **MODERATE-HIGH:** As written, this entity opens multiple vectors for data leaks, data corruption, or privilege abuse if not handled correctly at higher layers.

---

### References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security: Mass Assignment](https://docs.spring.io/spring-security/reference/servlet/exploits.html)
- [Java Secure Coding Guidelines](https://www.oracle.com/java/technologies/javase/seccodeguide.html)

---

**Mitigation is required both in this entity and in the controlling layers.**