# Code Review Report

## Package: `com.cricketacademy.api.service`
## Class: `CashfreeService`

---

### **General Comments:**

- Clean structure and separation of concerns.
- Follows Spring's dependency injection patterns.
- Performs what appears to be a straightforward Cashfree order creation via REST API.

However, there are several critical improvements to follow **industry standards**, address **potential errors**, and **optimize the implementation**. Below are findings and suggested corrections.

---

### **1. Avoid Instantiating `RestTemplate` Directly**

**Issue:**  
Directly instantiating a new `RestTemplate` inside this method defeats the benefits of bean reusability, configuration, and testability.

**Correction:**  
Inject `RestTemplate` as a Bean (constructor- or field-inject).

**Pseudo code:**
```java
// Add at class-level:
@Autowired
private RestTemplate restTemplate;

// Remove: RestTemplate restTemplate = new RestTemplate();
```
Or if constructor-based:
```java
@Service
public class CashfreeService {
    // ...

    private final RestTemplate restTemplate;

    @Autowired
    public CashfreeService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // ...
}
```
---

### **2. Hardcoded Currency Value**

**Issue:**  
`"order_currency"` is hardcoded as `"INR"`. If only supporting INR, consider extracting to a constant for maintainability.

**Correction:**  
```java
private static final String ORDER_CURRENCY = "INR";

// in body.put:
body.put("order_currency", ORDER_CURRENCY);
```
---

### **3. Type Safety on HTTP Response**

**Issue:**  
Raw type `ResponseEntity<Map>` is unsafe. Use generic type parameters.

**Correction:**  
```java
// Change:
ResponseEntity<Map<String, Object>> response = restTemplate.postForEntity(url, entity, new ParameterizedTypeReference<Map<String, Object>>() {});
```

---

### **4. Handling of Response Status Codes**

**Issue:**  
Only 200 OK is checked. APIs can return 201 Created, or other 2xx codes, which should also be considered as successful.

**Correction:**  
```java
// Instead of:
if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null)

// Use:
if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null)
```
---

### **5. Exception Handling — No Logging**

**Issue:**  
RuntimeException is thrown without logging; loss of error information.

**Correction:**  
Add appropriate logging:
```java
// Pseudocode before throwing exception:
logger.error("Failed to create Cashfree order. Status: {}, Body: {}", response.getStatusCode(), response.getBody());
throw new RuntimeException("Failed to create Cashfree order");
```
*(Assume a logger is defined at class-level: `private static final Logger logger = LoggerFactory.getLogger(CashfreeService.class);`)*

---

### **6. Parameter Types**

**Issue:**  
`orderAmount` is String, which is generally discouraged for monetary values. Use appropriate type (such as `BigDecimal`).

**Correction:**  
```java
// Change method signature:
public String createOrder(String orderId, BigDecimal orderAmount, String customerEmail, String customerPhone)
```
And change in body:
```java
body.put("order_amount", orderAmount);
```
---

### **7. Use of `Map.of` (Requires Java 9+)**

**Issue:**  
If the environment is on Java 8, `Map.of` will not work.

**Correction:**  
If Java 8 compatibility is needed:
```java
Map<String, String> customerDetails = new HashMap<>();
customerDetails.put("customer_id", orderId);
customerDetails.put("customer_email", customerEmail);
customerDetails.put("customer_phone", customerPhone);
body.put("customer_details", customerDetails);
```

---

### **8. Environment URL Configuration**

**Issue:**  
URLs are hardcoded in the method.

**Correction:**  
Extract to `@Value` for ENV-based configuration.
```java
@Value("${cashfree.prodUrl}")
private String prodUrl;

@Value("${cashfree.sandboxUrl}")
private String sandboxUrl;

// Use instead:
String url = env.equalsIgnoreCase("PROD") ? prodUrl : sandboxUrl;
```
---

### **9. Thread Safety of Service**

**Comment:**  
Class is stateless and thread-safe as written, but if mutable fields are added, review further.

---

## **Summary Table**

| Issue No. | Severity   | Suggestion/Correction |
|-----------|------------|----------------------|
| 1         | High       | Use Bean-injected RestTemplate |
| 2         | Low        | Extract currency as constant |
| 3         | Medium     | Use type-safe generics for response |
| 4         | Medium     | Accept all 2xx status as success |
| 5         | Medium     | Add logging before throwing exception |
| 6         | High       | Use `BigDecimal` for monetary values |
| 7         | Medium     | Avoid `Map.of` for Java 8 support |
| 8         | Medium     | Extract Cashfree URLs to @Value config |

---

## **References:**
- [Spring Best Practices](https://docs.spring.io/spring-framework/reference/core/beans/dependencies.html)
- [RestTemplate Usage](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/client/RestTemplate.html)
- [Java Type Safety with Generics](https://docs.oracle.com/javase/tutorial/java/generics/)
- [OWASP Secure Coding Practices](https://owasp.org/www-pdf-archive/OWASP_SCP_Quick_Reference_Guide_v2.pdf)

---

**Please update the code according to the critical observations above. This will help improve maintainability, security, and standard compliance.**