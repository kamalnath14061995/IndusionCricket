```markdown
# Code Review Report: OtpService

## General Observations

- **Concurrency & Thread Safety:** Usage of `ConcurrentHashMap` for OTP storage is appropriate for thread safety.
- **OTP Security:** OTPs are generated using `Random`, which is insecure for OTPs.
- **OTP Expiry Logic:** Using `ChronoUnit.MINUTES.between()` for expiry is functional, but the logic could be improved for precision.
- **Logging:** `System.out.println` for production is not recommended; should use proper logging.
- **Code Modularity & Dependency Injection:** The `SmsService` autowiring can be improved.
- **Resource Leaks:** There is no cleanup mechanism for expired OTPs unless validation is attempted.
- **Unoptimized Map Update:** Overwriting the OTP for an identifier may not be a concern, but any re-send logic must be designed around that.
- **Repeated `LocalDateTime.now()` Calls:** Should be captured once per operation for consistency.

---

## 1. **Insecure OTP Generation**

Using `Random` for security tokens is unsafe. Use `SecureRandom` instead.

**Replace:**
```java
String otp = String.format("%06d", new Random().nextInt(999999));
```

**With (pseudo-code):**
```pseudo
Use SecureRandom instead of Random for secure OTP:
SecureRandom secureRandom = new SecureRandom();
String otp = String.format("%06d", secureRandom.nextInt(1_000_000));
```

---

## 2. **Logging Instead of System.out**

**Replace:**
```java
System.out.println("OTP sent to email " + email + ": " + otp);
// ...
System.out.println("OTP sent to phone " + phone + ": " + otp);
```

**With (pseudo-code):**
```pseudo
Use Logger for logging:
private static final Logger logger = LoggerFactory.getLogger(OtpService.class);
// ...
logger.info("OTP sent to email {}: {}", email, otp);
// ...
logger.info("OTP sent to phone {}: {}", phone, otp);
```
*(make sure to import a logger, e.g., SLF4J)*

---

## 3. **Incorrect OTP Range**

`new Random().nextInt(999999)` generates up to 999,998, never 999,999. Use 1,000,000 as the upper bound.

**Replace:**
```java
new Random().nextInt(999999)
```
**With:**
```pseudo
secureRandom.nextInt(1_000_000)
```

---

## 4. **Improve OTP Expiry Precision**

The logic currently checks if expiry is GREATER THAN the threshold, which allows OTPs to remain valid up to 1 minute longer than intended.

**Replace:**
```java
if (ChronoUnit.MINUTES.between(otpData.getGeneratedAt(), LocalDateTime.now()) > OTP_EXPIRY_MINUTES)
```
**With:**
```pseudo
if (otpData.getGeneratedAt().plusMinutes(OTP_EXPIRY_MINUTES).isBefore(now))
```
*(where "now" is a LocalDateTime captured at the method's start)*

---

## 5. **Consistent Current Time Handling**

**Replace:**
```java
ChronoUnit.MINUTES.between(otpData.getGeneratedAt(), LocalDateTime.now())
```
**With:**
```pseudo
LocalDateTime now = LocalDateTime.now();   // at start of validateOtp()
[... use now for all time comparisons in this method ...]
```

---

## 6. **Constructor Injection For smsService**

Field injection is discouraged for testability and immutability.

**Replace:**
```java
@org.springframework.beans.factory.annotation.Autowired(required = false)
private SmsService smsService;
```
**With (pseudo-code):**
```pseudo
Use constructor injection:
private final SmsService smsService;
@Autowired
public OtpService(SmsService smsService) {
    this.smsService = smsService;
}
```
*(If SmsService is optional, use `@Autowired(required = false)` on constructor param, or `@Nullable`)*

---

## 7. **No OTP Expiry Cleanup**

Consider scheduled cleanup to prevent memory leaks.

**Suggested Addition:**
```pseudo
@Scheduled(fixedDelay = 60000)
public void cleanUpExpiredOtps() {
    LocalDateTime now = LocalDateTime.now();
    for (Map.Entry<String, OtpData> entry : otpStorage.entrySet()) {
        if (entry.getValue().getGeneratedAt().plusMinutes(OTP_EXPIRY_MINUTES).isBefore(now)) {
            otpStorage.remove(entry.getKey());
        }
    }
}
```
*(Enable scheduling in your Spring boot application)*

---

## 8. **Miscellaneous**

- **Constant Visibility:** Make constants like `OTP_EXPIRY_MINUTES` `private static final`.
- **Thread Safety Comment:** Document that `otpStorage` (ConcurrentHashMap) is thread-safe.

---

## **Summary**

**Critical (must-fix):**
- Use `SecureRandom` for OTPs.
- Use a logger, not `System.out`.
- Correct OTP upper bound and expiry logic.

**Recommended:**
- Use constructor injection for dependencies.
- Schedule cleanup for expired OTPs.
- Consistent handling of `LocalDateTime` in methods.

---

### **Suggested Corrections (Pseudo-code only; DO NOT copy-paste directly)**

```pseudo
1. Use SecureRandom for OTP generation.
2. Use logger instead of System.out.
3. Use correct upper bound in OTP generation (1_000_000).
4. Use expiry: if (generatedAt.plusMinutes(OTP_EXPIRY_MINUTES).isBefore(now))
5. Capture LocalDateTime.now() at the method start for consistency.
6. Prefer constructor injection for SmsService dependency.
7. Add scheduled OTP expiry cleanup with @Scheduled(fixedDelay = 60000).
```

---

**Note:**  
Any refactoring should be covered by relevant unit tests, especially for security/reliability in OTP logic!
```