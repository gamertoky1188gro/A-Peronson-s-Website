# GarTexHub Support — Auto-naming + Live AI Activity Tree

Date: 2026-11-17
Status: Approved design (brainstormed with the owner)
Component: Support investigation workspace (`/support/case/:id`)

## Goal

1. **Auto-name a case after the first client message**, from context, by extending the intake assistant's own reply contract — with a deterministic fallback.
2. **Show an inline, Claude/Copilot-style activity tree while the AI works** — `Thinking…` → `|_ Reading walletService.js` → … — visible live, and preserved after the fact as a collapsed section.

## Non-goals

- No token-level streaming of model reasoning. "Thinking…" is a pulsing label, never a trace.
- No tree for the intake (clarifying) conversation. Naming only.
- No change to reports, verdicts, escalation, delivery, or the two-mode `/support` entry.
- No new database tables and no schema column. (`tool_log` is `Json?` — extended additively.)

## Owner-approved decisions

1. **Both features in one spec**, implemented in stages in this order: naming → live tree → persistent tree.
2. **Detail policy (single tier)**: the tree shows the *phase label* (`Thinking…` / `Inspecting code…`), and rows per tool settle. File tools show the **file name only (basename)**. Every other tool shows **its name only**. No args, no paths, no payloads, no reasoning text, and **nothing the AI says to the buyer is ever hidden behind or reordered by the tree** — the assistant's message text renders exactly as before, always visible.
3. **Streaming**: real-time settled events (`support.case.activity`) over the existing SSE stream. One event per tool call, emitted when its state leaves `running`/`streaming`. Server-side cost is one SSE line per tool call; ordering is best-effort by arrival, deduped client-side by event id.
4. **Placement**: inline collapsible block **above the assistant's reply** while the case is investigating (per Claude Web / GitHub Copilot Agent Mode). After the case completes it stays, collapsed, under the report as "How this was investigated (N steps)". Never inside the message text.
5. **Persistence**: live tree streams during the run; `tool_log` entries per role are extended at finish time with the same sanitized `{ kind, label }` shape (basename only — still no paths). `GET /api/support/cases/:id` returns the per-role activity; the tree survives reloads, collapsed.
6. **Security filter** applies to every path-derived value: basename only, quotes/spaces/newlines stripped, caps at 60 chars, rejects `..` — anything suspicious renders as `Using <tool>` instead.

## Feature 1 — Auto-naming after the first message

### Mechanism: marker in the intake contract

`CLARIFICATION_SYSTEM_PROMPT` (`server/services/caseConversationService.js`) gains exactly one rule, applying **only to the first client message of a case**:

```
If this is the FIRST message of the conversation, begin your reply with a line
of exactly this form and nothing else on it:
TITLE: <3 to 8 word title for the case, no punctuation>
Then a newline, then the one clarifying question. Never mention, quote or explain this line.
```

No turn after the first message carries a marker. The clarifying system prompt is otherwise unchanged.

### Server extraction (before anything else)

`answerClarification`:

1. Reads the raw model answer.
2. If the current turn is the case's **first** client message and the reply matches `^TITLE:\s*(.{1,80})\s*$` on its first line, capture the title and **remove that line and its newline from the reply**.
3. Title hygiene: collapse whitespace, strip `<>&"'` and control chars, hard cap 80 chars.
4. Returns `{ reply, ready, title? }`.
5. If there is no match (model ignored the marker) and `subject` is empty → deterministic fallback: first 6–8 words of the first message, punctuation stripped, cap 48 chars. Implemented as `deriveCaseSubject({ modelTitle, firstMessage })` — pure, unit-tested.

The marker never reaches the client, never reaches a report, never reaches a log line that renders content to the user. The extraction happens before the existing HTML-escape/`MAX_MESSAGE_LENGTH` truncation, so what the buyer finally sees is identical in shape to today's reply with the marker line removed.

### Storage & fan-out

- `caseService` gains `setCaseSubject(caseId, subject)` — mirrors `setCaseModel` (update `supportCase.subject`). Called by the message controller **only when a title was extracted (or fallback derived) on the first client message AND the case's current subject is empty/null**.
- `POST /api/support/cases/:caseId/messages` response gains `subject` when it was just set.
- SSE: no new event needed for the name itself; the client applies the subject from the POST response. Other open tabs pick it up on the next `refresh` or navigation.

### Client changes (`useSupportCase.js`, workspace)

- `useSupportCase` POST-response merge: if `data.subject` is present, apply it to `caseRow` (same path as `sent`/`confirmed`).
- Header sub-line (under "AI Investigation"): render the title, truncated, title-case as generated. Before any title exists it keeps rendering `NEW CASE`.
- Case-reference card: title on its first line (truncated), short id underneath as today.
- Recent-cases list: unchanged code — it already renders `subject || summary || "Untitled case"`, so it renames itself for free.
- Report rendering: unchanged. `buildCaseSummary` produces the same combined line with a better subject.

### Edge cases

- Marker on a later message → ignored (extraction only armed on the first client message; otherwise the line is **stripped and no title is set** — never rendered).
- Model refuses / times out / hallucinates sans marker → deterministic fallback; investigation unaffected.
- Subject already set (e.g. opened with a subject in the future) → no write; reply still has the marker line removed.
- Multiple first messages racing (two tabs) → the write is idempotent-ish: only when empty; last writer wins on a tie, both are short and reasonable.

## Feature 2 — AI activity tree

### 2a. Sanitized label helper (new, pure)

`server/services/investigation/activityLabel.js`:

```js
// Maps an opencode tool part -> { kind, label }. Basename only, never a path.
export function activityLabelFor(part)
```

