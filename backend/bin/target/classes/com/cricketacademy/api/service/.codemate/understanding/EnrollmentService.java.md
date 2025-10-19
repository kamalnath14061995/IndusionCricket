# EnrollmentService - High-Level Documentation

**Purpose:**  
The `EnrollmentService` class orchestrates the enrollment process for users into programs within a cricket academy management system. It provides services to enroll users and retrieve their enrollment information.

---

## Key Responsibilities

- **Enroll Users:**  
  Handles the business logic to enroll a user in a specific program, customizing the enrollment status based on the payment method. For "cash" payments, the enrollment is set as "pending"; otherwise, it is immediately "enrolled".

- **Retrieve Enrollment:**  
  Allows querying for a specific enrollment using a user ID and program ID, facilitating checks or display of enrollment status.

---

## Main Methods

1. **enroll(Long userId, Long programId, String paymentMethod, String programTitle, String coachName): Enrollment**  
   - Creates a new `Enrollment` record for a user and a program.
   - Sets the payment method, status (pending/enrolled), and stores additional info (program title, coach name).
   - Persists the enrollment in the database using the repository.

2. **getEnrollment(Long userId, Long programId): Enrollment**  
   - Fetches an existing enrollment based on user and program identifiers.

---

## Dependencies

- **EnrollmentRepository:**  
  Used for persistence operations related to Enrollment entities.
- **Spring Framework:**  
  Utilizes Spring's dependency injection (@Autowired) and service layer (@Service) features.

---

## Notes

- The class leverages a builder pattern to create `Enrollment` instances.
- Status logic is simple and based only on the payment method, but can be extended as needed.
- No exception handling or validation is shown; assumed to be handled elsewhere or by Spring/Data layers.

---

**In summary:**  
`EnrollmentService` encapsulates the core use cases for user enrollments in training programs, ensuring correct status based on payment, and cleanly separating business logic from data access.