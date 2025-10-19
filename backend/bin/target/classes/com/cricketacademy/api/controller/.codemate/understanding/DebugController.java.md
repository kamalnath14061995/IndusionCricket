# DebugController - High-Level Documentation

The `DebugController` is a REST API controller designed for debugging and development purposes within the `com.cricketacademy.api.controller` package. It exposes utility endpoints for verifying API accessibility and basic server behaviors.

**Base Path:**  
All endpoints are grouped under `/api/debug`.

**CORS Support:**  
Cross-origin requests from any origin are allowed.

---

## Endpoints

### 1. Test Endpoint
- **Path:** `/api/debug/test`
- **Method:** GET
- **Description:**  
  Returns a simple JSON response confirming that the debug endpoint is accessible, along with a current timestamp. Useful for basic health checks or verifying service reachability.

---

### 2. Security Information Endpoint
- **Path:** `/api/debug/security-info`
- **Method:** GET
- **Description:**  
  Provides debugging information about security configurations, including allowed HTTP methods and whether Cross-Origin Resource Sharing (CORS) is enabled. Intended to assist with validation of CORS and HTTP method rules during development.

---

### 3. Echo Endpoint
- **Path:** `/api/debug/echo`
- **Method:** POST
- **Description:**  
  Receives a JSON payload in the request body and echoes it back in the response, confirming receipt. Useful for debugging payload structure and verifying API communication.

---

## Common Characteristics

- **Response Format:**  
  All endpoints return a JSON object containing fixed fields like `status`, `message`, and additional relevant data per endpoint.

- **Intended Usage:**  
  For internal development, debugging, and testing—not for production or business logic.

---

## Example Use Cases

- Verifying that the API service is online and correctly configured.
- Testing CORS configuration from front-end applications.
- Debugging client-server data exchange by echoing back posted JSON.