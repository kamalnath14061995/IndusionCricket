# High-Level Documentation: career_applications Table

## Purpose
Defines the **career_applications** table for storing information about job applications.

## Structure

- **id**: Unique identifier for each application (auto-incremented primary key).
- **name**: Applicant's name.
- **email**: Applicant's email address.
- **phone**: Applicant's phone number.
- **position_type**: The type of position the applicant is applying for.
- **qualifications**: Description of the applicant's qualifications.
- **experience**: Details of the applicant's work experience.
- **availability**: Information about the applicant's availability (up to 500 characters).
- **status**: Current status of the application. Possible values: `PENDING` (default), `APPROVED`, or `REJECTED`.
- **created_at**: Date and time the application was submitted (defaults to the current timestamp).

## Indexes

- `idx_status`: Index on the **status** column for efficient filtering by application status.
- `idx_position_type`: Index on the **position_type** for quick retrieval by position type.
- `idx_created_at`: Index on the **created_at** column for efficient retrieval and sorting by submission time.

## Usage

Intended for tracking and managing job applications, supporting queries by application status, position type, and submission date.