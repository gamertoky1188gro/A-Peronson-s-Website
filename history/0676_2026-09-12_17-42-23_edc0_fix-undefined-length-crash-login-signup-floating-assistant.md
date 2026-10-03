# Commit 676 — edc08f0

| Field | Value |
|-------|-------|
| **Commit Number** | 676 |
| **Commit Hash** | edc08f0ca29499d2cdf7844521b1bd82de58564c |
| **Parent Hash** | cdd6631fc7c17453cfaa458965e98272db41d8f6 |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-12 17:42:23 |
| **Branch** | main |
| **Files Changed** | 1 |
| **Additions** | 2 |
| **Deletions** | 2 |
| **Net Change** | +2/−2 |
| **Merge Commit** | No |

## Guard Against Undefined `.length` in FloatingAssistant Session Messages

This commit fixes a runtime crash that occurred on the login and signup pages when the FloatingAssistant component attempted to render session messages. The root cause was two-fold: the `TypewriterText` component accessed `text.length` without first verifying that `text` was defined, and the session message mapper assigned `m.text` directly without a fallback for undefined values. Both were patched with simple nullish guards.

The crash manifested as `TypeError: Cannot read properties of undefined (reading 'length')` in the TypewriterText effect, which would unmount the entire FloatingAssistant and leave users on login/signup without the assistant widget. The fix ensures that the assistant gracefully handles missing or malformed session data.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| src/components/FloatingAssistant.jsx | Modified | 2 | 2 | 0 |

## Detailed Diff Analysis

**Line 84 (TypewriterText)**: Changed `if (index < text.length)` to `if (text && index < text.length)`. This adds a truthy check on `text` before accessing `.length`, preventing the TypeError when the component receives an undefined or null text prop. The typewriter effect simply does nothing when text is falsy.

**Line 171 (session message formatter)**: Changed `text: m.text` to `text: m.text || ""`. When mapping stored session messages from localStorage, if a message object has an undefined `text` field (which can happen with corrupted storage or older session formats), it now falls back to an empty string instead of passing `undefined` downstream to TypewriterText.

## Why This Change Was Needed

The FloatingAssistant persists chat messages to localStorage as session data. On the login/signup pages, the assistant is mounted fresh without an authenticated user context, and the session messages loaded from storage may contain objects with missing `text` fields (e.g., from a previous version that stored messages differently, or from messages that were partially written before a crash). Without the guard, the component would crash immediately on mount.

## Was It Useful

Yes — this was a crash-level bug that affected every new visitor to the login/signup pages who had stale session data in their browser. The fix is minimal and correct.

## Impact Analysis

- **Stability**: Login and signup pages no longer crash when the FloatingAssistant loads corrupted session data.
- **User experience**: The assistant widget now loads reliably on all entry points, even with stale localStorage.
- **Zero visual change**: The fix only adds defensive checks; no UI behavior changes when data is valid.

## Relationship to Surrounding Commits

This is the first of two commits addressing login/signup crashes. Commit 677 immediately follows with a similar guard in CyberpunkCursor for `e.key` being undefined. Together they represent a systematic audit of the component tree that renders on unauthenticated pages.

## Confidence Notes

- The `|| ""` fallback is safe because TypewriterText already handles empty strings gracefully (the loop condition `index < text.length` is immediately false for empty strings).
- The `text &&` guard in TypewriterText is a standard defensive pattern; it means the typewriter animation simply won't start until text is provided.

## Optional Technical Details

- The session message format is `{ role: "user"|"assistant", text: string, isNew: boolean }`. The `text` field was always expected to be a string, but the persistence layer didn't enforce this schema.
- The TypewriterText component uses a `useState`/`useEffect` pair with a `setTimeout` loop; accessing `.length` on `undefined` would throw synchronously inside the effect, which React catches and surfaces as an unhandled error boundary or blank screen.
