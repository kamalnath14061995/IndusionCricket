# Code Review Report

**File:** `Infobip2FADeliverPin.java`  
**Package:** `com.cricketacademy.api.service`  
**Summary:** A command-line Java application to deliver a 2FA PIN via Infobip API.

---

## 1. **Security Issues**

### a) **Hardcoded Authorization Credentials**

**Problem:**  
The API authorization token is hardcoded in the source:  
```java
.addHeader("Authorization", "App d8e6109e1db62346f64a4a583cd56833-535e98b1-f2a6-4998-b6ba-52952d990796")
```
This is a critical security vulnerability.

**Suggested Fix:**
```pseudo
// Read API token from environment variable or secure secrets manager
String apiToken = System.getenv("INFOBIP_API_TOKEN");
// Add a null/empty check and fail early if not set
if (apiToken == null || apiToken.isEmpty()) {
    System.err.println("Error: INFOBIP_API_TOKEN environment variable not set.");
    return;
}
.addHeader("Authorization", "App " + apiToken)
```

---

## 2. **Resource Leaks & Unoptimized Implementation**

### a) **OkHttpClient Instantiation**

**Problem:**  
A new OkHttpClient is created per execution.  
```java
OkHttpClient client = new OkHttpClient().newBuilder().build();
```
Best practice is to reuse OkHttpClient—it's thread-safe and costly to create.

**Suggested Fix:**
```pseudo
// Make OkHttpClient static and reused class-wide if possible
private static final OkHttpClient CLIENT = new OkHttpClient();
// In main, use CLIENT instead of new instance
Response response = CLIENT.newCall(request).execute();
```

---

### b) **Response.Body Handling**

**Problem:**  
The original code prints `response.body().string()` multiple times or outside of try-with-resources, which can cause IllegalStateException if accessed after closing.

**Suggested Fix:**
```pseudo
String responseBody = response.body() != null ? response.body().string() : "null";
System.out.println("Response code: " + response.code());
System.out.println("Response body: " + responseBody);
```

---

## 3. **Error Handling Improvements**

### a) **Improved Exception Handling**

**Problem:**  
No proper error logging or exception handling for network issues.

**Suggested Fix:**
```pseudo
try (Response response = client.newCall(request).execute()) {
    // ...
} catch (IOException e) {
    System.err.println("Network or IO error: " + e.getMessage());
    e.printStackTrace();
}
```

---

## 4. **Logging/Output Best Practice**

### a) **Sensitive Data Redaction**

**Problem:**  
Logging entire responses can leak PII or sensitive information. Use a logging framework for configurable log levels and redactions.

**Suggested Fix:**
```pseudo
// Use logging framework (e.g., slf4j), and avoid printing sensitive response values to stdout/stderr
LOG.info("Response code: {}", response.code());
LOG.debug("Response body: {}", responseBody); // Only in debug mode
```
*If sticking with `System.out`, at least warn of PII risk.*

---

## 5. **Code Maintainability**

### a) **Magic Strings**

**Problem:**  
Hardcoded values for URLs and "from" phone numbers reduce maintainability.

**Suggested Fix:**
```pseudo
final String API_URL = "https://69kqdd.api.infobip.com/2fa/2/pin";
final String FROM_PHONE = "447491163443";
// Use variables instead of hardcoded values inline
```

---

## 6. **General:**  

### a) **Class Design**

**Problem:**  
Using a `main()` method for what could be a reusable service class, limiting testability and extensibility.

**Suggested Fix:**
```pseudo
// Refactor logic into a public method, call from main()
public static String deliver2FAPin(String applicationId, String messageId, String toPhone) { ... }
```

---

# **Summary Table**

| Issue                              | Severity | Suggested Change (in pseudo code)                              |
|-------------------------------------|----------|---------------------------------------------------------------|
| Hardcoded API token                 | HIGH     | Read token from env var, do null check                        |
| OkHttpClient re-instantiation       | MEDIUM   | Make OkHttpClient a static reusable instance                  |
| Response body access                | HIGH     | Store to variable before closing, print only once             |
| Exception handling                  | MEDIUM   | Add catch and print stack trace                               |
| Logging of sensitive info           | MEDIUM   | Use logging framework, limit details at info/error level      |
| Magic strings (URL, numbers)        | LOW      | Use constants for URL and from-number                         |
| Poor class reusability              | LOW      | Refactor into a service method, main() for CLI only           |

---

## **Proposed Corrected Code Fragments**

```pseudo
// Secure token handling:
String apiToken = System.getenv("INFOBIP_API_TOKEN");
if (apiToken == null || apiToken.isEmpty()) {
    System.err.println("Error: INFOBIP_API_TOKEN environment variable not set.");
    return;
}
.addHeader("Authorization", "App " + apiToken)

// OkHttpClient reuse:
private static final OkHttpClient CLIENT = new OkHttpClient();
// use CLIENT variable instead of creating new OkHttpClient

// Read response only once:
String responseBody = response.body() != null ? response.body().string() : "null";
System.out.println("Response code: " + response.code());
System.out.println("Response body: " + responseBody);

// Improved error handling:
try (...) {
    // network code...
} catch (IOException e) {
    System.err.println("Network or IO error: " + e.getMessage());
    e.printStackTrace();
}

// Use constants for magic strings:
final String API_URL = "https://69kqdd.api.infobip.com/2fa/2/pin";
final String FROM_PHONE = "447491163443";
```

---

**Note:**  
- Do not commit sensitive tokens to source code.
- Consider using dependency injection and configuration files for better maintainability, especially in server applications.
- Always sanitize external input before use in logs or error messages.

---

*End of Report.*