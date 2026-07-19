# Commit 0405 — `a18544e5b07`

| Field       | Value                                                           |
| ----------- | --------------------------------------------------------------- |
| Commit Hash | `a18544e5b0720b6fbb645cce2283974a0f656801`                      |
| Parent Hash | `847f2df5a674d19842c10038d0725af631098836`                      |
| Author      | gamertoky1188gro                                                |
| Date        | 2026-05-22 19:43:10 +0600                                       |
| Subject     | fix: set OPENCODE_MODEL env var to override server model config |

---

## High-Level Summary

Adds `OPENCODE_MODEL` environment variable to Render config. Reverts `OPENCODE_MODEL_ID` back to `deepseek-v4-flash-free`.

---

## Files Changed

| File          | Status   | Insertions | Deletions |
| ------------- | -------- | ---------- | --------- |
| `render.yaml` | modified | 4          | 0         |

**1 file changed, 3 insertions, 1 deletion**

---

## Why

The opencode server may read `OPENCODE_MODEL` env var separately from `OPENCODE_MODEL_ID`. Adding both ensures correct model selection.

---

## Was It Useful

Minor env config fix.

---

## Impact

Small.

---

## Relationships

Part of opencode model config series.

---

## Confidence

High.
