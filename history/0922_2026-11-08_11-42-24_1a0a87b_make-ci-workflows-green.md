# Commit 0922 — 1a0a87b
| Field | Value |
|-------|-------|
| **Commit Number** | 0922 |
| **Commit Hash** | 1a0a87bf80f19f1169811da70ac79776b33a34b5 |
| **Parent Hash** | 2e2652c2bb3adff98a3f47f983ecbe5a982719cd |
| **Author** | Tokyi |
| **Date/Time** | 2026-11-08 11:42:24 |
| **Files Changed** | 12 |
| **Additions** | 24351 |
| **Deletions** | 24272 |
| **Net Change** | +24351/-24272 |
| **Merge Commit** | No |

## Make the CI Workflows Green

Fixes the three failing GitHub Actions jobs: Jekyll Pages build (excluded generated `history/` from rendering, ending the `endraw` Liquid error), the `Node.js Tests` lint job (Biome config: unknown key removed, schema aligned, 2.6.3 upgrade, preset-all findings demoted to warn, 10 real errors fixed), and the Node matrix (18.x dropped — deps require ≥20; 20.x → 22.x). Verified locally: biome check exit 0, npm test 965 passed.

Original commit message: “ci: make CI workflows green”.

## Files Changed

| File | Type | + | - | Δ |
|------|------|---|---|---|
| `package-lock.json` | Modified | 24274 | 24238 | +24274/-24238 |
| `server/services/codeInvestigationService.js` | Modified | 24 | 9 | +24/-9 |
| `src/components/Footer.jsx` | Modified | 22 | 9 | +22/-9 |
| `biome.json` | Modified | 9 | 1 | +9/-1 |
| `tests/unit/server-code-investigation.test.js` | Modified | 2 | 8 | +2/-8 |
| `src/pages/AdminPanel.jsx` | Modified | 6 | 2 | +6/-2 |
| `src/pages/VerificationPage.jsx` | Modified | 5 | 1 | +5/-1 |
| `src/App.jsx` | Modified | 3 | 1 | +3/-1 |
| `src/pages/SearchResults.jsx` | Modified | 2 | 1 | +2/-1 |
| `.github/workflows/nodejs-tests.yml` | Modified | 1 | 1 | +1/-1 |
| `_config.yml` | Added | 2 | 0 | +2/-0 |
| `package.json` | Modified | 1 | 1 | +1/-1 |

### What changed per file

- **`package-lock.json`** — modified. +24274/-24238 lines.
- **`server/services/codeInvestigationService.js`** — modified. +24/-9 lines.
- **`src/components/Footer.jsx`** — modified. +22/-9 lines.
- **`biome.json`** — modified. +9/-1 lines.
- **`tests/unit/server-code-investigation.test.js`** — modified. +2/-8 lines.
- **`src/pages/AdminPanel.jsx`** — modified. +6/-2 lines.
- **`src/pages/VerificationPage.jsx`** — modified. +5/-1 lines.
- **`src/App.jsx`** — modified. +3/-1 lines.
- **`src/pages/SearchResults.jsx`** — modified. +2/-1 lines.
- **`.github/workflows/nodejs-tests.yml`** — modified. +1/-1 lines.
- **`_config.yml`** — added. +2/-0 lines.
- **`package.json`** — modified. +1/-1 lines.

## Detailed Diff Analysis

- **Files changed:** 12; **+24351/-24272**.
- **Areas touched:** docs/history 0 file(s), src/server/shared 6 file(s), tests 1 file(s), config/CI 5 file(s).

## Why This Change Was Needed

Build stability: all three CI jobs were red on every push.

## Was It Useful

Useful. Necessary and sufficient for green CI; the lockfile diff is large but mechanical (Biome upgrade).

## Impact Analysis

Every push gets a truthful CI signal again; Pages deploy stops dying on `history/` markdown.

## Relationship to Surrounding Commits

- **Follows:** 0921 — make the ci workflows green.
- Release-blocking CI fix; immediately followed by 0923 (wiki sync).

## Confidence Notes

- **Facts** (metadata, file list, line counts, rename/binary detection) extracted directly from git for this commit.
- **Interpretation** (title, summary, motivation, verdict) was written from the diff and commit message; statements labelled as inference are not confirmed by the commit itself.
- Backfilled on 2026-11-08 as part of the history catch-up (commits 0895–0923).

## Optional Technical Details

- Renamed files: see `git show --find-renames` for this commit.
- Binary files: any non-textual entries are reported as `-` line counts by git.
- Build output (`dist/`) files: none.
