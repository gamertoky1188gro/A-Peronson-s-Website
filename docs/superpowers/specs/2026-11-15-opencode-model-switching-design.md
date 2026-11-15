# OpenCode Assistant — Model Fetching, Switching & Auto-Fallback

Date: 2026-11-15
Status: Approved design (brainstormed with the owner)

## Goal

Give the floating assistant the same free-tier model resilience the support
investigation portal has, plus an admin UI to see and switch the active model
at runtime. Today the assistant is pinned to one model
(`OPENCODE_MODEL_ID`, default `minimax-m3.1-flash-free`); when that model
refuses (429 / quota / provider error) the opencode path returns nothing and
the assistant silently falls through to HTTP providers or the FAQ engine.

Non-goals (explicitly out of scope):

- The support-investigation portal is untouched; it keeps its own chain.
- No paid models anywhere. The picker shows free-tier opencode models only.
- No new Prisma models; persistence reuses existing tables.

## Decisions (from brainstorming)

1. Admin model picker + assistant auto-fallback. Investigation untouched.
2. Persistence: `AdminBranding` key-value row + `AdminConfigHistory` audit
   entry. Chosen because `adminConfigService` is a local JSON file that does
   not survive Render's ephemeral disk, and a new Prisma model would need a
   hand-applied migration against the shared Aiven DB.
3. Auto-fallback: retry the same turn on the next free model, and surface the
   answering model in the reply envelope.
4. Model set: free tier only, enforced server-side with the existing
   `isFreeOpencodeModel` rule.
5. Picker lives in the existing Admin AI section (`AdminAISection.jsx`,
   `activeCategory === "ai"`), backed by new routes on the assistant router.

## Architecture

```
AdminAISection.jsx
   │  GET/PUT /api/assistant/models   (requireAuth + owner/admin)
   ▼
assistantRoutes.js ──► opencodeModelService.js  (new, server/services/)
                            │  fetchAvailableModels()  ──► v2 client model.list()
                            │  getActiveModel()        ──► AdminBranding → env → default
                            │  setActiveModel(id, id-of-user)
                            │  runAssistantPrompt()    ──► waitForAssistantTurn + fallback loop
assistantService.js
   │  callOpencode()        ──► uses runAssistantPrompt(); returns the outcome
   │  createUserOpencodeSession() / cachedSessionMatchesModel()
   │     compare against RESOLVED active model (admin pick wins over env)
   ▼
response metadata { model, attempts }   (REST /ask envelope, and streaming onComplete payload)
```

## Components

### 1. `server/services/opencodeModelService.js` (new)

- `fetchAvailableModels(client?)` — flatten `client.model.list()` (same shape
  handling as `listAvailableModels` in `investigation/opencodeRuntime.js`),
  filter with `isFreeOpencodeModel`, return `[{ id, providerID }]`. The live
  list is fetched every time (no cache: a picker must notice a down server).
- `getActiveModel()` — read `AdminBranding` row `ai.opencode.model_id`.
  - If present and `isFreeOpencodeModel`: use it (`source: "admin"`).
  - Else fall back to `aiConfig.opencode.modelID` (`source: "env"` when set,
    else `"default"`).
  - A non-free or unparseable persisted value is ignored with a warning log,
    never honored.
- `setActiveModel(modelId, changedBy)` — `modelId` must be free-tier AND
  present in the live list (best effort: if the live fetch fails, fall back to
  the free-tier rule alone and log that validation was skipped). Writes
  `AdminBranding`, then appends `AdminConfigHistory`
  (`config_type: "ai_opencode_model"`, `changed_by`, `previous_value`,
  `new_value`). If either write fails, the switch fails with a 500 — a silent
  audit miss is worse than a failed switch.
- `getCandidateChain()` — active model first, then `DEFAULT_MODEL_CHAIN`
  (from `investigation/modelChain.js`) minus the active model. All free-tier.
- `runAssistantPrompt({ client, sessionID, userId, text, timeoutMs, onText })`
  — the fallback loop:
  1. Try the active model's session (session reuse is the caller's concern;
     the loop creates a **fresh session bound to the candidate model** for
     each retry after the first refusal — a session is bound to its model).
  2. On `model_refused` / provider quota-class errors, retry with the next
     candidate. A **timeout is NOT retried** (the model was working).
  3. Return `{ text, parts, model, attempts }` where `attempts` is the list of
     `{ model, outcome }`.
  4. On exhaustion, return the last outcome's text if any, else null, so the
     caller's existing fallback (HTTP providers / FAQ) still applies.
- `runAssistantPrompt` returns the outcome by value (`{ text, parts, model, providerID, attempts }` or null). Concurrent requests never share an outcome — there is no process-global stash.

### 2. `assistantService.js` (surgical changes)

- `cachedSessionMatchesModel(meta)` compares `meta.model` against the resolved
  active model from `getActiveModel()` (not just `aiConfig.opencode.modelID`).
  Stale sessions are discarded as today.
- `createUserOpencodeSession(userId)` binds sessions to the resolved active
  model; log line carries the source (`admin|env|default`).
- A persisted session's recorded model is never overwritten with the model that
  is active now. A session is bound to ONE model, so re-stamping it would undo
  an admin switch (the stale session would be reused as if it matched) and
  report a model that never answered. Only a session that records no model
  gets the active model stamped on it.
