# Commit 0541 — `9e89027dd2c`

| Field | Value |
|-------|-------|
| Commit Hash | `9e89027dd2c394e8a1e9532b67dc38bbdf5b2cb1` |
| Parent Hash | `5e7ed48a82af43795f4842d58b3f4f981a042010` |
| Author | gamertoky1188gro |
| Date | 2026-06-06 12:10:23 +0600 |
| Subject | chore: enable sourcemap in vite build config |

---

## High-Level Summary

Adds `sourcemap: true` to Vite's `build` config for debug-friendly development builds.

---

## Files Changed

| File | Status | Insertions | Deletions |
|------|--------|------------|-----------|
| `vite.config.js` | modified | 1 | 0 |

**1 file changed, 1 insertion**

---

## Detailed Diff Analysis

### `vite.config.js`
- Added `sourcemap: true` alongside existing `reportCompressedSize: true` as a paired build toggle, both marked with a comment to disable for public release.

---

## Why

Enables JS source maps in development so stack traces point to original source lines instead of bundled output.

---

## Was It Useful

Yes — standard debug enabler.

---

## Impact

Low — only affects Vite build output, not runtime behavior or bundle size in production (when toggled off).

---

## Confidence

High.
