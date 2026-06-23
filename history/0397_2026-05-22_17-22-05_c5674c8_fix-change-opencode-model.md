# Commit 0397 — `c5674c82998`

| Field | Value |
|-------|-------|
| Commit Hash | `c5674c829982f4a58fb603866678d4ee5c2a8585` |
| Parent Hash | `24235fbd667abcbfdf363c14156348123adec628` |
| Author | gamertoky1188gro |
| Date | 2026-05-22 17:22:05 +0600 |
| Subject | fix: change opencode model to deepseek-v4-flash-free |

---

## High-Level Summary

Changes the default AI model from `minimax-m2.5-free` to `deepseek-v4-flash-free` in three places: the assistant service config, the opencode config file, and Render's environment variables.

---

## Files Changed

| File | Status | Insertions | Deletions |
|------|--------|------------|-----------|
| `render.yaml` | modified | 2 | 0 |
| `server/services/assistantService.js` | modified | 2 | 0 |
| `sessions/opencode_config.json` | modified | 2 | 0 |

**3 files changed, 4 insertions, 2 deletions**

---

## Why

Switching to a different (likely cheaper or more capable) model.

---

## Was It Useful

Yes — configures the correct AI model.

---

## Impact

Changes the AI model used for all assistant responses.

---

## Relationships

Part of the opencode AI integration series.

---

## Confidence

High.
