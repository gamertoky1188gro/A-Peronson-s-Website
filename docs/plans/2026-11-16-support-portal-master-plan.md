# GarTexHub Support Portal — Master Plan (verified against code, 2026-11-16)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the buyer-facing AI investigation support portal — token-gated buyer chat, dynamic OpenCode free-model selection, read-only investigation over the repo, Gmail-delivered detailed report — without ever enabling it before the read-only boundary is proven live.

**Architecture:** Existing Express + React + Prisma + PostgreSQL stack stays. No new frontend framework, no new ORM, no separate services. The investigation runtime is the repo's spawned `opencode serve` (V2, `@opencode/client`), pinned to committed read-only agents. Reports render as Markdown, deliver via the existing `emailService` Gmail API path, persist before delivery.

**Tech Stack:** React 18 + Vite + Tailwind, Express, Prisma, PostgreSQL (Aiven), Jest, OpenCode V2 (`@opencode/client`), `.opencode/agents/*.md` (native V2 ordered-permissions frontmatter), GitHub/Render/Context7/Parallel-Search MCP (opt-in).

## Global Constraints

- **OpenCode free models only, OpenCode provider only.** Never add OpenRouter/Gemini/Anthropic/OpenAI/Ollama or any paid fallback to this system. `iceman-free` is excluded everywhere (trains on prompts). `longcat-2.5-free` stays out of the default allowlist (100-request/day quota).
- **No code modification, ever.** No edit/write/patch/bash/subagent/question/web for the investigation agents. Read-only shell allowlist only.
- **Buyers never see** private reasoning, raw tool calls, source code, credentials, MCP internals, or fallback diagnostics.
- **Do not merge or enable investigations in production until the read-only boundary passes the live spike** (Phase A).
- **PortableV2 format only** in `.opencode/` (see Phase A.0 — the current V1-flavored frontmatter is unverified and likely untranslated).
- **Gmail delivery requires** `notifications.email.enabled=true` in admin config AND `GMAIL_CLIENT_ID` / `GMAIL_CLIENT_SECRET` / `GMAIL_REFRESH_TOKEN` (or service-account OAuth as already implemented). `emailService` supports `gmail_api`; Brevo SMTP is IP-locked to Render and must not be used from Aiven/outside Render.
- **Never commit** `dist/`, `node_modules/`, `.env`, or `dist/assets/`/`dist/brand/` (currently untracked build artifacts — leave untracked).
- `main` is 45 commits ahead of `origin/main`; pushing is the owner's call.

## Where things actually stand (verified 2026-11-16)

| Layer | Status | Evidence |
|---|---|---|
| Phase 1 — two-mode `/support` (token buyer chat + generic form) | ✅ Done, merged to local `main` | Phase-1 commits; idempotent `prisma/migrations/20261115170000`; token-gated `x-support-token` path live in controllers |
| Phase 2 — dynamic free-model catalog + buyer picker + owner model management | ✅ Done, merged | `server/services/investigation/modelCatalog.js`, `modelChain.js`, `caseModelChain.js`, `investigationModelConfigService.js`; iceman-free excluded; buyer model applies per message to clarification + investigation |
| Phase 3 — premium UI at `/support` (token landing → workspace → report → submitted) | ✅ Done, merged (blue/cyan) | Phase-3 merge; 1071 tests green at merge |
| Phase 4 — MCP wiring + read-only agents | 🟡 Committed on `feat/support-mcp-wiring` (`ab1a893c`), NOT merged, NOT proven live | Investigation runtime pins `agent: investigator`; assistant pins `assistant`; MCP is opt-in via `.opencode/opencode.mcp.optional.json`; `.opencode/opencode.json` declares `$schema` only |
| Phase 5 — detailed Gmail report | 🟡 Renderer extended, NOT proven live | `report.js` §7 Sources + §8 Audit events (tool totals, failed, reruns); delivery goes through `emailService` `gmail_api` path; `report.test.js` covers §7/§8; no live send ever exercised |
| Purple/cyan re-theme | ❌ Not started | Merged UI is blue/cyan (Phase 3); spec calls for purple/cyan |
| Owner console case tabs (evidence/activity/email tabs) | 🟡 Partial | Inbox + priority column + `?case=` deep link done Phase 3; full tab set not verified |
| `V2 agent frontmatter` | ❌ Broken approach risk | Current `.opencode/agents/*.md` use V1 `permission:` grouped syntax; V2 expects ordered `permissions` rules (`{action, resource, effect}`). Translation is best-effort, never verified live |
| Read-only live proof (spike) | ❌ Never passed | `INVESTIGATION_SPIKE=1 npm test` gated off; probes showed reads OK and stock-agent leak before lockdown; post-lockdown zero live runs |
| MCP merged + live-verified | ❌ | Not merged; servers declared only in opt-in block |
| Gmail live send to owner mailbox | ❌ | `notifications.email.enabled=false`; creds unexercised |
| Push to `origin/main` | ❌ | 45 commits unpushed (owner choice) |