- `callOpencode()` delegates the prompt to `runAssistantPrompt()` and hands the
  outcome back through an `outcomeRef` the caller owns, so it belongs to that
  turn alone. Empty catch-all behavior (`return null`) unchanged.
- `assistantReply` (non-streaming path): when the opencode provider produced
  the answer, `metadata` gains `model` and `fallback_attempts`
  (existing `buildMatchedResponse` + the dynamic-answer branch). When the
  answer came from FAQ/HTTP providers, `metadata.model` is absent — nothing
  about those paths changes.
- Streaming path (`streamOpencodeAnswer`): the `onComplete(fullText, err)`
  payload gains the same `{ model, attempts }` on the terminal event. (SSE
  envelope change is additive; the client ignores unknown fields.)

### 3. Routes — `server/routes/assistantRoutes.js`

- `GET /api/assistant/models` — `requireAuth, allowRoles("owner","admin")`.
  Response: `{ models: [{ id, providerID }], active: "<id>",
  source: "admin|env|default", serverAvailable: boolean }`. If the opencode
  server is not running, `models` is `[]`, `serverAvailable: false`, and
  `active`/`source` still resolve from DB/env — the UI renders the persisted
  choice with a "server unavailable" badge instead of an empty state.
- `PUT /api/assistant/models` — same guards. Body `{ modelId }`. Validates
  (free-tier + live-list presence when the live list is available), persists,
  audits, returns the same shape as GET. 400 on refused model, 500 on write
  failure.
- New handlers live in `assistantController.js` next to the existing config
  handlers.

### 4. Admin UI — `src/pages/admin/sections/AdminAISection.jsx`

New "OpenCode Models" tab next to the existing Settings/Rules tabs:
- Fetches `GET /api/assistant/models` on mount (and on explicit Refresh).
- Radio list of free models (id + provider), active one checked; a source
  badge (`Admin pick` / `Env default`) and a "Server unavailable" notice when
  `serverAvailable` is false.
- Save → `PUT /api/assistant/models`; success notice + refresh. Errors
  surfaced via the existing `setError` pattern.
- One line of explanatory copy: switching affects new sessions immediately;
  existing sessions are rebound on their next turn.
- `Free tier only` note. No paid models are rendered.

## Data flow (assistant /ask with fallback)

1. `assistantReply` → dynamic answer path → primary provider is opencode.
2. `callOpencode` → `runAssistantPrompt` → active model session.
3. Model refuses (429) → fresh session on next chain candidate → succeeds.
4. Outcome returned `{ model: "glm-5.3-flash-free", attempts: [{minimax…, "refused"}, {glm…, "ok"}] }`.
5. Reply JSON: `matched_answer` = text, `metadata.model` +
   `metadata.fallback_attempts` added. Client shows answer as usual; the
   metadata is there for the UI to surface (and for debugging).

## Error handling

- Live list fetch failure → picker still shows the persisted/env choice,
  `serverAvailable: false`. `setActiveModel` then validates against the
  free-tier rule only (logged) — an admin can still switch while the server is
  down; it takes effect on next boot/spawn.
- All candidates refuse → opencode path returns null → existing HTTP-provider /
  FAQ fallback unchanged. The attempts are logged.
- Timeout on a candidate → NOT retried, and the chain does not advance past it.
  The opencode path returns null and the caller's existing HTTP-provider / FAQ
  fallback applies (matches the investigation runtime's semantics: the model
  was working, retrying would double the wall clock).
- `AdminConfigHistory` write failure → `PUT` returns 500, no branding write
  happened (order: branding first would violate "audit or nothing"; do
  branding write → history write, and if history fails, attempt to roll the
  branding row back to the previous value; if rollback fails, log loudly and
  still 500). The rollback REMOVES the branding row when there was no admin
  pick before the switch — a `default`/`env` choice must not turn into an
  admin pick that nobody chose.
- Live list comes back empty (the server is up but offers no free model) →
  presence validation is skipped and logged
  (`opencode_model_live_list_empty`); the free-tier rule still applies.

## Testing

New `tests/unit/server-opencode-model-service.test.js` (node --experimental-vm-modules jest, mocked client + mocked prisma branding/history writes):

- `fetchAvailableModels` flattens + filters to free-tier only.
- `getActiveModel`: admin row wins; non-free admin row ignored → env/default.
- `setActiveModel`: refuses non-free id; refuses id absent from live list;
  writes branding + history; 500-path when history write throws (rollback
  attempted).
- `runAssistantPrompt`: first candidate refuses → second answers, attempts
  recorded; timeout is not retried; all candidates refuse → null + attempts
  recorded.

Extend `tests/unit` assistant tests only where the ask-path metadata is
asserted (one assertion added). No test changes to the investigation portal.

## Verification

- `npm test` green (serial, --runInBand as the repo does).
- Boot the server, `GET /api/assistant/models` as owner → 200 with the live
  free list; as member → 403.
- PUT a different free model → GET reflects it; AdminBranding row +
  AdminConfigHistory row visible.
- Ask a question that trips the primary model (force via env to a bogus free
  id first, or mock refusal in the spike) → answer arrives from the next
  chain model and `metadata.model` reflects it.

## Rollout / ops notes

- No migration. No new env vars. Works with `OPENCODE_ENABLED=false`
  (picker shows persisted value + server unavailable; fallback never engages).
- `OPENCODE_MODEL_ID` remains meaningful as the env-level default when no
  admin pick exists.
