# GarTexHub Support — Premium Two-Sided UI — Implementation Plan (Phase 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the premium two-sided UI: buyer routes (`/support` landing → `/support/case/:caseId` 3-column workspace → `/report` → `/submitted`) in a blue/cyan dark-glass identity, plus the owner case console restyled to the same standard with tabbed detail.

**Architecture:** Decompose the 2,273-line `SupportReports.jsx` into routed pages under `src/pages/support/` and primitives under `src/components/support/`. `SupportReports.jsx` is deleted; `App.jsx` routes change `/support` to `SupportLanding` and add public `/support/case/:caseId[/report|/submitted]`. The signed-out support-token session moves from component state into a module-level context (`src/lib/supportToken.js`) so routes can share it; the case API contract and SSE are untouched. Owner console: `AdminPlatformSection.jsx` restyles in place and splits the case detail into tabs (Overview / Conversation / Evidence / Code findings / Activity / Email report), reusing the shared primitives.

**Tech Stack:** React 19, react-router-dom 7, Tailwind 4, jest 29 + RTL (`node --experimental-vm-modules … jest --runInBand`).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-11-16-support-premium-ui-design.md` (authority).
- Palette: blue/cyan on `#050b1d` base, `#0a1025` elevated; NO purple/violet accents anywhere.
- No new dependencies; no new storage; disk + signed URLs for evidence.
- `SupportReports.jsx` deleted at the end (routes move to pages) — keep existing tests (`frontend-support-chooser`, `frontend-support-case`, `frontend-signed-media`, `frontend-signed-file`) green by giving them their new home or updating imports.
- Token in memory only (`supportToken.js`); NEVER localStorage/sessionStorage/cookies; page refresh → `/support`.
- All existing behavior preserved: same API calls, same SSE, same confirmation flow (report → confirm → submitted).
- a11y: focus rings `sky-400/60`; ≥40px targets; `aria-label` on icon buttons; `prefers-reduced-motion`.

---

### Task 1: Foundations — token session lib + shared primitives + tests

**Files:**
- Create: `src/lib/supportToken.js`
- Create: `src/components/support/GlassCard.jsx`, `StatusPill.jsx`, `StageRail.jsx`, `TimelineItem.jsx`, `EvidenceViewerModal.jsx`, `Composer.jsx`, `SectionTitle.jsx`, `CaseShell.jsx`, `ModelBadge.jsx` (move/duplicate the InvestigationModelPicker badge markup here; the picker stays in place importing it)
- Test: `tests/unit/frontend-support-primitives.test.js`

**Interfaces:**
- `src/lib/supportToken.js` exports `setSupportSession({ token, buyer, label })`, `getSupportSession() → { token, buyer, label } | null`, `clearSupportSession()`. Module-level `let`, never persisted.
- `EvidenceViewerModal({ items, index, onClose, onNavigate })` — `items: [{ url, name, type, size }]`; zoom 0.5–4 via wheel + buttons; arrow keys prev/next; Escape close; `role="dialog" aria-modal="true" aria-label`.
- `StageRail({ steps, status })` — `steps: ["Understand","Investigate","Discuss","Report"]`; renders non-interactive chips; current = by `status` mapping `collecting→0`, `investigating→1`, `verifying→…`, `completed→3` (map unknown → 0).
- `Composer({ onSend, onFiles, disabled, sending, onStop })` — textarea autogrow (max 160px), drag/drop + paste files, Enter send / Shift+Enter newline, attach button visible only when `attachVisible` (default true; parent passes false for signed-out buyers), attachment strip with per-file remove.

- [ ] **Step 1: Write the failing test**

```js
import { render, screen, fireEvent } from "@testing-library/react";
import { setSupportSession, getSupportSession, clearSupportSession } from "../../src/lib/supportToken.js";
import { EvidenceViewerModal } from "../../src/components/support/EvidenceViewerModal.jsx";
import { StageRail } from "../../src/components/support/StageRail.jsx";

test("token session module holds the session in memory only", () => {
	expect(getSupportSession()).toBeNull();
	setSupportSession({ token: "gtk_sup_x", buyer: { id: "b1", name: "Buyer" }, label: "pilot" });
	expect(getSupportSession()?.buyer.id).toBe("b1");
	expect(localStorage.getItem("support-token")).toBeNull();
	clearSupportSession();
	expect(getSupportSession()).toBeNull();
});

test("EvidenceViewerModal navigates and closes on Escape", () => {
	const items = [{ url: "u1", name: "a.png", type: "image/png", size: 10 }, { url: "u2", name: "b.png", type: "image/png", size: 20 }];
	const onClose = jest.fn();
	render(<EvidenceViewerModal items={items} index={0} onClose={onClose} onNavigate={jest.fn()} />);
	expect(screen.getByText("a.png")).toBeInTheDocument();
	fireEvent.keyDown(window, { key: "Escape" });
	expect(onClose).toHaveBeenCalled();
});

test("StageRail renders all four stages", () => {
	render(<StageRail steps={["Understand", "Investigate", "Discuss", "Report"]} status="collecting" />);
	for (const step of ["Understand", "Investigate", "Discuss", "Report"]) {
		expect(screen.getByText(step)).toBeInTheDocument();
	}
});
```

