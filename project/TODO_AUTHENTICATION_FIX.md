# Authentication Flow Fix - TODO

## Issue
When users try to book or enroll in coaching, they get redirected to login. After successful login, they are redirected to dashboard instead of back to the payment page, causing them to lose their booking intent.

## Root Cause
Login component always redirects to '/dashboard' after successful login, ignoring the "from" state that contains the original intended destination.

## Changes Made
✅ **Fixed Login.tsx**: Modified to check for "from" state and redirect appropriately after successful login
✅ **Fixed PaymentPage.tsx**: Modified to preserve booking state when redirecting to login

## Files Modified
- `project/src/pages/Login.tsx` - Added useLocation import and modified redirect logic to preserve state
- `project/src/pages/PaymentPage.tsx` - Modified to pass booking state when redirecting to login

## Testing Status
- [ ] Test booking flow: Try to book without login → login → should redirect back to payment page
- [ ] Test coaching enrollment flow: Try to enroll in coaching without login → login → should redirect back to payment page

## Additional Considerations
- [ ] AdminLogin.tsx also has the same issue - should be fixed if admin users need similar flow
- [ ] Consider adding similar logic to other authentication flows if needed

## Next Steps
1. Test the booking flow to ensure users are redirected back to payment after login
2. Test the coaching enrollment flow to ensure users are redirected back to payment after login
3. If successful, mark as completed
