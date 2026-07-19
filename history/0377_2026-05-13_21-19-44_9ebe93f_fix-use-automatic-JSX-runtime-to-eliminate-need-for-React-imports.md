# Commit 0377 — fix: use automatic JSX runtime to eliminate need for React imports

## Commit Metadata

- **Hash:** `9ebe93ffba3be697a2e13088217feb198b09323e`
- **Parent:** `7f4d10660fd9736b9a4d76095b1eebc820cb2a81`
- **Author:** Cyber Code Master
- **Date:** 2026-05-13 21:19:44 +0600
- **Message:** fix: use automatic JSX runtime to eliminate need for React imports

## Custom Title

Enable automatic JSX runtime in ESLint config and rebuild dist

## High-Level Summary

Modified `eslint.config.js` to enable the automatic JSX runtime (`"jsx-runtime"`), which eliminates the need for explicit `import React` in JSX files. All dist assets were regenerated with this config change.

## File-by-File

| File             | Status      | Changes   |
| ---------------- | ----------- | --------- |
| eslint.config.js | modified    | 2 changes |
| dist/assets/*    | hash rename | +8 / -8   |
| dist/index.html  | modified    | 4 changes |

## Detailed Diff

```diff
 (eslint.config.js updated to use automatic JSX runtime)
```

## Why

After removing `import React` from all JSX files in 0373, the ESLint config needed updating to use the automatic JSX transform so that JSX works without explicit React imports.

## Was It Useful

Yes — configures the toolchain to match the code changes.

## Impact

Low. Config change with dist rebuild.

## Relationships

First of 4 commits migrating to automatic JSX runtime (0377-0380).

## Confidence

High — clear descriptive message.
