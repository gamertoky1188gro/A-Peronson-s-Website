## Commit Metadata

| Field        | Value                                                          |
| ------------ | -------------------------------------------------------------- |
| **Hash**     | `1bc727d37d48239bf49d97ce8ac3b1cc35b11009`                     |
| **Parent**   | `5fba9f678991dde83bd49dc3d5db85209e37fccb`                     |
| **Author**   | gamertoky1188gro                                               |
| **Date**     | 2026-06-05 01:16:05 +0600                                      |
| **Subject**  | Remove duplicate retentionMs in buildPlatformAnalyticsSnapshot |
| **Sequence** | 0520                                                           |

## Custom Title

Remove Duplicate retentionMs Logic in buildPlatformAnalyticsSnapshot

## High-Level Summary

One file changed (1 insertion, 14 deletions). In `analyticsService.js`, removes a duplicate implementation of `retentionMs` calculation and the associated filtering of `requirementsRows` and `eventRows` by retention cutoff.

## File-by-File Breakdown

- **server/services/analyticsService.js** (15 lines changed)
  - Removed 14 lines that calculated `retentionMs`, `retentionCutoff`, and filtered `requirementsRows`/`eventRows`
  - Now simply returns `{ usersById, requirementsRows: requirements, eventRows: events }` directly

## Detailed Diff Analysis

The `buildPlatformAnalyticsSnapshot` function had leftover code from the jsonStore era that filtered rows by retention period. The Prisma migration (0518) replaced the underlying data source but left this duplicate filtering logic. This commit removes the dead code.

## Why This Change

Dead code removal. The retention filtering was redundant after the Prisma migration.

## Was It Useful

Yes — cleanup and prevents potential double-filtering of analytics data.

## Impact Analysis

Low. Removes dead code. Analytics behavior should be unchanged (filtering was already happening at the Prisma query level).

## Relationships

Hotfix/cleanup for the Prisma migration (0518).

## Confidence Notes

High.
