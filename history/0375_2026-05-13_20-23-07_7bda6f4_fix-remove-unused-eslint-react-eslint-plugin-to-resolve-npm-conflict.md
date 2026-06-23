# Commit 0375 — fix: remove unused @eslint-react/eslint-plugin to resolve npm conflict

## Commit Metadata
- **Hash:** `7bda6f44d28593fc2d7b00ff0e22bf35f090a51b`
- **Parent:** `b7c235237cd6d978295d3bb25539039450e067e0`
- **Author:** Cyber Code Master
- **Date:** 2026-05-13 20:23:07 +0600
- **Message:** fix: remove unused @eslint-react/eslint-plugin to resolve npm conflict

## Custom Title
Remove unused ESLint plugin to resolve npm dependency conflict

## High-Level Summary
Removed `@eslint-react/eslint-plugin` from `package.json` to resolve an npm dependency conflict, then rebuilt all dist assets.

## File-by-File
| File | Status | Changes |
|------|--------|---------|
| dist/assets/* | major rebuild | +269,838 / -8,546 |
| package.json | modified | 1 deletion |
| server/database/admin_audit.json | modified | +42 |

## Detailed Diff
```diff
- (removed @eslint-react/eslint-plugin from dependencies)
```

## Why
The `@eslint-react/eslint-plugin` was causing npm dependency conflicts (likely peer dependency or version conflicts). It was unused, so removing it resolved the issue.

## Was It Useful
Yes — fixes npm install/CI pipeline.

## Impact
Low. Removes an unused dependency.

## Relationships
Prepares for ESLint config changes in 0377.

## Confidence
High — clear fix with descriptive message.
