## High-Level Documentation for PasswordResetUtil

### Overview
The `PasswordResetUtil` is a standalone command-line utility for the Cricket Academy API system that allows administrators to reset a user's password to a specified value. This tool is intended for operational or administrative use without needing to run the full application server.

### Features
- **Password Reset**: Allows resetting a user's password by invoking the appropriate method in the application's `UserService`.
- **Command-Line Interface**: Accepts the user’s email and new password as command-line arguments for ease of scripting and automation.
- **Spring Context**: Runs independently by loading the application context and required beans from the API system.

### Usage
Run the utility from the command line (after building the project):

```
java -cp target/classes com.cricketacademy.api.util.PasswordResetUtil <userEmail> <newPassword>
```
- `<userEmail>`: The email address of the target user.
- `<newPassword>`: The new password to be set for the user.

### Workflow
1. **Argument Validation**: Checks that both email and password are provided, otherwise displays usage instructions.
2. **Context Initialization**: Loads the Spring application context from the base API package.
3. **Password Reset**: Fetches the `UserService` bean and calls its `resetUserPassword` method with the given credentials.
4. **Error Handling**: Prints an error message and stack trace if the password reset fails for any reason.
5. **Resource Cleanup**: Closes the Spring context to release resources.

### Notes
- Requires the application’s compiled classes and dependencies on the classpath.
- Should be run with appropriate user privileges, as it can modify user credentials.
- Designed primarily for admin/support-level operations. Not a replacement for normal user password reset flows.