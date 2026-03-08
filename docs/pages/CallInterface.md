# CallInterface - Complete Page Specification (Manual)

## Page Title & Description
- Title: `Supplier Intro Meeting` (dynamic from call details)
- Route: `/call?callId=<id>&matchId=<id>`
- Purpose: WebRTC call room UI for video/audio session, call lifecycle controls, and recording status tracking.

## Layout & Structure
- Two-column layout:
1. Main call canvas (left, large):
  - call header/status
  - local + remote video panes
  - lifecycle action buttons
  - status message banner
2. Meeting details panel (right):
  - badges for meeting metadata
  - participant chips
  - notes card

Main pane sections:
- Header with quick toggles (mute/camera/share).
- Video grid (2 panels).
- Status notifications.
- Footer action row (`Start`, `End`, `Refresh Recording`, `Schedule Follow-up`, `Leave`).

## Theme & Styling
- Neutral dark/light hybrid depending on app theme classes.
- Video area uses black backgrounds for stream surfaces.
- Status banners:
  - blue informational style.
- Buttons:
  - bordered utility controls with red accent for `End Call`.

## Content Details
Key visible text:
- Dynamic status line:
  - `<call.status> • <recording_status> • <peerState>`
- Toggle labels:
  - `🔇 Unmute` / `🎙️ Mute`
  - `📷 Camera On` / `📷 Camera Off`
  - `🖥️ Share`
- Footer actions:
  - `Start Call`
  - `End Call`
  - `Refresh Recording`
  - `Schedule Follow-up`
  - `Leave`
- Meeting details section:
  - `Meeting Details`
  - `Meeting ID`, `Match ID`, `Started`, `Ended`
  - `Participants`
  - `Notes`
  - note copy: `Share key decisions, pricing updates, and next actions here during the call.`

## Interactions & Functionality
- Session bootstrap:
  - if no `callId` but `matchId` exists -> `POST /calls/join`.
- Call details fetch:
  - `GET /calls/:callId`.
- Recording polling:
  - polls call details every 4s when call ended and recording status not terminal.
- WebRTC flow:
  - captures local media (`getUserMedia`).
  - creates RTCPeerConnection.
  - exchanges offer/answer/ice over WebSocket (`join_call_room`, `webrtc_signal`).
  - binds tracks to local/remote `<video>` elements.
- Lifecycle API actions:
  - start: `POST /calls/:callId/start`
  - end: `POST /calls/:callId/end`
  - schedule follow-up: `POST /calls/scheduled`
- Local device controls:
  - mute toggles audio tracks enabled.
  - camera toggles video tracks enabled.

## Images & Media
- Primary media is live WebRTC video streams.
- No static image assets required.

## Extra Notes / Metadata
- SEO:
  - no page-level metadata.
- Accessibility:
  - some control labels rely on emoji text; can be improved with explicit screen-reader labels.
- Reliability:
  - WS errors and media permission errors are surfaced through status message.
