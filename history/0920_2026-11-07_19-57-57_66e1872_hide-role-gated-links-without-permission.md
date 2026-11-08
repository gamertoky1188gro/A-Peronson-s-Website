# Commit 0920 — 66e1872
| Field | Value |
|-------|-------|
| **Commit Number** | 0920 |
| **Commit Hash** | 66e1872953e9c57a1f18b1e60720a61b42672412 |
| **Parent Hash** | 0d53a47fef8c1564a238b0412c8223183422d193 |
| **Author** | Tokyi |
| **Date/Time** | 2026-11-07 19:57:57 |
| **Files Changed** | 2 |
| **Additions** | 22 |
| **Deletions** | 12 |
| **Net Change** | +22/-12 |
| **Merge Commit** | No |

## Hide Role-Gated Links Without Permission

NavBar, Footer and Chat nav hide links whose route the current role can't access; chat rail reordered accordingly (2 files). Pairs with the ROUTE_MANIFEST health check.

Original commit message: “feat(nav): hide role-gated links lacking permission”.

## Files Changed

| File | Type | + | - | Δ |
|------|------|---|---|---|
| `src/components/Footer.jsx` | Modified | 10 | 10 | +10/-10 |
| `src/pages/ChatInterface.jsx` | Modified | 12 | 2 | +12/-2 |

### What changed per file

- **`src/components/Footer.jsx`** — modified. +10/-10 lines.
- **`src/pages/ChatInterface.jsx`** — modified. +12/-2 lines.

## Detailed Diff Analysis

- **Files changed:** 2; **+22/-12**.
- **Areas touched:** docs/history 0 file(s), src/server/shared 2 file(s), tests 0 file(s), config/CI 0 file(s).

## Why This Change Was Needed

Security/UX correctness: showing dead or forbidden links leaks structure and confuses users.

## Was It Useful

Useful. Closes the 'nav shows everything, 403 on click' class of bugs.

## Impact Analysis

Each role sees only what it can open; direct-URL access still guarded by route checks.

## Relationship to Surrounding Commits

- **Follows:** 0919 — hide role-gated links without permission.
- Nav/role-gating step; 0921 continues the buyer-requests fixes.

## Confidence Notes

- **Facts** (metadata, file list, line counts, rename/binary detection) extracted directly from git for this commit.
- **Interpretation** (title, summary, motivation, verdict) was written from the diff and commit message; statements labelled as inference are not confirmed by the commit itself.
- Backfilled on 2026-11-08 as part of the history catch-up (commits 0895–0923).

## Optional Technical Details

- Renamed files: see `git show --find-renames` for this commit.
- Binary files: any non-textual entries are reported as `-` line counts by git.
- Build output (`dist/`) files: none.
