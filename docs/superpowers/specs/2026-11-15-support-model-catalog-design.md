# GarTexHub Support — Dynamic Model Catalog + Buyer Model Choice (Phase 2)

Date: 2026-11-15
Status: Approved design (brainstormed with the owner)
Program: Phase 2 of the GarTexHub support upgrade (1 ✅ two modes · 2 this file · 3 premium workspace UI · 4 MCP read-only wiring · 5 detailed email report)

## Goal

Let the owner manage the investigation/clarification model set dynamically (discover the free OpenCode catalog at runtime instead of the stale static chain), let the buyer pick any owner-allowed model per case, switchable per turn, for the whole conversation (clarification + five investigation agents).

## Non-goals (this phase)

- No per-agent model assignment (owner-picks-per-role deferred).
- No premium UI (Phase 3), no MCP tools (Phase 4), no email-report upgrade (Phase 5).
- Paid models remain impossible to select, anywhere. iceman-free is permanently excluded.

## Decisions (owner-approved)

1. Buyer picker: switchable any time per message send (per-turn), buyer sees only owner-allowed models; applied to BOTH the clarification conversation and the five investigation agents.
2. Persistence: AdminBranding rows + AdminConfigHistory audit (same pattern as the assistant's model pick); no new tables except the `model_id` column on the case row.
3. Catalog: fetched from the public `https://opencode.ai/inference/v1/models` with 5-min cache + stale fallback.
4. iceman-free: permanently excluded everywhere (owner cannot enable it — trains on prompts).
5. Clarification on OpenCode: reuse the assistant's isolated OpenCode runtime (`ensureOpencodeServer`, the same read-only config and 450 MiB memory guard) — no new server class, no extra process; if the runtime cannot start (Render free), fall back to the existing env-configured chain (openrouter/gemini/ollama) → the existing "none" static answer path.
6. LongCat 2.5 (~100 req/day cap) stays selectable but flagged in the UI; excluded only from the DEFAULT allowlist — owner can enable it explicitly.
7. Clarification answers are single-shot per message (stateless): the prompt carries the stored case history; a fresh short-lived session per clarification call; session deleted after the turn. No orphaned sessions.
8. The model recorded for an investigation run lives on the case row (`model_id`); SupportInvestigation rows already carry `model_id` per role from the investigation queue — unchanged.

## Components

### 1. `server/services/investigation/modelCatalog.js` (new)

```js
export async function getOpenCodeFreeModels({ forceRefresh = false } = {})
```
- Fetches `https://opencode.ai/inference/v1/models`, 10 s timeout, `Accept: application/json`.
- Accepts `payload.data` (array, documented shape) or a bare array.
- Filters: `id.endsWith("-free") || id === "big-pickle"`, provider `opencode`, and `id !== "iceman-free"`.
- Returns `{ models: [{ id, name, providerID: "opencode", created, ownedBy }], cached, fetchedAt, stale? }`.
- Cache 5 min TTL; on fetch failure: serve stale cache (`stale: true`) if present; else throw a typed error (`.status = 503`) with the reason.
- Pure module — no prisma, no other imports besides node/url; unit-testable with an injected `fetchImpl`.

### 2. Persisted settings (`investigationModelConfigService.js`, new, thin wrapper)

Rows (logical, stored as AdminBranding values, JSON-encoded where needed):

| Key | Value |
|---|---|
| `ai.opencode.investigation_allowed` | JSON array of ids, e.g. `["minimax-m3.1-flash-free","deepseek-v4.1-flash-free","mimo-v2.6-flash-free","glm-5.3-flash-free","big-pickle"]` — default is the live free catalog at first read (live catalog minus `longcat-2.5-free` and `iceman-free`) |
| `ai.opencode.investigation_default` | single id; owner-set; default `minimax-m3.1-flash-free`; must be ∈ allowed |
| `ai.opencode.buyer_model_select` | `"1"`/`"0"`; default `"1"` |

- `getInvestigationModelConfig({ freshCatalog } = {})` → `{ allowed, default, buyerSelectEnabled, catalog, catalogStale, catalogFetchedAt }`.
- `setInvestigationModelConfig({ allowed?, default?, buyerSelectEnabled? }, actorId)` — validation: every allowed id ∈ live catalog (or — if catalog unreachable — ∈ known free ids from the static DEFAULT chain); default ∈ allowed; buyer toggle must be boolean. AdminConfigHistory row `config_type: "investigation_model_config"` with `changed_by` and a JSON snapshot.
- Non-allowed-but-selectable confusion is impossible: every read intersects persisted allowed with the live free catalog at request time (stale cache tolerated).

### 3. Admin routes — `GET/PUT /api/admin/support-models` (owner/admin)

- `GET` → `{ ok: true, catalog: [...], allowed: [...], default, buyerSelectEnabled, catalogStale, catalogFetchedAt }`.
- `PUT` body `{ allowed?, default?, buyerSelectEnabled? }` → validates (400 with per-field reason on invalid), persists, writes audit history, returns the same shape as GET.
- 503 when the catalog is unreachable AND no cache exists.
- Controllers in `server/controllers/adminSupportModelController.js`; service in `investigationModelConfigService.js`. Wired into `server/server.js` next to `/api/admin/support-tokens`.
- UI: new "Investigation Models" tab in `AdminAISection.jsx` (after OpenCode Models): catalog table (id/name/ownedBy/created, availability badge, "Selectable" toggle per row), default-model dropdown (allowed only), "Allow buyer to change model" switch, "Refresh catalog" button, save + force-refresh.

### 4. Case model column + buyer route

- `SupportCase.model_id String?` — migration `20261116000000_add_case_model_id`, `ALTER TABLE "support_cases" ADD COLUMN IF NOT EXISTS "model_id" TEXT;`, applied raw to Aiven (no ledger) per Phase 1 procedure + rollout note append.
- `PUT /api/support/cases/:caseId/model` body `{ modelId }` — auth: case owner (existing case ownership rule — same middleware as the case router; support token caller counts as the buyer) → `{ modelId | null }`; `null` clears the pick (falls back to default). Validates: buyerSelectEnabled; modelId ∈ allowed (or null). Rate-limited like other write routes.
- `GET /api/support/cases/:caseId/model` — returns `{ modelId, effectiveModelId, default, buyerSelectEnabled, allowed: [...] }` for the composer badge.

### 5. Investigation queue — `pickModels` → `pickCaseModels(client, caseRow)`

Priority order per investigation:
1. case row's `model_id` (if set, allowed today, and offered by the runtime) — primary, and recorded on every SupportInvestigation row.
2. Remaining allowed ids in allowlist order (filter by runtime's actual list).
3. `DEFAULT_MODEL_CHAIN` (free models) minus already-used — resilience backstop.
4. Hard rule: `iceman-free` never appears. Timeouts never retried (unchanged).

### 6. Clarification on OpenCode — `caseConversationService.js` extension

- New provider branch `"opencode"` eligible ONLY per request: `answer({ …, requestedModel })` — when `case.model_id` is set (or the caller passes `requestedModel`), resolution becomes: `requestedModel` (if allowed + free + offered) → else owner default → else existing env chain → else `"none"`.
- Transport: import the shared warm OpenCode runtime via a tiny new export from `assistantService.js` — `getAssistantRuntimeClient()` (returns `{ client, port }` or null when the server is down or cannot start). The clarification call uses the SAME hard `DEFAULT_TIMEOUT_MS` (8 s) timeout + abort signal as the env providers, calls `client.session.create({ title, model: { id, providerID: "opencode" }, location: { directory: REPOSITORY_ROOT } })`, prompts once with the built prompt (system + history + user question), reads via `waitForAssistantTurn` with an 8 s timeout, deletes the session in a `finally`, races the whole call against the abort signal exactly like today.
- Boundary exception, documented in code: `caseConversationService.js` imports `getAssistantRuntimeClient` from `assistantService.js` — a scoped, single-purpose exception to the module's self-contained rule (never more than this import; the spawn itself is owned by the assistant service).
- Cold runtime or any failure (spawn refused, model refusal, timeout, empty answer): log `clarification_opencode_failed { model, reason }` and fall back to the env chain → the static offline question. NEVER throws, NEVER hangs beyond 8 s, NEVER fabricates `ready: true`.
- History: unchanged — prompt is stateless; case message history is already loaded from the DB; history is NOT re-played into the model; the system prompt carries the context as it does for the env providers. A fresh ephemeral session per message.
- Output contract unchanged: `{ reply, ready }` extraction identical; on any failure the service returns the env chain/"none" answer exactly as today.
- Selection bookkeeping: no new column; log `logInfo("clarification_model_used", { case_id, model })` so the investigation audit trail can show which model clarified.

### 7. Buyer UI (SupportReports.jsx, composer area)

- Compact dropdown in the composer footer (next to the send button): shows effective model id + a subtle "Free" badge; disabled when `buyerSelectEnabled` is false (then shows the effective default, read-only).
- Changing the dropdown → `PUT /api/support/cases/:caseId/model { modelId | null }` → on 200 update composer state immediately (the badge shows the new id); buyer sees the change on the NEXT sent message, never mid-turn.
- Copy (honest labeling): "Investigation model — applies to clarifying chat and the technical investigation."
- On 401 (token revoked): unchanged handling from Phase 1.
- No model list is ever shown that isn't owner-allowed.

## Data flow (per buyer message, model set to deepseek)

1. Buyer types → send → `POST /api/support/cases/:caseId/messages { message }`.
2. Conversation service reads case (it must read the row anyway for history) → sees `model_id = deepseek-…` → tries OpenCode via assistant runtime; on failure → env chain → `"none"`.
3. Reply streamed/stored as today.
4. After confirmation, the five agents run; `pickCaseModels(client, caseRow)` starts with `deepseek-…`; SupportInvestigation rows record it.

## Error handling

- Catalog down at admin view time + no cache → 503 with message; admin UI shows "catalog unavailable — showing cached/last-known" (stale badge) when cache exists, or an error state otherwise.
- Catalog down at buyer message time → allowed/default come from the persisted rows (not the network); the runtime intersect uses the runtime's own `model.list()` (a DIFFERENT source — the spawned server's offers), so buyer flow never depends on `inference/v1/models` being reachable.
- modelId withdrawn by owner mid-case → investigation falls back to allowlist order (case pick skipped); buyer's next message answer also falls back to default; a one-line UI notice is shown when this happens (detected by comparing composer effective model vs stored pick — best effort, not guaranteed; a silent fallback is acceptable and safe).
- iceman-free can never appear in allowed (PUT validates), in default, in the queue, or in the buyer dropdown.

## Security notes

- The buyer dropdown never reveals internal config (allowed ids, defaults, history). It reveals only the allowed ids and names — they are client-visible by design; no secrets involved.
- The OpenCode clarification path runs inside the same isolated read-only runtime configuration as the assistant (no MCP, no writes, `.env` denied) — buyer prompt injection cannot escalate the clarification agent.
- `SupportCase.model_id` is an opaque string; every reader validates against the persisted allowlist — a hand-crafted value is rejected.

## Testing

- Unit: `modelCatalog` (fixture JSON → filters, cache TTL, stale fallback, iceman excluded, malformed payload).
- Unit: `investigationModelConfigService` (get/set incl. allowlist ∩ live catalog, default∈allowed, audit row, 503 when no cache and catalog down).
- Unit: `pickCaseModels` (case pick first; iceman never; fallback chain when case pick withdrawn; runtime intersection respected).
- Unit: clarification OpenCode branch (mocked runtime client; refusal/timeout → falls back to env chain → "none" path; session created + deleted).
- Unit: `PUT /cases/:id/model` (buyer/support-token can set/clear; owner of case vs stranger 403/404; invalid id 400; buyer-select disabled → 403).
- Integration count rises by ~20; `npm test` green.

## Rollout

- Migration applied raw per Phase 1 procedure (Aiven, no ledger) + rollout note append.
- New env vars: NONE (catalog URL is a constant).
- Behavior when disabled: `buyer_model_select = "0"` hides the picker; all cases run the default.
