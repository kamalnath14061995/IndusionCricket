# Enrollment Entity - High-Level Documentation

## Overview
The `Enrollment` class represents the enrollment of a user in a program within the cricket academy system. It is defined as a JPA entity for ORM (object-relational mapping) to a corresponding database table. Lombok annotations are used for boilerplate code generation (getters, setters, constructors, builder).

## Structure
- **Database Table**: Maps to a table storing enrollments.
- **Primary Key**: `id` - Unique identifier for each enrollment, auto-generated.
- **Fields**:
  - `userId`: ID of the enrolled user.
  - `programId`: ID of the program in which the user is enrolled.
  - `paymentMethod`: Payment method used for enrollment (“card”, “upi”, or “cash”). Required field.
  - `status`: Current status of the enrollment (“pending”, “enrolled”). Required field.
  - `programTitle`: Name/title of the enrolled program (optional).
  - `coachName`: Name of the coach for the program (optional).

## Purpose
This class is used to record and manage user enrollments, their payment details, association with coaches and programs, and enrollment statuses within the system.

## Features
- Utilizes JPA annotations for database persistence.
- Employs Lombok for reduced boilerplate and enhanced readability.
- Supports standard construction patterns (no-args, all-args, and builder).

---

**In summary:**  
The `Enrollment` entity models the relationship between users and programs, capturing enrollment status, payment method, and optional descriptive details for display or reporting within a cricket academy management context.