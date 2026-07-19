## Commit Metadata

- **Hash:** `b3a3d1efedd71e725fe07a76c13a408417653b18`
- **Parent:** `fb758bf562d754bcd246c04a27dca1c25dce1df4`
- **Author:** Cyber Code Master
- **Date:** 2026-04-20 01:37:04 +0600
- **Subject:** stabilize local quality scripts and make e2e opt-in
- **Body:** (none)

## Custom Title

Stabilize Quality Scripts & Make E2E Opt-In

## High-Level Summary

Rebased work that stabilizes CI/quality scripts (reindex, smoke search), makes E2E tests opt-in, improves AI verifier, adds DB utility, and massively updates AdminPanel.

## File-by-File

| File                                    | Change       |
| --------------------------------------- | ------------ |
| `playwright.config.ts`                  | +35 / -0     |
| `scripts/ci/reindex-opensearch.mjs`     | +33 / -0     |
| `scripts/ci/smoke-search.mjs`           | +21 / -0     |
| `server/services/aiVerifier.js`         | +28 / -0     |
| `server/utils/db.js`                    | +11 / -0     |
| `src/lib/auth.js`                       | +36 / -0     |
| `src/pages/AdminPanel.jsx`              | +3468 / -340 |
| `tests/e2e/deal-journey-matrix.spec.ts` | +2 / -0      |
| `tests/e2e/workflow-lifecycle.spec.ts`  | +3 / -0      |

## Detailed Diff

```diff
--- a/playwright.config.ts
+++ b/playwright.config.ts
+  // e2e opt-in mode
--- a/scripts/ci/reindex-opensearch.mjs
+++ b/scripts/ci/reindex-opensearch.mjs
+  // stabilization
--- a/server/utils/db.js
+++ b/server/utils/db.js
+  // new DB utility
```

## Why

CI quality scripts were flaky; E2E tests should be opt-in to avoid unnecessary CI failures.

## Was It Useful

Yes — improved CI reliability.

## Impact

Large (3972 lines changed across 9 files). AdminPanel dominates.

## Relationships

Rebuilt on same parent as 262/265. Merged in 269.

## Confidence

High
