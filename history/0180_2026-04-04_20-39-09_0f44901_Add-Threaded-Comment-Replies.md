## Commit Metadata
- **Hash:** 0f449010ca8288c87dbd7f6da63e8a7e97a9c7cb
- **Parent:** fae91e9379963a5de3d4d4c27e0296de990190b3
- **Author:** gamertoky1188gro
- **Date:** 2026-04-04 20:39:09
- **Message:** Add threaded comment replies

## Custom Title
Add threaded comment replies to feed

## High-Level Summary
Implemented threaded (nested) replies for comments on feed items. Added parent_comment_id support to the social controller, social service, and CommentsDrawer component UI.

## File-by-File Breakdown
- **server/controllers/socialController.js** — Updated comment creation to accept `parent_comment_id` for nested replies
- **server/services/socialService.js** — Added reply threading logic: stores parent_comment_id, fetches replies hierarchically, returns nested structure
- **src/components/feed/CommentsDrawer.jsx** — Major UI update (+161 lines): render nested replies indented under parent comments, reply input per comment, expand/collapse replies, reply button

## Detailed Diff Analysis
**socialService.js:** Comments now accept an optional `parent_comment_id`. When retrieving comments, the service builds a nested tree structure. Replies are limited to 1 level deep (no infinite nesting). Each reply references its parent.

**CommentsDrawer.jsx:** Refactored to show threaded replies. Each comment shows a "Reply" button that reveals an inline reply input. Replies are rendered indented below their parent with a connecting visual line. "Show replies" toggle for collapsed threads.

## Why This Change
Threaded replies are a standard social media feature that improves conversation readability. Previously all comments were flat.

## Was It Useful
Yes. Makes feed discussions much more usable.

## Impact Analysis
- **Scope:** 3 files, +217/-18 lines
- **Risk:** Low — additive feature, existing flat comments continue to work

## Relationships
Enhances the social/feed feature set.

## Confidence Notes
High. Standard nested comment implementation with 1-level depth constraint.
