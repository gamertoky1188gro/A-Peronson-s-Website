# Commit 0897 — 4f34b88
| Field | Value |
|-------|-------|
| **Commit Number** | 0897 |
| **Commit Hash** | 4f34b887f84dcfd6d55ab2b5ff790d90043b7486 |
| **Parent Hash** | e9a99067da1dd39a3cc444d62849253cbc0c6713 |
| **Author** | Tokyi |
| **Date/Time** | 2026-11-03 20:12:38 |
| **Files Changed** | 2 |
| **Additions** | 15 |
| **Deletions** | 1 |
| **Net Change** | +15/-1 |
| **Merge Commit** | No |

## Restore the documents.ai_early_exit Default

Adds a SQL migration re-inserting the `documents.ai_early_exit` default that production had lost, plus one line in `docs/developer/database-reference.md` documenting it. Without the default, document creation could hit a NOT NULL or missing-default failure path in AI document analysis.

Original commit message: “Restore documents.ai_early_exit default where production dropped it”.

## Files Changed

| File | Type | + | - | Δ |
|------|------|---|---|---|
| `prisma/migrations/20261104010000_documents_ai_early_exit_default/migration.sql` | Added | 13 | 0 | +13/-0 |
| `docs/developer/database-reference.md` | Modified | 2 | 1 | +2/-1 |

### What changed per file

- **`prisma/migrations/20261104010000_documents_ai_early_exit_default/migration.sql`** — added. +13/-0 lines.
- **`docs/developer/database-reference.md`** — modified. +2/-1 lines.

## Detailed Diff Analysis

- **Files changed:** 2; **+15/-1**.
- **Areas touched:** docs/history 1 file(s), src/server/shared 0 file(s), tests 0 file(s), config/CI 0 file(s).

## Why This Change Was Needed

Bug fix / schema drift repair between migrations and production state.

## Was It Useful

Useful. Small, surgical, and targeted at a live production defect; low risk.

## Impact Analysis

New document rows get the expected AI early-exit default again; unblocks AI-document flows until the next migration reconciles properly.

## Relationship to Surrounding Commits

- **Follows:** 0896 — restore the documents.ai_early_exit default.
- Directly continues the production-stability effort from the previous branch (e9a9906).

## Confidence Notes

- **Facts** (metadata, file list, line counts, rename/binary detection) extracted directly from git for this commit.
- **Interpretation** (title, summary, motivation, verdict) was written from the diff and commit message; statements labelled as inference are not confirmed by the commit itself.
- Backfilled on 2026-11-08 as part of the history catch-up (commits 0895–0923).

## Optional Technical Details

- Renamed files: see `git show --find-renames` for this commit.
- Binary files: any non-textual entries are reported as `-` line counts by git.
- Build output (`dist/`) files: none.
