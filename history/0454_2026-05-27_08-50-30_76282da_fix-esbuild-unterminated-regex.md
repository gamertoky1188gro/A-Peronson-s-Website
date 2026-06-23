# 0454 — fix: esbuild unterminated regex in smart match pill

**Commit:** `76282daa44a177343cd094f8be85cc8438687900`
**Parent:** `65773609c875b11e2fd68f15c4da7ce7b4c5d16c`
**Author:** gamertoky1188gro
**Date:** 2026-05-27 08:50:30 +0000

## High-Level Summary
Fixes an esbuild "unterminated regex" error by changing the template literal syntax for the smart match pill endpoint URL. The `{"{id}"}` syntax was being interpreted as a regex literal by esbuild.

## File-by-File Breakdown
| File | Change |
|------|--------|
| `src/pages/BuyerRequestManagement.jsx` | 1 insertion, 1 deletion |

## Detailed Diff Analysis
```diff
- <Pill className="bg-white/5 text-slate-300">GET /api/requirements/{"{id}"}/matches</Pill>
+ <Pill className="bg-white/5 text-slate-300">GET /api/requirements/{'{id}'}/matches</Pill>
```

## Why This Change
`{"{id}"}` inside JSX was being parsed as a regex (`/{id}/`) by esbuild's JSX parser, causing a build failure. Wrapping the braces in a string expression `{'{id}'}` avoids this conflict.

## Was It Useful
Critical — the build would fail without this fix.

## Impact Analysis
**Low.** Single character change in JSX expression syntax.

## Relationships
Hotfix for 0450's introduction of the API endpoint pills (which were mostly removed in 0451, but this one survived).

## Confidence Notes
High — clear esbuild parsing issue.
