# Commit 683 — 78f9abc

| Field | Value |
|-------|-------|
| **Commit Number** | 683 |
| **Commit Hash** | 78f9abc94d91dfd7f177ea9db576a09899c3209a |
| **Parent Hash** | 55ee6886b6ca905e3ea38af41271521439093491 |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-12 21:28:18 |
| **Branch** | main |
| **Files Changed** | 4 |
| **Additions** | 17 |
| **Deletions** | 12 |
| **Net Change** | +17/−12 |
| **Merge Commit** | No |

## Fix Verification Page toFixed Crash, Feed Management Bugs, and Admin Null Guards

This commit addresses three distinct bug categories across four files. First, the VerificationPage crashed when calling `.toFixed(2)` on `undefined` values from the pricing API — the fix adds nullish coalescing operators (`?? 0`) and proper type checking. Second, FeedManagement had a broken post-saving flow where the response parsing assumed `data.post` but the API returns the post directly, plus the README field was not validated as required. Third, the admin dashboard sections accessed `securityContext.mfa_required` and `securityContext.exec_enabled` without null guards, causing crashes when the security context hadn't loaded yet.

These are all defensive programming fixes that prevent runtime crashes when API responses are unexpected or data hasn't loaded yet.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| src/pages/FeedManagement.jsx | Modified | 8 | 3 | +5 |
| src/pages/VerificationPage.jsx | Modified | 5 | 4 | +1 |
| src/pages/admin/sections/AdminHomeSection.jsx | Modified | 2 | 2 | 0 |
| src/pages/admin/sections/AdminServerSection.jsx | Modified | 2 | 2 | 0 |

## Detailed Diff Analysis

**FeedManagement.jsx**:
- Added a validation check: `if (!form.readme.trim()) { setError("README / Longform content is required."); return; }` — prevents submitting posts without README content
- Fixed post save response parsing: changed `if (!data?.post) { ... } const saved = data.post;` to `const saved = data?.post || data; if (!saved?.id) { ... }` — handles both `{ post: {...} }` and direct `{ id: ..., ... }` response formats
- Added `required` attribute to the README textarea label for visual indication

**VerificationPage.jsx**:
- Changed `if (data?.first_month !== null)` to `if (data?.first_month != null && typeof data.first_month === "number")` — properly validates the API response type before using it
- Changed `verificationPrice.firstMonth.toFixed(2)` to `(verificationPrice.firstMonth ?? 0).toFixed(2)` in 4 locations — prevents crash when pricing data is null/undefined
- Applied the same `?? 0` fallback to `verificationPrice.renewal.toFixed(2)` in 2 locations

**AdminHomeSection.jsx**:
- Changed `securityContext.mfa_required` to `securityContext?.mfa_required` — optional chaining prevents crash when securityContext is null
- Changed `securityContext.exec_enabled` to `securityContext?.exec_enabled` — same pattern

**AdminServerSection.jsx**:
- Same optional chaining applied to `securityContext.mfa_required` and `securityContext.exec_enabled` in the server status display

## Why This Change Was Needed

The VerificationPage crash was the most user-facing: users navigating to the verification page would see a white screen if the pricing API returned unexpected data (null first_month, or a non-number value). The feed management bug prevented users from saving posts in certain API response formats. The admin null guards were defensive fixes for an edge case where the security context loads asynchronously and the component renders before it's ready.

## Was It Useful

Yes — these are all crash-prevention fixes. The `.toFixed()` crash was likely the most frequently encountered, as it affected every user who visited the verification page when the pricing API was slow or returned unexpected data.

## Impact Analysis

- **Stability**: VerificationPage no longer crashes on null pricing data; FeedManagement saves posts correctly; admin dashboard renders without security context.
- **User experience**: Verification pricing shows "$0.00" instead of crashing when data is unavailable; post saving works with all API response formats.
- **Admin reliability**: The dashboard renders correctly even when security context loads slowly.

## Relationship to Surrounding Commits

This commit is a bug-fix sweep that follows the large-scale LazyImage migration (commit 682). It's common to discover edge-case crashes after a large refactor, as the code paths are exercised more thoroughly. The next commit (684) continues the analytics bug-fix theme.

## Confidence Notes

- The `?? 0` fallback is safe for `.toFixed()` — `0..toFixed(2)` returns `"0.00"`, which is a reasonable default for pricing.
- The `data?.post || data` pattern correctly handles both `{ post: {...} }` and `{ id: ..., title: ..., ... }` response shapes.
- The `!= null` check (loose equality) catches both `null` and `undefined`, which is the correct behavior for validating API responses.
- The optional chaining on `securityContext?.mfa_required` is the minimal fix — it doesn't add default values, just prevents the crash.

## Optional Technical Details

- The VerificationPage's pricing state was initialized with `{ firstMonth: 1.99, renewal: 6.99 }` as defaults, but the API response check used `!== null` which doesn't catch `undefined`. The fix changes both the check and the fallback behavior.
- The FeedManagement `required` label change is purely visual — the actual validation is in the `if (!form.readme.trim())` check above.
- The admin security context is fetched from `/api/infra/security-context` which may be slow on first load; the null guards ensure the dashboard renders immediately while the data loads.
