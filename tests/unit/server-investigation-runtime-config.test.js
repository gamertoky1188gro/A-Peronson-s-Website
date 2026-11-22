import fs from "node:fs";
import path from "node:path";

// The investigation runtime is gated by the agents committed in this repo's
// `.opencode/agents/` directory. opencode v2 reads the project config for
// EVERY opencode started in this repository - including the operator's own
// session - so `.opencode/opencode.json` is deliberately empty of policy, and
// the agents carry the full lockdown in native V2 ordered `permissions`
// frontmatter, which binds only sessions created with `agent:` pinned.
//
// Native V2 format (not the legacy grouped `permission:` map):
//   permissions:
//     - action: "*"
//       resource: "*"
//       effect: deny
//   ...read/glob/grep/shell allowlist, .env DENY rules AFTER the allow.
// The last matching rule wins, so ordering is the contract under test.

const ROOT = process.cwd();
const config = JSON.parse(fs.readFileSync(path.join(ROOT, ".opencode", "opencode.json"), "utf8"));
const investigator = fs.readFileSync(
	path.join(ROOT, ".opencode", "agents", "investigator.md"),
	"utf8",
);
const assistant = fs.readFileSync(path.join(ROOT, ".opencode", "agents", "assistant.md"), "utf8");

function actions(file) {
	return [...file.matchAll(/- action: ([^\n]+)/gu)].map((m) => m[1].trim().replace(/^"|"$/gu, ""));
}

describe("investigation runtime project config (.opencode/)", () => {
	it("the project config declares nothing that binds other sessions", () => {
		expect(config.default_agent).toBeUndefined();
		expect(config.permission).toBeUndefined();
		expect(config.permissions).toBeUndefined();
		// Agents carry their own lockdown; MCP is opt-in only via the optional block.
		expect(config.mcp).toBeUndefined();
	});

	it("the context7 optional block remains unmerged", () => {
		const optionalPath = path.join(ROOT, ".opencode", "opencode.mcp.optional.json");
		expect(fs.existsSync(optionalPath)).toBe(true);
		const optional = JSON.parse(fs.readFileSync(optionalPath, "utf8"));
		expect(Object.keys(optional.mcp?.servers ?? {})).toEqual(["context7"]);
		expect(optional.mcp.servers.context7?.oauth).toBe(false);
		expect(optional.mcp.servers.context7?.codemode).toBe(false);
		expect(optional.mcp.servers.context7?.headers?.["CONTEXT7_API_KEY"]).toBe(
			"{env:CONTEXT7_API_KEY}",
		);
	});
});

describe.each([
	["investigator", investigator],
	["assistant", assistant],
])("agent %s (.opencode/agents/)", (_name, file) => {
	it("uses native V2 ordered permissions, not the legacy grouped map", () => {
		expect(file).toMatch(/^permissions:$/mu);
		expect(file).not.toMatch(/^permission:$/mu);
		// V1-only actions that silently vanish under V2 must not appear.
		// `bash` is intentionally ALLOWED in V2 as a read-only git allowlist.
		for (const bad of ["write", "patch", "task", "list", "doom_loop"]) {
			expect(actions(file)).not.toContain(bad);
		}
	});

	it("first rule is a catch-all deny", () => {
		expect(file).toMatch(/^permissions:\n\s+- action: "\*"\n\s+resource: "\*"\n\s+effect: deny/mu);
	});

	it("read/glob/grep allowed; .env denied AFTER the read allow; .env.example re-allowed", () => {
		const readAllow = file.search(/resource: "\*"\n\s+effect: allow/u);
		const envDeny = file.search(/resource: "\*\.env"/u);
		const envGlobDeny = file.search(/resource: "\*\*\/\.env"/u);
		const envExample = file.search(/resource: "\*\.env\.example"/u);
		expect(readAllow).toBeGreaterThan(-1);
		expect(envDeny).toBeGreaterThan(readAllow);
		expect(envGlobDeny).toBeGreaterThan(readAllow);
		expect(envExample).toBeGreaterThan(envGlobDeny);
		expect(file).toMatch(/action: glob\n\s+resource: "\*"\n\s+effect: allow/u);
		expect(file).toMatch(/action: grep\n\s+resource: "\*"\n\s+effect: allow/u);
	});

	it("expensive/mutating actions carry explicit denies", () => {
		// websearch is intentionally ALLOWED for the investigator (owner
		// decision), but stays denied for the assistant.
		const denied =
			_name === "investigator"
				? ["edit", "webfetch", "subagent", "question"]
				: ["edit", "webfetch", "websearch", "subagent", "question"];
		for (const action of denied) {
			expect(file).toMatch(
				new RegExp(`action: ${action}\\n\\s+resource: "\\*"\\n\\s+effect: deny`),
			);
		}
		expect(file).toMatch(/action: external_directory\n\s+resource: "\*"\n\s+effect: deny/u);
	});

	it("shell permissions, if any, are a strict read-only allowlist (no write/mutate commands)", () => {
		const allowed = new Set([
			"git log*",
			"git show*",
			"git diff*",
			"git rev-parse*",
			"git rev-list*",
			"git ls-tree*",
			"git cat-file*",
			"git status*",
			"git branch*",
			"git log --*",
			"git diff --*",
			"rg*",
			"grep*",
			"head*",
			"tail*",
			"wc*",
			"ls*",
		]);
		const shellAllows = [
			...file.matchAll(/- action: (?:shell|bash)\n\s+resource: "([^"]*)"\n\s+effect: allow/gu),
		].map((m) => m[1]);
		for (const pattern of shellAllows) {
			expect(allowed.has(pattern)).toBe(true);
		}
		// no pattern may match a write-capable verb
		const writeVerbs = [
			"rm",
			"mv",
			"cp",
			"sed -i",
			"chmod",
			"chown",
			"git commit",
			"git push",
			"git merge",
			"git rebase",
			">",
			">>",
		];
		for (const w of writeVerbs) {
			for (const pattern of shellAllows) {
				expect(pattern.includes(w)).toBe(false);
			}
		}
	});
});

