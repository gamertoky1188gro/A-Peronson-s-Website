# Commit 677 — a575ddb

| Field | Value |
|-------|-------|
| **Commit Number** | 677 |
| **Commit Hash** | a575ddba2ecb261325b268133be0fd32ddc98f87 |
| **Parent Hash** | edc08f0ca29499d2cdf7844521b1bd82de58564c |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-12 17:55:43 |
| **Branch** | main |
| **Files Changed** | 2 |
| **Additions** | 2 |
| **Deletions** | 2 |
| **Net Change** | +2/−2 |
| **Merge Commit** | No |

## Guard Undefined `e.key` in CyberpunkCursor and Duplicate Session Message Fallback

This commit addresses a second crash vector on the login/signup pages, this time in the CyberpunkCursor component's keyboard event handler. The `keydown` listener checked `e.key.length !== 1` to filter out modifier and special keys, but on some browsers and input events, `e.key` can be `undefined` (e.g., during certain synthetic events or when focus is on non-standard elements). The fix adds an `!e.key` guard before the `.length` check.

Additionally, the session message `text` fallback from commit 676 (`m.text || ""`) is duplicated in the second location where session messages are loaded (line 196), ensuring consistency across both code paths.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| src/components/FloatingAssistant.jsx | Modified | 1 | 1 | 0 |
| src/components/ui/CyberpunkCursor.jsx | Modified | 1 | 1 | 0 |

## Detailed Diff Analysis

**CyberpunkCursor.jsx (line 44)**: Changed `if (e.key.length !== 1) return;` to `if (!e.key || e.key.length !== 1) return;`. The CyberpunkCursor tracks keyboard input to detect a hidden activation phrase ("activate cursor"). When `e.key` is `undefined`, calling `.length` on it throws a TypeError that propagates up and crashes the component tree. The `!e.key` check short-circuits before the length comparison.

**FloatingAssistant.jsx (line 196)**: The same `text: m.text || ""` fallback from commit 676 is applied to a second code path where session messages are processed (this path handles re-formatting messages from a different storage format). This ensures both message loading paths are equally guarded.

## Why This Change Was Needed

The CyberpunkCursor component registers a global `keydown` listener on mount. On the login/signup pages, this listener fires for every keypress, including synthetic events from password managers, autofill, and browser extensions — some of which dispatch events with `e.key === undefined`. Without the guard, any such event would crash the component and, because CyberpunkCursor is a global provider, potentially the entire React tree.

The duplicate session message guard ensures that regardless of which code path loads the messages, undefined text values are handled consistently.

## Was It Useful

Yes — this eliminates the second login/signup crash path. Combined with commit 676, these two fixes ensure the FloatingAssistant and CyberpunkCursor are resilient to malformed input data.

## Impact Analysis

- **Stability**: The CyberpunkCursor no longer crashes on synthetic or malformed keyboard events.
- **Consistency**: Both session message loading paths now use the same `|| ""` fallback.
- **No visual change**: The fix only adds nullish guards; behavior is identical when `e.key` is defined.

## Relationship to Surrounding Commits

This directly continues the login/signup crash fix series started in commit 676. It also touches CyberpunkCursor, which is a custom cursor component that renders globally — making this fix especially important since a crash here would affect every page, not just login/signup.

## Confidence Notes

- The `!e.key` check is a standard nullish guard. `e.key` being undefined is a known edge case in the DOM KeyboardEvent spec for certain synthetic events.
- The CyberpunkCursor's `onKeyDown` handler already checks `e.repeat`, `e.ctrlKey`, `e.metaKey`, and `e.altKey` — the `!e.key` check is the logical first guard in the chain.

## Optional Technical Details

- The CyberpunkCursor uses a sliding buffer pattern: it accumulates keystrokes into a string buffer and checks if the buffer ends with the activation phrase. The `e.key.length !== 1` check filters out non-character keys (Shift, Control, etc.) which have longer key names. Undefined `e.key` would bypass this filter and attempt to append `undefined` to the buffer, corrupting the detection logic even if it didn't crash.
- The `clearTimeout(timer); timer = setTimeout(resetBuffer, 1500)` pattern means the buffer resets after 1.5 seconds of inactivity, so a corrupted buffer would eventually self-heal — but only if the component survived the initial crash.
