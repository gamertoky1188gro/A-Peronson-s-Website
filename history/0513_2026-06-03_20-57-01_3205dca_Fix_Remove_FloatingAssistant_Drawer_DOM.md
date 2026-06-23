## Commit Metadata
| Field | Value |
|-------|-------|
| **Hash** | `3205dca0dff2b9fd6fe2e1d193f7cd064e95c957` |
| **Parent** | `6e6e0c097a4a64815c5ef2afdc76fbc9b73d5244` |
| **Author** | gamertoky1188gro |
| **Date** | 2026-06-03 20:57:01 +0600 |
| **Subject** | fix: remove FloatingAssistant drawer from DOM when closed (caused overflow); remove non-standard zoom property |
| **Sequence** | 0513 |

## Custom Title
Fix: Remove FloatingAssistant Drawer from DOM When Closed; Remove Non-Standard Zoom Property

## High-Level Summary
One file changed (3 insertions, 6 deletions). In FloatingAssistant.jsx, replaces a `SlideIn` wrapper that always rendered the drawer (hidden via translate class) with a conditional render (`{open ? ... : null}`). Also removes the non-standard CSS `zoom` property from the drawer's container.

## File-by-File Breakdown
- **src/components/FloatingAssistant.jsx** (9 lines changed)
  - Removed `import SlideIn` (no longer needed)
  - Replaced `<SlideIn direction="up" ...><div className="...translate-x-full ...">` with `{open ? <div ...> ... </div> : null}`
  - Removed `zoom` property from drawer container styles

## Detailed Diff Analysis
Previously the drawer panel was always in the DOM but translated off-screen via `translate-x-full`. This meant its content still contributed to the page width, causing overflow. The fix conditionally removes it from the DOM entirely when closed, eliminating the overflow contribution.

## Why This Change
The drawer's off-screen content was causing horizontal overflow. Removing it from the DOM when closed fixes this at the source.

## Was It Useful
Yes — eliminated a key source of horizontal overflow.

## Impact Analysis
Low to medium. Changes the render behavior of the floating assistant drawer. If the SlideIn animation was providing an entrance effect, that's now lost, but the open/close transition is handled by framer-motion on the button.

## Relationships
Part of the overflow fix series (0511-0516).

## Confidence Notes
High.
