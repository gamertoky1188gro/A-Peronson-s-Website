# Commit 0024: Add Token-Based Current-User Endpoint and Secure Feed User Loading

## Commit Metadata

| Field | Value |
|-------|-------|
| **Commit Number** | 0024 |
| **Commit Hash** | `8e1c5ebe39b3e5a56c5ac25f9462363cf78ccfae` |
| **Parent Hash** | `daba2ccb910d4be00c31d3d955a9e1db8a904b29` |
| **Author** | Cyber Code Master |
| **Date/Time** | 2026-03-02 11:03:33 (+0600) |
| **Files Changed** | 136 |
| **Additions** | 7,061 |
| **Deletions** | 1,359 |
| **Net Change** | +5,702 lines |
| **Merge Commit** | No |

## Custom Title

**Add JWT Issuer/Audience, Current-User Endpoint, and Secure Feed Loading**

## High-Level Summary

A root branch that improves authentication security by adding JWT issuer/audience claims (`JWT_ISSUER`, `JWT_AUDIENCE`), expanding the auth middleware, adding a `me` endpoint to `authController`, and updating `src/lib/auth.js` with better token handling. The MainFeed page is rewritten for more secure user loading. Token expiry reduced from 7 days to 12 hours.

## Key Auth Improvements

- **`server/middleware/auth.js`**: JWT now includes `issuer`, `audience`, and `subject` claims. Token expiry reduced to 12h. Verification checks issuer and audience.
- **`server/controllers/authController.js`**: New `me()` endpoint returns the authenticated user's data from `findUserById()`.
- **`server/routes/authRoutes.js`**: Added `GET /me` route.
- **`src/lib/auth.js`**: Updated with new API request patterns.

## Why

To improve security posture (shorter token expiry, proper JWT claims) and provide a standard `/me` endpoint for client-side user session loading.

## Relationship

This branch will be merged in commit 0025.
