## Commit Metadata
- **Hash:** `b8d12e715211897c5c517d116f4af7c66889c23d`
- **Parent:** `718b1006055c1ee06ca8f19acf5e8800b57712f7`
- **Author:** Cyber Code Master
- **Date:** 2026-04-24 20:52:45 +0600
- **Subject:** fix: content fills space when sidebar collapsed on mobile
- **Body:** (none)

## Custom Title
Fix Content Width When Sidebar Collapsed on Mobile

## High-Level Summary
Adjusts the main content width to fill the available space when the sidebar is collapsed on mobile. 1 insertion, 1 deletion.

## File-by-File
| File | Change |
|------|--------|
| `src/pages/AdminPanel.jsx` | +1 / -1 |

## Detailed Diff
```diff
--- a/src/pages/AdminPanel.jsx
+++ b/src/pages/AdminPanel.jsx
-  width: calc(100% - 250px);
+  width: 100%;
```

## Why
When the sidebar is collapsed, the main content was still reserving space for it.

## Was It Useful
Yes — fixed layout gap on mobile.

## Impact
Minimal. 2 lines.

## Relationships
Parent of 289.

## Confidence
High
