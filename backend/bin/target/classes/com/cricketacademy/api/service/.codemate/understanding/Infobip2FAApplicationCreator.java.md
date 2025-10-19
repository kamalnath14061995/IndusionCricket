# High-Level Documentation: Infobip2FAApplicationCreator

## Overview

The `Infobip2FAApplicationCreator` class is a standalone Java program designed to create a new 2FA (Two-Factor Authentication) application using Infobip's API. It leverages the OkHttp library to construct and send an HTTP POST request with the necessary application configuration in JSON format.

## Key Functionalities

- **API Integration**: Connects to Infobip's 2FA API endpoint to create a new 2FA application.
- **Request Configuration**: Sets up request headers for authorization (API key), and specifies content type as JSON.
- **Request Body**: Provides detailed 2FA application parameters, such as PIN attempts, time-to-live, and sending limits, in the request body.
- **Synchronous Execution**: Sends the HTTP request synchronously and waits for the response.
- **Response Handling**: Prints the HTTP response code and the response body to the standard output. If the request fails, logs an error with the appropriate status code and message.

## Customization Points

- **Application Configuration**: The JSON request body can be altered to tailor the 2FA application settings (e.g., changing PIN limits or time-to-live).
- **Authorization Key**: The authorization header uses a static API key, which should be replaced with a valid and secure token for real usage.
- **Endpoint URL**: Points to a specific Infobip environment and path, which could be adjusted based on regional or production endpoints.

## Intended Usage

- **Purpose**: Automate the provisioning of new 2FA applications via API calls for integration, testing, or administrative purposes.
- **How to Run**: Execute as a Java application. Requires OkHttp library and internet connectivity.
- **Error Handling**: Basic—prints errors to standard error output if the API call fails.

## Dependencies

- **OkHttp**: Used for HTTP client functionality.
- **Infobip API**: Requires valid credentials and network access to Infobip endpoints.

---

**Note:** Ensure sensitive credentials are managed securely and not hard-coded in production environments.