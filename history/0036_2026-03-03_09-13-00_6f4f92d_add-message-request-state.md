# Commit 0036: Add Persisted Message Request State and Moderation APIs

## Commit Metadata

| Field             | Value                                      |
| ----------------- | ------------------------------------------ |
| **Commit Number** | 0036                                       |
| **Commit Hash**   | `6f4f92da1597da026aa014f6c11bf960a264a863` |
| **Parent Hash**   | `fca8ac1e8e18684edaac095e5c8af9d97dfeeee7` |
| **Author**        | Cyber Code Master                          |
| **Date/Time**     | 2026-03-03 09:13:00                        |
| **Files Changed** | 5                                          |
| **Additions**     | 104                                        |
| **Deletions**     | 16                                         |
| **Net Change**    | +88                                        |
| **Merge Commit**  | No                                         |

## Custom Title

Add Persisted Message Request State and Moderation APIs

## High-Level Summary

Introduces a persisted message request state system. Unverified senders' messages are routed to a request pool, and verified senders go directly to the priority inbox. New API endpoints (`/messages/requests/:threadId/accept` and `/reject`) allow moderators to accept or reject message requests. The ChatInterface now calls these APIs instead of using local state.

## File-by-File Breakdown

- **server/controllers/messageController.js** (+12/-1): Added accept/reject request controllers.
- **server/database/message_requests.json** (+1): New JSON store for message request states.
- **server/routes/messageRoutes.js** (+3/-1): Added accept/reject POST routes.
- **server/services/messageService.js** (+47/-2): Added `acceptMessageRequest`, `rejectMessageRequest`, `tieredInbox` updated to use persisted states.
- **src/pages/ChatInterface.jsx** (+19/-11): Updated to call API for accept/reject, removed local state management.

## Detailed Diff Analysis

When a message is posted by an unverified sender, the service creates/updates a `message_requests.json` entry with status `pending`. The inbox endpoint checks this store: accepted requests go to priority, rejected are hidden, and pending stay in the request pool. The frontend now calls `/messages/requests/:threadId/accept` or `/reject` which persist to the JSON store, replacing the previous local-state-only approach.

## Why This Change May Have Been Needed

Message requests need to survive page reloads and sync across sessions. Persisting the state server-side was essential for a reliable inbox workflow.

## Was It Useful?

Yes, crucial for making the message moderation system persistent and server-authoritative.

## Impact Analysis

Medium. Introduces a new data store, modifies the message service's core inbox logic, and updates the frontend to use API calls.

## Relationship to Surrounding Commits

This branch is merged by commit 0037. Commit 0057 (Persist message request state in inbox routing) further refines this with deduplication fixes.

## Confidence Notes

High confidence. Clean pattern with `upsertRequestState` helper for atomic state updates.
