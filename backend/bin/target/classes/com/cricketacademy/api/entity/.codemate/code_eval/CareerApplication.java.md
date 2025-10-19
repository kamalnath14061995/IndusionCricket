# Code Review Report: `CareerApplication` Entity

## General Observations

- **Strengths**: The class uses JPA and Bean Validation annotations for data integrity, and Lombok for boilerplate code reduction. Field validations are thorough for string fields.
- **Lombok**: Avoids manual getter/setter code.
- **JPA**: Table, field, and enum handling is good.

## Issues & Recommendations

### 1. **Thread-Safety of Default Enum Initialization**
**Problem:**  
Setting the field default value for `status` directly in the declaration can cause issues, especially with JPA/Hibernate, as it sometimes bypasses the constructor and uses reflection.

**Recommendation:**  
Set the default value in the `@PrePersist` callback to ensure it's always initialized if not set.

**Suggested code:**
```pseudo
@PrePersist
protected void onCreate() {
    if (status == null) {
        status = ApplicationStatus.PENDING;
    }
    if (createdAt == null) {
        createdAt = LocalDateTime.now();
    }
}
```

<br>

### 2. **Phone Number Validation**
**Problem:**  
No validation for phone number format. A free-form string can allow invalid data.

**Recommendation:**  
Add pattern validation (adjust regex for your region):

```pseudo
@Pattern(regexp = "^[0-9\\-\\+]{9,15}$", message = "Invalid phone number format")
```

<br>

### 3. **String Column Lengths**
**Problem:**  
Email, name, phone, and positionType do not specify column lengths, making them potentially unlimited (defaulted to 255, but not explicit).

**Recommendation:**  
Set explicit column lengths for string fields based on validations:

```pseudo
@Column(nullable = false, length = 100) // for name
@Column(nullable = false, length = 100) // for email
@Column(nullable = false, length = 20)  // for phone
@Column(nullable = false, length = 50)  // for positionType
```

<br>

### 4. **Constructor Consistency**
**Observation:**  
Lombok `@AllArgsConstructor` and `@NoArgsConstructor` are used, but custom logic (like field defaults) may not be set when using these constructors. If used via constructor, ensure domain boundaries are respected.

**Recommendation:**  
If domain invariants are critical (e.g., always non-null status and createdAt), consider a builder or static factory, or document expectations for object initialization.

<br>

### 5. **Enum Location**
**Observation:**  
Nesting enums inside entity class can cause confusion with JPA/hbm2ddl schema generation and code reuse.

**Recommendation:**  
Move `ApplicationStatus` enum to its own file if it needs to be reused elsewhere.

```pseudo
// -- Move ApplicationStatus to a separate file if it is shared across entities.
```

<br>

### 6. **createdAt Field Immutability**
**Suggestion:**  
`createdAt` should not be modifiable after persist. Prevent setter generation if possible.

**Recommendation:**  
Tell Lombok to not generate a setter:

```pseudo
@Getter
@Setter
@NoSetter // Use @Setter(AccessLevel.NONE) if using Lombok
```
Or annotate:
```pseudo
@Data
@Setter(AccessLevel.NONE) // On createdAt field
```
Or:
```pseudo
private final LocalDateTime createdAt;
```

<br>

### 7. **Use of Field Access**
**Observation:**  
With JPA, consistent field or property access is important. Since you use field annotations, ensure you use field access everywhere.

---

## Changes Summary

**Add/modify these code lines as per suggestions:**

```pseudo
@Pattern(regexp = "^[0-9\\-\\+]{9,15}$", message = "Invalid phone number format")
@Column(nullable = false, length = 20)
private String phone;

@Column(nullable = false, length = 100)
private String name;

@Column(nullable = false, length = 100)
private String email;

@Column(nullable = false, length = 50)
private String positionType;

// in onCreate()
@PrePersist
protected void onCreate() {
    if(status == null) {
        status = ApplicationStatus.PENDING;
    }
    if(createdAt == null) {
        createdAt = LocalDateTime.now();
    }
}

// (Optional, for more safety)
@Setter(AccessLevel.NONE) // on createdAt field
private LocalDateTime createdAt;
```

---

## Conclusion

- **Apply field lengths and validation for consistency and data safety.**
- **Initialize fields using callback rather than direct assignment for JPA compatibility.**
- **Restrict mutability of audit fields like `createdAt`.**
- **Consider extracting enums and enhancing validation as per use-case.**

**Addressing the above will make the code more robust, maintainable, and aligned with enterprise JPA standards.**