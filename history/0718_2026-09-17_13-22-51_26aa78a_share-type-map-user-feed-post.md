# Commit 0718 — 26aa78a

| Field | Value |
|-------|-------|
| **Commit Number** | 0718 |
| **Commit Hash** | 26aa78a3016023d525eee58d6d64b64832afcd0c |
| **Parent Hash** | 71b677e801688555db7e1c43f05ef3cac31882c6 |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-17 13:22:51 |
| **Branch** | main |
| **Files Changed** | 1 |
| **Additions** | 1 |
| **Deletions** | 0 |
| **Net Change** | +1/-0 |
| **Merge Commit** | No |

## Add 'user_feed_post' to Share TypeMap to Fix Frontend-Backend Mismatch

This single-line commit fixes the root cause of the share endpoint 404 error: the frontend sends `user_feed_post` as the entity type in the share URL, but the backend `typeMap` only had `feed_post` and `post` as keys — not `user_feed_post`. The debug logging from commit 0717 revealed this mismatch, and this commit resolves it by adding the missing key.

The typeMap now includes all four variants that the frontend uses: `product` → `company_product`, `feed_post` → `user_feed_post`, `post` → `user_feed_post`, and the newly added `user_feed_post` → `user_feed_post`. This ensures that regardless of which alias the frontend sends, the correct internal feed type is resolved.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| server/services/feedService.js | Modified | 1 | 0 | +1 |

## Detailed Diff Analysis

### server/services/feedService.js
- Adds `user_feed_post: "user_feed_post"` to the `typeMap` object in `getShareablePost()`
- The map now handles: `buyer_request`, `requirement`, `product`, `feed_post`, `post`, and `user_feed_post`

## Why This Change Was Needed

The frontend's share link generation sends `user_feed_post` as the entity type parameter, but the backend only mapped `feed_post` and `post`. When the backend received `user_feed_post`, it fell through to the `if (!feedType)` check and returned null, causing the 404. This was the actual root cause that the status fix in commit 0716 didn't address.

## Was It Useful

Yes — this is the critical fix that makes shared post links actually work. Without this one-line change, the entire share feature for feed posts was broken. The debug logging investment from commit 0717 paid off immediately.

## Impact Analysis

- **Bug Fix**: Restores shared post link functionality for feed posts (the most common share type)
- **Scope**: Single line addition — minimal risk
- **Risk**: Very low — adding a map entry is purely additive

## Relationship to Surrounding Commits

- Follows commit 0717 (debug logging) — the logs revealed this exact issue
- Directly resolves the share endpoint 404 that commit 0716 partially addressed
- Precedes commit 0719 (Prisma query fix) — another share endpoint issue discovered afterward

## Confidence Notes

This is a clean, minimal fix. The typeMap now covers all entity types the frontend can send. The debug logging was instrumental in quickly identifying this one-line issue.

## Optional Technical Details

- The typeMap values are internal feed type identifiers used by the Prisma queries
- The frontend generates share URLs using the entity type from the feed stream, which can be any of these variants
- The map acts as a normalization layer between the URL parameter and the database model
