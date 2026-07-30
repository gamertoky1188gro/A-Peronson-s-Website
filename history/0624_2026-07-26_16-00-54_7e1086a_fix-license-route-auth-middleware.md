# Commit 0624 — 7e1086a353d5

| Field | Value |
|-------|-------|
| **Commit Number** | 0624 |
| **Commit Hash** | 7e1086a353d53b1acbd5318c81ed07b884b43415 |
| **Parent Hash** | 5e48229d5cfb8829123c1df278dff5673c371492 |
| **Author** | gamertoky1188gro |
| **Date/Time** | 2026-07-26 16:00:54 |
| **Branch** | main |
| **Files Changed** | 1 |
| **Additions** | 6 |
| **Deletions** | 6 |
| **Net Change** | 0 |
| **Merge Commit** | No |

## Fix License Route Auth Middleware

Replaces `authenticateToken` with `requireAuth` on all five route handlers in `server/routes/licenseRequestRoutes.js`. Both are auth middleware functions, but `requireAuth` provides a user object in `req.user` while `authenticateToken` only validates the token.

## Files Changed

| File | Type | + | - | Δ |
|------|------|---|---|---|
| `server/routes/licenseRequestRoutes.js` | Modified | 6 | 6 | 0 |

## Detailed Diff Analysis

The import line changed from:
```js
import { authenticateToken } from "../middleware/auth.js";
```
to:
```js
import { requireAuth } from "../middleware/auth.js";
```

All five route definitions changed. Each route handler now uses `requireAuth` instead of `authenticateToken`:
- `POST /` — createLicenseRequestController
- `POST /:requestId/upload` — uploadLicenseDocumentController
- `POST /:requestId/reject` — rejectLicenseRequestController
- `GET /incoming` — listPendingController
- `GET /outgoing` — listMyRequestsController

## Why This Change Was Needed

**Inference**: The license request controllers likely need `req.user` (provided by `requireAuth`) to access the authenticated user's ID, role, or profile data. `authenticateToken` only verifies the token and attaches the decoded payload to `req.user` or `req.token` depending on implementation, but may not fetch the full user record from the database. `requireAuth` calls `getCurrentUser` internally and provides a richer user object. Without this fix, controllers would either crash (accessing undefined properties) or behave incorrectly (e.g., always using a default user ID).

## Was It Useful

**Useful** — Corrects an auth middleware mismatch that would cause runtime errors in the license request controllers. The license routes were new in commit 0621 but used the wrong middleware.

## Impact Analysis

- **Runtime**: License request endpoints now have access to the full authenticated user object
- **Security**: Both middleware functions require a valid JWT, so auth enforcement remains identical
- **Consistency**: Aligns license request routes with other route files in the project that use `requireAuth`

## Relationship to Surrounding Commits

Fixes a bug introduced in commit 0621 when the license request routes were first created. The `licenseRequestRoutes.js` file was new in 0621 (+19 lines) and used `authenticateToken`. This commit corrects it to `requireAuth` — a pattern followed by most other route files.

## Confidence Notes

High confidence. The diff is minimal and clear. The `requireAuth` import already exists in `auth.js` and is used extensively across the codebase (70+ route files).
