# ChatInterface - Complete Page Specification (Manual)

## Page Title & Description
- Title: `Messages`
- Route: `/chat`
- Purpose: Real-time and fallback messaging workspace with priority inbox, request handling, media upload, call scheduling, and thread details.

## Layout & Structure
- Four-column desktop layout:
1. Left icon rail (navigation shortcuts).
2. Inbox column (`Messages`, search, priority + requests sections).
3. Main chat panel (active thread, live status, message stream, composer).
4. Right details panel (profile summary + call history).
- Mobile/tablet collapses columns into stacked sections.

Main panel composition:
- Thread header (avatar/name/lock status + Video/Audio/Schedule buttons).
- Live status strip (WS enabled state).
- Scrollable message timeline.
- Thread info row.
- Composer with attach button and send button.

## Theme & Styling
- Dark neon-like interface:
  - deep gradients (`#0f0f1b` family)
  - purple highlights
  - lime accents for activity indicators
- Cards and panels with rounded high-radius corners and subtle borders.
- White text with muted slate secondary labels.

## Content Details
Exact key text/labels:
- Column title: `Messages`
- Search placeholder: `Search Message...`
- Section headers:
  - `PRIORITY INBOX`
  - `REQUESTS`
- Empty/loading text:
  - `Loading inbox...`
  - `No pending requests.`
  - `Select a chat to begin`
  - `No messages yet.`
- Header action labels:
  - `Video`
  - `Audio`
  - `Schedule`
- Live strip:
  - `Live: Enabled • online` (or offline variant)
  - `Disable WS` / `Enable WS`
- Composer:
  - placeholder: `Type a message...`
  - send button: `Send`
- Status text examples:
  - `Uploading file...`
  - `File sent.`

## Interactions & Functionality
- Data loading:
  - `GET /messages/inbox` for priority/request pool.
  - `GET /calls/history?match_ids=...` for call history by thread.
  - `GET /messages/:matchId` for full message history.
- WebSocket chat:
  - joins room (`join_chat_room`) when active thread changes.
  - receives `joined_chat_room`, `chat_message`, `chat_error`.
  - supports fallback to HTTP send when WS disabled/unavailable.
- Message sending:
  - WS send payload for `chat_message` or `POST /messages/:matchId`.
- Attachments:
  - file picker -> `POST /messages/:matchId/upload` multipart.
  - supports image/video/file rendering in timeline.
- Request actions:
  - non-friend requests: accept/reject via `/messages/requests/:threadId/{accept|reject}`.
  - incoming friend requests: `POST /users/:userId/friend-request` for acceptance.
- Call actions:
  - instant call: `POST /calls/join`, then navigate to `/call?...`.
  - schedule call: `POST /calls/scheduled` with prompts for date and optional contract/security IDs.

## Images & Media
- Message media rendering:
  - images shown inline with clickable full URL.
  - videos shown inline in player.
  - files shown as links.
- Avatars are generated initials badges (no static image assets required).

## Extra Notes / Metadata
- SEO:
  - no explicit metadata in component.
- Accessibility:
  - multiple icon-only controls should include explicit `aria-label` coverage in future pass.
- Responsive:
  - designed for desktop-rich workspace but functional in stacked layout.
