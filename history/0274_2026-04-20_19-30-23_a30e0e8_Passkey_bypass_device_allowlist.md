## Commit Metadata

- **Hash:** `a30e0e8ee470f3d6ef3a0f6029e2b2b570d25446`
- **Parent:** `6954e4ec2bd486de27fa71484f92e1ab2148095b`
- **Author:** Cyber Code Master
- **Date:** 2026-04-20 19:30:23 +0600
- **Subject:** Allow passkey-authenticated admins to bypass device allowlist
- **Body:** (none)

## Custom Title

Passkey-Authenticated Admins Bypass Device Allowlist

## High-Level Summary

Allows admin users who authenticate via passkey to skip the device allowlist check. Modifies adminSecurity middleware, adds more service/code infrastructure.

## File-by-File

| File                                   | Change     |
| -------------------------------------- | ---------- |
| `server/controllers/authController.js` | +7         |
| `server/middleware/adminSecurity.js`   | +4 / -0    |
| `server/services/userService.js`       | +27        |
| `server/utils/jsonStore.js`            | +60 / -0   |
| `src/pages/AdminPanel.jsx`             | +74 / -163 |

## Detailed Diff

```diff
--- a/server/middleware/adminSecurity.js
+++ b/server/middleware/adminSecurity.js
+  // bypass device allowlist for passkey auth
```

## Why

Passkey auth is inherently device-bound (WebAuthn), so the device allowlist check is redundant for these users.

## Was It Useful

Yes — improved UX for passkey users.

## Impact

Moderate. 335 lines across 5 files.

## Relationships

Merged in 275.

## Confidence

High