- Reads `part.type === "tool"`, `tool` name (`part.name || part.tool`), `part.state?.input`.
- File-ish tools (`read`, `read_file`, `write`, `edit`, `cat`, `open`): locates a path-ish input value under `path`, `filePath`, `file`, `filepath`, `target`; if found, returns `{ kind: "read", label: \`Reading \${basename}\` }` (verb by tool family). Basename via `path.basename` after stripping quotes/spaces/backslashes; must contain a `.` or `/` separator handled safely; rejects `..`.
- Search tools (`grep`, `glob`, `rg`, `find`): `{ kind: "search", label: "Searching code" }` — the **pattern is never shown**.
- Everything else: `{ kind: "other", label: \`Using \${tool}\` }` with the tool name sanitized (letters/digits/`-_` only, cap 32).
- Any failure → `{ kind: "other", label: "Working" }`.

### 2b. Runtime emission

`waitForAssistantTurn` (`server/services/opencodeTurns.js`) gains an **optional** `onToolSettled(part)` callback. `runAgentPrompt` (or the queue's role runner) passes one that:

1. Dedupes per poll cycle inside the event loop's own part-scan: a part is announced once per `(role, toolName, input-hash)` — a repeated identical tool call collapses into the single row it already produced (rendered with a `×N` suffix if N > 1 is easy; if not, a single row is acceptable). Never keyed on array index (the list reorders).
2. Runs `activityLabelFor(part)`.
3. Computes a stable event id (`crypto.randomUUID()`).
4. Emits `support.case.activity` via the same `emitCaseEvent` path as `support.case.progress`:

```json
{ "caseId": "…", "role": "repo", "id": "…", "kind": "read", "label": "Reading walletService.js", "status": "done", "at": "…ISO" }
```

- Emitted when `part.state?.status` transitions into `completed`/`failed`/`error` and has not been announced this turn (per the dedupe rule above).
- Status `failed` for error tools. Tool call events carry no `error` text (no reasoning, no payload).
- Emission failure logs and continues — same discipline as progress events.
- `waitForAssistantTurn`'s signature and default behavior are unchanged when the callback is absent (unit-testable).

### 2c. Persistence

`finishRow(row, { …, tool_log })` stores what `runAgentPrompt` returns — so the labels are computed **once, at the point the full part objects exist**: in `runAgentPrompt`'s `toolCalls` normalization, each entry becomes `{ tool, status, error?, kind, label }`, with `kind`/`label` from the same `activityLabelFor(part)` as the live path. No path is ever written to `tool_log`. Older entries without `label` render as `Using <tool>` with the tool name sanitized the same way; entries with nothing usable are skipped. The investigation rows and finish flow need no other change.

`GET /api/support/cases/:id` response gains `investigations: [{ role, status, completed_at, tool_log }]` — the minimal projection needed for the tree (no findings, no evidence, no prompts). Only rows for this case, `select`ed narrowly.

### 2d. Client render

New `ActivityTree` component (`src/components/support/ActivityTree.jsx`):

- Props: `activity` (merged live+persisted rows), `running` (case investigating/verifying/reporting or any role running), `status`.
- **While running**: header row — pulsing dot + `Working…` and the active role (`repo · Inspecting the codebase…`); chevron-expanded by default on first streaming item, collapsible per user toggle; rows appear live as events arrive.
- **Settled rows**: muted, `|_ Reading walletService.js` style with the verb by kind (`Reading…`, `Searching code`, `Using <tool>`); failed rows get a subtle warning glyph.
- **After completion**: header collapses to `How this was investigated · N steps · <duration>` with a chevron; collapsed by default. Persisted rows from `investigations.tool_log` merge in (dedupe by `id` for live overlap; by role+index for the rest).
- Renders inline **above the assistant's current reply** in the transcript (same column, same max-width); never inside a bubble, never reorders messages; the AI's text is untouched.
- `useSupportCase` gains `activity: []`: whitelist `support.case.activity` in `caseRealtime.js`; reducer action `activity` dedupes by `id`, caps the list at 200; `load:ok` seeds persisted rows from `investigations`.
- Right rail keeps the existing six-step rail unchanged (the tree is additive).

### 2e. Contract changes

`server/realtime/realtimeBus.js` — add `activity: "support.case.activity"` to `CASE_EVENTS`.
`src/lib/caseRealtime.js` — add `support.case.activity` to `CASE_EVENT_TYPES`.
`docs/contracts.md` — add §4.6 `support.case.activity` (shape above, exactly these fields, no others; server owns semantics; client must tolerate unknown `kind`).

## Testing

- Unit: `activityLabel.js` sanitizer (path basename, traversal rejection, quote/space strip, unknown tools, unreadable input); `deriveCaseSubject` (marker present/absent, fallback shape); `useSupportCase` reducer (activity dedupe/cap); controller response gains `subject` only when set.
- Integration (live): local run of a case through `collecting → investigating` shows rows streaming; reload mid-run → rows re-appear from persisted `tool_log` + progress rows; reload after completion → collapsed tree with correct count; marker never visible in any message; unnamed pre-existing cases keep "Untitled case".
- Manual: title appears in header + recent cases within one round trip of the first message; second message carries no marker; report summary shows the title; standing screenshots in `qa-screenshots/`.

## Rollout

- Ship naming first (one commit), then live tree (one commit), then persistence + collapsed report tree (one commit).
- No migration; additive `tool_log` shape only.
- No pricing/entitlement changes. No new env vars. `CASE_AI_TIMEOUT_MS` unchanged (60s).
