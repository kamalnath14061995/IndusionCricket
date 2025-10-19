High-Level Documentation

This configuration file contains settings for integrating with the Cashfree payment gateway and controlling JWT authentication in an application:

1. **Cashfree Integration**
   - `cashfree.appId`: Placeholder for your unique Cashfree Application ID. Replace with your actual value.
   - `cashfree.secretKey`: Placeholder for your secret key provided by Cashfree. Replace with your actual value.
   - `cashfree.env`: Specifies the operational environment for Cashfree integration. Typical values are `TEST` for testing/sandbox mode and `PROD` for production.

2. **JWT (JSON Web Token) Configuration**
   - `app.jwt.expiration`: Determines the lifespan of issued JWTs in milliseconds. Here, it's set to 600,000 ms (10 minutes), after which tokens will expire and require renewal.

**Purpose**:  
These settings facilitate secure online payments through Cashfree and ensure user sessions are time-limited via JWT expiration to enhance security. All credential placeholders should be replaced with actual, sensitive values before deploying the application.