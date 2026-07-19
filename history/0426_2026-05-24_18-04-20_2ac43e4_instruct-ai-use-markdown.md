# 0426 — instruct AI to use Markdown formatting in responses

**Commit:** `2ac43e4610a1079ee6a2a9deb64b67d4bceac3ca`
**Parent:** `948c289bcb1099fb6276d73a9692c9da1ecdf018`
**Author:** gamertoky1188gro
**Date:** 2026-05-24 18:04:20 +0600

## High-Level Summary

Adds explicit Markdown formatting instructions to the AI's system prompt, telling the model to use bold, inline code, fenced code blocks, lists, and tables.

## File-by-File Breakdown

| File                                  | Change       |
| ------------------------------------- | ------------ |
| `server/services/assistantService.js` | 7 insertions |

## Detailed Diff Analysis

Adds a "Use Markdown formatting:" block to the system prompt with examples of each format.

## Why This Change

Since 0425 enabled Markdown rendering, the AI now needs to be instructed to actually use these formats in its responses.

## Was It Useful

Necessary complement to 0425. Without this, the AI would continue producing plain text.

## Impact Analysis

**Medium.** Changes the AI's output format. Only affects the system prompt for the opencode provider.

## Relationships

Direct follow-up to 0425. Reverted/adjusted by 0427 (backtick escaping fix).

## Confidence Notes

High — clear intent.
