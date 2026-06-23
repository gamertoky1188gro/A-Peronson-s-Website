## Commit Metadata
- **Hash:** 0bca8b9c8d3d407780a81a6a6bee8de3c992fe7a
- **Parent:** c6b992e9a1bd4d43a2a68114bc3f987ad7ec254c
- **Author:** gamertoky1188gro
- **Date:** 2026-03-28 16:00:37
- **Message:** Highlight premium bundles

## Custom Title
Premium bundles display in admin panel and LC migration

## High-Level Summary
Added a Prisma migration for LC type fields on payment_proofs and added premium bundle highlight cards to the admin Home tab, listing features for Buyer (Premium), Factory (Premium), and Buying House (Premium).

## File-by-File Breakdown
- **prisma/migrations/20260327151037_add_lc_fields/migration.sql** — ALTER TABLE payment_proofs ADD COLUMN lc_type TEXT, usance_days INTEGER
- **src/pages/AdminPanel.jsx** — Added `premiumBundles` array with feature highlights for 3 roles, rendered as a 3-column grid of admin cards on the Home tab

## Detailed Diff Analysis
**migration.sql:** Simple schema migration adding two nullable columns.

**AdminPanel.jsx:** Defined `premiumBundles` with detailed feature lists (11 for Buyer, 23 for Factory, 23 for Buying House). Rendered in a `grid gap-4 lg:grid-cols-3` layout below the charts section on the Home tab. Each card uses `admin-card admin-sweep` classes with bullet-point feature lists.

## Why This Change
To give admins a quick view of what premium includes per role, useful for support and sales conversations.

## Was It Useful
Yes. The admin can now reference premium features without leaving the dashboard.

## Impact Analysis
- **Scope:** Minimal — static data and presentation only
- **Risk:** None

## Relationships
Accompanies the migration from the LC fields added in 156.

## Confidence Notes
High. Static data addition with straightforward rendering.
