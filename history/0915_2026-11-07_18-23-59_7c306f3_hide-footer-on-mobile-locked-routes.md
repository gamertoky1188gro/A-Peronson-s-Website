# Commit 0915 — 7c306f3
| Field | Value |
|-------|-------|
| **Commit Number** | 0915 |
| **Commit Hash** | 7c306f338b79c73d56b7c2d6fde73127a028927c |
| **Parent Hash** | a5be8b667a8349041ca8d3249e0fdc870314a61f |
| **Author** | Tokyi |
| **Date/Time** | 2026-11-07 18:23:59 |
| **Files Changed** | 2 |
| **Additions** | 4 |
| **Deletions** | 3 |
| **Net Change** | +4/-3 |
| **Merge Commit** | No |

## Hide the Stacked Footer on Mobile for Locked Routes

Hides the ~990px stacked footer on small screens for viewport-locked routes (`/owner`, `/contracts`, `/leads`, `/verification`) via `global-footer hidden lg:block` and updates the test pinning JSX bindings.

Original commit message: “fix(app): hide stacked footer on mobile for viewport-locked routes”.

## Files Changed

| File | Type | + | - | Δ |
|------|------|---|---|---|
| `src/pages/OwnerDashboard.jsx` | Modified | 2 | 2 | +2/-2 |
| `src/App.jsx` | Modified | 2 | 1 | +2/-1 |

### What changed per file

- **`src/pages/OwnerDashboard.jsx`** — modified. +2/-2 lines.
- **`src/App.jsx`** — modified. +2/-1 lines.

## Detailed Diff Analysis

- **Files changed:** 2; **+4/-3**.
- **Areas touched:** docs/history 0 file(s), src/server/shared 2 file(s), tests 0 file(s), config/CI 0 file(s).

## Why This Change Was Needed

Bug fix: the footer pushed locked-shell content off-screen and squeezed <main> to zero on mobile.

## Was It Useful

Useful. Breaks the 'nothing is the right height' loop by fixing the actual cause.

## Impact Analysis

Mobile locked routes fill the viewport correctly; footer visible only on lg.

## Relationship to Surrounding Commits

- **Follows:** 0914 — hide the stacked footer on mobile for locked routes.
- Resolution step of the Owner Dashboard height chain (0910–0914); continues with 0916.

## Confidence Notes

- **Facts** (metadata, file list, line counts, rename/binary detection) extracted directly from git for this commit.
- **Interpretation** (title, summary, motivation, verdict) was written from the diff and commit message; statements labelled as inference are not confirmed by the commit itself.
- Backfilled on 2026-11-08 as part of the history catch-up (commits 0895–0923).

## Optional Technical Details

- Renamed files: see `git show --find-renames` for this commit.
- Binary files: any non-textual entries are reported as `-` line counts by git.
- Build output (`dist/`) files: none.
