# GarTexHub Support — Premium Two-Sided UI (Phase 3)

Date: 2026-11-16
Status: Approved design (brainstormed with the owner)
Program: Phase 3 of the GarTexHub support upgrade (1 ✅ · 2 ✅ · 3 this file · 4 MCP read-only · 5 detailed email report)

## Goal

Premium-grade UI for both sides of the support experience: (a) the buyer's
two-mode `/support` in a blue/cyan dark-glass identity with split routes and
full evidence support; (b) the owner's case console redesigned to the same
standard with tabbed case detail.

Non-goals (this phase): no new storage pipeline (R2/S3 rejected — disk +
signed URLs stay); no MCP tools (Phase 4); no email-report upgrade (Phase 5);
no new backend endpoints except what is trivially trivial; investigations and
permissions are untouched.

## Decisions (owner-approved)

1. Scope: buyer UI AND owner console in one combined cycle.
2. Palette: Dark glass with blue/cyan identity (no purple) — `#050b1d` base,
   elevated `#0a1025`, accent gradient `cyan-300 → sky-400`, glow `sky-500/20`.
3. Routes: split. `/support` landing (public) · `/support/case/:caseId`
   (workspace) · `/support/case/:caseId/report` · `/support/case/:caseId/submitted`.
   Owner console stays at the existing admin deep link (`/admin?case=<id>` —
   keep working) as the case detail surface; it is restyled, not re-routed.
4. Token stays in memory only (page refresh → chooser; no persistence).
5. Evidence viewer: in-modal zoom/pan/prev-next/download (existing signed URLs).
6. `SupportReports.jsx` decomposes into `src/pages/support/*` +
   `src/components/support/*`; behavior preserved; the chooser state machine
   moves to routes.

## Design tokens

| Token | Value |
|---|---|
| Page background | `#050b1d` (+ radial glow layers) |
| Elevated surface | `#0a1025` / `white/[0.03]` translucent |
| Border | `white/10` hairlines; focused `sky-400/60` |
| Accent | `#22d3ee` → `#38bdf8` gradient |
| Text | `#e8eefc` primary, `#8ea3c8` secondary |
| Success/info | cyan/emerald; warning amber; danger rose |
| Radii | 16–28px cards, full for chips |
| Motion | 150–300ms ease-out; no looped glows |

Reusable primitives under `src/components/support/`:
`GlassCard`, `SectionTitle`, `StatusPill`, `EvidenceThumb`,
`StageRail`, `TimelineItem`, `Composer`, `CaseShell`, `EvidenceViewerModal`,
`ModelBadge` (reused from `InvestigationModelPicker`).

## Routes & files (all public; guards stay on the API and in-page)

- `/support` → `SupportLanding.jsx` — hero, three feature cards, two mode
  cards (AI Investigation token / General Support for signed-in users),
  privacy disclosure, "How it works" three-step strip. Header: logo +
  "GarTexHub Support". No external imagery.
- `/support/case/:caseId` → `SupportWorkspace.jsx` — three columns:
  - Left rail (240–260px): case id, 4 stages (Understand · Investigate ·
    Discuss · Report) as a `StageRail` (non-interactive, reflects
    `case.status`), evidence list, privacy note, "End session" (clears the
    in-memory token, back to `/support`).
  - Center: conversation. Message types: client (right glass bubble),
    assistant (left), question (accent-outlined card), evidence (thumb +
    filename + size), finding (summary card with confidence chip),
    investigation update (neutral timeline card). Fixed composer: textarea
    (autogrow), drag/drop + paste images, attachment preview strip with
    progress, Enter sends / Shift+Enter newline, Stop button while streaming,
    retry chip on failure.
  - Right rail (260–300px): investigation status (six steps), resources
    (Repository inspection / GitHub history / External research / Approved
    data — each shown as "Authorized / Unavailable" from the same static map
    the backend reports), evidence collected list, permissions guarantee card
    ("Read-only — the AI cannot modify source code, run commands or deploy.")
