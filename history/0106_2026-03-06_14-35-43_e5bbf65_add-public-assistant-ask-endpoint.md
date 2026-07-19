# Commit 0106: Add Public Assistant Ask Endpoint for WS Bridge

## Commit Metadata

| Field         | Value                                      |
| ------------- | ------------------------------------------ |
| Commit Number | 0106                                       |
| Hash          | `e5bbf65f9601ea31d8dc6819e2de0448d57e8e82` |
| Parent Hash   | `917ac133c72d1b80a02ec5b19fbe29569ad95929` |
| Author        | Cyber Code Master                          |
| Date/Time     | 2026-03-06 14:35:43                        |
| Files Changed | 3                                          |
| Lines Added   | 375                                        |
| Lines Deleted | 49                                         |
| Net Change    | +326                                       |
| Merge         | No                                         |

## Custom Title

Add Public Assistant Ask Endpoint for WebSocket Bridge

## High-Level Summary

Made the `/api/assistant/ask` endpoint publicly accessible (removed `requireAuth`) and aligned the `orgIdFromUser` to return `'public_guest'` when no user is authenticated. Extended the service with logging, LLM integration, and fallback logic. This enabled the WebSocket assistant (in server.js from commit 0100) to use the same request handler.

## File-by-File Breakdown

- **server/controllers/assistantController.js** (+16/-1 line): Added `logInfo` import, request logging, and `import` changes.
- **server/routes/assistantRoutes.js** (+2 lines): Removed `requireAuth` from the `POST /ask` route.
- **server/services/assistantService.js** (+357/-48 lines): Full LLM integration with logging, code-context retrieval, `buildKnowledgeContext`, `generateDynamicAnswer`, fallback endpoints, and `agent_prompt_context`.

## Detailed Diff Analysis

### Route Changes

- `POST /ask` is now public (no auth middleware) — this is needed for the WS bridge to forward user questions without requiring a session token.

### Controller Changes

- `orgIdFromUser` uses `'public_guest'` as fallback when no user object exists.

### Service Changes

- Identical LLM pipeline to commit 0104 with logging, fallback, code-context, and RAG.

## Why This Change May Have Been Needed

The WebSocket assistant (from commit 0100) needs to process user questions without an HTTP session. Making `/ask` public and using `'public_guest'` org ID allows the WS handler to call the same logic.

## Was It Useful?

Yes — enables the real-time WebSocket assistant to function without requiring authentication.

## Impact Analysis

- **Behavior change**: `/api/assistant/ask` is now public. Anyone can ask questions without authentication.
- **Security**: The endpoint is now unauthenticated which could be a concern if it exposes proprietary knowledge in production.

## Relationship to Surrounding Commits

Commit 0107 merges this into the mainline. This is a sibling branch to commits 0102/0104.

## Confidence Notes

High confidence.

## Optional Technical Details

None.
