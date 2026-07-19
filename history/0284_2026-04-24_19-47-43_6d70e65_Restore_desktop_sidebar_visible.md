## Commit Metadata

- **Hash:** `6d70e658d5f76831034f233cdf83b8532b7863ef`
- **Parent:** `e3b0a1472c4091f0d0cd3dc76a23b4b945a23298`
- **Author:** Cyber Code Master
- **Date:** 2026-04-24 19:47:43 +0600
- **Subject:** fix: restore desktop layout - sidebar always visible
- **Body:** (none)

## Custom Title

Restore Desktop Layout: Sidebar Always Visible

## High-Level Summary

Fixes the desktop layout so the sidebar is always visible on wider screens. The mobile toggle was accidentally affecting desktop view. Changes 4 lines in AdminPanel.jsx.

## File-by-File

| File                       | Change  |
| -------------------------- | ------- |
| `src/pages/AdminPanel.jsx` | +4 / -4 |

## Detailed Diff

```diff
--- a/src/pages/AdminPanel.jsx
+++ b/src/pages/AdminPanel.jsx
-  // sidebar hidden on desktop (bug)
+  // sidebar always visible on desktop
```

## Why

The responsive sidebar implementation broke the desktop layout.

## Was It Useful

Yes — restored expected desktop behavior.

## Impact

Minimal. 8 lines in one file.

## Relationships

Parent of 285.

## Confidence

High
