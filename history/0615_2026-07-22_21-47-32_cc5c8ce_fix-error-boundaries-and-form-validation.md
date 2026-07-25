# Commit 0615 — `cc5c8ce379b1`

| Field | Value |
|-------|-------|
| **Commit Number** | 0615 |
| **Commit Hash** | `cc5c8ce379b1b06c34906f6b74607b80df1300b0` |
| **Parent Hash** | `335b94fed5ec02d05676eee2c6d9ac0435888ea0` |
| **Author** | gamertoky1188gro |
| **Date/Time** | 2026-07-22 21:47:32 |
| **Branch** | main |
| **Files Changed** | 3 |
| **Additions** | 83 |
| **Deletions** | 56 |
| **Net Change** | +27 |
| **Merge Commit** | No |

## Fix Error Boundaries and Form Validation

Resolves audit items #16 and #18. Wraps both Suspense blocks in `AppLayout` with `<ErrorBoundary>` so lazy-route chunk failures show a user-facing fallback instead of silently reloading. Reverts `safeLazy` to return the existing `LazyLoadError` component (instead of calling `window.location.reload()` on chunk errors). Restores `isValidEmail()` usage in `OrgSettings.jsx` for the invite-member flow — replacing an inline regex — and re-adds the profile-email validation check that was previously removed.

## Files Changed

| File | Status | Additions | Deletions | Net |
|------|--------|-----------|-----------|-----|
| `AUDIT_REPORT.md` | Modified | 44 | 44 | 0 |
| `src/App.jsx` | Modified | 29 | 12 | +17 |
| `src/pages/OrgSettings.jsx` | Modified | 10 | 0 | +10 |

## Detailed Diff Analysis

### `src/App.jsx` — Error boundaries restored

The prior commit (0614) had removed the `<ErrorBoundary>` wrappers from both `Suspense` blocks inside `AppLayout` — one for admin/immersive routes, one for the default layout — and changed `safeLazy` to catch chunk-load errors by calling `window.location.reload()` instead of rendering a fallback. This commit undoes that:

- **`safeLazy`**: The `catch` handler now returns `{ default: LazyLoadError }` instead of checking for `ChunkLoadError` and reloading. Any load failure (network error, deploy race, etc.) shows the `LazyLoadError` component — a centered card with a warning icon, "Failed to load page" heading, and a "Refresh Page" button.
- **`LazyLoadError` function**: Re-added as a local component (removed by the prior commit) with a red warning icon, explanatory text, and a manual refresh button.
- **Admin/immersive route branch**: Re-wrapped `<Suspense>` with `<ErrorBoundary>`.
- **Default layout branch**: Re-wrapped the `<main>` content's `<Suspense>` with `<ErrorBoundary>`.
- **`LazyLoadError` was already defined** — this commit re-introduces it.

### `src/pages/OrgSettings.jsx` — Form validation restored

- **Import**: Added `isValidEmail` back to the import from `../lib/validation`.
- **`inviteMember()`**: Replaced the inline regex check (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)`) with `isValidEmail(email)` and uses `ERRORS.email` for the error message (consistent with the app's validation constants).
- **`saveContactSettings()`**: Re-added the profile-email validation check that was previously removed — if `profileEmail` is set and fails `isValidEmail()`, it sets `profileFeedback` to `ERRORS.email` and returns early.

### `AUDIT_REPORT.md` — Status reset

The prior commit had marked items #16 and #18 as "✅ FIXED" with dates and fix descriptions. This commit resets them back to unfixed status (removing the status line, reverting summary table counts, and restoring the unchecked TODO list items).

## Why This Change Was Needed

The prior commit (0614) had rolled back error boundaries and form validation in an apparent mistake — possibly to align with a different branch or experimental approach. This commit restores both fixes, ensuring:

1. Users see a friendly error page instead of a blank screen or infinite reload when a lazy-loaded chunk fails to load.
2. The email validation in `OrgSettings` uses the shared `isValidEmail()` utility with consistent error messages, and the profile-email field is properly validated before saving.

## Was It Useful

**Critical** — Without error boundaries, chunk-load failures silently break the UI. Without form validation, invalid email addresses could be submitted.

## Impact Analysis

- **UX**: Chunk-load failures now show a friendly error page with a refresh button.
- **Data quality**: Email validation is stricter and consistent across the app.
- **Audit compliance**: Items #16 and #18 resolved.

## Relationship to Surrounding Commits

Directly follows commit 0614 (which apparently removed these same fixes). Precedes commit 0616 which resolves audit items 19-25.

## Confidence Notes

High. The diff is small and reverses an apparent regression from the prior commit.