describe("investigator MCP allowlist (inert until .opencode.mcp.optional.json is merged)", () => {
	it("github/render/context7 read tools allowed", () => {
		expect(investigator).toMatch(
			/action: github_get_file_contents\n\s+resource: "\*"\n\s+effect: allow/u,
		);
		expect(investigator).toMatch(
			/action: context7_query-docs\n\s+resource: "\*"\n\s+effect: allow/u,
		);
		expect(investigator).toMatch(
			/action: render_list_services\n\s+resource: "\*"\n\s+effect: allow/u,
		);
	});

	it("only the owner-approved github_create_issue write tool is allowed", () => {
		expect(investigator).toMatch(
			/action: github_create_issue\n\s+resource: "\*"\n\s+effect: allow/u,
		);
		// Every OTHER write-capable MCP tool stays denied.
		expect(investigator).not.toMatch(
			/github_push_|github_merge_|github_delete_|delete_file|pull_request_review_write|render_create_|render_update_|render_trigger_|render_delete_/u,
		);
	});
});

describe("assistant agent mirrors the same read-only rules", () => {
	it("assistant has no MCP tools at all", () => {
		expect(assistant).not.toMatch(/github_|render_|context7_|parallel-search_/u);
	});
});

describe("guarded support plugin (.opencode/plugins/)", () => {
	// V2 auto-loads local plugins from .opencode/plugins/ for EVERY opencode in
	// this repo, including the operator's own session (docs: /build/plugins).
	// It must therefore be completely inert unless our spawned runtime opts in.
	const plugin = fs.readFileSync(
		path.join(ROOT, ".opencode", "plugins", "gartexhub-support", "index.mjs"),
		"utf8",
	);

	it("is inert unless GHT_PLUGIN_ACTIVE=1 is set by our runtime", () => {
		expect(plugin).toMatch(/GHT_PLUGIN_ACTIVE === "1"/u);
		// setup returns before registering anything when the guard is off.
		expect(plugin).toMatch(/if \(!ACTIVE\) \{\s*return;\s*\}/mu);
	});

	it("uses the V2 promise-based Plugin.define({ id, setup(ctx) }) API", () => {
		expect(plugin).toMatch(/Plugin\.define\(\{/u);
		expect(plugin).toMatch(/id:\s*"gartexhub\.support"/u);
		expect(plugin).toMatch(/async setup\(ctx\)/u);
	});

	it("registers authoritative tool lifecycle, retry and reference hooks", () => {
		expect(plugin).toMatch(/ctx\.tool\.hook\("execute\.before"/u);
		expect(plugin).toMatch(/ctx\.tool\.hook\("execute\.after"/u);
		expect(plugin).toMatch(/ctx\.session\.hook\("retry"/u);
		expect(plugin).toMatch(/ctx\.reference\.transform/u);
	});

	it("never sends telemetry unless every sink setting is present", () => {
		expect(plugin).toMatch(/ACTIVE && CASE_ID && ACTIVITY_URL && ACTIVITY_TOKEN/u);
	});
});
