# Commit 0715 — 1f5618f

| Field | Value |
|-------|-------|
| **Commit Number** | 0715 |
| **Commit Hash** | 1f5618fc3762060d9678b4fef23eb7576c68d61e |
| **Parent Hash** | 2515e8b3a82287cb09448ab78a07203f750ac350 |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-17 00:16:04 |
| **Branch** | main |
| **Files Changed** | 2 |
| **Additions** | 158 |
| **Deletions** | 6 |
| **Net Change** | +158/-6 |
| **Merge Commit** | No |

## Hardened Account Lock with Password + 3-Step Confirmation Flow

This commit significantly increases the security of the account lock feature by requiring password verification and a deliberate 3-step confirmation process. Previously, locking an account was a single-click operation with no guardrails — a critical risk for accidental or unauthorized lockouts.

The backend `lockMyAccount` endpoint now requires the user to submit their password in the request body. The server verifies the password against the stored bcrypt hash before proceeding with the lock. On the frontend, OrgSettings.jsx introduces a multi-step modal dialog: Step 1 shows a warning explaining the consequences of locking; Step 2 prompts the user to enter their password; Step 3 requires them to type "LOCK" explicitly before the action executes. The unlock path remains a simple toggle (no password required for unlocking), which is intentional — it ensures the account owner can always regain access.

This change addresses a significant security gap. Without password verification, any session compromise could lead to immediate account lockout. The typed confirmation ("LOCK") follows the destructive-action UX pattern used in cloud providers (e.g., AWS delete resources), reducing accidental lockouts to near zero.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| server/controllers/userController.js | Modified | 15 | 0 | +15 |
| src/pages/OrgSettings.jsx | Modified | 143 | 6 | +137 |

## Detailed Diff Analysis

### server/controllers/userController.js
- `lockMyAccount` now destructures `password` from `req.body` and returns 400 if absent
- Imports `bcrypt` dynamically and compares the submitted password against `user.password_hash`
- Returns 401 on incorrect password before attempting the lock
- Calls `selfLockAccount()` only after password validation succeeds

### src/pages/OrgSettings.jsx
- Adds 5 new state variables: `lockModalOpen`, `lockStep`, `lockPassword`, `lockConfirmText`, `lockError`
- Introduces `LockModal` component with 3-step wizard UI (warning → password → type LOCK)
- `toggleAccountLock` now accepts a `password` parameter and sends it in the POST body
- Unlock path (`DELETE /users/me/lock`) remains unchanged — no password required
- Button handlers now conditionally open the lock modal instead of immediately toggling

## Why This Change Was Needed

The account lock feature was a single-click action with no confirmation or identity verification. This is a critical security gap: anyone with session access could lock an account with no friction. The commit introduces defense-in-depth: password verification ensures the user is the legitimate account holder, and the typed confirmation prevents accidental lockouts.

## Was It Useful

Yes — this is a high-value security hardening change. It prevents accidental lockouts (typed confirmation), unauthorized lockouts (password verification), and maintains the unlock path for legitimate use. The UX pattern is well-established in the industry.

## Impact Analysis

- **Security**: Eliminates unauthorized lockout risk; requires password for lock
- **UX**: Adds ~15 seconds to the lock flow (modal navigation) but prevents irreversible mistakes
- **Backend**: New password validation on lock endpoint; existing callers must update to send password
- **Risk**: Low — the modal is additive and the backend validates before acting

## Relationship to Surrounding Commits

- Precedes commit 0716 (shared post page fixes) — a separate feature area
- Follows earlier OrgSettings work that established the settings panel infrastructure
- Lays groundwork for the 3-step confirmation pattern that could be applied to other destructive actions

## Confidence Notes

The implementation is clean and follows established patterns. The bcrypt import is dynamic (no top-level import), which is fine for a rarely-called endpoint. The modal state management is self-contained. One minor note: the `resetLockModal` function clears all lock state, which is good practice.

## Optional Technical Details

- Backend uses dynamic `import("bcrypt")` to avoid adding bcrypt to the top-level import chain
- Password comparison uses `bcrypt.default.compare()` (ESM interop pattern)
- The lock modal renders at `z-[9999]` to ensure it appears above all other overlays
- The typed confirmation requires exact uppercase "LOCK" match before enabling the submit button
