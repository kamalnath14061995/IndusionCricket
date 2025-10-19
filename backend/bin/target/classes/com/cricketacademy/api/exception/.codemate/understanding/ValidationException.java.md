**High-Level Documentation**

**ValidationException Class**

- **Purpose**:  
  Custom exception used in the application to indicate that a validation check failed (e.g., invalid input, required field missing).

- **Inheritance**:  
  Extends Java's RuntimeException, making it an unchecked exception.

- **Usage**:  
  Thrown and caught in scenarios where data validation errors are encountered, providing clear error messaging.

- **Constructors**:
  1. Takes a message describing the validation failure.
  2. Takes both a message and a cause (another throwable) to allow exception chaining.

- **Package**:  
  Part of com.cricketacademy.api.exception, grouping it with other API-related exception classes.

- **Javadoc Comment**:  
  Clearly states this exception is for signaling validation failures.