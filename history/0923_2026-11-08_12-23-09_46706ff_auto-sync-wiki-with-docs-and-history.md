# Commit 0923 — 46706ff
| Field | Value |
|-------|-------|
| **Commit Number** | 0923 |
| **Commit Hash** | 46706ff6c362dec948a3d2b10a58f4174a33a19a |
| **Parent Hash** | 1a0a87bf80f19f1169811da70ac79776b33a34b5 |
| **Author** | Tokyi |
| **Date/Time** | 2026-11-08 12:23:09 |
| **Files Changed** | 2 |
| **Additions** | 104 |
| **Deletions** | 0 |
| **Net Change** | +104/-0 |
| **Merge Commit** | No |

## Auto-Sync the Wiki with docs/ and history/

Adds `scripts/sync-wiki.mjs` (mirrors all docs/ and history/ markdown into the wiki repo, 1,066 pages, deleting stale mirrors) and a `Wiki Sync` GitHub Actions workflow that re-mirrors on every main push touching those paths. Verified live: run 42454529943 succeeded in 21 s.

Original commit message: “ci(wiki): auto-sync docs/ and history/ to the GitHub wiki on push”.

## Files Changed

| File | Type | + | - | Δ |
|------|------|---|---|---|
| `scripts/sync-wiki.mjs` | Added | 64 | 0 | +64/-0 |
| `.github/workflows/wiki-sync.yml` | Added | 40 | 0 | +40/-0 |

### What changed per file

- **`scripts/sync-wiki.mjs`** — added. +64/-0 lines.
- **`.github/workflows/wiki-sync.yml`** — added. +40/-0 lines.

## Detailed Diff Analysis

- **Files changed:** 2; **+104/-0**.
- **Areas touched:** docs/history 0 file(s), src/server/shared 0 file(s), tests 0 file(s), config/CI 1 file(s).

## Why This Change Was Needed

Docs maintenance: the wiki had been populated once but would drift from the repo without automation.

## Was It Useful

Useful. One-way sync is honest (repo is the source of truth); wiki edits to mirrored pages are lost by design.

## Impact Analysis

Docs/history stay published to the wiki automatically; no manual re-mirror needed.

## Relationship to Surrounding Commits

- **Follows:** 0922 — auto-sync the wiki with docs/ and history/.
- Final commit of this sequence; concludes the backfill (this very folder) by making future syncs automatic.

## Confidence Notes

- **Facts** (metadata, file list, line counts, rename/binary detection) extracted directly from git for this commit.
- **Interpretation** (title, summary, motivation, verdict) was written from the diff and commit message; statements labelled as inference are not confirmed by the commit itself.
- Backfilled on 2026-11-08 as part of the history catch-up (commits 0895–0923).

## Optional Technical Details

- Renamed files: see `git show --find-renames` for this commit.
- Binary files: any non-textual entries are reported as `-` line counts by git.
- Build output (`dist/`) files: none.
