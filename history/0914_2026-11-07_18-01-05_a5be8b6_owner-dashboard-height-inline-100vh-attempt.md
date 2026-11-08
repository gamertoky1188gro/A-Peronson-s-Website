# Commit 0914 — a5be8b6
| Field | Value |
|-------|-------|
| **Commit Number** | 0914 |
| **Commit Hash** | a5be8b667a8349041ca8d3249e0fdc870314a61f |
| **Parent Hash** | f9fa90bf2d336cce4cd680b3f474528d504c5a69 |
| **Author** | Tokyi |
| **Date/Time** | 2026-11-07 18:01:05 |
| **Files Changed** | 1 |
| **Additions** | 2 |
| **Deletions** | 2 |
| **Net Change** | +2/-2 |
| **Merge Commit** | No |

## Owner Dashboard Height: Inline height 100vh Attempt

Switches to an inline `height: 100vh` style (2-line change). Same class of issue as the vh utilities under zoom.

Original commit message: “fix(owner-dashboard): fix mobile main height with inline style height: 100vh”.

## Files Changed

| File | Type | + | - | Δ |
|------|------|---|---|---|
| `src/pages/OwnerDashboard.jsx` | Modified | 2 | 2 | +2/-2 |

### What changed per file

- **`src/pages/OwnerDashboard.jsx`** — modified. +2/-2 lines.

## Detailed Diff Analysis

- **Files changed:** 1; **+2/-2**.
- **Areas touched:** docs/history 0 file(s), src/server/shared 1 file(s), tests 0 file(s), config/CI 0 file(s).

## Why This Change Was Needed

Bug fix: mobile main height, attempt 5.

## Was It Useful

Useful as an iteration step; superseded by 0915/0916 which hide the footer and lock the shell correctly.

## Impact Analysis

No regression; mobile closer to correct.

## Relationship to Surrounding Commits

- **Follows:** 0913 — owner dashboard height: inline height 100vh attempt.
- Owner Dashboard height chain, attempt 5.

## Confidence Notes

- **Facts** (metadata, file list, line counts, rename/binary detection) extracted directly from git for this commit.
- **Interpretation** (title, summary, motivation, verdict) was written from the diff and commit message; statements labelled as inference are not confirmed by the commit itself.
- Backfilled on 2026-11-08 as part of the history catch-up (commits 0895–0923).

## Optional Technical Details

- Renamed files: see `git show --find-renames` for this commit.
- Binary files: any non-textual entries are reported as `-` line counts by git.
- Build output (`dist/`) files: none.