- [ ] **Step 2: Run — expect FAIL** (modules don't exist)

- [ ] **Step 3: Implement** (each component ≤ 120 LOC; inline SVG icons where needed; no new deps; viewer uses `transform: translate/scale` on a wrapper with `overflow: hidden`)

- [ ] **Step 4: Run tests — expect PASS**; `npx biome check` on new files: no new errors.

- [ ] **Step 5: Commit** — `feat(support): shared premium UI primitives + in-memory token session`

---

### Task 2: Landing page + routing

**Files:**
- Create: `src/pages/support/SupportLanding.jsx`
- Modify: `src/App.jsx` (replace `/support` element; add public `/support/case/:caseId`, `/report`, `/submitted` — pages from Tasks 3–4; for this task, wire `SupportLanding` at `/support` and stub the others to a temporary `<div>` to keep the build green, replaced in Tasks 3–4)
- Test: `tests/unit/frontend-support-landing.test.js`

**Interfaces:**
- `SupportLanding` renders: hero ("Something isn't working as expected? Let's investigate." + subcopy), three feature cards (Talk naturally / Evidence-based investigation / Detailed reporting), two mode cards: **AI Investigation** (token input + Continue) and **General Support** (signed-in → "Open the form" button → internal navigate to `/support?mode=form`… no — render the inline form right here when `mode === "form"`; signed-out → link to `/login`). Token continue: validate → `setSupportSession(...)` → `navigate("/support/case/<new-case-or-chooser>", { replace: true })` — case creation happens inside the workspace flow (reuse existing `startCase` logic or navigate to a fresh workspace that creates a case on first message). Simplest contract for this task: on valid token, navigate to `/support/case/new` with state marked new; the workspace (Task 3) handles "new" by creating the case on submit.

- [ ] **Step 1: Write the failing test** (render landing; expect hero text; AI card; signed-out General Support shows "Sign in to submit"; valid token path navigates — mock `useNavigate`)

- [ ] **Step 2: Implement Landing** (reuse existing cn() idiom, `getToken()` from `src/lib/auth.js`, `apiRequest` for validate; `getSupportSession` cleared on mount)

- [ ] **Step 3: App.jsx routes** — replace `/support` element with `<SupportLanding />`; add lazy-imports for the three routed pages (stubbed for now) with `safeLazy`; keep everything else untouched.

- [ ] **Step 4: Tests pass + `npm test` no new failures.**

- [ ] **Step 5: Commit** — `feat(support): premium landing page + public /support routes`

---

### Task 3: The workspace — routes, three columns, evidence viewer

**Files:**
- Create: `src/pages/support/SupportWorkspace.jsx`
- Modify: `src/App.jsx` (replace stubs)
- Delete: the case-panel portion of `src/pages/SupportReports.jsx` (the file is deleted entirely after Task 4)
- Test: `tests/unit/frontend-support-workspace.test.js`
- Reuse: `src/hooks/useSupportCase.js` unchanged; `src/components/support/*` from Task 1; `src/components/support/InvestigationModelPicker.jsx` stays mounted in the center column header

**Layout contract (from spec):** grid `grid-cols-[260px_minmax(0,1fr)_280px]` at ≥1024px; below that, single column with drawers (buttons: "Evidence (n)" and "Investigation"; toggles `fixed inset-y-0` panels with backdrop).

- Left rail: logo mark (Support / AI Investigation), case id mono, `StageRail`, evidence list (thumb + name), privacy note, "End session" button (`clearSupportSession` → navigate `/support`).
- Center: header row (AI avatar block, title "AI Investigation", status pill "Ready"/"Investigating", case id, `InvestigationModelPicker` badge); message list (existing `MessageBubble` reused — move into workspace file, restyle variants: right client bubble `sky-500/10 border-sky-400/30`, left assistant `white/5`); evidence thumbs; findings cards;
  - Composer (Task 1) with `attachVisible={Boolean(getToken())}`; `onFiles` uploads via existing `/documents` flow (entity_type `support_case`, entity_id caseId) with per-file progress state.
- Right rail: "INVESTIGATION" status (six steps: Understanding complaint · Gathering evidence · Inspecting code · Verifying causes · Discussing findings · Preparing report) — derive from `case.status` + SSE stage events (render as completed/active/idle chips); "RESOURCES" card (Repository inspection / GitHub history / External research / Approved application data — static labels with `Authorized` pills); "EVIDENCE COLLECTED" list; permissions guarantee card (read-only) styled as a highlighted panel.
- SSE consumption stays in `useSupportCase` (already fires updates) — right rail re-renders from the same reducer state; no SSE changes.

- [ ] **Step 1: Write the failing test** (render workspace with a fixture `case` + messages in state via a mocked `useSupportCase`; expect three columns present at ≥1024 via container query classes, evidence viewer opens on thumb click, stage texts visible)

- [ ] **Step 2: Implement** (move the panel's logic, restyled; keep every API call and header untouched — `x-support-token` threaded exactly as the current panel does)

- [ ] **Step 3: Evidence viewer integration** — thumbs open `EvidenceViewerModal` with the signed URLs from the attachments list (reuse `signAndOpen`/`useSignedSrc`).

- [ ] **Step 4: Tests green; `npm test` green.**

- [ ] **Step 5: Commit** — `feat(support): premium investigation workspace route`

---

### Task 4: Report preview + submission confirmation + delete legacy page

**Files:**
- Create: `src/pages/support/SupportReportPreview.jsx` (route `/support/case/:caseId/report`)
- Create: `src/pages/support/SupportSubmitted.jsx` (route `/support/case/:caseId/submitted`)
- Delete: `src/pages/SupportReports.jsx`
- Modify: `src/App.jsx` (replace stubs; delete SupportReports import), `tests/unit/frontend-support-chooser.test.js` + `frontend-support-case.test.js` (update imports/queries to the new files)
- Test: `tests/unit/frontend-support-report.test.js`

- Report preview: sections 01–07 rendered from the case's report summary (the API already returns the report structure used by the current UI — reuse the same renderer pieces currently inline in SupportReports.jsx; do not invent a new backend contract); confirm checkbox enables "Finish & Submit Report" (posts `POST /api/support/cases/:caseId/confirm`); "Back to conversation" returns to workspace.
- Submitted: shows case reference (from route state or `GET /api/support/cases/:caseId`), email status pill (saved/queued/sent/failed from `case.report_status` / `report_delivered_at`), back link to `/support`.
- Delete `SupportReports.jsx`; update the two existing test files' imports.

- [ ] **Step 1: Write the failing test** (fixture report; checkbox enables button; confirm posts; submitted page shows case reference + status pill)

- [ ] **Step 2: Implement both pages** (reuse existing report rendering code; restyle only)

- [ ] **Step 3: App.jsx** — wire routes, delete SupportReports import + file; update tests to the new components; run full suite.

- [ ] **Step 4: `npm test` green (expect ≥ 1035).**

- [ ] **Step 5: Commit** — `feat(support): premium report preview + submission confirmation`

---

### Task 5: Owner console — restyled + tabbed case detail

**Files:**
- Modify: `src/pages/admin/sections/AdminPlatformSection.jsx` (case list → denser glass table; case detail → tabs)
- Test: `tests/unit/frontend-admin-case-tabs.test.js`

- Inbox: denser table (`Case · Client · Subject · Priority chip · Status · Email · Submitted`); filter chips (status, priority) + search box; row click opens case as today.
- Detail tabs (buttons with `role="tablist"` / `aria-selected`): **Overview** (subject, client, stage rail, priority, submitted) · **Conversation** (transcript, reused message renderers) · **Evidence** (attachments grid → same `EvidenceViewerModal`) · **Code findings** (per-role findings cards: role, confidence chip, file:line mono lines, evidence links) · **Activity** (tool-call log: tool, status, duration — from `normalizeToolCalls` shape already in the admin API response; NOT reasoning) · **Email report** (pills: saved/queued/sent/failed + retry via existing `rerun` action with the existing note flow).
- All data already exists in `supportCaseDetail` (`{ case, messages, investigations }`) — no new endpoints.
- Keep the escalate/rerun actions and the step-up headers exactly as today.

- [ ] **Step 1: Write the failing test** (render tabbed detail with fixture `{ case, messages, investigations }`; switch tabs; evidence tab renders thumbs; Activity tab renders tool log rows)

- [ ] **Step 2: Implement** (extract subcomponents inline in the file or `src/pages/admin/caseTabs/*.jsx` — prefer inline to avoid file explosion; the file is already large, so prefer separate small components under `src/pages/admin/caseTabs/`)

- [ ] **Step 3: Tests green; `npm test` green.**

- [ ] **Step 4: Commit** — `feat(admin): premium case console — restyled inbox + tabbed detail`

---

### Task 6: Verification + accessibility + responsive pass

**Files:** none (verification only, fixes where cheap)

- [ ] **Step 1: `npm test`** — record totals; must be 0 failures; note pre-existing crash-reporter flake if it reappears (unrelated).
- [ ] **Step 2: Manual walkthrough on dev server** (`npm run dev` or `node server/server.js` + vite): `/support` renders; token-gate round trip (use a case you can create — create one via API or existing seeded data, or validate form-path); navigate workspace → report → submitted; confirm owner console tabs render with a real case via `/admin?case=<id>`.
- [ ] **Step 3: Responsive + a11y** — shrink window to 375px: single column, drawers open/close, focus order; keyboard-only path through landing → workspace (Tab order sane, Escape closes modals/drawers); `prefers-reduced-motion` respected (no infinite animations).
- [ ] **Step 4: `npx biome check` on changed files (no new errors); commit only fixes.**