**Honest overall completion: ~55–60% of the portal.** Phases 1–3 (~60% of scope) are done and test-covered. Phase 4 (~15%) and Phase 5 (~10%) exist in code but are unverified end-to-end. Remainder (~15–25%): native-V2 frontmatter conversion + live proofs + purple re-theme + owner decision items.

---

## Phase A — Fix the V2 config and prove the boundary (GATE: nothing ships until this passes)

### Task A.0: Convert agents to native V2 ordered-permissions frontmatter

**Files:** Modify `.opencode/agents/investigator.md`, `.opencode/agents/assistant.md`; Test: `tests/unit/server-investigation-runtime-config.test.js`

**Why:** The committed files use V1 grouped `permission:` syntax. V2 reads files containing **any** V2 field (`permissions`, `request`, `system`, `disabled`) strictly as V2 and silently ignores the V1 fields; files with only V1 fields rely on the deprecated translation layer, which has never been verified in this server. This is the one remaining silent-failure risk for the whole read-only story.

Native investigator permissions:

```yaml
permissions:
  - action: "*"
    resource: "*"
    effect: deny
  - { action: read, resource: "*", effect: allow }
  - { action: read, resource: "*.env", effect: deny }
  - { action: read, resource: "*.env.*", effect: deny }
  - { action: read, resource: "**/.env", effect: deny }
  - { action: read, resource: "**/.env.*", effect: deny }
  - { action: read, resource: "*.env.example", effect: allow }
  - { action: glob, resource: "*", effect: allow }
  - { action: grep, resource: "*", effect: allow }
  - { action: external_directory, resource: "*", effect: deny }
  - { action: shell, resource: "git log*", effect: allow }   # ... full read-only allowlist, one rule each
  - { action: shell, resource: "*", effect: deny }
  - { action: edit, resource: "*", effect: deny }
  - { action: webfetch, resource: "*", effect: deny }
  - { action: websearch, resource: "*", effect: deny }
  - { action: subagent, resource: "*", effect: deny }
  - { action: question, resource: "*", effect: deny }
  # MCP allows only when A.3 merged (see below)
```

- [ ] Convert both agent files; drop V1-only actions (`bash`, `write`, `patch`, `task`, `list`, `doom_loop`, nested maps) — V2 has none of them (`edit` = write/patch/edit, `shell` = bash, `subagent` = task). Note: `list` does not exist in V2; `glob` covers it.
- [ ] Update the unit test to assert the ordered native format (fail otherwise).
- [ ] `npm test -- --testPathPattern="runtime-config|investigation-mcp"` → PASS.
- [ ] Commit: `refactor(investigation): native V2 ordered-permissions frontmatter`.

### Task A.1: Live read-only spike (the hard gate)

- [ ] On the owner machine (never this sandbox): `INVESTIGATION_SPIKE=1 npm test -- --testPathPattern=investigation-readonly` — expected: suite runs, not skipped.
- [ ] Against a scratch copy of this repo, confirm in the investigation tool_log: `read`/`glob`/`grep` only; `git log` works; `.env` read refused; any `write`/`edit`/`shell` outside allowlist refused; `subagent` refused.
- [ ] Record evidence (tool_log rows, screenshots) into `docs/rollout/2026-11-16-investigation-readonly-proof.md`.
- [ ] If any denial is NOT enforced: stop, fix A.0, re-run. Do not proceed to A.2/A.3 or merge.

### Task A.2: Pin model used by investigation runtime sessions to OpenCode free models

- [ ] Already implemented: runtime passes `model: { id: model.id, providerID: "opencode" }` at session create (`opencodeRuntime.js`); verify free-tier-only intersection still holds after A.0 (no config change expected). No code task unless verification fails.

### Task A.3 (decision): Merge MCP into the investigation path — or leave MCP off

Two valid end states. Owner must pick:

