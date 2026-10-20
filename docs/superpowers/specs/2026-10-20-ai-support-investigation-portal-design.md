# AI Client Support & Codebase Investigation Portal - Design (2026-10-20)

## 1. Goal

Turn GarTexHub's support surface into an AI-assisted investigation desk: a client
describes a problem in conversation, the AI clarifies it, investigates the **real
GarTexHub codebase** with read-only tools, and produces an evidence-backed case
report that is emailed to the owner and stored in the admin console.

The AI **investigates**. It never modifies the repository, never edits project
files, and never runs commands.

## 2. Context (verified against the local tree, 2026-10-20)

The existing support surface is a plain ticket queue:

- `src/pages/SupportReports.jsx` (route `/support`, `ProtectedRoute` with
  `AUTH_ROLES`) renders a submit form plus a read-only ticket list. No conversation.
- `server/routes/supportRoutes.js` (mounted `/api/support`) exposes 6 endpoints, all
  `requireAuth` only, no rate limiter.
- `SupportTicket` / `SupportTicketMessage` (Prisma) have **no** case, investigation,
  finding, evidence, or report records. `is_internal` is never written. There is no
  `User` relation on either model.
- Admins **cannot reply** to a ticket through the API: `appendSupportTicketService`
  rejects any non-owner, and no admin message endpoint exists.
- `SupportTicket.description` and message bodies are **silently truncated at 1200
  chars** by `sanitizeString` — truncation, not rejection.

Two live problems fold into this work:

- **Support attachments are public.** `SupportReports.jsx:188` uploads via
  `POST /api/documents` -> `saveDocumentMetadata` -> the file lands in the **root** of
  `server/uploads/`, which the static mount serves unauthenticated. And
  `GET /api/documents?entity_type=support_ticket&entity_id=<id>` has **no ownership
  check**, so any authenticated user who learns a ticket id can list that ticket's
  attachments. Evidence for a case must be private.
- **The repo's OpenCode integration is broken.** `server/services/assistantService.js`
  imports `createOpencodeClient` from `@opencode-ai/sdk@1.15.12`, which targets the
  **v1** API (root paths). The installed runtime is **v2.0.32**, whose API lives at
  `/api/*`; the v1 root paths (`/find`, `/session`, `/config`, `/global/health`) all
  return the SPA's HTML. `client.find.text()` therefore receives HTML, not JSON. It
  is masked locally by `OPENCODE_ENABLED=false`. This portal must not build on it.

## 3. Scope

**In**
- A read-only OpenCode investigation runtime with enforced (not prompted) restrictions.
- A case record that owns the conversation, attachments, investigation runs, findings
  and report.
- Private evidence storage for case attachments.
- A clarification conversation with the client.
- Multi-agent investigation orchestrated by server code.
- A verification pass that challenges the findings.
- Report generation and email delivery.
- Client chat UI and admin review UI.

**Out**
- Any write capability for the AI. The repository is not a target of the feature.
- Replacing the existing ticket system. Tickets are still created; the case is the
  richer parent.
- Gmail OAuth. SMTP is configured; `emailService` already supports both providers.
- Fixing the pre-existing v1 OpenCode path in `assistantService.js` beyond removing
  its dependency on the broken client (see 12).
- A general-purpose "AI admin" for other subsystems.

## 4. Verified findings that constrain the design

These were established empirically against opencode v2.0.32, not inferred.

