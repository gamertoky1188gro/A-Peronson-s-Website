# Commit 0484

## Commit Metadata
- **Hash**: `c4022d1ed6da8ac3a5d8268a55da25a2000b8200`
- **Parent**: `d56f00a266b9bbb1bc8a26e7888e9401f6e4918b`
- **Author**: gamertoky1188gro
- **Date**: 2026-05-30 15:49:08
- **Message**: Show chevron-left back button on all pages except homepage

## High-Level Summary
Changed the NavBar back button to show on all pages (not just mobile) except the homepage. Previously it was hidden on desktop (md:hidden).

## File-by-File Breakdown
| File | Status | Insertions | Deletions |
|------|--------|-----------|-----------|
| src/components/NavBar.jsx | modified | 9 | 7 |

## Detailed Diff Analysis
- Removed md:hidden class from back button
- Wrapped button in conditional: {location.pathname !== "/" && (...)}

## Why This Change
Back navigation was only available on mobile. Now consistently visible on all viewport sizes except homepage.

## Was It Useful
Yes — improves navigation UX across the app.

## Impact Analysis
Low. Single conditional change in NavBar.

## Relationships
Standalone UX improvement.

## Confidence Notes
High.