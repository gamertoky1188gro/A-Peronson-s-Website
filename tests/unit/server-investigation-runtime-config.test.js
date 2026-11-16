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
const config = JSON.parse(
	fs.readFileSync(path.join(ROOT, ".opencode", "opencode.json"), "utf8"),
);
const investigator = fs.readFileSync(
	path.join(ROOT, ".opencode", "agents", "investigator.md"),
	"utf8",
);
const assistant = fs.readFileSync(
	path.join(ROOT, ".opencode", "agents", "assistant.md"),
	"utf8",
);

function actions(file) {
	return [...file.matchAll(/- action: ([^\n]+)/g)].map((m) =>
		m[1].trim().replace(/^"|"$/g, ""),
	);
}

describe("investigation runtime project config (.opencode/)", () => {
	test("the project config declares nothing that binds other sessions", () => {
		expect(config.default_agent).toBeUndefined();
		expect(config.permission).toBeUndefined();
		expect(config.permissions).toBeUndefined();
		expect(config.mcp).toBeUndefined();
	});

	test("the opt-in MCP block exists but is not merged into the project config", () => {
		const optionalPath = path.join(ROOT, ".opencode", "opencode.mcp.optional.json");
		expect(fs.existsSync(optionalPath)).toBe(true);
		const optional = JSON.parse(fs.readFileSync(optionalPath, "utf8"));
		expect(Object.keys(optional.mcp?.servers ?? {}).sort()).toEqual([
			"context7",
			"github",
			"parallel-search",
			"render",
		]);
	});
});

describe.each([
	["investigator", investigator],
	["assistant", assistant],
])("agent %s (.opencode/agents/)", (name, file) => {
	test("uses native V2 ordered permissions, not the legacy grouped map", () => {
		expect(file).toMatch(/^permissions:$/m);
		expect(file).not.toMatch(/^permission:$/m);
		// V1-only actions that silently vanish under V2 must not appear
		for (const bad of ["bash", "write", "patch", "task", "list", "doom_loop"]) {
			expect(actions(file)).not.toContain(bad);
		}
	});

	test("first rule is a catch-all deny", () => {
		expect(file).toMatch(
			/^permissions:\n\s+- action: "\*"\n\s+resource: "\*"\n\s+effect: deny/m,
		);
	});

	test("read/glob/grep allowed; .env denied AFTER the read allow; .env.example re-allowed", () => {
		const readAllow = file.search(/resource: "\*"\n\s+effect: allow/);
		const envDeny = file.search(/resource: "\*\.env"/);
		const envGlobDeny = file.search(/resource: "\*\*\/\.env"/);
		const envExample = file.search(/resource: "\*\.env\.example"/);
		expect(readAllow).toBeGreaterThan(-1);
		expect(envDeny).toBeGreaterThan(readAllow);
		expect(envGlobDeny).toBeGreaterThan(readAllow);
		expect(envExample).toBeGreaterThan(envGlobDeny);
		expect(file).toMatch(/action: glob\n\s+resource: "\*"\n\s+effect: allow/);
		expect(file).toMatch(/action: grep\n\s+resource: "\*"\n\s+effect: allow/);
	});

	test("expensive/mutating actions carry explicit denies", () => {
		for (const action of ["edit", "webfetch", "websearch", "subagent", "question"]) {
			expect(file).toMatch(
				new RegExp(`action: ${action}\\n\\s+resource: "\\*"\\n\\s+effect: deny`),
			);
		}
		expect(file).toMatch(
			/action: external_directory\n\s+resource: "\*"\n\s+effect: deny/,
		);
	});

	test("shell allowlist contains only read-only inspection commands", () => {
		const shellRules = [...file.matchAll(
			/- action: shell\n\s+resource: "([^"]+)"\n\s+effect: (\w+)/g,
		)].map((m) => ({ resource: m[1], effect: m[2] }));
		expect(shellRules.length).toBeGreaterThan(10);
		for (const rule of shellRules) {
			if (rule.effect !== "allow") continue;
			expect(rule.resource).not.toMatch(
				/rm|mv|cp|ln|chmod|chown|commit|push|add |npm|pnpm|yarn|bun|npx|curl|wget|ssh|sudo|kill|pkill/,
			);
		}
	});
});

describe("investigator MCP allowlist (inert until .opencode.mcp.optional.json is merged)", () => {
	test("github/render/context7/parallel-search read tools allowed", () => {
		expect(investigator).toMatch(/action: github_get_file_contents\n\s+resource: "\*"\n\s+effect: allow/);
		expect(investigator).toMatch(/action: parallel-search_web_search\n\s+resource: "\*"\n\s+effect: allow/);
		expect(investigator).toMatch(/action: context7_query-docs\n\s+resource: "\*"\n\s+effect: allow/);
		expect(investigator).toMatch(/action: render_list_services\n\s+resource: "\*"\n\s+effect: allow/);
	});

	test("no MCP write-capable tool is allowed", () => {
		expect(investigator).not.toMatch(/github_create_|github_push_|github_merge_|delete_file|pull_request_review_write|render_create_|render_update_|render_trigger_|render_delete_/);
	});
});

describe("assistant agent mirrors the same read-only rules", () => {
	test("assistant has no MCP tools at all", () => {
		expect(assistant).not.toMatch(/github_|render_|context7_|parallel-search_/);
	});
});
