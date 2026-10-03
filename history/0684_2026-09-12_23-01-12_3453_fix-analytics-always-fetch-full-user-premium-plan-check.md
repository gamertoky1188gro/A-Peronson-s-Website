# Commit 684 — 3453a74

| Field | Value |
|-------|-------|
| **Commit Number** | 684 |
| **Commit Hash** | 3453a74ae338180b2fd5d254449ba14b34642724 |
| **Parent Hash** | 78f9abc94d91dfd7f177ea9db576a09899c3209a |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-12 23:01:12 |
| **Branch** | main |
| **Files Changed** | 3 |
| **Additions** | 22 |
| **Deletions** | 13 |
| **Net Change** | +22/−13 |
| **Merge Commit** | No |

## Fix Analytics Premium Controller to Always Fetch Full User for Plan Check

This commit fixes a critical bug in the analytics premium endpoint where the controller passed the JWT-decoded `req.user` object to `getPremiumInsights()`, but the JWT payload doesn't include `subscription_status` — causing the premium plan check to always fail or return incorrect data. The fix changes the controller to always call `findUserById(req.user.id)` to get the full database record with subscription details.

Additionally, the `getCoreMetrics` function in `analyticsService.js` referenced `prisma.conversation` and `prisma.dispute` models that don't exist in the Prisma schema, causing 500 errors on the buying house analytics endpoint. These references were removed, and the trust score calculation was simplified. The VerificationPage also received improved pricing fallback handling from the previous commit.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| server/controllers/analyticsController.js | Modified | 1 | 1 | 0 |
| server/services/analyticsService.js | Modified | 10 | 8 | +2 |
| src/pages/VerificationPage.jsx | Modified | 11 | 4 | +7 |

## Detailed Diff Analysis

**server/controllers/analyticsController.js (line 126)**:
- Changed: `const actor = req.user?.role === "agent" ? await findUserById(req.user.id) : req.user;`
- To: `const actor = await findUserById(req.user.id);`
- Previously, only agent-role users got the full DB record; all other roles used the JWT-decoded object. Now all users get the full record, ensuring `subscription_status` and other plan fields are available for the `authorize()` call and `getPremiumInsights()`.

**server/services/analyticsService.js (lines 1660-1678)**:
- Removed `prisma.conversation.count(...)` and `prisma.dispute.count(...)` from the `Promise.all` — these models don't exist in the schema, so the queries would throw a Prisma error.
- Removed the `conversion` metric (contracts / conversations) since conversations no longer exist.
- Simplified the `trustScore` from `Math.max(0, contracts + (ratings._avg.score || 0) - disputes)` to `Math.max(0, contracts + (ratings._avg.score || 0))`.
- Updated the hint text from `"deals + rating - disputes"` to `"deals + rating"`.

**src/pages/VerificationPage.jsx**:
- Added proper fallback handling: when the API response check fails (`first_month` is null or not a number), the state is set to the hardcoded defaults `{ firstMonth: 1.99, renewal: 6.99 }` instead of staying at the initial null state.
- Added an explicit `catch` block that also sets the default pricing values.
- Added a visual "pricing unavailable" indicator (amber text) when `firstMonth` is null, so users know why the price shows as $0.00.
- The pricing display now conditionally shows either the formatted price or a "Pricing unavailable" message depending on whether the data loaded.

## Why This Change Was Needed

The analytics premium endpoint was broken for non-agent users because the JWT-decoded object lacks the `subscription_status` field that `getPremiumInsights()` needs to determine if a user has a premium plan. This meant the premium analytics feature was silently failing for most users.

The `getCoreMetrics` 500 error was caused by Prisma schema mismatches — `conversation` and `dispute` models were referenced but don't exist. This would crash the entire analytics endpoint for buying house users.

The VerificationPage pricing fallback was incomplete — the initial state had `null` values, and the catch block didn't set defaults, so if the API failed, the page would show "$0.00" or crash on `.toFixed()`.

## Was It Useful

Yes — this fixes two server-side bugs that would cause 500 errors or incorrect data, and improves the client-side pricing fallback to be more robust. The analytics feature now works correctly for all user roles.

## Impact Analysis

- **Server reliability**: The analytics premium endpoint no longer fails for non-agent users.
- **Data accuracy**: Premium plan checks now use the full user record from the database, not the JWT payload.
- **Analytics metrics**: The buying house analytics dashboard no longer crashes on missing Prisma models.
- **User experience**: VerificationPage shows clear "Pricing unavailable" messaging instead of broken $0.00 values.

## Relationship to Surrounding Commits

This is the final commit in the September 12 bug-fix sprint. It continues the theme of defensive programming and null guards established in commits 676, 677, and 683. The analytics fixes are server-side, making this commit unique in the batch — most others were frontend-only.

## Confidence Notes

- The `findUserById()` call adds one database query per analytics request, but this is acceptable for an endpoint that's called infrequently (analytics dashboards are not high-traffic).
- The removal of `conversion` and `dispute` metrics from the buying house analytics is a breaking change for any dashboard that displayed these metrics — but since the underlying data was always wrong (the models don't exist), this is actually a correctness fix.
- The VerificationPage's null state handling is now comprehensive: initial state is null → API success sets values → API failure sets defaults → UI shows either price or "unavailable" message.

## Optional Technical Details

- The JWT payload is decoded by `express-jwt` middleware and includes `id`, `role`, `email`, but not subscription-related fields. The `findUserById` call hits the `users` table which has `subscription_status`, `subscription_plan`, etc.
- The Prisma `conversation` and `dispute` models may have been planned but never implemented, or they may have been removed in a schema migration. Either way, the queries were dead code that caused runtime errors.
- The `computeAvgFirstResponseHours(userId)` function was kept in the `Promise.all` — it's a working query that computes the average time between a buyer request and the first factory response.
