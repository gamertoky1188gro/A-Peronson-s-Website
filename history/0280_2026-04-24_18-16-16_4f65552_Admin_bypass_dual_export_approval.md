## Commit Metadata

- **Hash:** `4f655520dcd4cb7b8d296a15d49c8611f7a9a1f0`
- **Parent:** `6ea67674d01b5a1ad78a98b8cd04753b80329266`
- **Author:** Cyber Code Master
- **Date:** 2026-04-24 18:16:16 +0600
- **Subject:** fix: allow admin role to bypass dual export approval
- **Body:** (none)

## Custom Title

Allow Admin Role to Bypass Dual Export Approval

## High-Level Summary

Adds 4 lines to the `adminDualConfirm.js` middleware to let users with the admin role skip the dual-confirmation export approval step.

## File-by-File

| File                                    | Change |
| --------------------------------------- | ------ |
| `server/middleware/adminDualConfirm.js` | +4     |

## Detailed Diff

```diff
--- a/server/middleware/adminDualConfirm.js
+++ b/server/middleware/adminDualConfirm.js
+  if (user.role === 'admin') {
+    return next();
+  }
```

## Why

Admins should not need dual approval for their own export actions.

## Was It Useful

Yes — streamlined admin workflow.

## Impact

Minimal. Single file, 4 lines.

## Relationships

Parent of 281 (PDF export).

## Confidence

High
