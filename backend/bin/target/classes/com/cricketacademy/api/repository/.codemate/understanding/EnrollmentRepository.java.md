# High-Level Documentation: EnrollmentRepository

**Purpose:**
The `EnrollmentRepository` interface provides data access operations for the `Enrollment` entity in a cricket academy management application. It leverages Spring Data JPA to simplify interaction with the database.

**Core Features:**

- **Extends JpaRepository:** Inherits standard CRUD (Create, Read, Update, Delete) methods for the `Enrollment` entity through `JpaRepository<Enrollment, Long>`.
- **Query Methods:**
  - `List<Enrollment> findByUserId(Long userId)`: Retrieves all enrollments for a specified user.
  - `Enrollment findByUserIdAndProgramId(Long userId, Long programId)`: Finds a specific enrollment by user and program identifiers.

**Usage Context:**
This repository is used in the backend API for managing relationships between users (e.g., students) and cricket academy programs, enabling efficient retrieval and persistence of enrollment data.