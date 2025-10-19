# UserRepository Interface - High-Level Documentation

## Overview

The `UserRepository` interface provides data access methods for managing `User` entities in a Cricket Academy application. It leverages Spring Data JPA to facilitate CRUD operations and custom queries on `User` records in the database.

## Main Responsibilities

- Facilitate common and custom queries related to users.
- Support user lookup by domain-specific fields (email, phone, role, experience level, etc.).
- Provide methods to count and filter users on various criteria (e.g., active status, experience, age range).

## Key Features

1. **User Lookup**
   - Retrieve users by unique identifiers (email, phone).
   - Find users by experience level, role, or name (supports case-insensitive search).

2. **Existence Checks**
   - Verify if a user exists based on email or phone number.

3. **Filtering and Counting**
   - Fetch all active users or count them.
   - Find or count users by experience level.
   - Get users by a given age range or those who are both active and match a specific experience level.

4. **Custom Queries**
   - Uses JPQL queries for operations like searching by name (case-insensitive substring match) and filtering by age ranges.

## Technical Notes

- Extends Spring Data JPA's `JpaRepository` for basic CRUD support.
- Annotated with `@Repository` for Spring component scanning.
- Uses the `User` entity as the target, with `Long` as the ID type.

## Use Cases

- Authentication and registration checks (via existence queries).
- Viewing and managing user lists filtered by different business requirements (role, active status, experience).
- Advanced searching capabilities within user data for administrative or reporting features.

## Summary

This repository interface is central to user management in the Cricket Academy application, efficiently connecting business logic to persistent user data with versatile and expressive methods.