# Commit 0708 — 5e284d2

| Field | Value |
|-------|-------|
| **Commit Number** | 0708 |
| **Commit Hash** | 5e284d29775659e3de52114af6043d665e493d05 |
| **Parent Hash** | 024547dcba46c2041e813f91b3033d8c9fbfbe0d |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-16 21:37:21 |
| **Branch** | main |
| **Files Changed** | 4 |
| **Additions** | 64 |
| **Deletions** | 1 |
| **Net Change** | +64/-1 |

## Fix: Enforce Account Lock -- Auth Middleware Blocks Locked Accounts, Frontend Shows Lock Screen

This commit implements end-to-end account locking enforcement across 4 files. On the backend, `server/middleware/auth.js` now intercepts requests from users with `status === "locked"` and returns HTTP 403 with an `ACCOUNT_LOCKED` error code, except for the self-unlock endpoint and logout. On the frontend, `App.jsx` detects the locked state and renders a dedicated lock screen overlay that blocks all routes except `/settings` and `/profile`. `src/lib/auth.js` persists the locked flag to `localStorage` so the lock screen survives page reloads. `OrgSettings.jsx` clears the localStorage flag when the user unlocks their account.

## Files Changed

| File | Type | + | - | Delta |
|------|------|---|---|---|
| `server/middleware/auth.js` | Modified | 16 | 0 | +16 |
| `src/App.jsx` | Modified | 43 | 1 | +42 |
| `src/lib/auth.js` | Modified | 5 | 0 | +5 |
| `src/pages/OrgSettings.jsx` | Modified | 1 | 0 | +1 |

## Detailed Diff Analysis

### server/middleware/auth.js
- After the JWT verification and user lookup in `requireAuth`, a new block checks `user.status === "locked"`.
- An allowlist defines two paths that locked users can still access: `DELETE /api/users/me/lock` (self-unlock) and `POST /api/auth/logout`.
- If the request does not match an allowed path, the middleware returns `403` with `{ error: "Account locked", code: "ACCOUNT_LOCKED", message: "Your account is currently locked. Unlock it to regain access." }`.

### src/App.jsx
- Imports `clearSession` from `auth.js` (newly needed for logout action).
- In `ProtectedRoute`, after loading the user but before role checks, a new block checks `user?.status === "locked"` and `!isUnlockPage` (where `isUnlockPage` is `/settings` or `/profile`).
- If locked and not on an unlock page, renders a full-page lock screen with:
  - Amber lock icon (SVG).
  - "Account Locked" heading.
  - Descriptive text about temporary lock.
  - "Unlock Account" button that clears the localStorage flag and navigates to `/settings`.
  - "Log out instead" link that calls `clearSession()` and redirects to `/login`.

### src/lib/auth.js
- In the `apiRequest` error handler, when `res.status === 403 && data?.code === "ACCOUNT_LOCKED"`, sets `localStorage.setItem("ght_account_locked", "1")`.
- This ensures the lock screen appears even on fresh page loads after the first 403 response.

### src/pages/OrgSettings.jsx
- In the unlock handler (`DELETE /users/me/lock`), adds `localStorage.removeItem("ght_account_locked")` to clear the persisted lock flag after successful unlock.

## Why This Change Was Needed

The account lock feature existed in the database (users could set `status = "locked"`) but had no enforcement. A locked user could still access all endpoints and UI routes, making the lock feature purely cosmetic. This commit completes the feature by adding backend gatekeeping and frontend UI blocking.

## Was It Useful

Yes. This is a security-critical feature. Without enforcement, locked accounts (e.g., compromised accounts, accounts under review) could continue to access the platform, defeating the purpose of the lock mechanism.

## Impact Analysis

- **Security:** Locked accounts are now properly blocked from all API endpoints except self-unlock and logout.
- **UX:** Locked users see a clear, branded lock screen instead of silently being able to use the app.
- **Edge cases:** The allowlist ensures locked users can still unlock themselves or log out, preventing dead-end states.
- **localStorage dependency:** The lock flag persists across reloads but is cleared on unlock or logout.

## Relationship to Surrounding Commits

- **Preceded by:** Commit 0707 (remove CTA/Links fields) -- unrelated feature cleanup.
- **Followed by:** Commit 0709 (remove Filters button) -- feed UI simplification.

## Confidence Notes

- The backend middleware correctly checks `user.status` after the user object is loaded from the database.
- The frontend lock screen is rendered before any role-based routing, ensuring no route leakage.
- The localStorage key `ght_account_locked` is consistent between `auth.js` (set), `App.jsx` (read), and `OrgSettings.jsx` (clear).

## Optional Technical Details

- The middleware uses `req.path.startsWith()` for path matching, which is safe because the allowlisted paths are short and specific.
- The lock screen does not prevent WebSocket connections or other background processes -- only HTTP API calls are gated.
