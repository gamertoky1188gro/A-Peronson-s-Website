## Commit Metadata
- **Hash:** `146ea12d4f3913ccc2ba002033a89a28930284b9`
- **Parent:** `cc880d2d4d309c9a91a51eb9311ab3b8912b94f6`
- **Author:** Cyber Code Master
- **Date:** 2026-04-29 17:54:57 +0600
- **Subject:** Listen to storage events to sync theme changes from NavBar
- **Body:** (none)

## Custom Title
Listen to Storage Events for Cross-Page Theme Sync

## High-Level Summary
Adds a `storage` event listener to detect theme changes made in other tabs/windows (or the same tab via the NavBar) and syncs the notifications page theme accordingly.

## File-by-File
| File | Change |
|------|--------|
| `src/pages/NotificationsCenter.jsx` | +18, -2 |

## Why
When the theme is changed in the NavBar, the notifications page needs to detect and apply the change without requiring a manual refresh.

## Was It Useful
Yes — enabled real-time cross-page theme sync.

## Impact
Small. Storage event listener added.

## Relationships
Follows commit 325. Continues theme sync improvements.

## Confidence
High
