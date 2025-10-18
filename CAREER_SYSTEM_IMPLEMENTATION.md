# Career System Implementation

## Overview
This document outlines the implementation of the career form system with database storage and admin management for both cricket coaches and ground staff.

## Features Implemented

### 1. Enhanced Database Schema
- Added `onboard_status` and `job_status` fields to both `cricket_coaches` and `ground_staff` tables
- Status tracking with timestamps for creation and updates
- Enum-based status management for consistency

### 2. Backend Enhancements

#### Entity Updates
- **CricketCoach.java**: Added onboard and job status enums with default values
- **GroundStaff.java**: Added onboard and job status enums with default values

#### Service Layer
- **CareerRegistrationService.java**: Enhanced with full CRUD operations
  - Create, Read, Update, Delete operations for both coaches and staff
  - Status management methods for onboard and job status updates
  - Proper error handling and validation

#### Controller Layer
- **CareerController.java**: Added comprehensive REST endpoints
  - GET `/api/career/cricket-coach/{id}` - Get coach by ID
  - PUT `/api/career/cricket-coach/{id}` - Update coach details
  - DELETE `/api/career/cricket-coach/{id}` - Delete coach
  - PUT `/api/career/cricket-coach/{id}/onboard-status` - Update onboard status
  - PUT `/api/career/cricket-coach/{id}/job-status` - Update job status
  - Similar endpoints for ground staff

### 3. Frontend Implementation

#### Admin Career Enquiry Module
- **AdminCareerEnquiry.tsx**: Complete admin interface for managing career applications
  - Tabbed interface for coaches and ground staff
  - Real-time status updates with dropdown selectors
  - Detailed view modal with all application information
  - CRUD operations with confirmation dialogs
  - Responsive design with proper loading states

#### Features
- **Status Management**: 
  - Onboard Status: PENDING, APPROVED, REJECTED, ONBOARDED
  - Job Status: APPLIED, UNDER_REVIEW, INTERVIEW_SCHEDULED, SELECTED, REJECTED, HIRED
- **Real-time Updates**: Status changes are immediately reflected
- **Detailed Views**: Modal popup showing complete application details
- **Time Tracking**: Creation and update timestamps displayed
- **Search and Filter**: Easy navigation through applications

### 4. Database Migration
- **add_career_status_columns.sql**: SQL script to add new columns
- **run_career_migration.bat**: Batch file to execute migration
- Backward compatible with existing data

## Status Enums

### Onboard Status
- `PENDING`: Initial status when application is submitted
- `APPROVED`: Application has been approved for next steps
- `REJECTED`: Application has been rejected
- `ONBOARDED`: Person has been successfully onboarded

### Job Status
- `APPLIED`: Initial status when application is submitted
- `UNDER_REVIEW`: Application is being reviewed
- `INTERVIEW_SCHEDULED`: Interview has been scheduled
- `SELECTED`: Candidate has been selected
- `REJECTED`: Application has been rejected
- `HIRED`: Candidate has been hired

## API Endpoints

### Cricket Coaches
```
GET    /api/career/cricket-coaches           - Get all coaches
POST   /api/career/cricket-coach             - Create new coach
GET    /api/career/cricket-coach/{id}        - Get coach by ID
PUT    /api/career/cricket-coach/{id}        - Update coach
DELETE /api/career/cricket-coach/{id}        - Delete coach
PUT    /api/career/cricket-coach/{id}/onboard-status?status={STATUS} - Update onboard status
PUT    /api/career/cricket-coach/{id}/job-status?status={STATUS}     - Update job status
```

### Ground Staff
```
GET    /api/career/ground-staff               - Get all staff
POST   /api/career/ground-staff               - Create new staff
GET    /api/career/ground-staff/{id}          - Get staff by ID
PUT    /api/career/ground-staff/{id}          - Update staff
DELETE /api/career/ground-staff/{id}          - Delete staff
PUT    /api/career/ground-staff/{id}/onboard-status?status={STATUS} - Update onboard status
PUT    /api/career/ground-staff/{id}/job-status?status={STATUS}     - Update job status
```

## Installation Steps

### 1. Database Migration
```bash
cd backend
run_career_migration.bat
```

### 2. Backend
- Restart the Spring Boot application to load new entity changes
- All endpoints are automatically available

### 3. Frontend
- The AdminCareerEnquiry component is already integrated into the Admin dashboard
- Access via Admin → Career Enquiry tab

## Usage

### For Applicants
1. Visit the career registration page
2. Choose between Cricket Coach or Ground Staff
3. Fill out the application form
4. Submit the application

### For Administrators
1. Login to admin dashboard
2. Navigate to "Career Enquiry" tab
3. View applications in tabbed interface (Coaches/Staff)
4. Update status using dropdown menus
5. View detailed information by clicking the eye icon
6. Delete applications if necessary

## Technical Details

### Database Schema Changes
```sql
-- Cricket Coaches Table
ALTER TABLE cricket_coaches 
ADD COLUMN onboard_status VARCHAR(20) DEFAULT 'PENDING',
ADD COLUMN job_status VARCHAR(30) DEFAULT 'APPLIED';

-- Ground Staff Table
ALTER TABLE ground_staff
ADD COLUMN onboard_status VARCHAR(20) DEFAULT 'PENDING',
ADD COLUMN job_status VARCHAR(30) DEFAULT 'APPLIED';
```

### Key Components
- **Entities**: Enhanced with status enums and proper validation
- **Services**: Full CRUD operations with status management
- **Controllers**: RESTful endpoints with proper error handling
- **Frontend**: React components with TypeScript for type safety

## Security Considerations
- All admin endpoints require authentication
- Input validation on both frontend and backend
- Proper error handling and user feedback
- CORS configuration for cross-origin requests

## Future Enhancements
- Email notifications for status changes
- Document upload functionality
- Interview scheduling integration
- Reporting and analytics dashboard
- Bulk operations for status updates

## Testing
- Test all CRUD operations through the admin interface
- Verify status updates are persisted correctly
- Check responsive design on different screen sizes
- Validate form submissions and error handling