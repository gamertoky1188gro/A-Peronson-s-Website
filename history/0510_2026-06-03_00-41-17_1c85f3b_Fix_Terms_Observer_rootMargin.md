## Commit Metadata
| Field | Value |
|-------|-------|
| **Hash** | `1c85f3beaa8a96c5ed5fd882ac9371cc42586a76` |
| **Parent** | `9fec4fc01d73f3bf9e5dfe856537f070c4f1e6b4` |
| **Author** | gamertoky1188gro |
| **Date** | 2026-06-03 00:41:17 +0600 |
| **Subject** | Fix Terms observer rootMargin: -70% → -10% so section 3 and beyond become visible on scroll |
| **Sequence** | 0510 |

## Custom Title
Fix Terms.jsx: Adjust IntersectionObserver rootMargin So All Sections Become Visible

## High-Level Summary
One file changed (2 insertions, 2 deletions). Changes the IntersectionObserver `rootMargin` from `-80px 0px -70% 0px` to `-80px 0px -10% 0px` and `threshold` from `0.18` to `0.08` in Terms.jsx.

## File-by-File Breakdown
- **src/pages/Terms.jsx** (4 lines changed)
  - `threshold: 0.18` → `0.08`
  - `rootMargin: "-80px 0px -70% 0px"` → `-80px 0px -10% 0px`

## Detailed Diff Analysis
The original rootMargin of -70% bottom margin meant sections would only be marked visible when they were scrolled past 70% of the viewport height. This made sections 3+ never trigger the visibility class, so they remained invisible (opacity 0, translateY 8).

## Why This Change
Sections 3 and beyond in the Terms page were not appearing because the IntersectionObserver never triggered for them due to the overly restrictive rootMargin.

## Was It Useful
Yes — critical bug fix. Without this, half the Terms page content was invisible.

## Impact Analysis
High for the Terms page. Only changes observer parameters, no structural changes.

## Relationships
Fixes a bug introduced in 0509 (the Terms restyle).

## Confidence Notes
High.
