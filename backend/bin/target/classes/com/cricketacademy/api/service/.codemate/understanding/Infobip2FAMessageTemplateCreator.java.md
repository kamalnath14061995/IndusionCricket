# High-Level Documentation

## Overview

The `Infobip2FAMessageTemplateCreator` is a standalone Java utility class used to create a 2FA (Two-Factor Authentication) message template for an application registered with Infobip, a popular communication API platform. This tool uses HTTP POST requests to interact with the Infobip 2FA API and register a new numeric PIN message template.

---

## Main Functionality

- **Purpose:**  
  Programmatically creates a 2FA message template for use in SMS-based authentication via Infobip.

---

## Usage

Run the class via the command line, passing the target application's ID as an argument:

```bash
java Infobip2FAMessageTemplateCreator <appId>
```
- `<appId>`: The unique identifier of the Infobip application for which the template is being created.

---

## Key Features

- **HTTP API Integration:**  
  Uses OkHttpClient to send RESTful requests to the Infobip 2FA endpoints.

- **Template Definition:**  
  Posts a message template with the following characteristics:
  - Pin type: NUMERIC
  - Message: "Your pin is {{pin}}"
  - Pin length: 4 digits
  - Sender ID: "ServiceSMS"

- **Authentication:**  
  Includes static authorization headers for access to Infobip API.

- **Response Handling:**  
  Prints the HTTP response code and body. Reports errors if the request is unsuccessful.

---

## Error Handling

- Checks if the required application ID argument is provided.
- Logs and prints error details if the HTTP request fails.

---

## Dependencies

- [OkHttp](https://square.github.io/okhttp/) - for making HTTP requests.

---

## Intended Users

- Backend developers or system administrators who need to automate or script the registration of 2FA message templates via Infobip's API.

---

## Security Note

- **Caution:** The API authorization key is hardcoded, which is insecure for production environments. Ensure secure storage and retrieval of credentials.

---

## Extensibility

- The code can be adapted for more dynamic template content, environment-based secrets, or additional REST calls to manage 2FA workflows.