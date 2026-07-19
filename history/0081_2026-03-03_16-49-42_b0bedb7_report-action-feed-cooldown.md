# Commit 0081: Add Report Action with Reason Prompt and Cooldown in Main Feed

## Commit Metadata

| Field         | Value                                      |
| ------------- | ------------------------------------------ |
| Commit Number | 0081                                       |
| Hash          | `b0bedb7e9c25220b711a306e700ea6e2ccd44d27` |
| Parent Hash   | `85c76b87c8d5fc12a1bda1fa9f7035a32672d308` |
| Author        | Cyber Code Master                          |
| Date/Time     | 2026-03-03 16:49:42                        |
| Files Changed | 1                                          |
| Additions     | 100                                        |
| Deletions     | 8                                          |
| Net Change    | +92                                        |
| Merge         | No                                         |

## Custom Title

Implement Report Button with Reason Prompt and 15-Second Cooldown

## High-Level Summary

This commit adds a "Report" action to the main feed with a reason prompt dialog, a 15-second cooldown timer, and improved action feedback. A `submittingActions` set prevents duplicate submissions. The cooldown countdown is displayed on the report button. Action feedback messages are color-coded (blue for success, red for error). The report reason is sent as extra payload in the social action API call.

## File-by-File Breakdown

### src/pages/MainFeed.jsx (modified, +100/-8)

- **What changed**: Added `submittingActions` set, `reportCooldowns` map, `now` timestamp state; added `buildActionKey`, `getReportKey`, `getReportCooldownLeftMs`, `isActionSubmitting`, `isReportDisabled`, `getReportReason` functions; added auto-updating `now` via `setInterval`; refactored `handleSocialAction` to accept `extraPayload` and track submitting state; added `handleReport` with reason prompt and cooldown; added report button with countdown display; added `actionFeedbackType` for color-coded messages; disabled buttons during submission.
- **Why it matters**: Enables feed moderation through user reporting with spam protection (cooldown).

## Detailed Diff Analysis

### Functions/Classes Added

- **`buildActionKey(post, action)`** — Unique key for action tracking: `{entityType}-{id}-{action}`
- **`getReportKey(post)`** — Unique key for report cooldown: `{entityType}-{id}`
- **`getReportCooldownLeftMs(post)`** — Remaining cooldown time
- **`isActionSubmitting(post, action)`** — Checks if action is in-flight
- **`isReportDisabled(post)`** — Checks if report is submitting or in cooldown
- **`getReportReason(post)`** — Shows `window.prompt` with context-aware suggestion
- **`handleReport(post)`** — Orchestrates reason prompt, validation, and submission

### Logic Changes

- **Action submission tracking**: `submittingActions` Set prevents double-submission
- **Cooldown**: Report actions trigger 15-second cooldown per post
- **Reason prompt**: Uses `window.prompt` with default suggestion based on entity type
  - `buyer_request`: "Potentially fake or harmful buying request"
  - Other: "Product post appears misleading or inappropriate"
- **Extra payload**: Report reason sent as `{ reason }` in body

### UI/UX Changes

- New "🚩 Report" button in feed card action bar
- Report button shows countdown when in cooldown: "Report (12s)"
- All action buttons disabled during their own submission
- Feedback messages color-coded: blue for success, red for error
- Report button turns red on hover

## Why This Change May Have Been Needed

Moderation requires user reporting capabilities. The cooldown prevents spam reporting, and the reason prompt provides context for moderation review.

## Was It Useful?

**Useful.** Essential moderation feature with sensible abuse protections.

## Impact Analysis

- **Developers**: `handleSocialAction` now accepts optional `extraPayload`. The social API call includes `{ entityId, entityType, action, reason }`.
- **Users**: Can report inappropriate content with optional reason. 15-second cooldown prevents repeated reports.
- **Backward compatibility**: Non-report actions unchanged. API already accepts optional reason field.

## Relationship to Surrounding Commits

Follows member management merge (0080) and precedes merge PR #43. This adds a moderation tool to the feed.

## Confidence Notes

High. Well-structured single-file change with clear feature boundaries.

## Optional Technical Details

- `window.prompt` is used for the reason dialog (synchronous, blocking)
- Minimum reason length: 8 characters; falls back to suggestion if too short
- Cooldown stored as `Date.now() + 15000` (15 seconds)
- `now` updated every 1 second via `setInterval` for countdown display
- Canceling the prompt (null return) aborts the report
