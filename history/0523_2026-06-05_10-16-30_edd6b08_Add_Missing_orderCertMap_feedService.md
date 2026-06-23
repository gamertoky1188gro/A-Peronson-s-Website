## Commit Metadata
| Field | Value |
|-------|-------|
| **Hash** | `edd6b083291a37f349035be398b12475c803bc95` |
| **Parent** | `3282a7d9f785826f721b433fe97ffcdf3b884a36` |
| **Author** | gamertoky1188gro |
| **Date** | 2026-06-05 10:16:30 +0600 |
| **Subject** | Add missing orderCertMap to feedService Promise.all |
| **Sequence** | 0523 |

## Custom Title
Add Missing orderCertMap to feedService Promise.all

## High-Level Summary
One file changed (2 insertions, 1 deletion). Adds `getOrderCertificationMap()` to the `Promise.all` call in `feedService.js`.

## File-by-File Breakdown
- **server/services/feedService.js** (3 lines changed)
  - Added `orderCertMap` to the destructuring from `Promise.all`
  - Added `getOrderCertificationMap()` to the Promise.all array

## Detailed Diff Analysis
The `Promise.all` was missing the `getOrderCertificationMap()` call, which provides order certification data needed for feed rendering. The variable `orderCertMap` was used later in the function but never defined, causing a runtime error.

## Why This Change
Missing Promise in the parallel data fetching caused a `ReferenceError` when the code tried to use `orderCertMap`.

## Was It Useful
Yes — critical fix. The feed endpoint would crash without this.

## Impact Analysis
Medium. Fixes the feed service. The `orderCertMap` data would have been missing from feed responses.

## Relationships
Hotfix following the Prisma migration (0518).

## Confidence Notes
High.
