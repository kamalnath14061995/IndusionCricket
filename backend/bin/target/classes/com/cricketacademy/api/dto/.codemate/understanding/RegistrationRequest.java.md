# High-Level Documentation

## Purpose
This code defines a Data Transfer Object (DTO) named **RegistrationRequest** for a cricket academy application. The DTO is used to capture user input from the registration form on the frontend. It ensures data integrity and validation before creating a new user in the system.

## Main Features

- **Encapsulates Registration Data:**  
  Holds all relevant user information required during the registration process: name, email, phone, age, experience level, and password.

- **Input Validation:**  
  Uses Java validation annotations to enforce rules on incoming data, ensuring that:
  - Required fields are present and not empty
  - Email and phone formats are valid
  - Name and password meet length constraints
  - Age is within allowed limits
  - Experience level is specified

- **Automatic Code Generation:**  
  Leverages Lombok annotations (`@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`) to auto-generate boilerplate code such as getters, setters, constructors, and other methods.

## Structure

- **Fields and Validation**
  - **name** (String): Required; 2-100 characters.
  - **email** (String): Required; must be in proper email format.
  - **phone** (String): Required; must match a defined numeric pattern (10-15 digits, optional plus sign).
  - **age** (Integer): Required; must be between 5 and 80.
  - **experienceLevel** (Enum): Required; maps to a predefined set of experience levels.
  - **password** (String): Required; at least 6 characters.

## Usage

- This DTO is intended for use in API endpoints that handle user registration.
- It validates incoming registration data before it's processed or persisted.
- Maps closely to the frontend registration form structure.

## Dependencies

- **Jakarta Validation** for field validation annotations.
- **Lombok** for code generation.
- **ExperienceLevel** enum (from the User entity).

---

**Summary:**  
The `RegistrationRequest` class provides a robust, validated structure for user registration in a cricket academy system, improving code maintainability and ensuring that only well-formed data is processed.