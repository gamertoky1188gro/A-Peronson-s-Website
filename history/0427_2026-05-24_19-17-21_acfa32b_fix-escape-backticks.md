# 0427 — fix: escape backticks in template literal

**Commit:** `acfa32b11cb365099dc24352d8686cbaabd8d884`
**Parent:** `2ac43e4610a1079ee6a2a9deb64b67d4bceac3ca`
**Author:** gamertoky1188gro
**Date:** 2026-05-24 19:17:21 +0600

## High-Level Summary

Escapes backticks inside the system prompt template literal to prevent JavaScript template literal interpolation issues when the prompt contains example code fences.

## File-by-File Breakdown

| File                                  | Change                    |
| ------------------------------------- | ------------------------- |
| `server/services/assistantService.js` | 2 insertions, 2 deletions |

## Detailed Diff Analysis

````diff
- - `inline code` for code, paths, filenames, commands
- - ```fenced code blocks``` for multi-line code, SQL, JSON, configs
+ - \`inline code\` for code, paths, filenames, commands
+ - \`\`\`fenced code blocks\`\`\` for multi-line code, SQL, JSON, configs
````

## Why This Change

The system prompt is a JavaScript template literal (backtick-delimited string). Unescaped backticks inside the string would prematurely terminate the template literal or cause syntax errors.

## Was It Useful

Yes — fixes a potential runtime error where the prompt string would be malformed.

## Impact Analysis

**Low.** Only affects the string representation sent to the AI; the actual instructions remain the same.

## Relationships

Fixup for 0426. Reverts the literal backtick characters that 0426 introduced into the template literal.

## Confidence Notes

High — obvious fix.
