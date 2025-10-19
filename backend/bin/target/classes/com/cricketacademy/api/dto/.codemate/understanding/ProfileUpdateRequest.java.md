# High-Level Documentation: ProfileUpdateRequest DTO

## Overview

**`ProfileUpdateRequest`** is a Data Transfer Object (DTO) designed for handling user profile update requests within the Cricket Academy API. This class encapsulates the user-submitted data for updating their profile and applies validation to ensure data correctness.

## Fields and Validation

1. **name** (`String`)
   - **Required:** Yes (must not be blank)
   - **Constraints:** 
     - 2 to 100 characters in length
   - **Purpose:** The user's full name.

2. **phone** (`String`)
   - **Required:** Yes (must not be blank)
   - **Constraints:** 
     - Must match the pattern: optional `+` followed by 10 to 15 digits
   - **Purpose:** The user's phone number.

3. **age** (`Integer`)
   - **Required:** Yes (must not be null)
   - **Constraints:** 
     - Minimum: 5
     - Maximum: 80
   - **Purpose:** The user's age.

4. **experienceLevel** (`User.ExperienceLevel`)
   - **Required:** Yes (must not be null)
   - **Purpose:** The user's cricket experience level, as defined in the `User` entity.

## Features

- **Automatic Getters/Setters:** Uses Lombok's `@Data` for boilerplate code generation.
- **Validation:** Uses Jakarta Bean Validation annotations for input validation.
- **Integration:** Intended for use in API request payloads where users update their profile information.

## Usage

This DTO should be used as the request body in API endpoints that handle profile updates, ensuring all inputs adhere to the specified validation constraints before further processing.