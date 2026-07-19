# Commit 0473

## Commit Metadata

- **Hash**: `8e47deb74b8f737936d2e01ff31997de221aeda4`
- **Parent**: `3feebdb26e39682684dc04bcbb57a15854c91dd6`
- **Author**: gamertoky1188gro
- **Date**: 2026-05-30 10:37:16
- **Message**: fix: full-screen NeonAtom on /feed/manage until both user and posts load

## High-Level Summary

Added pageLoading guard to FeedManagement that waits for both feed posts and user data to load. Uses syncUserFromApi for user loading.

## File-by-File Breakdown

| File                         | Status   | Insertions | Deletions |
| ---------------------------- | -------- | ---------- | --------- |
| src/pages/FeedManagement.jsx | modified | 26         | 2         |

## Detailed Diff Analysis

- Added imports: getToken, syncUserFromApi
- Added pageLoading state
- Initial load useEffect: postsDone/userDone flags, tryDone() checks both, sets pageLoading(false)
- loadMine: uses getToken() instead of raw localStorage reads; sets postsDone=true in finally
- New loadUser: calls syncUserFromApi(getToken()), sets userDone=true in finally
- Early return: if (pageLoading) return <NeonAtom fill />

## Why This Change

Prevents rendering the manage page shell before user context is available.

## Was It Useful

Yes — consistent full-screen loading with other pages.

## Impact Analysis

Low. Adds user sync call that was previously missing.

## Relationships

Part of the full-screen loading guard series (0470-0483).

## Confidence Notes

High.
