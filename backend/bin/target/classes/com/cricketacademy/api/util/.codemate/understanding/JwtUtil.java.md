# JwtUtil Class Documentation

## Overview
The `JwtUtil` class is a reusable utility for handling JSON Web Tokens (JWT) within a Spring-based application. It provides methods to generate JWTs for authenticated users, extract information (claims) from tokens, and validate tokens. This utility is designed to work with user authentication and authorization, typically in REST APIs.

## Key Features

- **Token Generation**  
  Generates JWTs containing user's email and roles, with configurable expiration and signature using an HMAC key.

- **Token Parsing**  
  Extracts claims and the subject (usually the user's email) from a token.

- **Token Validation**  
  Checks the integrity and expiry of a JWT, returning a boolean result.

## Configuration

- Reads two properties from application configuration:
  - `app.jwt.secret`: The secret key for signing tokens.
  - `app.jwt.expiration`: Token expiration time in milliseconds.

## Main Methods

- **generateToken(User user)**
  - Creates a JWT for a given `User` object.
  - Includes the user's email as the subject and user's role (with a `ROLE_` prefix) as a claim.
  - Signs the token using HS512 algorithm and the secret key.
  - Sets the expiration date based on the configured lifetime.

- **getClaimsFromToken(String token)**
  - Parses a JWT to extract its claims (payload information).

- **getSubjectFromToken(String token)**
  - Retrieves the subject (e.g., user email) from the token.

- **validateToken(String token)**
  - Attempts to parse the token to ensure it is correctly signed and not expired.
  - Returns `true` if the token is valid; `false` otherwise.

## Usage Context

This class is commonly used in authentication workflows, such as logging in users, securing APIs with token-based authentication, and authorizing requests based on roles embedded in tokens.

---

**Note:** Actual `User` entity should provide `getEmail()` and `getRole()` methods. JWT security (key management, expiration, claims) should be configured carefully in production environments.