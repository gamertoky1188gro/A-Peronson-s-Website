# 0430 — add detailed assistant interaction logging

**Commit:** `2e5e0a939fa59a68e5ee2d8c6d7e3254d395dec2`
**Parent:** `3d52615d73f85a0691340ca82f0a528bda18d412`
**Author:** gamertoky1188gro
**Date:** 2026-05-24 23:19:53 +0600

## High-Level Summary

Adds comprehensive console logging to both `callOpencode` and `streamOpencodeReply` for every AI interaction. Logs include user/guest ID, session ID, question (truncated to 500 chars), answer (truncated to 2000), reasoning parts, text parts, tool-call parts, tool-result parts, command parts, and system prompt preview.

## File-by-File Breakdown

| File                                  | Change                     |
| ------------------------------------- | -------------------------- |
| `server/services/assistantService.js` | 71 insertions, 7 deletions |

## Detailed Diff Analysis

In `callOpencode`:

- Separates parts by type (reasoning, text, tool-call, tool-result, command)
- Logs detailed interaction JSON with user, session, question, answer, and part breakdowns
- Improves error logging: now logs part types and raw preview instead of just info keys

In `streamOpencodeReply`:

- Same detailed logging after `blockingResult` is processed
- Logs part types from the blocking result

## Why This Change

Needed for debugging AI interactions, auditing, and understanding how the AI is being used. Without this, diagnosing issues required guesswork.

## Was It Useful

Yes — essential for operational visibility of the AI assistant feature.

## Impact Analysis

**Low-medium.** Adds console log volume (could be noisy) but no behavioral change. May need log level control in production.

## Relationships

Part of the AI assistant reliability push (0423-0431). Noisy but valuable.

## Confidence Notes

High — straightforward logging additions.
