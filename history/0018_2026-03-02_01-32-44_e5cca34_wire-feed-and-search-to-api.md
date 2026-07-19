# Commit 0018: Wire Feed and Search Pages to Live API Data

## Commit Metadata

| Field             | Value                                      |
| ----------------- | ------------------------------------------ |
| **Commit Number** | 0018                                       |
| **Commit Hash**   | `e5cca345d3120ff5899e47a2881247b53745800c` |
| **Parent Hash**   | `5de6103` (0017)                           |
| **Author**        | Cyber Code Master                          |
| **Date/Time**     | 2026-03-02 01:32:44 (+0600)                |
| **Files Changed** | 2                                          |
| **Additions**     | 421                                        |
| **Deletions**     | 189                                        |
| **Net Change**    | +232 lines                                 |
| **Merge Commit**  | No                                         |

## Custom Title

**Connect MainFeed and SearchResults to Live Backend API**

## High-Level Summary

Rewrites `MainFeed.jsx` and `SearchResults.jsx` to fetch live data from the backend API instead of using hardcoded sample data. Adds API helper functions, feed item normalization, and loading/error states. This is a significant step toward making the app functional with real data.

## Key Changes

**`src/pages/MainFeed.jsx`** (+290/-59):

- Added API helper with JWT auth token support
- `normalizeFeedItem()` function to handle various API response formats
- `toArray()` helper to extract arrays from nested API responses
- `formatRelativeTime()` for human-readable timestamps
- Feed now fetches from `/api/feed?type=all&unique=false`
- Like, comment, share buttons still UI-only

**`src/pages/SearchResults.jsx`** (+320/-99):

- Same API helper and normalization
- Search queries fetch from `/api/feed?type=buyer_request&category=...`
- Results displayed from API data instead of hardcoded samples
- Filter sidebar updated to work with dynamic data

## Why

To move the application from a static prototype to a functional MVP with real data. The feed and search were the most important pages for user engagement.

## Relationship

This commit will be merged via PR in commit 0019.
