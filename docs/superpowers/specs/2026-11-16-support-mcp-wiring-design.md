# GarTexHub Support — MCP Read-Only Wiring (Phase 4)

Date: 2026-11-16
Status: Approved design (brainstormed with the owner)
Program: Phase 4 of the GarTexHub support upgrade (1 ✅ two modes · 2 ✅ catalog · 3 ✅ premium UI · 4 this file · 5 detailed email report)

## Goal

Let the five read-only investigation agents call a tightly allowlisted,
read-only set of MCP tools — GitHub (repo evidence), Parallel Search (web
research), Render (deploy/service state), Context7 (library docs) — using the
operator's own credentials when present, and degrade honestly when absent.

Non-goals (this phase): no writes anywhere (comments, merges, deploys, env
vars), no Render logs (they leak secrets), no tools for the buyer-facing UI
process, no change to the model chain, no new Prisma models/migrations.

## Decisions (owner-approved)

1. Allowlists exactly as proposed (see table below) — approved verbatim.
2. Credentials sourced from env vars at server start, fail-closed:
   `GITHUB_PERSONAL_ACCESS_TOKEN`, `RENDER_API_KEY`, `CONTEXT7_API_KEY`
   absent ⇒ that server is not declared in the spawned runtime at all, and
   the agents report it as a limitation instead of failing.
