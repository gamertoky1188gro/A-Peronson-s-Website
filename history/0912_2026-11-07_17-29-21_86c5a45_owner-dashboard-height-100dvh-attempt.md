# Commit 0912 — 86c5a45
| Field | Value |
|-------|-------|
| **Commit Number** | 0912 |
| **Commit Hash** | 86c5a45339ddebec66c3c5eaaacec2ddce84b838 |
| **Parent Hash** | 8bcf0bb3b3361416092a31e6f32f63cee086c14f |
| **Author** | Tokyi |
| **Date/Time** | 2026-11-07 17:29:21 |
| **Files Changed** | 1 |
| **Additions** | 1 |
| **Deletions** | 1 |
| **Net Change** | +1/-1 |
| **Merge Commit** | No |

## Owner Dashboard Height: h-[100dvh] Attempt

Switches to arbitrary-value `h-[100dvh]` (one-line change). Same zoom caveat as 0911.

Original commit message: “fix(owner-dashboard): fix mobile main height with h-[100dvh]”.

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

Bug fix: mobile main height, attempt 3.

## Was It Useful

Useful as an iteration step; incomplete on its own (superseded by 0913–0915).

## Impact Analysis

Mobile improves; lg still broken (zoom interaction).

## Relationship to Surrounding Commits

- **Follows:** 0911 — owner dashboard height: h-[100dvh] attempt.
- Owner Dashboard height chain, attempt 3.

## Confidence Notes

- **Facts** (metadata, file list, line counts, rename/binary detection) extracted directly from git for this commit.
- **Interpretation** (title, summary, motivation, verdict) was written from the diff and commit message; statements labelled as inference are not confirmed by the commit itself.
- Backfilled on 2026-11-08 as part of the history catch-up (commits 0895–0923).

## Optional Technical Details

- Renamed files: see `git show --find-renames` for this commit.
- Binary files: any non-textual entries are reported as `-` line counts by git.
- Build output (`dist/`) files: none.
