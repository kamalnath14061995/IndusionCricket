# OtpService - High-Level Documentation

## Overview
`OtpService` is a Spring-based service that facilitates the generation, management, and validation of One-Time Passwords (OTPs) for user authentication or verification processes. The service manages OTP lifecycle in-memory, supports OTP delivery via email and SMS, and includes mechanisms to prevent OTP reuse and ensure expiry-based security.

## Core Features

### 1. OTP Generation
- **Method:** `generateOtp(String identifier)`
- **Purpose:** Produces a random 6-digit OTP, associates it with a unique identifier (like email or phone number), and stores it with a generation timestamp.
- **Storage:** In-memory, thread-safe map (`ConcurrentHashMap`).

### 2. OTP Validation
- **Method:** `validateOtp(String identifier, String otp)`
- **Purpose:** Validates an OTP against the stored value for the given identifier.
- **Security:**
  - OTP is single-use: removed from storage after successful validation.
  - OTPs have a fixed expiry (default: 5 minutes); expired OTPs are invalidated and removed.

### 3. OTP Delivery
- **sendOtpEmail(String email, String otp):** Simulated method; in production, should integrate with a real email provider such as SendGrid or AWS SES.
- **sendOtpSms(String phone, String otp):** Attempts to send OTP via an injected `SmsService` (e.g., Infobip integration), with fallback logging in development/testing environments.

## Internal Data Structures
- **OtpData (Private Inner Class):** Encapsulates OTP value and its generation timestamp.

## Dependencies & Integration
- `SmsService` (optional, autowired): Supports modular SMS delivery, allowing integration with third-party SMS gateways.
- Can be extended to use persistent storage or external notification services for production readiness.

## Usage Scenarios
- User registration or login verification via OTP.
- Password reset processes.
- Mobile/email number validation.

## Thread Safety & Expiry
- All OTP operations use a concurrent map for safe access in multi-threaded environments.
- Automatic cleanup upon validation or expiry for security.

---

**Note:** As implemented, OTPs are stored in memory and will not persist across application restarts. Consider extending functionality for distributed or production systems.