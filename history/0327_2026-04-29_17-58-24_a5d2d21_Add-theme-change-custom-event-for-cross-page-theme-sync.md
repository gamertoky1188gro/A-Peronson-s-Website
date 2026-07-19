## Commit Metadata

- **Hash:** `a5d2d21fe7e73aa17b279b58baaf933047c89829`
- **Parent:** `146ea12d4f3913ccc2ba002033a89a28930284b9`
- **Author:** Cyber Code Master
- **Date:** 2026-04-29 17:58:24 +0600
- **Subject:** Add theme-change custom event for cross-page theme sync
- **Body:** (none)

## Custom Title

Add Custom theme-change Event for Cross-Page Sync

## High-Level Summary

Adds a `theme-change` custom event listener to the notifications page and dispatches the event from `NavBar.jsx`, creating a standardized mechanism for cross-page theme synchronization.

## File-by-File

| File                                | Change |
| ----------------------------------- | ------ |
| `src/components/NavBar.jsx`         | +1     |
| `src/pages/NotificationsCenter.jsx` | +5, -1 |

## Why

The `storage` event only fires in other tabs, not within the same tab. A custom event provides reliable same-tab communication between components.

## Was It Useful

Yes — improved theme sync reliability.

## Impact

Small. Custom event mechanism added.

## Relationships

Follows commit 326. Continues theme sync work.

## Confidence

High
