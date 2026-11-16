# Support — MCP Read-Only Wiring — Implementation Plan (Phase 4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The investigation runtime gains a tightly allowlisted read-only MCP surface — GitHub, parallel-search, Render, Context7 — plus the owner's local opencode skills and three plugins (superpowers, ponytail, plannotator), all declared only when their credentials/directories exist at spawn time.

**Architecture:** `runtimeConfig.js` gains `MCP_SERVERS` (url/headers/codemode:false/oauth:false per server), `MCP_TOOL_ALLOWLISTS`, and env/directory-gated declaration in `buildInvestigationConfig` (`skills`, `plugins`, `mcp.servers`, per-tool `tools:true` + `permission` allow entries). `buildIsolatedRuntimeEnv` passes through exactly the three credential vars when set. Buyer UI reads a new `GET /api/support/capabilities` (requireAuth) to render honest Authorized/Unavailable pills in the right rail.

**Tech Stack:** Express 5, @opencode/client (v2 SDK), Prisma 6, React 19, Jest 29 (`node --experimental-vm-modules … jest --runInBand`).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-11-16-support-mcp-wiring-design.md` (authority, incl. §Decisions 7–9, tool allowlists table).
- The spawned investigator's `permission` keeps `"*": "deny"` and the existing deny set (edit/bash/webfetch/websearch/question/external_directory/doom_loop/task) — unchanged.
- `tools` map keeps `github_*`, `render_*`, `parallel-search_*`, `chrome-devtools_*`, `blender-mcp_*`, `minecraft_*` as `false`; allowlisted tools are added as `true`.
- No logs tools, no write tools anywhere; `codemode: false` and `oauth: false` for all four servers.
- Skills/plugins/MCP servers are declared ONLY when their environment/directory exists; absent ⇒ silently omitted (investigator behaves as before).
- `/api/support/capabilities` is requireAuth; raw secrets never leave the server (only booleans).
- iceman-free and the paid-model rules are untouched.

---

### Task 1: `runtimeConfig.js` — MCP servers, allowlists, skills, plugins + tests

**Files:**
- Modify: `server/services/investigation/runtimeConfig.js`
- Test: `tests/unit/server-investigation-mcp.test.js` (new)

**Interfaces:**
- Produces (used by Task 4): extended `buildInvestigationConfig({ mcpTools = [], skills = undefined, plugins = undefined } = {})` whose output may include `skills` (array of directories), `plugins` (array of absolute paths), and `mcp: { servers: {…} }`. `resolveEffectivePermission` semantics unchanged.
- Exports unchanged for `report.js`: `ALWAYS_DENIED_TOOL_NAMES`, `ALWAYS_DISABLED_MCP_PATTERNS` (value may be the array with allowlisted globs removed — keep the exported name).
- New export `MCP_SERVERS` (for Task 4 docs/rollout; keep small).

- [ ] **Step 1: Write the failing test**

```js
import { buildIsolatedRuntimeEnv } from "../../server/services/investigation/opencodeRuntime.js";
import { buildInvestigationConfig } from "../../server/services/investigation/runtimeConfig.js";

// Pin the ambient credential state per test.
const KEYS = ["GITHUB_PERSONAL_ACCESS_TOKEN", "RENDER_API_KEY", "CONTEXT7_API_KEY"];
const saved = {};
beforeEach(() => {
	for (const key of KEYS) {
		saved[key] = process.env[key];
		delete process.env[key];
	}
});
afterAll(() => {
	for (const key of KEYS) if (saved[key] !== undefined) process.env[key] = saved[key];
});

describe("investigation MCP wiring", () => {
	test("parallel-search is always declared, GitHub/Render/Context7 only when keyed", () => {
		const none = buildInvestigationConfig();
		expect(Object.keys(none.mcp?.servers ?? {})).toEqual(["parallel-search"]);
		process.env.GITHUB_PERSONAL_ACCESS_TOKEN = "ghp_x";
		const withGh = buildInvestigationConfig();
		expect(Object.keys(withGh.mcp.servers).sort()).toEqual(["github", "parallel-search"]);
	});

	test("the allowlist is honored and everything else stays disabled", () => {
		process.env.GITHUB_PERSONAL_ACCESS_TOKEN = "ghp_x";
		const { tools, permission } = buildInvestigationConfig();
		expect(tools["github_get_file_contents"]).toBe(true);
		expect(tools["github_search_code"]).toBe(true);
		expect(tools["github_*"]).toBe(false);           // the glob stays deny…
		expect(tools["github_create_or_update_file"] ?? "undefined").not.toBe(true); // …and nothing unlisted turns on
		expect(permission["github_get_file_contents"]).toBe("allow");
		expect(permission["github_create_or_update_file"]).toBeUndefined();
		expect(permission["*"]).toBe("deny");
	});

	test("skills and plugins are declared only when the directories exist", () => {
		// The machine running tests has the skills dir; assert the shape, not existence.
		const config = buildInvestigationConfig();
		if (config.skills) expect(Array.isArray(config.skills)).toBe(true);
	});
});
```

- [ ] **Step 2: Run — expect FAIL** (`mcp`/`skills` absent)

- [ ] **Step 3: Implement** (in `runtimeConfig.js`, after the existing constants)

```js
import fs from "node:fs";

