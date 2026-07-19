# Commit 0413 — `1805a4f2b78`

| Field       | Value                                       |
| ----------- | ------------------------------------------- |
| Commit Hash | `1805a4f2b781e3dc1794b7f00647ab1d21b71c34`  |
| Parent Hash | `51321c8effb1941a0f6021f4396b510bc0c583e6`  |
| Author      | gamertoky1188gro                            |
| Date        | 2026-05-23 18:41:15 +0600                   |
| Subject     | fix: unescape HTML entities in AI responses |

---

## High-Level Summary

Wraps all AI response text through a new `unescapeHtml` utility function that converts `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;` back to their literal characters. Applied to all provider response handlers (Ollama, OpenRouter, Gemini, Opencode).

---

## Files Changed

| File                                  | Status   | Insertions | Deletions |
| ------------------------------------- | -------- | ---------- | --------- |
| `server/services/assistantService.js` | modified | 18         | 0         |
| `server/utils/validators.js`          | **new**  | 10         | 0         |

**2 files changed, 19 insertions, 9 deletions**

---

## Why

AI models return HTML-escaped text (e.g., `&amp;` for `&`). Unescaping provides human-readable responses.

---

## Was It Useful

Yes — fixes garbled AI responses with HTML entities.

---

## Impact

Medium — improves AI response readability.

---

## Confidence

High.
