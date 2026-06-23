# Commit 0418 — `d76b0be0e94`

| Field | Value |
|-------|-------|
| Commit Hash | `d76b0be0e945deffc08e829c15f4a364419ae61a` |
| Parent Hash | `40861aa82fe3e910059ec86aae187c52ef3de24d` |
| Author | gamertoky1188gro |
| Date | 2026-05-23 20:48:20 +0600 |
| Subject | feat: live streaming AI responses via opencode SSE |

---

## High-Level Summary

Major feature: implements live streaming of AI responses via opencode's SSE (Server-Sent Events) protocol. Adds `streamOpencodeReply` function in the backend that uses `client.event.subscribe()` and `client.session.promptAsync()` to stream response chunks. Updates the WebSocket handler in `server.js` to support streaming callbacks (`gotChunk`, `gotComplete`). Updates `FloatingAssistant.jsx` to handle `chunk` messages that progressively update the assistant message text in-place.

---

## Files Changed

| File | Status | Insertions | Deletions |
|------|--------|------------|-----------|
| `server/server.js` | modified | 88 | 0 |
| `server/services/assistantService.js` | modified | 97 | 0 |
| `src/components/FloatingAssistant.jsx` | modified | 29 | 0 |

**3 files changed, 194 insertions, 20 deletions**

---

## Detailed Changes

### `server/services/assistantService.js` — `streamOpencodeReply` (new)
- Creates opencode client, ensures server is running
- Gets or creates a user/guest session
- Sets up `client.event.subscribe()` for SSE event stream
- Calls `client.session.promptAsync()` with parts-based prompt
- Iterates over SSE events: `message.part.updated` yields `delta` text; `session.status` / `session.updated` with `status === "idle"` signals completion
- 120s timeout, cleanup via `controller.abort()`
- Calls `onChunk(delta, fullText)` for each delta, `onComplete(answer, error)` when done
- Sanitizes and unescapes HTML in all text

### `server/server.js` — WebSocket handler refactored
- Replaced synchronous `assistantReply` call with streaming flow
- Defines `gotChunk` (sends `{ type: "chunk", delta, text, done: false }`) and `gotComplete` (sends `{ type: "reply", matched_answer }`)
- Falls back to `streamedText` if stream didn't start properly

### `src/components/FloatingAssistant.jsx` — Client streaming support
- Uses `streamingIds` Set to track in-progress streams
- Handles `data.type === "chunk"`: finds existing message by `request_id` and updates text in-place, or creates new assistant message
- Handles `data.type === "reply"`: marks `isNew` based on whether it was already streamed

---

## Why

Provide real-time streaming AI responses for a better user experience — users see text appear progressively instead of waiting for the full response.

---

## Was It Useful

High — major UX improvement for the AI assistant.

---

## Impact

Large. New streaming infrastructure across all three layers.

---

## Relationships

The culmination of the opencode integration work across commits 0395-0417.

---

## Confidence

High.
