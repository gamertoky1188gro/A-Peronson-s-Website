# Commit 0415 — `1217ae4dea9`

| Field | Value |
|-------|-------|
| Commit Hash | `1217ae4dea97643d4ca64860c3d45a80e2403970` |
| Parent Hash | `5e9af2e2c850cfb95d62f774cf97b468daf0ffec` |
| Author | gamertoky1188gro |
| Date | 2026-05-23 19:22:09 +0600 |
| Subject | refactor: replace custom code search with opencode SDK find.text |

---

## High-Level Summary

Major refactoring: removes the entire custom code search pipeline (~300 lines) including `collectCodeFiles`, `getCodeFiles`, `findBestSnippet`, `tokenize`, `scoreMatch`, `codeFileCache`, and all related constants. Replaces with a single call to `client.find.text()` which delegates code search to the running opencode server. Preserves `MAX_CONTEXT_CHARS` and `MAX_KNOWLEDGE_CONTEXT_CHARS` as safety limits.

Also removes `AI_PROVIDERS` enum, `aiConfig`, `getPrimaryProvider`, `getFallbackProvider`, `isProviderAvailable`, `getAiConfig`, `updateAiConfig` — the old multi-provider AI infrastructure (Ollama, OpenRouter, Gemini) is gutted. Only opencode remains.

---

## Files Changed

| File | Status | Insertions | Deletions |
|------|--------|------------|-----------|
| `server/services/assistantService.js` | modified | 343 | 0 |

**1 file changed, 34 insertions, 309 deletions**

---

## Detailed Changes

### Removed (~309 lines)
- `CODE_EXTENSIONS`, `SKIP_DIRECTORIES`, `MAX_FILES_TO_SCAN`, `MAX_FILE_BYTES`, `MAX_MATCHED_SNIPPETS`, `MAX_SNIPPET_LENGTH`
- `AI_PROVIDERS` enum (`OLLAMA`, `OPENROUTER`, `GEMINI`, `OPENCODE`, `NONE`)
- `aiConfig` object with all provider configs
- `getPrimaryProvider`, `getFallbackProvider`, `isProviderAvailable`, `getAiConfig`, `updateAiConfig`
- `_CODE_CONTEXT_HINTS` set
- `codeFileCache` and cache expiry
- `normalize`, `tokenize`, `scoreMatch` helper functions
- `collectCodeFiles`, `getCodeFiles`, `findBestSnippet`, `searchCodeContext` (old version)
- Old `searchCodeContext` relied on reading files from disk and token-matching

### New `searchCodeContext` (~34 lines)
- Calls `ensureOpencodeServer()` to get the port
- Creates an opencode client via `createOpencodeClient()`
- Calls `client.find.text({ query: { pattern: questionText } })`
- Parses the response (supports both array and `{data}` shapes)
- Maps matches to `{ file, line, snippet }` objects (up to 8)
- Returns `summary`, `snippets`, `prompt_context` (same shape as before)
- Preserves `MAX_CONTEXT_CHARS` (1600) and `MAX_KNOWLEDGE_CONTEXT_CHARS` (1200)

---

## Why

Replace fragile, manual file-walking code search with the opencode SDK's native `find.text` method, which is more accurate, maintainable, and performs the search server-side.

---

## Was It Useful

High — removes 300 lines of complex custom code and leverages the opencode server's built-in code search.

---

## Impact

Large. Removes multi-provider AI infrastructure (Ollama, OpenRouter, Gemini are no longer supported). Code search is now entirely delegated to opencode.

---

## Relationships

Major milestone in the opencode integration journey.

---

## Confidence

High.
