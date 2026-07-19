# 0431 — Add full session memory: conversation history, auto-title generation, typing indicator, greeting dedup

**Commit:** `1baea2553735bb6cd7f4fccf6709552bca2f5671`
**Parent:** `2e5e0a939fa59a68e5ee2d8c6d7e3254d395dec2`
**Author:** gamertoky1188gro
**Date:** 2026-05-25 01:54:01 +0600

## High-Level Summary

Major feature addition. Four interconnected changes: (1) Session history is fetched from opencode and included in every AI prompt so the AI has context, (2) auto-generated conversation titles from the first user message, (3) typing indicator hidden after first chunk received, (4) duplicate WS greeting messages suppressed when history exists. Also creates `AGENTS.md` with dev commands and architecture docs.

## File-by-File Breakdown

| File                                        | Change                       |
| ------------------------------------------- | ---------------------------- |
| `AGENTS.md`                                 | New file (43 lines)          |
| `server/controllers/assistantController.js` | 2 insertions, 2 deletions    |
| `server/services/assistantService.js`       | 122 insertions, 19 deletions |
| `src/components/FloatingAssistant.jsx`      | 33 insertions, 7 deletions   |

## Detailed Diff Analysis

**AGENTS.md:** New developer documentation with commands, test/lint/build instructions, architecture notes, and key quirks.

**assistantService.js:**

- New `formatConversationHistory()` and `generateSessionTitle()` helpers
- `buildAgentPrompt()` now accepts `conversationHistory` param and includes "CONVERSATION HISTORY" section
- `getOpencodeSessionMessages()` now returns `{ messages, title }` object
- `callOpencode()` handles title generation/persistence via `saveSessionMeta`
- `generateDynamicAnswer()` passes conversation history through
- New `fetchSessionHistory()` fetches past messages from opencode session
- `assistantReply()` and `streamOpencodeReply()` both fetch history and include in prompt
- Title auto-generated from first user question

**assistantController.js:** Returns `{ messages, title }` instead of plain array.

**FloatingAssistant.jsx:**

- Shows `title` in header (or "GarTex Assistant" fallback)
- Tracks `firstChunkReceived` to hide typing indicator once streaming starts
- Skips duplicate WS greeting via `hasUserMessagesRef`
- `deleteSession()` resets title and user messages flag

## Why This Change

The AI had no memory — each question was independent. Titles make sessions identifiable. Greeting dedup fixes a UX bug where opening a returning session showed the greeting twice.

## Was It Useful

Highly — conversational AI without memory is nearly useless. This enables multi-turn conversations.

## Impact Analysis

**High.** Fundamental feature addition affecting server logic, API shape, and frontend UI. Every AI interaction now has context.

## Relationships

Builds on the AI streaming foundation (0423-0430). Prerequisite for 0432 (session pre-load fix). AGENTS.md is project documentation.

## Confidence Notes

High — well-structured commit with clear separation of concerns.
