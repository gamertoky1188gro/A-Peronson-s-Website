# Commit 0400 — `14bae7d5700`

| Field | Value |
|-------|-------|
| Commit Hash | `14bae7d57006e7194d996cb94f6ebb8b288261c5` |
| Parent Hash | `9dc4cfc5aaa1d614a1ed72bcca82d6b0a9d23369` |
| Author | gamertoky1188gro |
| Date | 2026-05-22 18:59:26 +0600 |
| Subject | fix: set opencode as only AI provider, no fallback |

---

## High-Level Summary

Sets `AI_PRIMARY_PROVIDER` and `AI_FALLBACK_PROVIDER` both to `"opencode"` in the Render environment config, making opencode the sole AI provider.

---

## Files Changed

| File | Status | Insertions | Deletions |
|------|--------|------------|-----------|
| `render.yaml` | modified | 4 | 0 |

**1 file changed, 4 insertions**

---

## Why

Previously the fallback provider was `gemini`. Now opencode is used exclusively, with no Gemini fallback.

---

## Was It Useful

Yes — simplifies the AI provider setup.

---

## Impact

Minor — changes Render env config only.

---

## Relationships

Part of opencode-only AI architecture.

---

## Confidence

High.
