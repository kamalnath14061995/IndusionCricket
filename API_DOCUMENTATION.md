# Coaching Program Management System - API Documentation

## Overview
This document provides comprehensive documentation for the coaching program management system APIs, including authentication, authorization, and all available endpoints.

## Authentication
All endpoints (except authentication endpoints) require JWT authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Base URL
```
http://localhost:8080
```

## API Endpoints

### 1. Authentication Endpoints

#### POST /auth/login
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "ADMIN"
  }
}
```

### 2. Admin Program Management Endpoints

#### GET /api/admin/programs
Get all coaching programs (Admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
[
  {
    "id": 1,
    "programName": "Beginner Cricket Training",
    "description": "Introduction to cricket basics",
    "duration": "4 weeks",
    "price": 199.99,
    "level": "Beginner",
    "category": "Training",
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00",
    "updatedAt": "2024-01-15T10:00:00",
    "coaches": [1, 2, 3]
  }
]
```

#### GET /api/admin/programs/active
Get all active programs (Admin only).

**Response:** Same as above, filtered for active programs.

#### GET /api/admin/programs/{id}
Get specific program by ID (Admin only).

**Response:**
```json
{
  "id": 1,
  "programName": "Beginner Cricket Training",
  "description": "Introduction to cricket basics",
  "duration": "4 weeks",
  "price": 199.99,
  "level": "Beginner",
  "category": "Training",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00",
  "updatedAt": "2024-01-15T10:00:00",
  "coaches": [1, 2, 3]
}
```

#### POST /api/admin/programs
Create new coaching program (Admin only).

**Request:**
```json
{
  "programName": "Advanced Batting Techniques",
  "description": "Master advanced batting skills and techniques",
  "duration": "6 weeks",
  "price": 299.99,
  "level": "Advanced",
  "category": "Specialized",
  "isActive": true,
  "coachIds": [1, 2]
}
```

**Response:**
```json
{
  "id": 2,
  "programName": "Advanced Batting Techniques",
  "description": "Master advanced batting skills and techniques",
  "duration": "6 weeks",
  "price": 299.99,
  "level": "Advanced",
  "category": "Specialized",
  "isActive": true,
  "createdAt": "2024-01-15T11:00:00",
  "updatedAt": "2024-01-15T11:00:00",
  "coaches": [1, 2]
}
```

#### PUT /api/admin/programs/{id}
Update existing program (Admin only).

**Request:** Same as POST request.

**Response:** Updated program object.

#### DELETE /api/admin/programs/{id}
Delete program (Admin only).

**Response:** 204 No Content

### 3. Coach Program Viewing Endpoints

#### GET /api/coach/programs
Get all active programs (Coach only).

**Headers:**
```
Authorization: Bearer <coach-token>
```

**Response:** Same format as admin endpoints, but only active programs.

#### GET /api/coach/programs/{id}
Get specific program by ID (Coach only).

**Response:** Single program object.

#### GET /api/coach/programs/search
Search programs by keyword (Coach only).

**Query Parameters:**
- `keyword` (required): Search term

**Example:**
```
GET /api/coach/programs/search?keyword=batting
```

**Response:** Array of matching programs.

#### GET /api/coach/programs/category/{category}
Get programs by category (Coach only).

**Example:**
```
GET /api/coach/programs/category/Training
```

**Response:** Array of programs in specified category.

#### GET /api/coach/programs/level/{level}
Get programs by level (Coach only).

**Example:**
```
GET /api/coach/programs/level/Beginner
```

**Response:** Array of programs at specified level.

### 4. Error Responses

#### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "programName",
      "message": "Program name is required"
    }
  ]
}
```

#### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

#### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions to access this resource"
}
```

#### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Program not found with id: 123"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## 5. Data Models

### Program Object
```json
{
  "id": "number",
  "programName": "string (required, 2-255 chars)",
  "description": "string (optional)",
  "duration": "string (max 100 chars)",
  "price": "number (required, > 0)",
  "level": "string (max 50 chars)",
  "category": "string (max 100 chars)",
  "isActive": "boolean (default: true)",
  "createdAt": "ISO 8601 datetime",
  "updatedAt": "ISO 8601 datetime",
  "coaches": "array of coach IDs"
}
```

### Validation Rules
- **programName**: Required, 2-255 characters
- **price**: Required, must be greater than 0
- **duration**: Optional, max 100 characters
- **level**: Optional, max 50 characters
- **category**: Optional, max 100 characters
- **coachIds**: Optional, array of valid coach IDs

## 6. Rate Limiting
- **Authenticated requests**: 1000 requests per hour
- **Failed authentication**: 5 attempts per minute

## 7. Pagination
All list endpoints support pagination:
- `page`: Page number (default: 0)
- `size`: Page size (default: 20, max: 100)

Example:
```
GET /api/admin/programs?page=0&size=10
```

## 8. Filtering and Sorting
List endpoints support filtering and sorting:
- `sort`: Sort field and direction (e.g., `programName,asc`)
- `filter`: Additional filtering parameters

Example:
```
GET /api/admin/programs?sort=programName,asc&filter=category:Training
```

## 9. SDK Examples

### JavaScript/Node.js
```javascript
// Admin creating a program
const createProgram = async (programData) => {
  const response = await fetch('/api/admin/programs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify(programData)
  });
  return response.json();
};

// Coach viewing programs
const getPrograms = async () => {
  const response = await fetch('/api/coach/programs', {
    headers: {
      'Authorization': `Bearer ${coachToken}`
    }
  });
  return response.json();
};
```

### Python
```python
import requests

# Admin creating a program
headers = {'Authorization': f'Bearer {admin_token}'}
program_data = {
    'programName': 'New Program',
    'description': 'Program description',
    'price': 199.99
}
response = requests.post('/api/admin/programs', json=program_data, headers=headers)
```

### cURL
```bash
# Admin creating a program
curl -X POST http://localhost:8080/api/admin/programs \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "programName": "New Program",
    "description": "Program description",
    "price": 199.99
  }'

# Coach viewing programs
curl -X GET http://localhost:8080/api/coach/programs \
  -H "Authorization: Bearer $COACH_TOKEN"
```

## 10. Postman Collection
A complete Postman collection is available at:
```
/docs/postman/coaching-programs.postman_collection.json
```

## 11. OpenAPI Specification
OpenAPI 3.0 specification is available at:
```
http://localhost:8080/api-docs
```

## 12. Testing Endpoints
Test endpoints are available for development:
```
GET /api/test/health - Health check
GET /api/test/auth - Authentication test
