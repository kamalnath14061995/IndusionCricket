# TODO: Fix 400 Bad Request Error on Facilities Update

## Issue Description
When updating facilities with an existing image and only updating features, a POST request to `/api/admin/upload/from-url` returns 400 Bad Request.

## Root Cause
The error occurs when the frontend calls `uploadFromUrl` with invalid or relative URLs (e.g., "/uploads/filename.jpg") that don't start with "http://" or "https://".

## Solution Implemented

### Backend Changes (UploadController.java)
- [x] Added check for relative URLs starting with "/uploads/" in `uploadFromUrl` method
- [x] Return the URL as-is if it's already an uploaded file path
- [x] Prevents unnecessary fetching of already uploaded files

### Frontend Changes (AdminFacilities.tsx)
- [x] Modified `handleUrlUpload` to skip API call for URLs starting with "/uploads/"
- [x] Added validation for empty URLs to prevent invalid API calls
- [x] Trim URLs before processing
- [x] Display appropriate error messages for invalid inputs

### Testing
- [ ] Test updating facilities with existing image (should not call upload API)
- [ ] Test uploading from valid external URLs (should work as before)
- [ ] Test uploading from invalid URLs (should show proper error messages)
- [ ] Verify no 400 errors when only updating features

## Files Modified
- `backend/src/main/java/com/cricketacademy/api/controller/UploadController.java`
- `project/src/pages/AdminFacilities.tsx`
- `TODO.md` (updated with new section)
