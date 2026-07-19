## Commit Metadata

| Field        | Value                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| **Hash**     | `197490d9cf2eb1fe525b34147e402d8ca3f767b3`                                                                       |
| **Parent**   | `f1a88c4070ce2101e7041bfa02ad0cb297f02606`                                                                       |
| **Author**   | gamertoky1188gro                                                                                                 |
| **Date**     | 2026-06-03 22:35:19 +0600                                                                                        |
| **Subject**  | fix: feed page full height on desktop (flex-1 chain instead of min-h-screen); compensate zoom with min-h-[125vh] |
| **Sequence** | 0516                                                                                                             |

## Custom Title

Fix: Feed Page Full Height on Desktop Using flex-1 Chain, Compensate Zoom with min-h-[125vh]

## High-Level Summary

Two files changed (5 insertions, 5 deletions). Changes the feed page layout from `min-h-screen` to a flex-1 chain for proper full-height behavior. Also changes the app-shell from `min-h-screen` to `min-h-[125vh]` to compensate for the 80% zoom scaling that would otherwise cause the page to be shorter than the viewport.

## File-by-File Breakdown

- **src/App.jsx** (1 line) — Changed `min-h-screen` to `min-h-[125vh]` on the app-shell div
- **src/pages/MainFeed.jsx** (8 lines) — Changed outer div from `min-h-screen` to `flex min-h-0 flex-1 flex-col`, changed inner div to `flex min-h-0 flex-1 flex-col`, changed sidebar from `h-fit` to `h-full` on desktop

## Detailed Diff Analysis

- **MainFeed.jsx**: The page now uses a flex-1 chain that fills the available height (from app-shell's 125vh). Sidebar on desktop becomes `h-full` instead of `h-fit` so it scrolls with the content. The layout properly fills the viewport even with 80% zoom.
- **App.jsx**: `min-h-[125vh]` compensates for the 0.8 zoom factor (1/0.8 = 1.25 = 125vh).

## Why This Change

The feed page wasn't filling the full viewport height on desktop due to the 80% zoom wrapper reducing effective height.

## Was It Useful

Yes — fixes the feed page layout to properly fill the screen.

## Impact Analysis

Medium. Affects feed page layout structure. The 125vh compensation is tied to the 0.8 zoom value.

## Relationships

Final commit in the overflow/zoom fix series (0511-0516). Precedes 0517 which further refines the zoom wrapper for admin routes.

## Confidence Notes

High.
