# 0428 — fix: complete response cut off mid-word

**Commit:** `e70be9eb2bb56f07f866eda0c8fd0949061a1d81`
**Parent:** `acfa32b11cb365099dc24352d8686cbaabd8d884`
**Author:** gamertoky1188gro
**Date:** 2026-05-24 20:21:59 +0600

## High-Level Summary

Three fixes: (1) always prefer the blocking prompt result over SSE partial text when blocking result is longer, (2) increase `MAX_AI_ANSWER_CHARS` from 1200 to 8000, (3) fix duplicate message bug on the frontend by updating the existing streamed message instead of appending a new one on `reply` WS events.

## File-by-File Breakdown

| File                                   | Change                      |
| -------------------------------------- | --------------------------- |
| `server/services/assistantService.js`  | 2 insertions, 2 deletions   |
| `src/components/FloatingAssistant.jsx` | 24 insertions, 11 deletions |

## Detailed Diff Analysis

Server:

- `MAX_AI_ANSWER_CHARS`: 1200 → 8000
- Block result preference logic: `if (textPart?.text && (!fullText || textPart.text.length > fullText.length))` — now overwrites SSE text if blocking result is longer

Client:

- Reply handler uses `findLastIndex` to update existing assistant message by `request_id` instead of always pushing a new message
- Prevents duplicate bot messages when the streamed message is finalized by a `reply` event

## Why This Change

The 6s SSE timeout was cutting off responses mid-word. The blocking result (which has the full text) was being ignored if SSE had already provided partial text. Also, the client was creating duplicate messages on finalization.

## Was It Useful

Highly — fixes truncated responses and duplicate messages, two common UX bugs.

## Impact Analysis

**Medium-high.** Improves reliability of AI responses and fixes duplicate message rendering.

## Relationships

Fixes regression from 0423 (SSE timeout at 6s). Prerequisite for 0429 (removing truncation entirely).

## Confidence Notes

High — well-documented commit message.
