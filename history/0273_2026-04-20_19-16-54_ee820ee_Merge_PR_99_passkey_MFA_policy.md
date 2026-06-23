## Commit Metadata
- **Hash:** `ee820ee46f43ead7095ae1d318211ee8bde0942f`
- **Parent(s):** `eef74e357bae4cf52190cc2667396539754a05b5 e447f60b5ce367b868c648cfbede5c1daba9b8ef`
- **Author:** Cyber Code Master
- **Date:** 2026-04-20 19:16:54 +0600
- **Subject:** Merge pull request #99 from gamertoky1188gro/codex/remove-device-id-input-from-admin-dashboard-9esi35
- **Body:** Admin passkey auth, per-user MFA/step-up codes, and communication policy normalization

## Custom Title
Merge PR #99: Passkey Auth, MFA Codes & Policy Normalization

## High-Level Summary
Merges the jsonStore.js changes (communication policy normalization). Effective diff: 54 insertions, 6 deletions in jsonStore.js.

## File-by-File
| File | Change |
|------|--------|
| `server/utils/jsonStore.js` | +54 / -6 |

## Detailed Diff
```diff
--- a/server/utils/jsonStore.js
+++ b/server/utils/jsonStore.js
+  // Normalized upsert logic
+  // Passkey/MFA support
```

## Why
Normalize communication policy persistence with the jsonStore utility.

## Was It Useful
Yes — foundational for subsequent admin features.

## Impact
Small. Single file, 60 lines.

## Relationships
Parent of 275 (merge of 274).

## Confidence
High