const SKILLS_DIR = "/home/ccm/.config/opencode/skills";
const PLUGIN_DIRS = [
	"/home/ccm/.config/opencode/node_modules/superpowers",
	"/home/ccm/.cache/opencode/npm/@dietrichgebert/ponytail@latest",
	"/home/ccm/.cache/opencode/npm/@plannotator/opencode@latest",
];
const exists = (p) => {
	try {
		return fs.existsSync(p);
	} catch {
		return false;
	}
};

export const MCP_SERVERS = {
	"parallel-search": {
		type: "remote",
		url: "https://search.parallel.ai/mcp",
		oauth: false,
		codemode: false,
		timeout: 30_000,
	},
	github: {
		type: "remote",
		url: "https://api.githubcopilot.com/mcp/",
		oauth: false,
		codemode: false,
		timeout: 30_000,
		headers: { Authorization: "Bearer {env:GITHUB_PERSONAL_ACCESS_TOKEN}" },
	},
	render: {
		type: "remote",
		url: "https://mcp.render.com/mcp",
		oauth: false,
		codemode: false,
		timeout: 30_000,
		headers: { Authorization: "Bearer {env:RENDER_API_KEY}" },
	},
	context7: {
		type: "remote",
		url: "https://mcp.context7.com/mcp",
		oauth: false,
		codemode: false,
		timeout: 30_000,
		headers: { CONTEXT7_API_KEY: "{env:CONTEXT7_API_KEY}" },
	},
};

export const MCP_TOOL_ALLOWLISTS = {
	github: [
		"get_file_contents", "search_code", "list_commits", "get_commit", "search_commits",
		"list_branches", "list_tags", "list_releases", "get_latest_release", "get_release_by_tag",
		"get_tag", "list_issues", "issue_read", "search_issues", "list_issue_fields",
		"list_issue_types", "list_pull_requests", "pull_request_read", "search_pull_requests",
		"get_me", "search_repositories", "get_label", "get_teams", "get_team_members",
		"list_repository_collaborators",
	],
	"parallel-search": ["web_search", "web_fetch"],
	render: [
		"list_services", "get_service", "list_events", "get_deploy", "list_deploys",
		"get_metrics", "get_postgres", "list_postgres_instances", "list_key_value",
		"list_workspaces", "list_flows", "get_flow", "list_workflow_runs",
		"get_flow_run", "list_workflows", "get_workflow", "list_workflow_versions",
		"get_workflow_version", "get_workflow_task", "list_flow_run_steps",
	],
	context7: ["resolve-library-id", "query-docs"],
};

const CRED_FOR = { github: "GITHUB_PERSONAL_ACCESS_TOKEN", render: "RENDER_API_KEY", context7: "CONTEXT7_API_KEY" };
const toolKey = (server, tool) => `${server}_${tool}`;
```

Then in `buildInvestigationConfig({ mcpTools = [], skills, plugins } = {})`:

```js
// MCP: only servers whose credential (or public access) is available.
const servers = {};
for (const [name, server] of Object.entries(MCP_SERVERS)) {
	const CRED = CRED_FOR[name];
	if (!CRED || process.env[CRED]) servers[name] = server;
}

const tools = {};
for (const pattern of [...ALWAYS_DISABLED_MCP_TOOLS, ...mcpTools]) {
	tools[pattern] = false;
}
for (const [server, allowlist] of Object.entries(MCP_TOOL_ALLOWLISTS)) {
	if (!servers[server]) continue;
	for (const tool of allowlist) tools[toolKey(server, tool)] = true;
}

const permission = { …unchanged base… };
for (const [server, allowlist] of Object.entries(MCP_TOOL_ALLOWLISTS)) {
	if (!servers[server]) continue;
	for (const tool of allowlist) permission[toolKey(server, tool)] = "allow";
}

const config = { default_agent: "investigator", permission, tools, agents: { …unchanged… } };

const skillsDir = skills ?? (exists(SKILLS_DIR) ? [SKILLS_DIR] : undefined);
if (skillsDir?.length) config.skills = skillsDir;
const pluginDirs = plugins ?? PLUGIN_DIRS.filter(exists);
if (pluginDirs.length) config.plugins = pluginDirs;
if (Object.keys(servers).length) config.mcp = { servers };