3. `parallel-search` stays enabled without a key (public tier, as in the
   operator's config).
4. Verification includes ONE live probe investigation against this repo
   (GitHub PAT present via env) — ask "what changed in the last commit?" and
   record which `github_*` tools appear in `SupportInvestigation.tool_log`.
5. `codemode: false` on all four MCP servers so name-based tool allowlists
   behave exactly like the existing deny list (`github_*`, `render_*`, …).
6. Buyer-facing UI shows real availability (Authorized / Unavailable) driven
   by a new requireAuth-protected `GET /api/support/capabilities`.

## Tool allowlists

| Server | Allowed | Denied (everything else, enforced by existing `*` deny + explicit falses) |
|---|---|---|
| `github` | `get_file_contents`, `search_code`, `list_commits`, `get_commit`, `search_commits`, `list_branches`, `list_tags`, `list_releases`, `get_latest_release`, `get_release_by_tag`, `get_tag`, `list_issues`, `issue_read`, `search_issues`, `list_issue_fields`, `list_issue_types`, `list_pull_requests`, `pull_request_read`, `search_pull_requests`, `get_me`, `search_repositories`, `get_label`, `get_teams`, `get_team_members`, `list_repository_collaborators` | All writes (`push_files`, `create_or_update_file`, `delete_file`, `create_branch`, `fork_repository`, `create_repository`, `merge_pull_request`, `create_pull_request`, `update_*`, `add_*`, `pull_request_review_write`, …), `run_secret_scanning`, everything unlisted |
| `parallel-search` | `web_search`, `web_fetch` | `send_feedback` + everything unlisted |
| `render` | `list_services`, `get_service`, `list_events`, `get_deploy`, `list_deploys`, `get_metrics`, `get_postgres`, `list_postgres_instances`, `list_key_value`, `list_workspaces`, `list_flows`, `get_flow`, `list_workflow_runs`, `get_flow_run`, `list_workflows`, `get_workflow`, `list_workflow_versions`, `get_workflow_version`, `get_workflow_task`, `list_flow_run_steps` | `list_logs` (secret leakage), `update_environment_variables`, `trigger_deploy`, `create_*`, everything unlisted |
| `context7` | `resolve-library-id`, `query-docs` | everything unlisted |

## Components

### 1. `server/services/investigation/runtimeConfig.js` (extend, not replace)

- Add `MCP_SERVERS` table (name → `{ type: "remote", url, headers?, oauth: false, codemode: false, timeout: 30000 }`):
  - `github` → `https://api.githubcopilot.com/mcp/`, header `Authorization: Bearer {env:GITHUB_PERSONAL_ACCESS_TOKEN}`
  - `parallel-search` → `https://search.parallel.ai/mcp` (no headers, no key)
  - `render` → `https://mcp.render.com/mcp`, header `Authorization: Bearer {env:RENDER_API_KEY}`
  - `context7` → `https://mcp.context7.com/mcp`, header `CONTEXT7_API_KEY: {env:CONTEXT7_API_KEY}`
- `buildInvestigationConfig({ mcpEnabled })` (the assistant's default call passes nothing): includes
  ```js
  mcp: { servers: serversWhereCredentialsPresent }
  ```
  Only servers whose enabling condition holds are declared: `render` requires `RENDER_API_KEY`, `context7` requires `CONTEXT7_API_KEY`, `github` requires `GITHUB_PERSONAL_ACCESS_TOKEN`, `parallel-search` is always declared.
- `ALWAYS_DISABLED_MCP_TOOLS` becomes `ALWAYS_DENIED_MCP_TOOLS`: starts as the current explicit list (`render_*`, `github_*`, `parallel-search_*`, `chrome-devtools_*`, `blender-mcp_*`, `minecraft_*`, `github_*`) then for each enabled server, the allowlist tools are REMOVED from the disable set — everything else remains disabled by `github_*`-style glob.
- `permission` gains one rule per allowed tool: `{ action: "<tool>", resource: "*", effect: "allow" }`. `task`, `edit`, `bash`, `webfetch`, `websearch` stay denied; the `read/glob/grep/list` rules are untouched.
- `tools` maps allowed tools → `true` where the server is enabled.
- `buildAssistantRuntimeEnv()` (assistant's config) keeps MCP disabled — the assistant is not an investigator.

### 2. `server/services/investigation/opencodeRuntime.js`

- `buildIsolatedRuntimeEnv({ … })`: add the three credential names to the env passthrough **only when set** (values never logged; the child is the investigator process, bash is denied inside it).
- `startInvestigationRuntime()` — no signature change; the env builder handles it.

### 3. `GET /api/support/capabilities` (requireAuth)

Returns:
```json
{ "repositoryInspection": true, "githubHistory": true, "renderServices": false, "research": true, "libraryDocs": false, "applicationData": false }
```
Derived from `process.env` presence (repositoryInspection = codebase always true; githubHistory = GITHUB_PERSONAL_ACCESS_TOKEN; renderServices = RENDER_API_KEY; research = true; libraryDocs = CONTEXT7_API_KEY; applicationData = false this phase). Handler in `supportController.js` or a tiny `capabilitiesController.js`; mounted in server.js under `/api/support` BEFORE the generic support router (or in its own one-line mount).

### 4. Buyer UI — right rail "RESOURCES" card (SupportWorkspace.jsx)

- Fetch `GET /api/support/capabilities` on mount; keep the six static labels but replace the static "Authorized" pills with live values (Authorized / Unavailable, `Unavailable` in slate, `Authorized` in emerald). Single request, cached in component state, failure → keep static authorized pills OFF (show "Unknown" — never silently authorized).
- Copy honesty: "Authorized" only when the endpoint confirmed it.

### 5. Config/deploy hygiene

- `.env.example`: adds `GITHUB_PERSONAL_ACCESS_TOKEN=`, `RENDER_API_KEY=`, `CONTEXT7_API_KEY=` with a one-line comment each (no values; note they're read at boot).
- `render.yaml`: adds the same three keys with `sync: false` (dashboard-managed; never committed).
- `codemode: false` everywhere; `oauth: false` everywhere (API keys, not OAuth).

## Data flow

1. Case confirmed → investigation queue spawns runtime → config includes only the enabled MCPs + allowlisted tools → agents run.
2. An agent calls, e.g., `github_get_file_contents` → opencode routes through the MCP client → PAT-backed API call → result enters the tool log; anything not allowlisted returns denied/refused and the agent codes nothing.
3. Transcript/report cite files, commits, URLs; email delivery unchanged (Phase 5).

## Error handling

- Env var missing ⇒ server undeclared ⇒ agents see "GitHub history — Unavailable" limitation and skip; report says so.
- MCP endpoint down ⇒ agent sees tool errors; failure captured in tool_log; report distinguishes "not offered" from "offered but failed".
- 401 from the PAT (bad/expired token) ⇒ same path; the operator rotates the env var; no retry loop.
- Context7 key invalid ⇒ context7 server undeclared (we gate on presence, not validity) — fail-closed still holds; agents degrade.

## Testing

- Unit (`tests/unit/server-runtime-mcp-config.test.js`): given env vars present/absent combinations, assert `buildInvestigationConfig` declares exactly the enabled servers; allowlist preserved; `render_*`/`github_*` still disabled for non-allowlisted tools; `permission` gains only allowlisted allows; iceman-free untouched (orthogonal).
- Unit: capabilities endpoint test (env present/absent matrix) — support token or JWT not required beyond requireAuth; assert 401 without auth.
- No live model calls in Jest. The one live probe is Task 6 (manual, not in the suite).

## Rollout

- No migration, no new table, no new env var REQUIRED (app boots fine without any).
- `render.yaml` three `sync: false` keys; operator sets them in the dashboard when ready. Until then the runtime behaves exactly as today (all MCP disabled).
- Live probe result appended to the rollout note under `docs/rollout/`.
