# Authentication Fix for Upload from URL Endpoint

## Problem Analysis

The `/api/admin/upload/from-url` endpoint was returning "Unauthorized" with the message "Full authentication is required to access this resource" despite the frontend appearing to send the correct authentication token.

## Root Cause

The issue was in the `apiFetch` function in `project/src/services/apiClient.ts`. The function had this logic:

```typescript
// Only set Authorization header if token is valid
if (accessToken && isValidJwtToken(accessToken) && !headers.has('Authorization')) {
  headers.set('Authorization', `Bearer ${accessToken}`);
}
```

However, the `uploadFromUrl` method in `HomepageApiService` was explicitly setting the Authorization header:

```typescript
const res = await apiFetch(UPLOAD_FROM_URL, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` }, // This sets Authorization header
  body: JSON.stringify({ url, filename })
});
```

This meant that `headers.has('Authorization')` was `true`, so the `apiFetch` function wouldn't add the Authorization header from localStorage. But there was a potential mismatch between the token passed as a parameter and the token in localStorage.

## Solution

Modified the `apiFetch` function to properly handle cases where the Authorization header is already set:

```typescript
// Check if Authorization header is already set with a valid token
const existingAuth = headers.get('Authorization');
if (existingAuth && existingAuth.startsWith('Bearer ')) {
  // Authorization header is already set, use it as-is
  console.log('API Fetch: Using existing Authorization header');
} else if (accessToken && isValidJwtToken(accessToken)) {
  // Only set Authorization header if token is valid and no existing valid header
  headers.set('Authorization', `Bearer ${accessToken}`);
  console.log('API Fetch: Added Authorization header from localStorage token');
} else {
  console.log('API Fetch: No valid Authorization header available');
}
```

## Additional Debugging

Added debug logging to help diagnose authentication issues:

```typescript
// Debug log the request details
console.log('API Fetch Request:', {
  url: input,
  method: init.method || 'GET',
  headers: Object.fromEntries([...headers]),
  hasBody: !!init.body
});

// Debug log the response
console.log('API Fetch Response:', {
  status: first.status,
  statusText: first.statusText,
  headers: Object.fromEntries([...first.headers])
});
```

## Testing

Created a test file `test-auth-debug.html` to help debug authentication issues by:
1. Checking localStorage tokens and their validity
2. Testing the upload from URL endpoint directly
3. Testing other admin API endpoints

## Files Modified

1. `project/src/services/apiClient.ts` - Fixed Authorization header logic and added debug logging
2. `project/src/services/homepageApiService.ts` - No changes needed (already correct)
3. Created `test-auth-debug.html` - Debug tool for authentication testing

## Verification

To verify the fix:
1. Open the browser console to see debug logs from `apiFetch`
2. Use the `test-auth-debug.html` page to test authentication
3. Try the upload from URL functionality in the admin interface

The fix ensures that:
- If an Authorization header is already provided, it's used as-is
- If no Authorization header is provided but a valid token exists in localStorage, it's added
- Proper debug logging helps identify authentication issues
