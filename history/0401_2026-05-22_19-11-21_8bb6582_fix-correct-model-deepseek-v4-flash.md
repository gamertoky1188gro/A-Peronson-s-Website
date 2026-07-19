# Commit 0401 — `8bb65823412`

| Field       | Value                                      |
| ----------- | ------------------------------------------ |
| Commit Hash | `8bb6582341266727f4462fcd79f2766eb43266dd` |
| Parent Hash | `14bae7d57006e7194d996cb94f6ebb8b288261c5` |
| Author      | gamertoky1188gro                           |
| Date        | 2026-05-22 19:11:21 +0600                  |
| Subject     | fix: correct model to deepseek-v4-flash    |

---

## High-Level Summary

Changes model from `deepseek-v4-flash-free` to `deepseek-v4-flash` (without `-free` suffix) in three places.

---

## Files Changed

| File                                  | Status   | Insertions | Deletions |
| ------------------------------------- | -------- | ---------- | --------- |
| `render.yaml`                         | modified | 2          | 0         |
| `server/services/assistantService.js` | modified | 2          | 0         |
| `sessions/opencode_config.json`       | modified | 2          | 0         |

**3 files changed, 3 insertions, 3 deletions**

---

## Why

Correction of the model identifier.

---

## Was It Useful

Minor model name fix.

---

## Impact

Changes which model variant is used.

---

## Relationships

Follows model config from 0397.

---

## Confidence

High.
