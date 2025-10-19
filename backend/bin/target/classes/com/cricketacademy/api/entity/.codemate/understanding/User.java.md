# User Entity Documentation

## Overview
The `User` entity represents a member of a cricket academy. It is designed to map directly to registration form fields from the frontend and is used both for data persistence (using JPA/Hibernate) and for Spring Security-based authentication/authorization.

## Key Features

- **Persistence:** Annotated as a JPA entity and mapped to the `users` table in the database.
- **Validation:** Uses Jakarta Validation annotations to enforce constraints on user input (e.g., not null, valid patterns, sizes).
- **Authentication:** Implements `UserDetails` from Spring Security, providing integration with authentication and authorization mechanisms.
- **Automatic Timestamps:** Uses JPA lifecycle callbacks to automatically set creation and update timestamps.
- **Enums:** Includes `ExperienceLevel` and `UserRole` enums to categorize users' experience and roles.

## Fields

| Field           | Type                         | Description / Validation                                                             |
|-----------------|-----------------------------|--------------------------------------------------------------------------------------|
| `id`            | Long                        | Primary key, auto-generated.                                                         |
| `name`          | String                      | Required, 2-100 chars.                                                               |
| `email`         | String                      | Required, valid email, unique.                                                       |
| `phone`         | String                      | Required, valid phone format (10-15 digits, optional '+').                           |
| `age`           | Integer                     | Required, minimum 5, maximum 80.                                                     |
| `experienceLevel` | ExperienceLevel (Enum)    | Required, one of: BEGINNER, INTERMEDIATE, ADVANCED, PROFESSIONAL.                    |
| `password`      | String                      | Required, at least 6 characters.                                                     |
| `role`          | UserRole (Enum)             | User role, defaults to STUDENT (STUDENT, COACH, ADMIN).                              |
| `createdAt`     | LocalDateTime               | Set automatically on creation.                                                       |
| `updatedAt`     | LocalDateTime               | Updated automatically on each update.                                                |
| `isActive`      | Boolean                     | Indicates if the user account is active; impacts login.                              |

## Enums

- **ExperienceLevel:** BEGINNER, INTERMEDIATE, ADVANCED, PROFESSIONAL.
- **UserRole:** STUDENT, COACH, ADMIN.

## Spring Security Integration

Implements `UserDetails`, providing:
- **Authorities:** Single authority based on user role ("ROLE_" + role name).
- **Username:** Email is used as the principal.
- **Account Status Methods:** Methods like `isAccountNonLocked`, `isEnabled` depend on `isActive`, while expiration methods always return `true`.

## Automatic Timestamp Management

- `@PrePersist`: On entity creation, sets both `createdAt` and `updatedAt` to current time.
- `@PreUpdate`: On entity update, refreshes `updatedAt` to current time.

## Lombok Usage

- Uses `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor` for automatic generation of constructors, getters, setters, equals/hashcode, and toString methods.

---

**Summary:**  
This class centrally models the user/member of a cricket academy with persistence, validation, and security features necessary for a modern Spring Boot application.