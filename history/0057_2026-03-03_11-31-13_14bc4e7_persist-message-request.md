# Commit 0057: Persist Message Request State in Inbox Routing

## Commit Metadata

| Field             | Value                                      |
| ----------------- | ------------------------------------------ |
| **Commit Number** | 0057                                       |
| **Commit Hash**   | `14bc4e7f12fd421b05feb9de4b47ce0681f498a5` |
| **Parent Hash**   | `b82a0834c26227e4ac03e3521129332a9237f2a8` |
| **Author**        | Cyber Code Master                          |
| **Date/Time**     | 2026-03-03 11:31:13                        |
| **Files Changed** | 2                                          |
| **Additions**     | 20                                         |
| **Deletions**     | 8                                          |
| **Net Change**    | +12                                        |
| **Merge Commit**  | No                                         |

## Custom Title

Persist Message Request State in Inbox Routing

## High-Level Summary

Refines the inbox routing to use only the latest message per thread for determining priority vs. request pool placement. Previously, all messages were iterated, causing duplicates. Now only the most recent message per match is evaluated. Also fixes thread selection to persist across inbox loads.

## File-by-File Breakdown

- **server/services/messageService.js** (+12/-1): Added `latestByThread` map to deduplicate and use only the newest message per match_id.
- **src/pages/ChatInterface.jsx** (+8/-7): Fixed `activeThreadId` selection to survive inbox reloads, removed duplicate call to `loadInbox` in dependency array.

## Detailed Diff Analysis

In `tieredInbox`, the service now builds a `latestByThread` map selecting the newest message per `match_id`, then iterates over `matchIds` (not all filtered messages) to avoid duplicates. The priority/request assignment is based on the latest message's sender verification and request state. On the frontend, the `loadInbox` effect's dependency array was changed from `[activeThreadId]` to `[]` to prevent infinite reload loops, and thread selection logic now persists the current thread if still visible.

## Why This Change May Have Been Fixed

The inbox was incorrectly showing duplicate threads and resetting the active thread selection on every load.

## Was It Useful?

Yes, fixes a usability bug in the chat inbox.

## Impact Analysis

Small. Targeted fix to the inbox deduplication and thread selection logic.

## Relationship to Surrounding Commits

This branch is merged by 0058. Refines the message request state system from 0036.

## Confidence Notes

High confidence. Clean fix addressing both deduplication and thread persistence.
