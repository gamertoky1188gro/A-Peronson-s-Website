# Commit 0712 — 01a0ffb

| Field | Value |
|-------|-------|
| **Commit Number** | 0712 |
| **Commit Hash** | 01a0ffbebf8d7bbba72946dffe16f95b23b39649 |
| **Parent Hash** | b111c24bb1b51e199ad5763d20eff4a77d9863f2 |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-16 23:22:59 |
| **Branch** | main |
| **Files Changed** | 1 |
| **Additions** | 13 |
| **Deletions** | 4 |
| **Net Change** | +13/-4 |

## Fix: Unique OFF/ON Toggle Now Works -- Removed from Tabs, Added as Proper Toggle Button

This commit fixes the "Unique" filtering toggle in the feed. Previously, "Unique OFF" was a tab entry that, when clicked, set `activeType` to "Unique OFF" and then the API call logic checked for this string to set `feedType = "all"` -- an indirect and fragile mechanism. The fix removes "Unique OFF" from the tabs array and adds a dedicated toggle button that directly sets the `unique` boolean state, providing clear visual feedback (green when ON, outlined when OFF).

## Files Changed

| File | Type | + | - | Delta |
|------|------|---|---|---|
| `src/pages/MainFeed.jsx` | Modified | 13 | 4 | +9 |

## Detailed Diff Analysis

1. **TABS constant:** Removed `"Unique OFF"` from both `TABS` array and `DEFAULT_FEED_CONFIG.tabs`.
2. **API call logic:** Removed the `else if (activeType === "Unique OFF") { feedType = "all"; }` branch from the feed loading function.
3. **New toggle button:** Added after the tab pills in the Tabs section:
   - A `<button>` with `onClick={() => setUnique((v) => !v)}` that toggles the `unique` state.
   - Visual styling: green background (`bg-emerald-500 text-white`) when `unique` is true, outlined border style when false.
   - Label shows "Unique ON" or "Unique OFF" depending on state.
   - Responsive sizing matching the tab pills.

## Why This Change Was Needed

The previous "Unique OFF" tab was semantically incorrect -- it was a toggle disguised as a tab, mixing filtering modes (entity types) with a display option (unique filter). When clicked, it set `activeType` to a non-standard value that had to be special-cased in the API call. This was fragile and confusing: users saw "Unique OFF" as a tab alongside "All", "Buyer Requests", etc., which broke the mental model of what tabs represent.

## Was It Useful

Yes. Separating the toggle from the tabs makes the UI more intuitive. Users can now filter by entity type (tabs) and toggle unique mode independently. The toggle button provides clear visual state (green = active, outlined = inactive).

## Impact Analysis

- **UX clarity:** Tabs now represent entity types only; the unique filter is a separate, clearly labeled control.
- **Code simplification:** Removes a special-case branch in the API call logic.
- **No functional regression:** The `unique` state variable was already being used in the API call; this just changes how it is toggled.

## Relationship to Surrounding Commits

- **Preceded by:** Commit 0711 (profile card navigation) -- UX improvement.
- **Followed by:** Commit 0713 (search page mobile responsiveness) -- responsive fixes.

## Confidence Notes

- The `setUnique` function was already defined in the component; this commit just wires it to a new button.
- The `TABS` array is used for rendering tab pills and for API call logic. Removing "Unique OFF" from both locations ensures consistency.
- The toggle button is placed after the tab pills, visually separating it from the entity type tabs.

## Optional Technical Details

- The `unique` state was previously toggled by a hidden mechanism (the "Unique OFF" tab). Now it has a dedicated UI control.
- The button uses `type="button"` to prevent form submission if nested in a form.