- `/support/case/:caseId/report` → `SupportReportPreview.jsx` — draft report
  view (01 problem · 02 expected · 03 actual · 04 evidence · 05 technical
  investigation · 06 possible causes · 07 recommended next steps), client
  confirm checkbox, "Finish & Submit Report" (→ existing confirm flow),
  "Back to conversation".
- `/support/case/:caseId/submitted` → `SupportSubmitted.jsx` — case reference,
  email delivery states as distinct pills (saved/queued/sent/failed),
  "Back to Support" link.
- Deep links: `/admin?case=<id>` unchanged; `/` nav "Support" points to
  `/support` (already correct — verify).

## Buyer flow invariants

- Signed-out buyer enters via token on the landing AI card → validated →
  `navigate('/support/case/:caseId', { state: { supportToken, buyer } })` +
  in-memory context module (`src/lib/supportToken.js`: `setSupportSession`,
  `getSupportSession`, `clearSupportSession`). Refresh → `/support` (token
  gone, as today).
- Mode-02 anonymous prevention unchanged (signed-in only).
- The case API contract, SSE stream, and `x-support-token` header are untouched.

## Evidence handling (disk, unchanged)

- Upload: existing `POST /documents` (JWT-only) with entity_type
  `support_case` + entity_id `<caseId>` → row anchored, bytes land in
  `/uploads/support/`; signed URL exchange (`src/lib/signedFile.js`) for
  every render.
- Viewer modal: full-screen `bg-black/90`, zoom controls (+/−/fit, wheel),
  arrow-key navigation, file name/size/time, download via existing
  signed URL, Escape closes.
- Client-side: max 10 files, 8 MB each, images + PDFs only (server enforces
  its own limits — show inline error if exceeded).

## Owner console (existing `/admin?case=<id>`, restyled + tabbed)

- `AdminPlatformSection.jsx` case detail gains a tabbed layout:
  **Overview** (subject, client, priority, status, stage rail) ·
  **Conversation** (full transcript with message types reused) ·
  **Evidence** (attachments grid + viewer modal, same components) ·
  **Code findings** (per-role findings with file:line evidence cards) ·
  **Activity** (tool log: tool, status, duration from existing tool-call
  rows; NOT reasoning) ·
  **Email report** (status pills: saved/queued/sent/failed + retry button
  via existing `rerun` action).
- Inbox table restyled to match (denser): case id, client, subject, priority
  chip, investigation status, email status, submitted at, filter/search; row
  click opens the case (as today).
- Existing actions (escalate, rerun with note) preserved verbatim.

## Accessibility & responsive

- All interactive elements ≥ 40px targets; visible focus rings (sky-400/60);
  aria-labels on icon buttons; color never the only signal (chips carry
  text); `prefers-reduced-motion` respected (no transitions when reduced).
- Mobile < 1024px: single column; left/right rails become drawers toggled
  by buttons (evidence badge shows count on mobile); report/submitted pages
  remain single-column above all.

## Testing

- Component tests (jsdom): `SupportLanding` renders both mode cards (and
  signed-out CTA links to /login); `SupportWorkspace` renders three columns
  with stages reflecting a fixture case; `InvestigationModelPicker` unchanged;
  viewer modal opens with correct image; disabled attach for signed-out buyers.
- `npm test` green before merge (current baseline 1029 + new tests).
- Visual check: manual walkthrough via dev server at merge time; screenshot
  set attached to the PR/commit message.

## Rollout

- No migration, no new env vars, no new dependencies (existing component libs
  only; react-zoom-pan-pinch not needed — hand-rolled transforms are ~40 LOC,
  or reuse a tiny hook).
- `/support` public; existing ProtectedRoute behavior unchanged elsewhere;
  the admin console keeps its current tab deep-link (`/admin?case=`).
