import fs from "node:fs";
import path from "node:path";

// The investigation runtime is gated by the agents committed in this repo's
// `.opencode/agents/` directory, because opencode v2 discovers project
// configuration for EVERY opencode started in this repository - including
// the operator's own session. The project `.opencode/opencode.json` is
// therefore deliberately empty of policy, and the agents carry the full
// deny-first lockdown in their frontmatter, which binds only sessions
// created with `agent: "investigator"` (or "assistant") pinned.
//
// These tests pin both halves of that contract so a regression in either
// direction fails an ordinary commit.

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

describe("investigation runtime project config (.opencode/)", () => {
	test("the project config declares nothing that binds other sessions", () => {
		expect(config.default_agent).toBeUndefined();
		expect(config.permission).toBeUndefined();
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

describe("investigation agents (.opencode/agents/)", () => {
	test("agents carry the full deny-first lockdown in frontmatter", () => {
		for (const agentFile of [investigator, assistant]) {
			expect(agentFile).toMatch(/^\s+"\*": deny$/m);
			expect(agentFile).toMatch(/\*\.env": deny/);
			expect(agentFile).toMatch(/\*\*\/\.env": deny/);
			expect(agentFile).toMatch(/\*\.env\.\*": deny/);
			expect(agentFile).toMatch(/glob: allow/);
			expect(agentFile).toMatch(/grep: allow/);
			expect(agentFile).toMatch(/list: allow/);
			expect(agentFile).toMatch(/edit: deny/);
			expect(agentFile).toMatch(/write: deny/);
			expect(agentFile).toMatch(/patch: deny/);
			expect(agentFile).toMatch(/bash: deny/);
			expect(agentFile).toMatch(/webfetch: deny/);
			expect(agentFile).toMatch(/websearch: deny/);
			expect(agentFile).toMatch(/task: deny/);
			expect(agentFile).toMatch(/subagent: deny/);
		}
	});

	test("the investigator has read-only MCP tool allows only", () => {
		expect(investigator).toMatch(/github_get_file_contents: allow/);
		expect(investigator).toMatch(/github_search_code: allow/);
		expect(investigator).toMatch(/parallel-search_web_search: allow/);
		expect(investigator).toMatch(/parallel-search_web_fetch: allow/);
		expect(investigator).toMatch(/context7_query-docs: allow/);
		expect(investigator).toMatch(/render_list_services: allow/);
		expect(investigator).not.toMatch(
			/render_update_environment_variables|render_trigger_deploy|render_create_|github_create_|github_push_|github_merge_|delete_file|github_issue_create|github_pull_request_review_write/,
		);
	});

	test("investigator shell is allowlisted read-only only", () => {
		// every shell allow rule in the agent file is a read-only tool
		const allowLines = investigator
			.split("\n")
			.filter((line) => line.includes('"allow"'));
		expect(allowLines.length).toBeGreaterThan(0);
		for (const line of allowLines) {
			expect(line).not.toMatch(
				/rm|mv|cp|ln|chmod|chown|git commit|git push|git add|npm |pnpm |yarn |bun /,
			);
		}
	});

	test("assistant agent mirrors the same read-only rules", () => {
		expect(assistant).toMatch(/edit: deny/);
		expect(assistant).toMatch(/write: deny/);
		expect(assistant).toMatch(/patch: deny/);
		expect(assistant).toMatch(/shell:\n/);
	});
});