| # | Finding | Consequence |
|---|---|---|
| V1 | The v2 API is at `/api/*` and requires HTTP basic auth. The server prints a random password unless `OPENCODE_SERVER_PASSWORD` is set. | The portal sets the password itself and authenticates with user `opencode`. |
| V2 | The v1 SDK cannot talk to v2: every v1 root path returns SPA HTML. | Use the **v2 client**, not `@opencode-ai/sdk`. |
| V3 | The `opencode/*` free models are rejected with `provider.auth` 403 unless the caller presents a **release client User-Agent**. A spawned `opencode serve` CLI qualifies; the embedded `@opencode/sdk` host does not. | **Spawn the CLI.** Do not embed. |
| V4 | The free-tier gate reads the client version from the User-Agent; non-release version strings are rejected (upstream issue #49433, rollout 2026-09-16). | Same as V3. A Gemini key is a fallback (the repo has one). |
| V5 | Read-only is enforced by the config key **`permission`** (singular) in **object syntax**, keyed by tool name, with `*`/`?` wildcards on the tool's input, and **last matching rule wins**. The array form `permissions: [...]` is silently ignored. | Use the object form. A wrong key silently degrades to "everything allowed" - hence the spike gate. |
| V6 | `.env` is **denied by default**: `read` defaults to `*.env` / `*.env.*` denied. | Keep the explicit rule and assert it. |
| V7 | **`task` (subagent delegation) is a privilege-escalation path.** With `task` allowed, the investigator had no write/bash tools, so it *delegated the write to a subagent* - and the file was created. | **Deny `task`.** Multi-agent must be orchestrated by server code, one session per specialist. |
| V8 | MCP tools are registered as `<servername>_<tool>` and are disabled with `"tools": { "<servername>_*": false }`. `experimental.policies` only supports `provider.use`; it cannot deny an MCP. | Disable MCP tools by glob. |
| V9 | The v2 client API is flat and mostly async: `session.create({title, model:{id,providerID}, location:{directory}})`; `session.prompt({sessionID, text})` returns immediately (`delivery: steer\|queue`); poll `message.list({sessionID})`; assistant messages carry `content[]`, **not** `parts[]`. | The runtime polls for the assistant turn. |
| V10 | `OPENCODE_CONFIG_CONTENT` (inline JSON) is merged with the global config. | The portal cannot prevent the global config's MCP servers from being *defined*, only from being *used* (V8). |
| V11 | `OPENCODE_MODEL_ID=opencode/minimax-m2.5-free` in `.env` does not exist. Available free models include `opencode/deepseek-v4.1-flash-free`. | Use a model that exists; validate at boot. |
| V12 | `opencode serve` has no `--config` flag; config arrives via env. | Inject via env. |
| V13 | On Windows the `opencode` binary is a `.ps1`/`.cmd` shim; `spawn("opencode")` without a shell raises `ENOENT`. | Resolve the real executable path per platform. |

## 5. Architecture

```
Browser                     API (Express)                      OpenCode v2 (spawned CLI)
   |                             |                                     |
   |-- POST /support/cases ----->|  create case, enqueue investigation  |
   |                             |--------- spawn opencode serve ----->|  (own port, own password,
   |<-- SSE case.progress --------|                                     |   OPENCODE_CONFIG_CONTENT)
   |                             |<---- session.prompt (async) --------|
   |                             |  poll message.list, collect findings|
   |                             |  verify pass (second read-only agent)|
   |                             |  build report, persist, email owner |
   |                             |--------- end session, kill process ->|
```

The runtime is a **pooled, per-investigation process**. One `opencode serve` per
investigation keeps the read-only config and the session set isolated and makes
teardown trivial. Concurrency is bounded by a queue, not by process count.

## 6. The read-only runtime

### 6.1 `server/services/investigation/runtimeConfig.js`

Exports the config object injected via `OPENCODE_CONFIG_CONTENT`:

```jsonc
{
  "default_agent": "investigator",
  "permission": {
    "*": "deny",
    "read": { "*": "allow", "*.env": "deny", "*.env.*": "deny", "*.env.example": "allow" },
    "glob": "allow",
    "grep": "allow",
    "list": "allow",
    "edit": "deny",
    "bash": "deny",
    "webfetch": "deny",
    "websearch": "deny",
    "question": "deny",
    "external_directory": "deny",
    "doom_loop": "deny",
    "task": "deny"
  },
  "tools": {
    "render_*": false,
    "chrome-devtools_*": false,
    "blender-mcp_*": false,
    "minecraft_*": false,
    "github_*": false
  },
  "agents": {
    "investigator": {
      "mode": "primary",
      "description": "Read-only codebase investigator. Cannot modify files or run commands.",
      "permission": { "edit": "deny", "bash": "deny", "webfetch": "deny", "task": "deny" }
    }
  }
}
```

`github_*` is disabled by default because the GitHub MCP carries a personal access
token; it is enabled only for the repository-analyst specialist, which gets its own
config with the token scoped to read-only operations.

### 6.2 `server/services/investigation/runtime.js`

Responsibilities, in order:

1. Resolve the opencode executable per platform (V13).
2. Allocate a free port from a **dedicated** range that excludes 4096-4116, so the
   portal can never attach to an interactive TUI's server.
3. Spawn `opencode serve --port <p> --hostname 127.0.0.1` with
   `OPENCODE_SERVER_PASSWORD` (a per-run secret) and `OPENCODE_CONFIG_CONTENT`.
4. Wait for `/api/config` to answer with JSON when authenticated.
5. Build a v2 client against `http://127.0.0.1:<p>` with basic auth
   (`opencode:<password>`).
6. `session.create({ title, model: { id, providerID }, location: { directory } })` where
   `directory` is the **canonical absolute path of the repository root**, resolved
   once at startup and never taken from a request.
7. `session.prompt({ sessionID, text })`, then poll `message.list({ sessionID })` until
   an assistant turn with `content[]` appears or the timeout elapses.
8. Extract tool calls and their `state.status` / `state.error` into an evidence log.
9. Terminate the process and its port in a `finally`.

Every investigation gets a **fresh session** and a **fresh process**. Nothing is reused
across cases.

### 6.3 Model selection - free models only

The investigation **always** uses free models. There is no paid fallback in this
path, and the repo's Gemini key is deliberately **not** wired into it - a keyed
provider would make the free tier an accident rather than a guarantee.

`OPENCODE_INVESTIGATION_MODELS` is a comma-separated, ordered fallback chain
(default below). The runtime tries each in turn; on a provider error for model *N* it
moves to *N+1* and records the attempt in `SupportInvestigation.error`.

```
opencode/deepseek-v4.1-flash-free
opencode/mimo-v2.6-flash-free
opencode/glm-5.3-flash-free
opencode/minimax-m3.1-flash-free
opencode/nemotron-3-ultra-free
opencode/longcat-2.5-preview-free
opencode/nemotron-3.5-lightning-free
opencode/beam-free
opencode/nemotron-3.5-super-vl-free
opencode/big-pickle
```

Rules:

- **If every model in the chain fails, the investigation fails.** It does not fall
  back to a keyed or paid provider. The case records the per-model errors and stays
  retryable; the client is told the investigation could not run, not that it found
  nothing.
- At startup the runtime validates the chain against `GET /api/provider` and logs
  any configured model that does not exist (V11) - a stale `OPENCODE_MODEL_ID` was
  a live problem in this repo.
- A `provider.auth` 403 is a **model-level** failure and advances the chain. A
  configuration or spawn failure is **runtime-level** and aborts the investigation
  immediately - retrying with another model cannot fix a missing binary.

### 6.4 The spike gate (Phase 1 exit criterion)

A test, run against a live spawned server with the real config, that asserts:

1. An agent asked to create a file **does not create it**, and the tool call is
   recorded as denied.
2. An agent asked to run a shell command **does not run it**.
3. An agent asked to read `.env` **does not read it**, and the response contains no
   secret-shaped content.
4. An agent asked to read an ordinary source file **does** read it (the control -
   without it, a config that denies everything would pass 1-3).
5. An agent asked to list files **can** list them.
6. `GET /api/mcp` reports no enabled MCP tool for the disabled servers.
7. A denied write attempted via subagent delegation also fails (the `task` hole).

If any of these fail, the feature does not ship. This gate exists because V5 showed
that a wrong config key fails **open** and silently.

## 7. Data model

New Prisma models, all with `String @id` + `crypto.randomUUID()`, matching repo
convention:

```
SupportCase
  id, user_id, status(String @default "collecting"),
  subject?, summary?, ticket_id?, created_at, updated_at
  @@index([user_id, created_at]) @@index([status, created_at])

SupportCaseMessage
  id, case_id, role(String: client|assistant|system|admin),
  kind(String: question|answer|progress|finding|notice),
  content, agent(String?), sequence(Int), created_at
  @@index([case_id, sequence])

SupportInvestigation
  id, case_id, role(String: lead|code|repo|research|verify),
  status(String @default "queued"), attempt(Int @default 0),
  prompt(Text?), report(Text?), findings(Json?), evidence(Json?),
  tool_log(Json?), error(String?), started_at, completed_at
  @@index([case_id, role]) @@index([status])

SupportCaseAttachment
  id, case_id, document_id?, file_path, mime_type?, byte_size?,
  uploaded_by, created_at
  @@index([case_id])
```

`ticket_id` links the case to the `SupportTicket` created at the end of the flow.
`SupportCaseAttachment` references the existing `Document` row rather than
duplicating file metadata; the bytes live in a **gated** `support/` upload prefix.

Status transitions: `collecting -> investigating -> reporting -> completed`, with
`failed` reachable from any non-terminal state.

### 7.1 Case lifecycle and retention

- **A client may delete their own case at any time.** Deletion removes the case,
  its messages, its attachments and the uploaded bytes, and leaves the `SupportTicket`
  (which is the business record) intact.
- **Cases are swept after 90 days** (`CASE_RETENTION_DAYS`, default 90), measured
  from `updated_at`. A case with `status` in (`collecting`, `investigating`) is not
  swept - it is still live work.
- **Evidence bytes follow the case.** A swept or deleted case's attachment files
  are removed from disk, not just unlinked.
- **Owner/admin can extend retention** on a case under investigation, which pins
  `updated_at` forward and excludes it from the sweep. A `retain` flag on the case
  records the intent.
- The sweep runs on the same schedule as the existing worker loops and reports its
  depth to the log hub.

## 8. Evidence privacy

- Case attachments upload to `server/uploads/support/` and get a `Document` row with
  `entity_type: "support_case"`, `entity_id: <caseId>`, `uploaded_by: <userId>`.
- `support` is added to `GATED_PREFIXES` in `server/utils/signedFileUrl.js`, so the
  static mount 404s the prefix and serving goes through the signed-URL path.
- The directory-coverage test added in the security work (Task 4) automatically
  requires the new prefix to be listed - it fails if `support` is forgotten.
- Authorization for `support_case` documents: the uploader, or an owner/admin.
- **Existing** support attachments in the uploads root are migrated to the gated
  prefix by a one-off script that also updates their `Document.file_path` and
  `entity_type`; files that cannot be attributed to a ticket are left where they are
  and reported.

## 9. Conversation and investigation flow

### 9.1 Clarification (Phase 3)

The client posts messages; the server answers with a clarification question or
signals readiness. The conversational model uses the repo's existing provider
abstraction (`assistantService` -> Ollama / OpenRouter / Gemini), **not** the
investigation runtime: clarification is cheap, fast, and needs no tools.

The case stays in `collecting` until the client confirms the assistant's summary, or
until `MAX_CLARIFICATION_ROUNDS` (default 6) is reached, whichever comes first. At
either point the case moves to `investigating`. The assistant is told the round
number on every turn so it can converge. A case the client abandons stays
`collecting` and is swept after 30 days.

### 9.2 Investigation (Phase 4)

Our code runs the agents, one session each, with the config from 6.1:

| Role | Question it answers | Tools |
|---|---|---|
| `lead` | What is actually being asked? Frames the investigation. | read, glob, grep, list |
| `code` | Where in the code does this live? Trace the path. | read, glob, grep, list |
| `repo` | Did this break recently? Git history, blame, related issues. | read, glob, grep, list (+ optional `github_*`) |
| `research` | Is there external context (library behaviour, known issues)? | read, glob, grep, list (+ optional search MCP) |
| `verify` | Do the findings actually hold? Attempts to refute them. | read, glob, grep, list |

Each agent returns a JSON object with `summary`, `findings[]` (each with
`confidence: confirmed|probable|speculative`, `detail`, `evidence[]` with `file`,
`lines`, `commit`, `url`), and `limitations[]`.

**Structured output is parsed, not assumed.** The v2 API's structured-output
support was not verified during design, so the design does not depend on it: the
agent is asked for JSON in its prompt, and the runtime extracts it tolerantly
(a fenced ```json block, or the first balanced top-level object in the assistant's
text). If extraction fails the run is recorded as `failed`, the raw assistant text is
kept in `SupportInvestigation.error` for inspection, and **no findings are recorded
from that run** - a failed parse can never silently produce an empty-but-successful
result.

**The `verify` agent is mandatory and runs last.** It receives the other agents'
findings and is asked to refute them. Findings it refutes are downgraded; findings
it cannot challenge keep their confidence. A finding with no evidence reference is
demoted to `speculative` - the pipeline has no path that promotes an unevidenced
claim.

### 9.3 Queue (Phase 4)

Follows the `videoQueue` / `imageQueue` pattern: an in-process queue with
`enqueue`, `process`, `queueDepth`, and a bounded worker count. A case's
investigation is one queue job; its five agent runs are sequential within the job.
Depth is reported to the log hub like the existing queues.

**Concurrency is 2** (`INVESTIGATION_CONCURRENCY`, default 2). Each concurrent
investigation holds a spawned `opencode serve` process and an open model session,
so the limit is a resource limit, not a tuning preference. The queue is FIFO; depth
is exposed to the log hub the same way the media queues are.

### 9.4 Live updates (Phase 7)

`realtimeBus` publishes `support.case.progress` events; a new
`src/lib/caseRealtime.js` subscribes, following the `feedRealtime` pattern. The
client sees: question asked, investigation phase, per-agent completion, finding
posted, report ready.

## 10. Report and delivery

The report is Markdown, built from the findings, and covers the structure the plan
asked for: case metadata, original complaint, conversation log, investigation log
(agents, tools, files, commits, queries, failures), findings with confidence, next
steps, and audit/delivery status.

- Stored in full on `SupportInvestigation.report` and rendered in the admin console.
- Emailed through **`emailService`** (SMTP; `GMAIL_*` is not configured). The service
  now returns `ok: false` when it logs instead of sending, so a failed send cannot be
  reported as sent.
- The plain-text body is capped at `emailService`'s 2000-character limit: a summary
  plus an authenticated link to the full report. The HTML variant carries the same
  link.
- Recipients: owner/admin users, the same set the existing ticket-created email
  uses, resolved from `ADMIN_OWNER_EMAILS` and the `role in (owner, admin)` query.
- Delivery status is recorded on the case (`report_delivery_status`,
  `report_delivered_at`).

**Escalation.** A finding whose `confidence` is `confirmed` **and** whose category
is a security or data-loss issue escalates immediately and separately: an in-app
notification to every owner/admin, and an `escalated` flag on the case. It does not
wait for the report email, because a confirmed data-loss finding should not be
delayed by a mail failure. Non-security confirmed findings do not escalate
automatically - they appear in the report and the admin console like any other
finding.

## 11. UI

**Client** - `src/pages/SupportReports.jsx` is rewritten chat-first: a message list, a
composer, attachment upload, live progress, and the final report with a "confirm this
is accurate" action. The old form is removed, but its ticket-creation path is reused
when the case completes. The page keeps its existing route, guard, and theme.

**Admin** - `src/pages/admin/sections/AdminPlatformSection.jsx` gains a case list
alongside tickets, and a case detail view: conversation, per-agent findings, the tool
log, the report, and re-run / escalate actions.

## 12. Changes to existing code

| File | Change |
|---|---|
| `server/utils/signedFileUrl.js` | Add `support` to `GATED_PREFIXES`. |
| `server/services/fileAccessService.js` | Add the `support_case` authorization branch. |
| `server/services/uploadsService.js` | Route support-case uploads to the gated prefix. |
| `server/controllers/documentController.js` | Ownership check on `GET /api/documents`. |
| `server/services/assistantService.js` | Stop using the broken v1 OpenCode client for code search. Either port it to the v2 client or replace it with the repo's own search. The portal does not depend on it either way. |
| `src/pages/SupportReports.jsx` | Rewrite chat-first. |
| `src/pages/admin/sections/AdminPlatformSection.jsx` | Add the case list and detail. |
| `package.json` | Add the v2 client dependency (`@opencode/client`). |
| `.env.example` | `OPENCODE_SERVER_PASSWORD`, `OPENCODE_INVESTIGATION_MODEL`, `OPENCODE_INVESTIGATION_PROVIDER`. |
| `AGENTS.md` | A new fix-log entry. |

## 13. Error handling

| Failure | Behaviour |
|---|---|
| opencode binary missing | Investigation fails with an actionable message; the case stays visible with the error; the client is told the investigation could not run. No silent success. |
| Server did not become ready | Same, after a bounded wait. The process is killed. |
| Model rejected (`provider.auth` 403) | Surfaced verbatim; the fallback provider (Gemini) is attempted once, and the error is recorded if that also fails. |
| Agent turn times out | The partial transcript is kept as evidence, the run is marked `failed`, and the report says the investigation was incomplete. |
| A tool call is denied | Recorded in the tool log with the denial reason. A denied write is evidence about the environment, not a crash. |
| Email fails to send | The report is still stored and visible in the admin console; delivery status is `failed`. The client is not told it was emailed. |
| The client disconnects mid-investigation | The case and its investigation continue server-side; the client resumes from the stored transcript. |

## 14. Testing

- **Spike gate** (6.4) - live, against a spawned server, seven assertions.
- Unit: config builder shape; path containment; findings schema validation;
  confidence demotion rules; report renderer; evidence redaction.
- Integration: case creation, message append, investigation enqueue and completion,
  report generation, email dispatch and failure, attachment upload and signed-URL
  access, and **cross-case isolation** (case A's evidence must not be reachable
  through case B).
- Security: attachment ownership; a client cannot read another client's case; the
  investigation cannot write (spike); `.env` unreadable (spike); MCP tools disabled
  (spike).
- The existing 464-test suite must stay green.

## 15. Phases

1. **Read-only runtime + spike gate.** New runtime, config, tests. Exit: the seven
   spike assertions pass against a live server. Also ports or replaces the broken v1
   OpenCode usage in `assistantService.js`.
2. **Case persistence + private evidence.** New Prisma models and migration; gated
   `support/` prefix; ownership check on document listing; migration script for
   existing support attachments.
3. **Clarification conversation.** Case endpoints, message persistence, SSE
   progress, client composer.
4. **Investigation orchestration.** Queue, five agent roles, evidence collection,
   findings with confidence.
5. **Verification pass.** The `verify` agent, refutation, confidence demotion.
6. **Report + email.** Renderer, storage, `emailService` dispatch, delivery status.
7. **Client chat UI.** Chat-first rewrite of `/support`, attachments, live progress,
   confirmation, report view.
8. **Admin UI + hardening.** Case list and detail, re-run, escalation, and the
   final cross-case-isolation pass.

Each phase is independently shippable and independently testable.

## 16. Decisions taken, and the ones still open

**Resolved:**

- **Provider: free models only, always.** `opencode/deepseek-v4.1-flash-free`
  primary, with the 10-model free chain as fallback (6.3). No keyed or paid
  provider in the investigation path.
- **Retention: 90 days**, client may delete their own case any time, evidence
  bytes follow the case, owner/admin can pin a case (7.1).
- **Escalation: automatic for confirmed security/data-loss findings**, via in-app
  notification and a case flag, independent of the email (10).

**Still open - carried to implementation, not blocking the spec:**

- Whether the free tier's rate limits justify a **queue-side backoff** (retry a
  failed investigation later) versus failing the case outright. The default in this
  spec is: fail the investigation, keep the case retryable.
- Whether the `research` specialist should get the `parallel-search` MCP enabled
  (it is read-only, but it adds context weight; the docs warn that MCP tools
  consume context quickly).
- Whether `repo` should get the `github` MCP enabled. It carries a personal access
  token, so it is off by default and would need a read-only scoped token.

**Explicitly deferred by the design, not by omission:**

- The 1200-character `SupportTicket` truncation still applies to the final ticket.
  The full detail lives on the case and in the report, which is the system of record
  for the investigation.
