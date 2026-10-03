# Commit 0668 — 0c511f6

| Field | Value |
|-------|-------|
| **Commit Number** | 0668 |
| **Commit Hash** | 0c511f65a6ac1cdde5414bd1a2851f7943db1df7 |
| **Parent Hash** | fa74d1b88b4c0fb89eba26ea705fa145adf1337e |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-11 20:06:21 |
| **Branch** | main |
| **Files Changed** | 1 |
| **Additions** | 10 |
| **Deletions** | 1 |
| **Net Change** | +10/-1 |

## Solid White Backdrop for Mobile Menu + Body Scroll Lock

This commit fixes two mobile menu issues in NavBar.jsx: (1) the backdrop behind the mobile menu changes from a semi-transparent dark overlay (`bg-slate-950/35 backdrop-blur-sm`) to a solid white background in light mode and solid dark in dark mode (`bg-white dark:bg-slate-950`); (2) adds body scroll locking when the mobile menu is open, preventing users from scrolling the page behind the menu.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| src/components/NavBar.jsx | Modified | 10 | 1 | +9 |

## Detailed Diff Analysis

**1. Body scroll lock useEffect:**
```javascript
useEffect(() => {
    if (mobileOpen) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
}, [mobileOpen]);
```

This effect:
- Sets `overflow: hidden` on `<body>` when menu opens → prevents background scrolling
- Restores default overflow when menu closes
- Cleanup function ensures overflow is restored on unmount (React StrictMode safety)

**2. Backdrop class change:**
```diff
- className="fixed inset-0 z-[60] bg-slate-950/35 backdrop-blur-sm md:hidden"
+ className="fixed inset-0 z-[60] bg-white dark:bg-slate-950 md:hidden"
```

The old backdrop was a semi-transparent dark overlay with blur, which allowed page content to bleed through. The new solid background fully obscures the page content behind the menu.

## Why This Change Was Needed

**Semi-transparent backdrop issue:** With `bg-slate-950/35` (35% opacity) and `backdrop-blur-sm`, page content was visible behind the mobile menu. This created visual clutter and made the menu harder to read, especially on pages with complex layouts.

**Missing scroll lock:** Without `overflow: hidden` on the body, users could scroll the page behind the open menu. This is a common UX anti-pattern — the menu should be the only scrollable content when open.

## Was It Useful

Yes — both changes are standard mobile menu best practices. The solid backdrop eliminates visual bleed-through, and the scroll lock prevents confusing background scrolling behavior.

## Impact Analysis

- **User-facing:** Mobile menu now has a clean solid background with no content bleed-through; background page no longer scrolls when menu is open
- **Desktop:** No change — `md:hidden` means this entire section is only visible on mobile
- **Risk:** Low — CSS and simple DOM manipulation, no complex logic

## Relationship to Surrounding Commits

- **Predecessor (0667):** Privacy policy text changes
- **Successor (0669):** Further refines the mobile menu panel opacity
- Part of a mobile menu polish sequence (0668 → 0669)

## Confidence Notes

The body scroll lock implementation is correct and follows best practices. The cleanup function is important for React StrictMode where components mount/unmount/mount. The backdrop change from semi-transparent to solid is a clear visual improvement.

## Optional Technical Details

- The backdrop uses `z-[60]` to sit above most content but below the menu panel (which uses a higher z-index via Framer Motion)
- `md:hidden` ensures the backdrop only renders on mobile screens
- The scroll lock is toggled via `useEffect` with `mobileOpen` dependency, which is already managed by the menu's open/close state
- The cleanup `return () => { document.body.style.overflow = ""; }` is essential for React StrictMode and navigation events
