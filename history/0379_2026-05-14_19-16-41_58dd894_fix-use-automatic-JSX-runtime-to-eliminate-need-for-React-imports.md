# Commit 0379 — fix: use automatic JSX runtime to eliminate need for React imports

## Commit Metadata

- **Hash:** `58dd8946f60e472bd8cd4dee6696e000363dfb53`
- **Parent:** `5a409e70967e8e9c9731e4e054f6736739b0e123`
- **Author:** Cyber Code Master
- **Date:** 2026-05-14 19:16:41 +0600
- **Message:** fix: use automatic JSX runtime to eliminate need for React imports

## Custom Title

Fix React imports in TexHub.jsx and Signup.jsx

## High-Level Summary

Fixed remaining React import patterns in `TexHub.jsx` and `Signup.jsx`. `Signup.jsx` had a major cleanup: from 40 lines changed with 24 deletions, removing unnecessary React imports and reorganizing.

## File-by-File

| File                      | Status   | Changes   |
| ------------------------- | -------- | --------- |
| src/pages/TexHub.jsx      | modified | 4 changes |
| src/pages/auth/Signup.jsx | modified | +20 / -24 |

## Detailed Diff

`Signup.jsx` had unused React imports removed and `React.` prefix patterns replaced with direct imports. `TexHub.jsx` had similar fixes.

## Why

Completing the JSX runtime migration for remaining files.

## Was It Useful

Yes — finishes cleanup.

## Impact

Low. Two files.

## Relationships

Part of JSX runtime migration series.

## Confidence

High.
