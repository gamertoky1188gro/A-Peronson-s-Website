## Commit Metadata

- **Hash:** `e447f60b5ce367b868c648cfbede5c1daba9b8ef`
- **Parent:** `6954e4ec2bd486de27fa71484f92e1ab2148095b`
- **Author:** Cyber Code Master
- **Date:** 2026-04-20 19:16:32 +0600
- **Subject:** Fix communication policy upsert shape for Prisma schema
- **Body:** (none)

## Custom Title

Fix Communication Policy Upsert for Prisma Schema

## High-Level Summary

Fixes the communication policy upsert data shape to match Prisma schema expectations. Adds `jsonStore.js` utility for JSON-based data persistence.

## File-by-File

| File                                   | Change     |
| -------------------------------------- | ---------- |
| `server/controllers/authController.js` | +7         |
| `server/services/userService.js`       | +27        |
| `server/utils/jsonStore.js`            | +60 / -0   |
| `src/pages/AdminPanel.jsx`             | +76 / -161 |

## Detailed Diff

```diff
--- a/server/utils/jsonStore.js
+++ b/server/utils/jsonStore.js
+  // JSON file-based store for communication policies
+  // upsert operations aligned with Prisma schema
```

## Why

Prisma schema changed, requiring the upsert payload shape to be updated.

## Was It Useful

Yes — fixed broken policy persistence.

## Impact

Moderate. 331 lines changed across 4 files.

## Relationships

Merged in 273. Precedes 274.

## Confidence

High
