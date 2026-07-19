# Commit 0480

## Commit Metadata

- **Hash**: `04e30bd47d5fe2c4e52685b90cdfe2ef7da3358d`
- **Parent**: `4bc468d4da10a064a8733a33840a236a0ae87d62`
- **Author**: gamertoky1188gro
- **Date**: 2026-05-30 11:50:08
- **Message**: fix: full-screen NeonAtom on /notifications until notifs+alerts+user load

## High-Level Summary

Added pageLoading guard to NotificationsCenter waiting for notifications, alerts, and user sync.

## File-by-File Breakdown

| File                              | Status   | Insertions | Deletions |
| --------------------------------- | -------- | ---------- | --------- |
| src/pages/NotificationsCenter.jsx | modified | 23         | 4         |

## Detailed Diff Analysis

- Added useRef, syncUserFromApi imports
- Added pageLoading state
- Mount useEffect: 3 async IIFEs (notifications, alerts, user) each set a done flag and call tryDone()
- tryDone(): when all 3 done, setPageLoading(false)
- Early return: if (pageLoading) return <NeonAtom fill />

## Why This Change

Prevents flash of notification page before data is ready.

## Was It Useful

Yes — consistent with other pages.

## Impact Analysis

Low. Standard loading guard pattern.

## Relationships

Part of loading guard series.

## Confidence Notes

High.
