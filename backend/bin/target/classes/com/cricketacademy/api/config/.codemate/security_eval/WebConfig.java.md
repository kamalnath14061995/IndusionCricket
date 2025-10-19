# Security Vulnerability Report: `WebConfig.java`

This report reviews potential security vulnerabilities in the provided code, focusing only on security-related aspects.

---

## 1. **Path Traversal Vulnerability**

### **Issue**
The custom `getResource()` implementation allows access to resources via:
```java
Resource requestedResource = location.createRelative(resourcePath);
```
If user input is abused (`../` sequences in the requested path), a client could potentially read files outside the `/static/` directory ("Path Traversal" attack).

**Example Attack Vector:**
```
GET /../../application.properties
```
If `location` is `classpath:/static/`, `.createRelative(resourcePath)` could resolve to an unintended file if not properly sanitized.

**Severity:** High  
**Risk:** Exposure of sensitive files, configuration, or credentials.

### **Recommendation**
Sanitize and validate `resourcePath` input to prevent `../` or other traversal patterns. Consider:
- Rejecting paths containing `..` or starting with `/`
- Using Spring’s built-in sanitization or static resource handlers

---

## 2. **Information Disclosure via Default Resource**

### **Issue**
For any missing resource, the fallback is:
```java
new ClassPathResource("/static/index.html");
```
While this is common for SPAs, it can leak application structure by serving the index page for invalid requests, potentially revealing client-side routes or functionalities to attackers scanning for open endpoints.

**Severity:** Medium  
**Risk:** Enables attackers to fingerprint SPA routing and discover available frontend components.

### **Recommendation**
- Consider returning HTTP 404 for truly nonexistent resources (files that do not exist and are not SPA routes).
- Only serve `index.html` for frontend-recognized paths.

---

## 3. **Potential DOS / Resource Exhaustion**

### **Issue**
No explicit checks for resource request length or type are present. Large or unusual requests could be used to stress backend classpath lookups, potentially leading to Denial-of-Service.

**Severity:** Low  
**Risk:** Unlikely unless chained with other weaknesses, but worth monitoring.

### **Recommendation**
- Limit allowed request path lengths.
- Log unusual or repeated access to missing resources.

---

## 4. **Directory Listing**

### **Issue**
Depending on Spring Boot defaults and classpath structure, not explicitly prohibiting directory listing means a badly configured server may list directory contents.

**Severity:** Low-Medium  
**Risk:** Directory content exposure.

### **Recommendation**
- Ensure Spring Boot does not generate directory listings.
- Set relevant configuration or customize resource handlers to forbid them.

---

# Summary Table

| Vulnerability                | Severity  | Fix / Mitigation                                     |
|------------------------------|-----------|------------------------------------------------------|
| Path traversal               | High      | Sanitize `resourcePath` to prohibit `..` patterns    |
| Information disclosure (SPA) | Medium    | 404 for non-SPA paths or unknown resources           |
| Denial-of-Service (DOS)      | Low       | Validate resource path lengths, log anomalies        |
| Directory listing disclosure | Low-Med   | Ensure directory listings are disabled               |

---

# Recommendations

- **Input sanitization:** Always validate and sanitize all user controllable inputs (`resourcePath`).
- **Error handling:** Replace catch-all fallback (index.html) with conditional logic if SPA routing is not needed for all endpoints.
- **Hardening:** Disable directory listing, limit exposure of internal paths, and review logging for suspicious access patterns.

---

**References:**
- [Spring: Securing Static Resources](https://docs.spring.io/spring-security/reference/servlet/authorization/resource.html)
- [OWASP Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal)
