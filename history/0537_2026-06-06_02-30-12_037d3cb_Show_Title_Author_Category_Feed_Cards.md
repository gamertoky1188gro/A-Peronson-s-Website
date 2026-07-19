## Commit Metadata

| Field        | Value                                                                       |
| ------------ | --------------------------------------------------------------------------- |
| **Hash**     | `037d3cb679a6ba5f1d92eb3f487ca24c3dd3e507`                                  |
| **Parent**   | `4509d98917f5f2dfac19085416368afe7ede1da3`                                  |
| **Author**   | gamertoky1188gro                                                            |
| **Date**     | 2026-06-06 02:30:12 +0600                                                   |
| **Subject**  | feat: show title, author, category, caption, description on feed post cards |
| **Sequence** | 0537                                                                        |

## Custom Title

Show Title, Author, Category, Caption, and Description on Feed Post Cards

## High-Level Summary

Two files changed (70 insertions, 20 deletions). Enhances feed post search results: backend now joins author names via Prisma query, frontend shows richer card content including author name link, category badge, caption, and truncated description_markdown.

## File-by-File Breakdown

- **server/services/feedPostService.js** (21 lines) — After fetching feed posts, queries user table for author names, creates `author_name` and `author_id` fields on each result item
- **src/pages/SearchResults.jsx** (69 lines) — Rewrote feed post card rendering to show: title (highlighted), author name (linked), category badge, caption (highlighted), description_markdown snippet (highlighted)

## Detailed Diff Analysis

- **Backend**: The `searchFeedPosts()` function now does a second query to get user names for each post's `user_id`. Each result gets `author_name` and `author_id` added.
- **Frontend**: Feed post cards now show author name with link to profile, category as a pill badge, caption text, and truncated description with keyword highlighting.

## Why This Change

Feed post cards were too bare (just title/date). Adding author and content preview improves discoverability.

## Was It Useful

Yes — significantly improves feed post search results.

## Impact Analysis

Low-medium. Backend now does an extra user query per search.

## Relationships

Followed by 0538 which adds author avatars.

## Confidence Notes

High.
