# 0421 — fix: lines from find.text is an array, join before trim

**Commit:** `95edbdbeccb3b5c155233e1462e6cd68c123b1a7`
**Parent:** `72705203a33483b18046880e1125e4ada751b8fb`
**Author:** gamertoky1188gro
**Date:** 2026-05-23 21:59:28 +0600

## High-Level Summary

One-line fix in `searchCodeContext` to handle `m.lines` being an array instead of a string. Previously `.trim()` was called directly on what might be an array; now joins with newline first.

## File-by-File Breakdown

| File                                  | Change                  |
| ------------------------------------- | ----------------------- |
| `server/services/assistantService.js` | 1 insertion, 1 deletion |

## Detailed Diff Analysis

```diff
- snippet: (m.lines || "").trim().substring(0, 320),
+ snippet: (Array.isArray(m.lines) ? m.lines.join("\n") : (m.lines || "")).trim().substring(0, 320),
```

## Why This Change

The `find.text` search API returns `.lines` as an array of strings, not a single concatenated string. Calling `.trim()` on an array would either coerce unexpectedly or fail silently.

## Was It Useful

Yes — fixes a silent data corruption bug where code context snippets could be mangled or missing.

## Impact Analysis

**Low.** Single-line defensive guard. Affects AI context assembly but only for code-search results.

## Relationships

Follow-up to earlier `searchCodeContext` implementation. Tightly related to 0422 which further refines the same extraction logic.

## Confidence Notes

High — trivial fix, clear before/after.
