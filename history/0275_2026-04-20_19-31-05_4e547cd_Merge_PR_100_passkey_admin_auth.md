## Commit Metadata
- **Hash:** `4e547cdf7a0d99f464cb9f9468dc0d770004bcd2`
- **Parent(s):** `ee820ee46f43ead7095ae1d318211ee8bde0942f a30e0e8ee470f3d6ef3a0f6029e2b2b570d25446`
- **Author:** Cyber Code Master
- **Date:** 2026-04-20 19:31:05 +0600
- **Subject:** Merge pull request #100 from gamertoky1188gro/codex/remove-device-id-input-from-admin-dashboard-9b0zvb
- **Body:** Admin security: add passkey-based admin auth, per-user setup codes, and communication policy normalization

## Custom Title
Merge PR #100: Passkey Admin Auth & Setup Codes

## High-Level Summary
Final merge of the passkey bypass feature. Effective diff: 2 lines changed in adminSecurity.js middleware (2 insertions, 2 deletions).

## File-by-File
| File | Change |
|------|--------|
| `server/middleware/adminSecurity.js` | +2 / -2 |

## Detailed Diff
```diff
--- a/server/middleware/adminSecurity.js
+++ b/server/middleware/adminSecurity.js
+  // minor tweak to allowlist bypass logic
```

## Why
Finalize the PR merge.

## Was It Useful
Minor finalization.

## Impact
Minimal. 2 lines.

## Relationships
Base for commit 276 (next day's work).

## Confidence
High
