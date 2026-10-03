# Commit 0662 — 434285e

| Field | Value |
|-------|-------|
| **Commit Number** | 0662 |
| **Commit Hash** | 434285ebbdd779a5cf37edcf5bf3cba9a9807986 |
| **Parent Hash** | e772eb66bb263b142bc3a41a8be2aa2b458d5691 |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-11 17:38:15 |
| **Branch** | main |
| **Files Changed** | 1 |
| **Additions** | 29 |
| **Deletions** | 2 |
| **Net Change** | +29/-2 |
| **Merge Commit** | No |

## close-assistant-panel-on-mobile-back-button

Implements browser history integration for the FloatingAssistant panel so that the mobile back button closes the panel instead of navigating away from the page. The implementation uses `history.pushState` / `popstate` events with a `didPushRef` guard to prevent stale history entries.

**How it works:**
1. **Opening the panel** (`openPanel`): Calls `history.pushState({ assistantOpen: true }, "")` to push a history entry, then sets `didPushRef.current = true` and `setOpen(true)`. This means when the user opens the assistant, a new history entry is created.
2. **Closing the panel** (`closePanel`): Sets `setOpen(false)`. If `didPushRef.current` is true (meaning we pushed an entry when opening), it sets the ref to false and calls `history.back()` to navigate back — which triggers the `popstate` event.
3. **Back button handling** (`popstate` listener): A `useEffect` registers a `popstate` event listener. When the browser back button is pressed and `didPushRef.current` is true, it sets the ref to false and closes the panel. This handles the case where the user presses the native back button instead of the X button.
4. **Toggle button**: Changed from `onClick={() => setOpen(!open)}` to `onClick={() => (open ? closePanel() : openPanel())}` — opening pushes history, closing pops it.
5. **X button**: Changed from `onClick={() => setOpen(false)}` to `onClick={closePanel}` — ensures the history entry is properly cleaned up.

The `didPushRef` guard prevents a race condition: if the user opens the panel, closes it via the X button (which calls `history.back()`), and then the `popstate` event fires, the ref is already false so the panel stays closed instead of toggling.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| src/components/FloatingAssistant.jsx | edit | 29 | 2 | +27 |

## Detailed Diff Analysis

**New state and refs:**
- `const didPushRef = useRef(false)` — tracks whether we pushed a history entry when opening the panel.

**New effects:**
- `useEffect` with `popstate` listener — registered once on mount, cleans up on unmount. When `popstate` fires and `didPushRef.current` is true, sets it to false and closes the panel.

**New callbacks:**
- `openPanel` — wrapped in `useCallback` (empty deps, stable reference). Pushes history state, sets ref, opens panel.
- `closePanel` — wrapped in `useCallback` (empty deps, stable reference). Closes panel, conditionally calls `history.back()`.

**Changed button handlers:**
- Toggle button: `onClick={() => (open ? closePanel() : openPanel())}` — symmetric open/close with history management.
- X button: `onClick={closePanel}` — ensures history cleanup on manual close.

## Why This Change Was Needed

On mobile, users expect the back button to close overlays/panels, not navigate away from the page. Without history integration, pressing back while the assistant panel is open would navigate to the previous page, losing the user's context.

## Was It Useful

Yes. This is a standard mobile UX pattern — any full-screen or prominent overlay should integrate with browser history. Without it, the assistant panel felt broken on mobile.

## Impact Analysis

- **Mobile UX:** Back button now closes the assistant panel as expected.
- **Desktop UX:** No change — the back button behavior is the same, just through the history API.
- **History stack:** Each panel open adds one entry; each close removes it. No stale entries accumulate.
- **Risk:** Low. The `didPushRef` guard prevents double-back or stale entry issues.

## Relationship to Surrounding Commits

This is part of the mobile UX improvement series (0660-0664). The zoom fix (0660) addressed visual scaling; this commit addresses navigation behavior.

## Confidence Notes

- The `popstate` event is the standard browser API for detecting back/forward navigation.
- `history.pushState` doesn't trigger a page reload — it only updates the URL bar and history stack.
- The `didPushRef` pattern is a common solution for preventing stale history entries in React SPAs.

## Optional Technical Details

- `history.pushState({ assistantOpen: true }, "")` — the state object is stored but not actively used; it serves as a marker that this history entry was created by the assistant panel.
- `history.back()` is equivalent to `window.history.back()` — it navigates to the previous entry in the history stack, which triggers the `popstate` event.
- The `useCallback` wrappers with empty dependency arrays ensure `openPanel` and `closePanel` have stable references across renders, preventing unnecessary re-renders of child components.
