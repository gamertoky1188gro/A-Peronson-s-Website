# Commit 0470

## Commit Metadata

- **Hash**: `6a3c36a5050194d64dffa2fdc1a75217fec85f7c`
- **Parent**: `7b771daeef2cd663bfb178f50bb93c2a1bd847c3`
- **Author**: gamertoky1188gro
- **Date**: 2026-05-30 09:17:01
- **Message**: fix: single full-screen NeonAtom for initial load on OrgSettings page

## High-Level Summary

Consolidated OrgSettings' 8 parallel API initial loads into a single pageLoading flag that waits for all to settle before showing content. Removed redundant loadingMembers state.

## File-by-File Breakdown

| File                      | Status   | Insertions | Deletions |
| ------------------------- | -------- | ---------- | --------- |
| src/pages/OrgSettings.jsx | modified | 17         | 16        |

## Detailed Diff Analysis

- Added pageLoading state (default true)
- Removed loadingMembers state
- Initial useEffect: wrapped all 8 load calls in Promise.allSettled().finally(() => setPageLoading(false))
- Added early return: if (pageLoading) return <NeonAtom fill text="Loading..." />
- Removed loadingMembers conditional rendering in the Team Members section

## Why This Change

Instead of showing individual loading spinners for each section, show one full-screen loader until all data is ready.

## Was It Useful

Yes — cleaner loading experience.

## Impact Analysis

Low risk. Loading behavior changes from per-section to all-at-once.

## Relationships

Part of the full-screen loading guard series.

## Confidence Notes

High.
