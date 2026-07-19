## Commit Metadata

| Field        | Value                                             |
| ------------ | ------------------------------------------------- |
| **Hash**     | `a8f2ee51f824e0ffc8cdffb25a42518574cceed7`        |
| **Parent**   | `1c85f3beaa8a96c5ed5fd882ac9371cc42586a76`        |
| **Author**   | gamertoky1188gro                                  |
| **Date**     | 2026-06-03 19:47:53 +0600                         |
| **Subject**  | fix: prevent horizontal overflow across all pages |
| **Sequence** | 0511                                              |

## Custom Title

Fix: Prevent Horizontal Overflow Across All Pages

## High-Level Summary

Seven files changed (14 insertions, 7 deletions). Adds `overflow-x-hidden` and `max-width: 100vw` CSS at multiple levels (Tailwind base layer, App.jsx shell, NavBar, individual page components) to prevent horizontal scrollbars across the application.

## File-by-File Breakdown

- **src/tailwind.css** (7 lines) — Added `@layer base { html, body { overflow-x: hidden; max-width: 100vw; } }`
- **src/App.jsx** (2 lines) — Added `maxWidth: "100vw"` to the app-shell style; added `overflow-x-hidden` to `<main>`
- **src/components/NavBar.jsx** (1 line) — Added `max-w-[calc(100vw-2rem)]` to the search input
- **src/components/chat/AttachmentPreviewModal.jsx** (1 line) — Changed `overflow-auto` to `overflow-x-auto` on spreadsheet container
- **src/pages/BuyerRequestManagement.jsx** (1 line) — Changed `overflow-hidden` to `overflow-x-auto` on table wrapper
- **src/pages/OwnerDashboard.jsx** (1 line) — Added `overflow-x-hidden` to the flex container
- **src/pages/admin/sections/AdminPlatformSection.jsx** (1 line) — Changed `overflow-hidden` to `overflow-x-auto` on table wrapper

## Detailed Diff Analysis

The fix targets overflow at multiple levels: HTML base styles, React root wrapper, the main app shell, the navbar search input, and individual page tables/containers. The common pattern was that tables and fixed-width elements were causing horizontal scrollbars, especially when combined with the zoom wrapper.

## Why This Change

Horizontal overflow was appearing on various pages, causing an unsightly horizontal scrollbar and broken layouts on narrower viewports.

## Was It Useful

Yes — essential UX fix. Horizontal overflow is a common issue with zoomed layouts.

## Impact Analysis

Medium. Affects all pages at the global CSS level. Could interfere with intentional overflow (e.g., dropdown menus), but the inline approach targets specific elements.

## Relationships

First of a series of overflow fixes (0511-0516). Followed immediately by 0512 which refines the approach.

## Confidence Notes

High.
