# Security Vulnerability Report

## Overview

This report analyzes the provided Spring Boot configuration file for potential security vulnerabilities. The focus is specifically on identifying insecure practices, misconfigurations, or dangerous exposures in the configuration.

---

## Identified Security Vulnerabilities

### 1. **Hardcoded Database Credentials**

```yaml
spring:
  datasource:
    username: root
    password: Kamal@146
```

- **Risk**: Hardcoding database credentials in a configuration file can result in accidental leakage if the file is ever exposed via version control, backups, or an adversary gaining filesystem access.
- **Best Practice**: Use environment variables or a secrets management system (e.g., HashiCorp Vault, AWS Secrets Manager) to inject sensitive credentials at runtime.

---

### 2. **Database Configuration Allows Insecure Access**

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/cricket_academy?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
```

- **Risk #1**: `useSSL=false` disables SSL/TLS encryption between the application and MySQL database. This exposes database traffic to interception and manipulation.
- **Risk #2**: `allowPublicKeyRetrieval=true` enables a feature that can be used together with `useSSL=false` in certain MySQL versions to make the authentication process more susceptible to man-in-the-middle attacks.
- **Best Practice**: Always set `useSSL=true` and use valid certificates to encrypt all traffic. Avoid `allowPublicKeyRetrieval=true` unless absolutely necessary, and only with SSL enabled.

---

### 3. **Sensitive Data in Debug Logging**

```yaml
logging:
  level:
    com.cricketacademy.api: DEBUG
    org.springframework.security: DEBUG
    org.springframework.security.web: DEBUG
    org.springframework.web: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

- **Risk**: Enabling DEBUG and especially TRACE logs for security and SQL components can lead to sensitive information (credentials, tokens, SQL parameters) being written to log files or the console.
- **Best Practice**: Use INFO or WARN logging in production. Avoid logging sensitive beans, security configuration, or user data at DEBUG/TRACE level.

---

### 4. **JWT Secret Hardcoded and Weak Secret Warning**

```yaml
app:
  jwt:
    secret: your-secret-key-here-make-it-long-and-secure-in-production-ensure-this-is-at-least-64-characters-long-for-hs512-algorithm
```

- **Risk**: Secret is hardcoded. The sample hints to change it for production but provides a default value, which can be overlooked and used in deployment.
- **Best Practice**: Never hardcode secrets. Use environment variables or a secrets manager. Ensure the actual value used in production is strong, rotated regularly, and never checked into version control.

---

### 5. **Use of Root Database User**

```yaml
  datasource:
    username: root
```

- **Risk**: Running the application as the root database user violates the principle of least privilege. If compromised, the attacker gets full control over the database.
- **Best Practice**: Create a dedicated database user for the application with only the necessary permissions.

---

### 6. **Exposure of Database Port on `localhost`**

- **Risk**: `localhost` can be considered moderately safe, but if the deployment environment binds to `0.0.0.0` or is misconfigured, it might expose the database to the network.
- **Best Practice**: Ensure MySQL is not exposed to external interfaces unnecessarily, and firewall inbound connections aggressively.

---

## Summary Table

| Vulnerability                 | Description                                      | Recommendation                                   |
|-------------------------------|--------------------------------------------------|--------------------------------------------------|
| Hardcoded DB credentials      | Credentials stored in config files               | Use environment variables or secrets manager      |
| Insecure DB SSL Config        | useSSL=false, public key retrievable             | Require SSL, use proper certificates             |
| Sensitive Data in Logging     | DEBUG/TRACE logs, possible sensitive output      | Use INFO log level in production                 |
| Hardcoded JWT Secret          | Secret key is static in code                     | Use env variables or secret manager              |
| Use of Root DB User           | Grants full DB privileges to app                 | Use least privileged DB user                     |
| Exposure of DB Port           | Possible exposure depending on deployment        | Restrict DB network exposure, use firewalls      |

---

## Recommendations

1. **Remove All Hardcoded Secrets**: Use secure context-aware properties management (such as Spring Cloud Config or secret managers) rather than properties or YAML files.
2. **Enable SSL For Database Connections**: Always encrypt traffic between your app and the DB.
3. **Sanitize Logging Levels in Production**: Move to INFO log level and audit log outputs for leaks.
4. **Do Not Use 'root' As Database User**: Create and use a restricted database user account.
5. **Regularly Rotate All Credentials**: Including JWT secrets and database passwords.
6. **Audit Deployment Security**: Ensure local bindings and firewalls are in place to prevent accidental exposure.

---

## Conclusion

The provided configuration file contains several critical security vulnerabilities primarily relating to credential management, insecure default settings, and excessive logging. These must be addressed prior to moving the application to production or any environment where sensitive data could be exposed.

**Recommendation**: Do a comprehensive security review before deployment.