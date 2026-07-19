# Commit 0150: Fixed — Chat Filter Logic Reorder

## Commit Metadata

| Field       | Value                                      |
| ----------- | ------------------------------------------ |
| **Hash**    | `bc7d5f7ef12a04dfa7ab4007f3fd137449501d04` |
| **Parent**  | `e2d30f47c539f397b198471b258d8f41db8a8235` |
| **Author**  | gamertoky1188gro                           |
| **Date**    | 2026-03-27 09:22:37 +0600                  |
| **Message** | Fixed                                      |

## High-Level Summary

Single-file fix in ChatInterface.jsx: 16 lines added, 16 lines removed. The `filteredPriorityInbox`, `filteredRequests`, `allVisibleThreads`, and `activeThread` memoized computations were moved to execute _before_ the `useEffect` and other hooks that depend on them. This fixes a React hook ordering issue where `activeThreadMatchIdRef` was being set after `useEffect` had already run with a stale value.

## File-by-File Breakdown

| File                          | Status   | Lines   |
| ----------------------------- | -------- | ------- |
| `src/pages/ChatInterface.jsx` | Modified | +16/-16 |

## Detailed Diff Analysis

Before the fix, `filteredPriorityInbox`, `filteredRequests`, `allVisibleThreads`, and `activeThread` were defined after the `useEffect` that loads AI negotiation data. After the fix, they are defined _before_ that `useEffect`.

This ensures that when the `useEffect` runs:

1. `activeThread` is already computed from the current `activeThreadId`
2. `activeThreadMatchIdRef.current` is correctly set
3. AI negotiation data loads for the correct active thread

Without this fix, subscribing to a different thread's messages could result in loading AI negotiation data for the wrong thread (stale closure issue).

## Why This Change

Bugfix: React hooks ordering issue where downstream computations were used before being defined.

## Was It Useful

Yes. This fixes a functional bug that would cause incorrect AI negotiation data loading when switching between chat threads.

## Impact Analysis

- **Low risk**: Reordering memo definitions. No logic changes.
- **Bugfix**: Corrects thread-specific data loading.

## Relationship to Surrounding Commits

Last commit in the range (0150). Fixes a bug likely introduced during the large chat UI rewrites in previous commits.

## Confidence Notes

High. Clearly a React hooks ordering fix — moving computations above the `useEffect` that depends on them.