return config;
```

(KEEP the existing base permission/glob/read blocks byte-identical; add only the two loops and the three optional keys. `ALWAYS_DENIED_TOOL_NAMES` and `ALWAYS_DISABLED_MCP_PATTERNS` remain exported with their current values.)

- [ ] **Step 4: `opencodeRuntime.js` env passthrough**

In `buildIsolatedRuntimeEnv`, add after the existing env keys:
```js
for (const key of ["GITHUB_PERSONAL_ACCESS_TOKEN", "RENDER_API_KEY", "CONTEXT7_API_KEY"]) {
	if (baseEnv[key]) env[key] = baseEnv[key];
}
```

- [ ] **Step 5: Run — expect PASS; existing suite green**

Run: `node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand tests/unit/server-investigation-mcp.test.js tests/unit/server-investigation-runtime-config.test.js tests/unit/server-assistant-opencode-isolation.test.js tests/integration/investigation-readonly.test.js`
Expected: PASS, and especially `tools["github_*"] === false` still holds (existing test).

- [ ] **Step 6: Commit** — `feat(investigation): read-only MCP wiring + local skills/plugins in the isolated runtime`

---

### Task 2: `GET /api/support/capabilities` + buyer right-rail pills — tests

**Files:**
- Modify: `server/controllers/supportController.js` or create `server/controllers/capabilitiesController.js` (whichever the existing support controllers favor — check the file for the pattern)
- Modify: `server/routes/supportRoutes.js` (one line: `router.get("/capabilities", requireAuth, capabilitiesHandler)`) — BEFORE `/tickets` if order matters; routers already mount at `/api/support` so one line suffices
- Modify: `src/pages/support/SupportWorkspace.jsx` (RESOURCES card reads the endpoint)
- Test: `tests/unit/frontend-support-capabilities.test.js`, `tests/unit/server-support-capabilities.test.js`

**Interfaces:**
- `GET /api/support/capabilities` — requireAuth — response `{ repositoryInspection: true, githubHistory: <bool>, renderServices: <bool>, research: true, libraryDocs: <bool>, applicationData: false }` with booleans derived from `process.env[key]` presence (`GITHUB_PERSONAL_ACCESS_TOKEN`, `RENDER_API_KEY`, `CONTEXT7_API_KEY`).
- UI: fetch once on mount; three pills per entry ("Repository inspection", "GitHub history", "Render services", "Parallel research", "Library docs", "Approved application data"); each pill shows `Authorized` (emerald) or `Unavailable` (slate); fetch failure ⇒ all pills show `Unknown` — never a silent `Authorized`.

- [ ] **Step 1: Implement endpoint + test**

```js
// capabilitiesController.js
const envBool = (key) => typeof process.env[key] === "string" && process.env[key].trim().length > 0;
export async function capabilitiesHandler(_req, res) {
	return res.json({
		repositoryInspection: true,
		githubHistory: envBool("GITHUB_PERSONAL_ACCESS_TOKEN"),
		renderServices: envBool("RENDER_API_KEY"),
		research: true,
		libraryDocs: envBool("CONTEXT7_API_KEY"),
		applicationData: false,
	});
}
```
Route test (supertest + requireAuth mock or the real app pattern from the existing support isolation test): 401 without token; 200 with token; booleans reflect env.

- [ ] **Step 2: Buyer UI pill update**

In `SupportWorkspace.jsx`'s right rail: on mount `apiRequest("/api/support/capabilities", { token: true })`; store result; render the six rows with conditional pill colors; on error render `Unknown`.

- [ ] **Step 3: Tests green** + `npx biome check` on changed files.

- [ ] **Step 4: Commit** — `feat(support): live capabilities endpoint + honest authorized pills`

---

### Task 3: env.example + render.yaml + rollout note

**Files:**
- Modify: `.env.example` — three new keys with no values + one comment line each
- Modify: `render.yaml` — three entries with `sync: false`
- Create: append to `docs/rollout/2026-11-15-support-two-mode-migration.md` a Phase 4 section

- [ ] **Step 1–2:** add the keys (as sync:false) and note; rollout section records: MCP wiring is credential-gated; skills/plugins are machine-local absolute paths, absent on Render ⇒ not declared; the owner must set the three env vars in the Render dashboard when ready; the swarm application is never referenced anywhere in the runtime config.
- [ ] **Step 3: Commit** — `docs: phase 4 env keys (sync:false) + rollout note`

---

### Task 4: Verification + one live probe (owner-present)

- [ ] **Step 1:** `npm test` — record totals; 0 failures expected.
- [ ] **Step 2:** Boot `NODE_ENV=production SERVE_DIST=true PORT=4590 node server/server.js` and confirm boot log clean; `GET /health` 200.
- [ ] **Step 3 (owner present):** Live probe — `GITHUB_PERSONAL_ACCESS_TOKEN` must be sourced from `~/.config/opencode/github.env` ONLY FOR THIS PROCESS (export it in the spawned env of a probe script; never written to any file): spawn the investigation runtime against this repo, ask "What changed in the last commit?" one investigation, and capture the tool log. Record: which `github_*` tools appear in `SupportInvestigation.tool_log`, whether the probe failed on quota (if so, report that instead of silently passing), and the rollback note if the runtime fails to spawn.
- [ ] **Step 4:** Append the probe result to the rollout note; commit `docs(rollout): phase 4 live probe result`.
