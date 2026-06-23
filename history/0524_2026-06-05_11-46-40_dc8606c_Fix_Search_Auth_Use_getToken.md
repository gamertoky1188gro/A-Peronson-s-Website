## Commit Metadata
| Field | Value |
|-------|-------|
| **Hash** | `dc8606c0f25b901da616aeaac5ba88f2b09b3a0e` |
| **Parent** | `edd6b083291a37f349035be398b12475c803bc95` |
| **Author** | gamertoky1188gro |
| **Date** | 2026-06-05 11:46:40 +0600 |
| **Subject** | Fix search auth: use getToken() instead of wrong localStorage key 'sessionToken' |
| **Sequence** | 0524 |

## Custom Title
Fix Search Auth: Use getToken() Instead of Wrong localStorage Key

## High-Level Summary
One file changed (2 insertions, 5 deletions). In `SearchResults.jsx`, replaces a manual `localStorage.getItem("sessionToken")` call with the proper `getToken()` utility function from `auth.js`.

## File-by-File Breakdown
- **src/pages/SearchResults.jsx** (7 lines changed)
  - Added `getToken` to the import from `../lib/auth`
  - Replaced 4 lines of `useMemo` that manually read `localStorage` with a single line: `const token = useMemo(() => getToken(), []);`

## Detailed Diff Analysis
The old code read the token directly from localStorage using the key `"sessionToken"`. The `getToken()` function handles the actual key name and fallback logic, which may differ. This was likely a leftover from before the auth utility was created.

## Why This Change
The localStorage key for the session token may not be `"sessionToken"` (it might be stored under a different key or in a different format). Using `getToken()` ensures consistency with the rest of the app.

## Was It Useful
Yes — fixes potential authentication failures in search if the token key was wrong.

## Impact Analysis
Medium. Fixes search authentication. Affects all search requests.

## Relationships
Part of the search feature development series (0524-0540).

## Confidence Notes
High.
