# Commit 0911 — 8bcf0bb
| Field | Value |
|-------|-------|
| **Commit Number** | 0911 |
| **Commit Hash** | 8bcf0bb3b3361416092a31e6f32f63cee086c14f |
| **Parent Hash** | f28f07d2126caf7e9bcf4ca30e516fc28e4e38ec |
| **Author** | Tokyi |
| **Date/Time** | 2026-11-07 17:21:59 |
| **Files Changed** | 1 |
| **Additions** | 1 |
| **Deletions** | 1 |
| **Net Change** | +1/-1 |
| **Merge Commit** | No |

## Owner Dashboard Height: h-dvh Attempt

Tries `h-dvh` for the locked mobile shell (one-line change). Insufficient on lg due to the global 0.8 zoom scaling vh units — later fixed via 125dvh.

Original commit message: “fix(owner-dashboard): fix mobile main height with h-dvh”.

## Files Changed

| File | Type | + | - | Δ |
|------|------|---|---|---|
| `src/pages/OwnerDashboard.jsx` | Modified | 1 | 1 | +1/-1 |

### What changed per file

- **`src/pages/OwnerDashboard.jsx`** — modified. +1/-1 lines.

## Detailed Diff Analysis

- **Files changed:** 1; **+1/-1**.
- **Areas touched:** docs/history 0 file(s), src/server/shared 1 file(s), tests 0 file(s), config/CI 0 file(s).

## Why This Change Was Needed

Bug fix: mobile main height, attempt 2.

## Was It Useful

Useful as an iteration step; incomplete on its own (superseded by 0912–0914).

## Impact Analysis

Mobile improves; lg still broken (zoom interaction).

## Relationship to Surrounding Commits

- **Follows:** 0910 — owner dashboard height: h-dvh attempt.
- Owner Dashboard height chain, attempt 2.

## Confidence Notes

- **Facts** (metadata, file list, line counts, rename/binary detection) extracted directly from git for this commit.
- **Interpretation** (title, summary, motivation, verdict) was written from the diff and commit message; statements labelled as inference are not confirmed by the commit itself.
- Backfilled on 2026-11-08 as part of the history catch-up (commits 0895–0923).

## Optional Technical Details

- Renamed files: see `git show --find-renames` for this commit.
- Binary files: any non-textual entries are reported as `-` line counts by git.
- Build output (`dist/`) files: none.
