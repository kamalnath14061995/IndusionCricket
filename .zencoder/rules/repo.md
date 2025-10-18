---
description: Repository Information Overview
alwaysApply: true
---

# Repository Information Overview

## Repository Summary
This repository contains a Cricket Academy Registration System with a React frontend and Spring Boot backend. The system allows for user registration, authentication, and management for a cricket academy.

## Repository Structure
- **backend/**: Spring Boot API for the Cricket Academy system
- **project/**: React frontend application built with Vite and TypeScript
- **dist/**: Build output directory for the frontend
- **projectss/**: Appears to be a secondary or older project version

## Projects

### Frontend (React Application)
**Configuration File**: package.json

#### Language & Runtime
**Language**: TypeScript/JavaScript
**Version**: TypeScript 5.5.3
**Build System**: Vite 5.4.2
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- React 18.3.1
- React DOM 18.3.1
- React Router DOM 7.7.1
- Lucide React 0.344.0

**Development Dependencies**:
- TypeScript 5.5.3
- Vite 5.4.2
- ESLint 9.9.1
- Tailwind CSS 3.4.1
- PostCSS 8.4.35
- Autoprefixer 10.4.18

#### Build & Installation
```bash
npm install
npm run dev    # Development server
npm run build  # Production build
```

### Backend (Spring Boot API)
**Configuration File**: pom.xml

#### Language & Runtime
**Language**: Java
**Version**: Java 17
**Build System**: Maven
**Framework**: Spring Boot 3.2.0

#### Dependencies
**Main Dependencies**:
- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Security
- MySQL Connector Java 8.0.33
- Lombok
- JWT (jsonwebtoken) 0.11.5

**Development Dependencies**:
- Spring Boot Starter Test
- Spring Security Test

#### Build & Installation
```bash
mvn clean install
mvn spring-boot:run
```

#### Testing
**Framework**: JUnit with Spring Boot Test
**Test Location**: src/test
**Run Command**:
```bash
mvn test
```

## API Endpoints

### Authentication Endpoints
- **POST** `/api/auth/register`: Register a new user
- **GET** `/api/auth/health`: Health check endpoint
- **GET** `/api/auth/experience-levels`: Get available experience levels
- **GET** `/api/auth/validate-email`: Check email availability
- **GET** `/api/auth/validate-phone`: Check phone number availability

### User Management Endpoints
- **GET** `/api/users/profile`: Get current user profile
- **GET** `/api/users/{id}`: Get user by ID
- **GET** `/api/users`: Get all active users (Admin)
- **PUT** `/api/users/{id}`: Update user information
- **DELETE** `/api/users/{id}`: Deactivate user account