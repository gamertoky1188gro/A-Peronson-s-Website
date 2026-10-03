# Commit 0709 — 40000a5

| Field | Value |
|-------|-------|
| **Commit Number** | 0709 |
| **Commit Hash** | 40000a521b0a399eb824b8789d2b7603049065ed |
| **Parent Hash** | 5e284d29775659e3de52114af6043d665e493d05 |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-16 21:56:55 |
| **Branch** | main |
| **Files Changed** | 1 |
| **Additions** | 1 |
| **Deletions** | 104 |
| **Net Change** | +1/-104 |

## Fix: Remove Filters Button and Category Filter Panel from Feed -- Tabs Provide Correct Filtering

This commit removes the entire category-based filter system from `MainFeed.jsx`, including the Filters button, the collapsible filter panel, the `FEED_CATEGORIES` constant, the `filtersOpen` state, the `filtersPanelRef`, and the click-outside listener. The tab system (All / Buyer Requests / Company Products / Posts) already provides the necessary filtering, making the separate category panel redundant and confusing.

## Files Changed

| File | Type | + | - | Delta |
|------|------|---|---|---|
| `src/pages/MainFeed.jsx` | Modified | 1 | 104 | -103 |

## Detailed Diff Analysis

1. **Import removed:** `Filter` icon from lucide-react no longer needed.
2. **Constant removed:** `FEED_CATEGORIES` array (8 category strings: "All categories", "T-Shirt", "Polo", etc.).
3. **State removed:** `const [filtersOpen, setFiltersOpen] = useState(false)`.
4. **Ref removed:** `const filtersPanelRef = useRef(null)`.
5. **Effect removed:** The `useEffect` that registered a `mousedown` listener for click-outside-to-close behavior on the filter panel.
6. **Mobile sidebar:** Removed the "Categories" section (a `rounded-[28px]` card with `Pill` buttons for each category).
7. **Desktop sidebar:** Removed the identical "Categories" section from the desktop sidebar.
8. **Tabs section:** Changed comment from `{/* Tabs & Filters */}` to `{/* Tabs */}`.
9. **Filters button:** Removed the entire `<button>` that toggled `filtersOpen`, including its `Filter` icon and "Filters" label.
10. **Filter panel:** Removed the entire conditional `{filtersOpen && (...)}` block containing the category pill grid.

## Why This Change Was Needed

The feed had two overlapping filtering mechanisms: the tab bar (All / Buyer Requests / Company Products / Posts) and a category filter panel (T-Shirt, Polo, Denim, etc.). The tabs already filter by the correct entity types, and the category panel was not properly integrated with the data fetching -- it set `activeCategory` but the API did not use this parameter for server-side filtering. This created confusion where users expected category filtering to work but it did not actually change the results. Removing the redundant panel simplifies the UI.

## Was It Useful

Yes. Removing a non-functional filter that appears to work (clicking categories changes the active pill) but does not actually filter results is a significant UX improvement. Users are no longer misled into thinking they can filter by garment category.

## Impact Analysis

- **Code reduction:** 103 net lines removed, making the component significantly simpler.
- **UX clarity:** One clear filtering mechanism (tabs) instead of two overlapping ones.
- **No functional regression:** The removed filter was not functional at the API level.

## Relationship to Surrounding Commits

- **Preceded by:** Commit 0708 (account lock enforcement) -- security feature.
- **Followed by:** Commit 0710 (public shared post pages) -- major new feature.

## Confidence Notes

- The `Filter` icon import is removed cleanly; no other code in the file references it after this change.
- The `FEED_CATEGORIES` constant is only used in the removed sections.
- The `activeCategory` state variable is still used elsewhere (sidebar category pills in the feed config), so it is not removed.

## Optional Technical Details

- The `FEED_CATEGORIES` were hardcoded strings, not dynamically generated from the API. This further suggests the category filter was a UI prototype that was never fully wired up.
- The tab-based filtering uses `feedType` parameter in the API call, which the backend actually filters on.
