## Commit Metadata
- **Hash:** `30cdb09c4bf5c3eb96b96fc67427c5b9bb96f68a`
- **Parent:** `6954e4ec2bd486de27fa71484f92e1ab2148095b`
- **Author:** Cyber Code Master
- **Date:** 2026-04-20 18:35:44 +0600
- **Subject:** Refine admin security gate and add per-account setup codes
- **Body:** (none)

## Custom Title
Refine Admin Security Gate & Add Per-Account Setup Codes

## High-Level Summary
Refines the admin security gate, adds per-account MFA/setup codes in `authController.js` and `userService.js`, and significantly simplifies the AdminPanel (net -39 lines).

## File-by-File
| File | Change |
|------|--------|
| `server/controllers/authController.js` | +7 / -0 |
| `server/services/userService.js` | +27 / -0 |
| `src/pages/AdminPanel.jsx` | +82 / -155 |

## Detailed Diff
```diff
--- a/server/controllers/authController.js
+++ b/server/controllers/authController.js
+  // per-account setup code generation
--- a/server/services/userService.js
+++ b/server/services/userService.js
+  // setup code logic
--- a/src/pages/AdminPanel.jsx
+++ b/src/pages/AdminPanel.jsx
-  // simplified security gate UI
+  // streamlined admin panel
```

## Why
Each admin account should have unique setup codes for MFA; the security gate should be more refined.

## Was It Useful
Yes — improved MFA flexibility and simplified UI.

## Impact
Moderate. 271 lines changed across 3 files. AdminPanel net slimmed.

## Relationships
Merged in 271 (PR #98). Precedes 272-275.

## Confidence
High
