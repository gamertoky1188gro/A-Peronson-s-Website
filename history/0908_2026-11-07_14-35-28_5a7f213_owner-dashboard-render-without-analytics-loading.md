# Commit 0908 — 5a7f213
| Field | Value |
|-------|-------|
| **Commit Number** | 0908 |
| **Commit Hash** | 5a7f21320ced6b986e885b97ee036e5fb2b95129 |
| **Parent Hash** | 0a2a7d21d69e0fa3fd5828ceabb9004ca84bac70 |
| **Author** | Tokyi |
| **Date/Time** | 2026-11-07 14:35:28 |
| **Files Changed** | 1 |
| **Additions** | 18 |
| **Deletions** | 17 |
| **Net Change** | +18/-17 |
| **Merge Commit** | No |

## Don't Block Content on Analytics Loading

Owner Dashboard no longer waits for analytics to finish before rendering the page body; the analytics section loads independently.

Original commit message: “fix(owner-dashboard): don't block content rendering on analytics loading”.

## Files Changed

| File | Type | + | - | Δ |
|------|------|---|---|---|
| `src/pages/OwnerDashboard.jsx` | Modified | 18 | 17 | +18/-17 |

### What changed per file

- **`src/pages/OwnerDashboard.jsx`** — modified. +18/-17 lines.

## Detailed Diff Analysis

- **Files changed:** 1; **+18/-17**.
- **Areas touched:** docs/history 0 file(s), src/server/shared 1 file(s), tests 0 file(s), config/CI 0 file(s).

## Why This Change Was Needed

Bug fix: a slow analytics request blanked the entire dashboard.

## Was It Useful

Useful. Removes a real perceived hang.

## Impact Analysis

Dashboard paints immediately; analytics shows when ready.

## Relationship to Surrounding Commits

- **Follows:** 0907 — don't block content on analytics loading.
- Same symptom class as 0909–0914 (blank Owner Dashboard); first of the Owner Dashboard fix chain.

## Confidence Notes

- **Facts** (metadata, file list, line counts, rename/binary detection) extracted directly from git for this commit.
- **Interpretation** (title, summary, motivation, verdict) was written from the diff and commit message; statements labelled as inference are not confirmed by the commit itself.
- Backfilled on 2026-11-08 as part of the history catch-up (commits 0895–0923).

## Optional Technical Details

- Renamed files: see `git show --find-renames` for this commit.
- Binary files: any non-textual entries are reported as `-` line counts by git.
- Build output (`dist/`) files: none.
