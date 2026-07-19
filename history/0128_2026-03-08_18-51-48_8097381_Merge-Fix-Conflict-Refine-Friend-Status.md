# Commit 0128: Merge — Fix Conflict, Refine Friend Status Checks

## Commit Metadata

| Field         | Value                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------- |
| **Hash**      | `809738188bc675c1c183ec34dcbcae64c2180a1b`                                                     |
| **Parent(s)** | `f8ac77062f427afeffb673b8018684e0cd3890eb`, `15238dcde84d4fa34c0fb978bb0f1d92fa7d0a42`         |
| **Author**    | gamertoky1188gro                                                                               |
| **Date**      | 2026-03-08 18:51:48 +0600                                                                      |
| **Message**   | merge remote-tracking branch 'origin/codex/investigate-invalid-token-issue-after-login-imhfd7' |

## High-Level Summary

Merge resolving the previous branch with the refined parallel branch (0127). The diff against first parent shows: removal of merge conflict markers from `user_connections.json`, improvements to friend status comparison (now handles 'accepted' in addition to 'active', legacy friend request statuses), ChatInterface refinements (removed unused Lucide icons, removed accordions, filtered WS 'forbidden' errors from display, simplified WS error handling).

## File-by-File Breakdown

| File                                    | Status              | Description                                                                                                                                                     |
| --------------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `server/database/user_connections.json` | Modified (-14)      | Removed merge conflict markers, reset to empty array                                                                                                            |
| `server/services/friendService.js`      | Modified (+11)      | Added `isLegacyFriendActive`, broadened status checks to include 'accepted'                                                                                     |
| `server/services/userService.js`        | Modified (+26)      | Updated `isFriendConnected`, `connectionSnapshot`, `sendFriendRequest` to handle 'accepted' status                                                              |
| `src/pages/ChatInterface.jsx`           | Modified (-99/+115) | Removed unused imports, removed accordion state, filtered 'forbidden' errors, simplified WS onerror handling, improved live status display, gradient background |

## Detailed Diff Analysis

### friendService.js

- `isLegacyFriendActive(row)`: new helper recognizing `friend_request` type with 'accepted'/'active' status as valid friend relationships
- `hasFriendRelationship()`: broadened to check `['active', 'accepted']` for `friend` type, and call `isLegacyFriendActive()`
- This fixes the "invalid token" / "not friends" issue — previously only exact 'active' status was recognized

### userService.js

- `isFriendConnected()`: now checks both 'active' and 'accepted' statuses for both `friend` and `friend_request` types
- `connectionSnapshot()`: same broadening
- `sendFriendRequest()`: `existingFriendIndex` check now uses `['active', 'accepted']`
- These changes ensure backward compatibility with records stored as 'accepted' (from older flows)

### ChatInterface.jsx

- Removed unused Lucide icons (`FileText`, `Image`, `Link2`, `ChevronDown`, `ChevronUp`)
- Removed `openAccordions` state and accordion toggle function
- Removed `sharedMedia` and `sharedLinks` memoized values
- WS `chat_error` handler: no longer sets connection status to 'error' — stays 'online'; filters out 'forbidden' errors from display
- WS `onerror` handler: no longer sets connection to 'error', stays 'online'
- Added `visibleError` — filters errors containing 'forbidden' from rendering
- Added `liveOnline` boolean for conditional rendering
- Darker gradient background: `#0f0f1b` via `#13132a` to `#12162f`
- Panels use `rounded-[20px]`
- Search input: white background with dark text (`text-[#19192b]`), `rounded-[20px]`
- Active sidebar indicator: `#d4ff70` (slightly different green)

## Why This Change

Merge to bring in the refined friend status checks that fix the "invalid token"/login issues, while also cleaning up the merge conflict markers and simplifying the UI by removing the accordion/shared-media right panel.

## Was It Useful

Yes. The status check broadening is a bugfix — without it, friend relationships with 'accepted' status would be invisible, breaking the friend system. The WS error filtering prevents confusing "Forbidden" errors from appearing to users.

## Impact Analysis

- **Bugfix**: Friend relationship detection now handles both 'active' and 'accepted' statuses.
- **UI**: Right panel accordions removed; WS error handling improved.
- **Risk**: Low — broadening status checks is backward-compatible.

## Relationship to Surrounding Commits

Merge of 0126 (f8ac7706) and 0127 (15238dcd). Parent for commit 0130 (48d0972d) after 0129 (9377bf03).

## Confidence Notes

High. The status check fix is well-scoped. WS changes prevent noise from expected authorization errors.
