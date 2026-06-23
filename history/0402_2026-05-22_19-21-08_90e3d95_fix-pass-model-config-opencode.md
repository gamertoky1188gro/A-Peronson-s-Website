# Commit 0402 — `90e3d95da61`

| Field | Value |
|-------|-------|
| Commit Hash | `90e3d95da61439008cff7ec840e4636dd0412c0d` |
| Parent Hash | `8bb6582341266727f4462fcd79f2766eb43266dd` |
| Author | gamertoky1188gro |
| Date | 2026-05-22 19:21:08 +0600 |
| Subject | fix: pass model config when starting opencode server |

---

## High-Level Summary

Passes the model config (`model` and `autoupdate: false`) to the `createOpencode` call in `ensureOpencodeServer`. Reverts default model to `deepseek-v4-flash-free`.

---

## Files Changed

| File | Status | Insertions | Deletions |
|------|--------|------------|-----------|
| `server/services/assistantService.js` | modified | 6 | 0 |

**1 file changed, 5 insertions, 1 deletion**

---

## Why

The opencode server was starting without the correct model configuration. Now `config.model` and `config.autoupdate` are explicitly passed.

---

## Was It Useful

Yes — ensures the opencode server uses the configured model.

---

## Impact

Medium — fixes model selection at server startup.

---

## Relationships

Part of the opencode server integration series.

---

## Confidence

High.
