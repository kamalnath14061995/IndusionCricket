# CareerApplication Entity - High-Level Documentation

**Purpose:**
Represents an application for a career position (e.g., coach or ground staff) at a cricket academy. Serves as a persistent entity in the database and manages applicant details, position, status, and audit timestamps.

---

## Key Features & Fields:

- **Primary Key**
  - `id`: Unique identifier for each application (auto-generated).

- **Applicant Personal Details**
  - `name`: Applicant’s full name (required, 2-100 chars).
  - `email`: Applicant’s email address (required, validated).
  - `phone`: Applicant’s phone number (required).

- **Application-Specific Details**
  - `positionType`: Type of job applied for (e.g., Coach, Ground Staff), required.
  - `qualifications`: Applicant’s relevant qualifications (optional, up to 1000 chars).
  - `experience`: Applicant’s previous experience (optional, up to 1000 chars).
  - `availability`: Applicant’s availability details (optional, up to 500 chars).

- **Application Lifecycle Management**
  - `status`: Current application status. Enum values (`PENDING`, `APPROVED`, `REJECTED`). Default: `PENDING`.
  - `createdAt`: Timestamp when the application was created. Automatically set when persisted.

- **Data Validation & Integrity**
  - Uses Bean Validation (e.g., `@NotBlank`, `@Size`, `@Email`) to enforce valid and required field input.
  - Database-level column constraints for required fields and length limits.

- **ORM Integration**
  - Entity mapped to the `career_applications` table.
  - Integrates with JPA/Hibernate using annotations.

- **Lifecycle Hooks**
  - Generates `createdAt` timestamp when persisting a new application (`@PrePersist`).

- **Lombok Integration**
  - Uses Lombok’s `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor` to auto-generate boilerplate code (getters, setters, constructors, etc.).

---

## Associated Enum

**ApplicationStatus**
- `PENDING`
- `APPROVED`
- `REJECTED`
Defines the workflow state of an application.

---

## Typical Usage

Used as a JPA entity to persist, retrieve, and manage job applications in the cricket academy's back-end system. Supports automatic validation and mapping to the underlying database schema.

---

**Related Table:**  
Database table: `career_applications`