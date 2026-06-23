## Commit Metadata
| Field | Value |
|-------|-------|
| **Hash** | `0cebd432e07adbb35c5c5b7afdf91a5b1927915a` |
| **Parent** | `902d69a646ec97ab96bb701effea5fc386182ae1` |
| **Author** | gamertoky1188gro |
| **Date** | 2026-06-05 12:35:05 +0600 |
| **Subject** | Strip advanced filters from search params for free users to prevent backend rejection |
| **Sequence** | 0526 |

## Custom Title
Strip Advanced Filters from Search Params for Free Users

## High-Level Summary
One file changed (5 insertions, 3 deletions). In `SearchResults.jsx`, adds a check within `buildSearchParams`: if the user is not premium, skip adding `season`, `machinery`, and `stockStatus` to the URL params.

## File-by-File Breakdown
- **src/pages/SearchResults.jsx** (8 lines changed)
  - Wrapped the three advanced filter param additions in `if (isPremium) { ... }`

## Detailed Diff Analysis
Previously, the advanced filter values were always added to the search params regardless of subscription status, which could cause the backend to reject them. Now, only premium users have these params included.

## Why This Change
Backend enforcement requires that free users don't send advanced filter params. This frontend change prevents the backend from rejecting search requests from free users who might have these filters set.

## Was It Useful
Yes — prevents silent search failures for free users.

## Impact Analysis
Medium. Changes search behavior for free users.

## Relationships
Follows 0525 (disabled UI), precedes 0527 (broader enforcement using ADVANCED_FILTER_KEYS).

## Confidence Notes
High.
