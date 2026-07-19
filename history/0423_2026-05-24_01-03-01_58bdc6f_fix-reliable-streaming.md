# 0423 — fix: reliable streaming — blocking prompt + SSE fallback

**Commit:** `58bdc6f38d4ab32fad1efc5cd6b17466b5e3dbeb`
**Parent:** `66a3165283b2d51ee26a385d674842bbcd862f2e`
**Author:** gamertoky1188gro
**Date:** 2026-05-24 01:03:01 +0600

## High-Level Summary

Major rewrite of the `streamOpencodeReply` function. Removes the duplicate `promptAsync` call; replaces with a synchronous/blocking `session.prompt()` that resolves after the AI completes. Concurrently subscribes to SSE events for streaming deltas. If SSE delivers chunks, they are forwarded real-time. If no SSE events arrive within 6s (`Promise.race` with timeout), the blocking result is used as the fallback answer.

## File-by-File Breakdown

| File                                  | Change                      |
| ------------------------------------- | --------------------------- |
| `server/services/assistantService.js` | 52 insertions, 49 deletions |

## Detailed Diff Analysis

Key changes:

1. **Removed** `client.session.promptAsync()` in favor of `client.session.prompt()` (blocking)
2. **SSE subscription** via `client.event.subscribe()` with a 6s race timeout
3. **Streaming chunks** forwarded via `onChunk(delta, fullText)` if SSE data arrives
4. **Fallback** to blocking result `blockingResult.data.parts` if SSE is empty or times out
5. **Removed `MAX_AI_ANSWER_CHARS`** sanitization from the stream path

## Why This Change

The previous dual-call pattern (promptAsync + SSE) often produced empty responses because the SSE stream would indicate completion before the blocking call finished. Now a single blocking call guarantees a result, while SSE provides real-time chunking if available.

## Was It Useful

Highly — fixes silent empty-reply bugs and ensures every user receives a response.

## Impact Analysis

**High.** Core change to how AI streaming works server-side. All assistant interactions flow through this path.

## Relationships

Foundation for 0424 (syntax fixup), 0428 (prefer blocking result over SSE), 0429 (remove truncation).

## Confidence Notes

High — the pattern is well-established (blocking + SSE-as-optimization).
