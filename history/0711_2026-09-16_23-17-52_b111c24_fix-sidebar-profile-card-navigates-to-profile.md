# Commit 0711 — b111c24

| Field | Value |
|-------|-------|
| **Commit Number** | 0711 |
| **Commit Hash** | b111c24bb1b51e199ad5763d20eff4a77d9863f2 |
| **Parent Hash** | 6d0e74274196448cb2bf375e2295970bfac3a7ce |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-16 23:17:52 |
| **Branch** | main |
| **Files Changed** | 1 |
| **Additions** | 38 |
| **Deletions** | 30 |
| **Net Change** | +38/-30 |

## Fix: Clicking Profile Card in Sidebar Navigates to User's Profile Page

This commit makes the user profile card (avatar, name, role, bio) in both the mobile and desktop sidebars of `MainFeed.jsx` clickable, navigating to the user's role-based profile page. Previously the card was a static `<div>` with no interactivity. A new `profileUrl(user)` helper generates the correct URL based on the user's role.

## Files Changed

| File | Type | + | - | Delta |
|------|------|---|---|---|
| `src/pages/MainFeed.jsx` | Modified | 38 | 30 | +8 |

## Detailed Diff Analysis

1. **New helper function `profileUrl(user)`:**
   - Takes a user object, returns `/feed` as fallback if no `user.id`.
   - Role `buyer` -> `/buyer/{id}`.
   - Role `buying_house` -> `/buying-house/{id}`.
   - All other roles -> `/factory/{id}`.

2. **Mobile sidebar:**
   - The `<div>` wrapping the profile header (gradient card with avatar, name, role, bio, email) is replaced with a `<Link to={profileUrl(user)} onClick={() => setSidebarOpen(false)} ...>`.
   - The `onClick` closes the mobile sidebar overlay when navigating.
   - Added `transition hover:shadow-2xl hover:shadow-sky-500/30` for visual hover feedback.
   - Removed the closing `</div>` and replaced with `</Link>`.

3. **Desktop sidebar:**
   - Same change: the `<div>` wrapping the profile header becomes `<Link to={profileUrl(user)} ...>`.
   - Added `block` display and `transition hover:shadow-2xl hover:shadow-sky-500/30`.
   - Closing `</div>` replaced with `</Link>`.

## Why This Change Was Needed

The profile card in the sidebar displayed the user's name, role, avatar, and bio but was not interactive. Users expected clicking on their profile card would take them to their profile page, which is a standard UX pattern. Without this, users had to navigate to their profile through other means (e.g., the settings page).

## Was It Useful

Yes. This is a standard UX improvement. Profile cards in sidebars are universally expected to be clickable links to the user's profile. The hover effect (shadow increase) provides clear visual feedback that the element is interactive.

## Impact Analysis

- **UX:** Users can now navigate to their profile from the feed sidebar with a single click.
- **Mobile:** The sidebar closes on navigation, preventing the common issue of navigating while the overlay is still open.
- **No regressions:** The card's visual appearance is identical except for the hover shadow effect.

## Relationship to Surrounding Commits

- **Preceded by:** Commit 0710 (public shared post pages) -- new feature.
- **Followed by:** Commit 0712 (Unique toggle fix) -- feed functionality fix.

## Confidence Notes

- The `profileUrl` function handles all known roles (`buyer`, `buying_house`, and a fallback `factory` for all others).
- The `block` display on the `<Link>` ensures the entire card area is clickable, not just the text.
- The `onClick={() => setSidebarOpen(false)}` on the mobile link prevents the sidebar from staying open after navigation.

## Optional Technical Details

- The role-to-URL mapping uses `encodeURIComponent` on the user ID, which is good practice but likely unnecessary for UUIDs.
- The desktop sidebar does not have a close handler because it is always visible (not an overlay).
