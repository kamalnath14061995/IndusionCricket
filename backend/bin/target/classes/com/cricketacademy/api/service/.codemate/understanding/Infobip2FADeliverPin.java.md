**High-Level Documentation of Infobip2FADeliverPin**

---

**Purpose:**
This Java class provides a simple command-line utility to deliver a 2FA (Two-Factor Authentication) PIN message via the Infobip SMS API.

**Key Functionalities:**

- **Parameter Intake:**  
  Accepts three command-line arguments:  
  1. `applicationId` - The unique application identifier provided by Infobip.  
  2. `messageId` - The ID of the 2FA message template to send.  
  3. `toPhoneNumber` - The recipient's phone number.

- **Request Construction:**  
  - Builds a JSON request payload with the above arguments and a hardcoded sender phone number.
  - Assembles a POST request to Infobip's `/2fa/2/pin` endpoint.
  - Adds necessary headers for authorization and content formatting.

- **Network Interaction:**  
  - Uses OkHttp to send the POST request to the Infobip API.
  - Waits synchronously for a response.

- **Response Handling:**  
  - Prints the response HTTP status code and response body to standard output.
  - Prints error messages to standard error if the request is unsuccessful.

**Typical Usage:**
```shell
java Infobip2FADeliverPin <applicationId> <messageId> <toPhoneNumber>
```

**Main Use Case:**  
Sending 2FA PIN codes via SMS to users for authentication or verification within a Java-based service or utility.

**Note:**  
- The class requires a valid Infobip authorization key, which is hardcoded in the example.
- The sender’s phone number is also hardcoded.
- The example assumes the required OkHttp library is included in the classpath.