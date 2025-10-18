# Bookings.tsx Fix Plan

## Issue
TypeError: (intermediate value)(intermediate value)(intermediate value)?.map is not a function
at Bookings.tsx:292:94

## Root Cause
The error occurs in JSX where `.map()` is called on a conditional expression:
```tsx
{(bookingType === 'ground' ? facility.facilities : facility.features)?.map(...)}
```

If either `facility.facilities` or `facility.features` is not an array, the `.map()` call fails.

## Fix Applied
Replaced the unsafe `.map()` call with a safe approach using default empty array:
```tsx
{((bookingType === 'ground' ? facility.facilities : facility.features) || []).map(...)}
```

## Steps Completed
- [x] Identified the problematic line
- [x] Created fix plan
- [x] Implemented the fix
- [ ] Test the fix
