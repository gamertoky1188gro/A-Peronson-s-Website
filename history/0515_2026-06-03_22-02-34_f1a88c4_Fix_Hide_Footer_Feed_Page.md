## Commit Metadata
| Field | Value |
|-------|-------|
| **Hash** | `f1a88c4070ce2101e7041bfa02ad0cb297f02606` |
| **Parent** | `57a804e6bd24fe72190a24955a06d99fe46e1cb2` |
| **Author** | gamertoky1188gro |
| **Date** | 2026-06-03 22:02:34 +0600 |
| **Subject** | fix: hide footer on /feed page |
| **Sequence** | 0515 |

## Custom Title
Fix: Hide Footer on /feed Page

## High-Level Summary
One file changed (1 insertion, 1 deletion). Conditionally renders the `<Footer />` component, hiding it when `location.pathname === "/feed"`.

## File-by-File Breakdown
- **src/App.jsx** (2 lines) — Changed `{!hideChrome ? <Footer /> : null}` to `{!hideChrome && location.pathname !== "/feed" ? <Footer /> : null}`

## Detailed Diff Analysis
Single-line change adding a pathname check before rendering the Footer.

## Why This Change
The feed page likely has its own layout structure where the footer is redundant or causes layout issues (especially with the zoom wrapper and full-height requirements).

## Was It Useful
Yes — removes duplicate/redundant footer on the feed page.

## Impact Analysis
Low. Only affects the /feed page. No styling changes.

## Relationships
Part of the feed layout fix series. Followed by 0516 which adjusts feed page height.

## Confidence Notes
High.
