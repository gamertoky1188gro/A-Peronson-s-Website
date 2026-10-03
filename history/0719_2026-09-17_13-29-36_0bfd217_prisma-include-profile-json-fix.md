# Commit 0719 — 0bfd217

| Field | Value |
|-------|-------|
| **Commit Number** | 0719 |
| **Commit Hash** | 0bfd217dcd91c089196208b6f6100e127c477b7b |
| **Parent Hash** | 26aa78a3016023d525eee58d6d64b64832afcd0c |
| **Author** | Tokyi |
| **Date/Time** | 2026-09-17 13:29:36 |
| **Branch** | main |
| **Files Changed** | 1 |
| **Additions** | 6 |
| **Deletions** | 4 |
| **Net Change** | +6/-4 |
| **Merge Commit** | No |

## Remove Invalid 'include: profile' from Prisma Query (profile is Json, not Relation)

This commit fixes a Prisma runtime error in the share endpoint where the `include: { profile: true }` option was used on a user query. The `profile` field in the User model is a `Json` column, not a relation — Prisma cannot use `include` on Json fields and throws an error. The fix removes the invalid `include` and instead accesses the profile data directly from the returned user object, with safe JSON parsing for string-encoded profiles.

After the query, the code now manually parses `author.profile` — handling three cases: null/undefined, already-parsed object, or JSON string that needs parsing. The avatar URL resolution chain then uses this parsed `profile` object instead of `author.profile`, ensuring consistent access regardless of storage format.

## Files Changed

| File | Type | + | − | Δ |
|------|------|---|---|---|
| server/services/feedService.js | Modified | 6 | 4 | +2 |

## Detailed Diff Analysis

### server/services/feedService.js
- Removes `include: { profile: true }` from `prisma.user.findUnique()` call
- Adds manual profile parsing: `const authorProfile = author?.profile || {}`
- Handles string-encoded JSON profiles with try/catch `JSON.parse`
- Avatar URL resolution chain changes from `author?.profile?.profile_image` to `profile?.profile_image` (and similar for `avatar_url`, `avatar`)

## Why This Change Was Needed

The `include: { profile: true }` was causing a Prisma error because `profile` is a `Json` field, not a relation. This would crash the share endpoint for any post that had an author, making the entire share feature non-functional even after the type map fix in commit 0718. The fix correctly treats `profile` as raw JSON data.

## Was It Useful

Yes — this was a showstopper bug. Without this fix, the share endpoint would throw a Prisma error on every request (since virtually every post has an author), returning a 500 instead of the post data.

## Impact Analysis

- **Bug Fix**: Prevents Prisma runtime error on Json field inclusion
- **Data Handling**: Introduces safe JSON parsing for the profile field (handles both object and string formats)
- **Risk**: Low — the change is defensive and handles edge cases

## Relationship to Surrounding Commits

- Follows commit 0718 (type map fix) — the share endpoint was still broken due to this Prisma error
- Precedes commit 0720 (debug logging cleanup) — the debugging phase is complete
- Part of the 0716–0720 share endpoint debugging saga

## Confidence Notes

The fix is correct and defensive. The JSON parsing handles the common case where Prisma stores Json fields as objects and the edge case where they're serialized as strings. The avatar resolution chain is equivalent in behavior.

## Optional Technical Details

- Prisma's `include` only works with relation fields; Json fields are accessed directly as `user.profile`
- The `typeof` check + `JSON.parse` in a try/catch handles both stored-as-object and stored-as-string formats
- The avatar URL fallback chain (`profile_image` → `avatar_url` → `avatar` → `author.avatar_url`) maintains backward compatibility
