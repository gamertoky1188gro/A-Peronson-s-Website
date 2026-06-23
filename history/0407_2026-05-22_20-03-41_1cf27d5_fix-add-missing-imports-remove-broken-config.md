# Commit 0407 — `1cf27d52544`

| Field | Value |
|-------|-------|
| Commit Hash | `1cf27d5254469bcafaabd5ae8bd1d95f1370c279` |
| Parent Hash | `8672fcb6b897699d5148aa2bec023b78f6149e78` |
| Author | gamertoky1188gro |
| Date | 2026-05-22 20:03:41 +0600 |
| Subject | fix: add missing path/fs imports, remove broken config from createOpencode |

---

## High-Level Summary

Fixes missing `path` and `fs` imports in `assistantService.js`. Separates `fs` and `fs/promises` imports. Removes the `config` object from `createOpencode` call (which was causing issues). Re-adds `path` import needed by the service.

---

## Files Changed

| File | Status | Insertions | Deletions |
|------|--------|------------|-----------|
| `server/services/assistantService.js` | modified | 15 | 0 |

**1 file changed, 6 insertions, 9 deletions**

---

## Why

Missing `path` import caused crashes. The `config` block passed to `createOpencode` was not supported by the SDK.

---

## Was It Useful

Yes — fixes crashes and aligns with SDK API.

---

## Impact

Small but important for runtime stability.

---

## Relationships

Part of opencode integration series.

---

## Confidence

High.
