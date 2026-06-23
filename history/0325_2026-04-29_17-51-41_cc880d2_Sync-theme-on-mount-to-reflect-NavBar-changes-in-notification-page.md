## Commit Metadata
- **Hash:** `cc880d2d4d309c9a91a51eb9311ab3b8912b94f6`
- **Parent:** `a46130a0474974c23103eb3916418088bf4fb40c`
- **Author:** Cyber Code Master
- **Date:** 2026-04-29 17:51:41 +0600
- **Subject:** Sync theme on mount to reflect NavBar changes in notification page
- **Body:** (none)

## Custom Title
Sync Theme on Mount to Reflect NavBar Changes

## High-Level Summary
Adds a `useEffect` that runs on mount to ensure the notifications page theme matches the NavBar's current state, handling cases where the theme was changed before navigating to the page.

## File-by-File
| File | Change |
|------|--------|
| `src/pages/NotificationsCenter.jsx` | +7 |

## Why
When navigating to the notifications page after changing the theme, the page would not reflect the updated theme until a manual re-sync was triggered.

## Was It Useful
Yes — fixed theme flash on navigation.

## Impact
Small. Mount effect added.

## Relationships
Follows commit 324. Continued theme sync improvements.

## Confidence
High