- **Option 1 — Investigation without MCP (recommended for first enable).** Investigator uses repository reads + read-only shell only. MCP servers never load for investigations. Simplest possible verification surface. Cost: no github_*/render_*/context7/parallel-search tools in investigations (the portal still fully works).
- **Option 2 — Investigation with MCP (opt-in).** Merge `.opencode/opencode.mcp.optional.json` into `.opencode/opencode.json` **knowingly** (it will also register the servers for the operator's own opencode in this repo), set `GITHUB_PERSONAL_ACCESS_TOKEN` (+`RENDER_API_KEY`, `CONTEXT7_API_KEY`) in the investigation environment, re-run A.1, and verify each tool class appears in tool_log (github_get_file_contents on a known file; parallel-search_web_search on a known error string).

**Default if no decision:** Option 1.

### Task A.4: Merge `feat/support-mcp-wiring`

- [ ] Only after A.1 passes. `git checkout main && git merge feat/support-mcp-wiring`; re-run full `npm test`; re-run `npm run build`.
- [ ] Do not push until the owner explicitly wants `main` on origin (45+ commits).

## Phase B — Gmail report, end to end (GATE: delivery proven before enabling investigations)

### Task B.1: Honor the right transport

- [ ] Confirm `INVESTIGATION_REPORT_EMAIL_PROVIDER=gmail` reaches the code path (`emailService` — verify env name in code; historically `notifications.email.enabled` + `GMAIL_CLIENT_ID/SECRET/REFRESH_TOKEN`, service-account path already implemented).
- [ ] Wire `.env.example` documentation already present; set the real token in Render env.

### Task B.2: Live delivery proof

- [ ] Owner runs one real investigation end-to-end against a scratch repo; report email arrives in owner mailbox; subject `[Client Report #<case-id>]`; sections 1–8 present (complaint, conversation, per-run investigation with model_id, findings, recommended steps, Sources, Audit events).
- [ ] If delivery fails: email must record `failed` on the case (existing honesty logic) — capture the failure mode; do not mark shipped.

### Task B.3: Owner console completeness

- [ ] Verify the owner case view shows: complaint, transcript, uploads, per-run model + tool evidence, report delivery status + retry, escalation status. Add the missing tabs only if absent (evidence/activity/email tabs from Phase 3 partial).

## Phase C — UI: purple/cyan identity (cosmetic, after gates)

- [ ] Re-token `/support` (and owner console) to the spec palette: background `#0b0714`, surfaces `#151020`, primary `#a855f7`, secondary `#d946ef`, accent `#22d3ee`. Tailwind theme extension only; no component rewrites.
- [ ] Mobile: sidebars → drawers at < lg breakpoints (verify current Phase-3 behavior; add only what's missing).
- [ ] Keep GarTexHub branding (drop "TOKY SUPPORT" from the spec unless the owner wants it — open question).

## Phase D — Optional extras (owner decision each)

1. Per-agent model assignment (owner assigns models to each of the five roles) — needs config schema + admin UI + tests.
2. Live model health monitor (quota failures/latency/availability surfaced from tool_log/DB).
3. Case export/PDF report (react-pdf or server-side render).
4. Investigation replay / activity timeline in owner console.
5. Investigation feedback (buyer rating) → stored on case; no model training use.
6. Smart auto-model (task-type → model) — requires a reliable routing heuristic; do NOT build until Phase A/B stable.

## Phase E — Production enable (last, owner-only)

- [ ] `notifications.email.enabled=true` + Gmail creds live; investigations queue enabled in admin config.
- [ ] Canary: one internal test case through the whole pipeline; watch delivery + console; check report honesty section; rollback plan = admin config flag off.
- [ ] Update `docs/rollout/2026-11-15-support-two-mode-migration.md` with enable date + canary result.

## Open questions for the owner

1. MCP Option 1 or Option 2 for the investigation runtime?
2. Reports: email-only, or also PDF attachment?
3. Brand: GarTexHub Support Center or "Toky Support"?
4. Do we ever push `main` to origin (45+ commits) — and is branch protection desired?
5. Should `longcat-2.5-free` remain excluded from the default allowlist (100 req/day)?

## What this plan replaces

The pasted ChatGPT plan (Next.js + Drizzle + R2 + separate worker) is NOT used: the repo already has Express + Prisma + PostgreSQL, signed private uploads, the support-case API, the queue, the admin console, and the premium UI. Rebuilding any of that would violate the existing architecture. Specific corrections to the pasted plan are recorded in `docs/plans/2026-11-16-plan-corrections.md` (create with this plan): docs are V2 (`opencode.ai/v2/docs/*`), API ref currently lists 170 ops / 501 schemas (not 143/293), `iceman-free` remains excluded, `Inkling` is not treated as train-on-prompts (unverified rumor — excluded only per existing policy), `docs.opencode.ai` links are V1-legacy and not the target.
