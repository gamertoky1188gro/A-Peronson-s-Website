import fs from "node:fs";
import path from "node:path";

// The investigation MCP servers are declared in an OPT-IN block,
// `.opencode/opencode.mcp.optional.json`, not in the repository's project
// config: opencode v2 reads the project config for every opencode started in
// this repo, including the operator's own session, and registering four
// MCP servers there would bind them to it. Merging the block into
// `.opencode/opencode.json` is a deliberate, documented decision
// (see .opencode/README.md). These tests pin the block itself: when it is
// merged in, the investigation runtime's servers stay read-only and expose
// no inline credentials.

const ROOT = process.cwd();
const optionalPath = path.join(ROOT, ".opencode", "opencode.mcp.optional.json");
const optional = JSON.parse(fs.readFileSync(optionalPath, "utf8"));

describe("investigation MCP servers (.opencode/opencode.mcp.optional.json)", () => {
	const servers = optional.mcp?.servers ?? {};

	test("all four servers are declared", () => {
		expect(Object.keys(servers).sort()).toEqual([
			"context7",
			"github",
			"parallel-search",
			"render",
		]);
	});

	test("no server uses OAuth or codemode", () => {
		for (const server of Object.values(servers)) {
			expect(server.oauth).toBe(false);
			expect(server.codemode).toBe(false);
		}
	});

	test("github and render use env-interpolated bearer auth, never inline secrets", () => {
		const ghHeaders = servers.github?.headers ?? {};
		const rndHeaders = servers.render?.headers ?? {};
		expect(ghHeaders.Authorization).toBe("Bearer {env:GITHUB_PERSONAL_ACCESS_TOKEN}");
		expect(rndHeaders.Authorization).toBe("Bearer {env:RENDER_API_KEY}");
		expect(JSON.stringify(servers)).not.toMatch(/ghp_|rnd_|ctx7sk-|tvly-/);
	});

	test("context7 uses env-interpolated API key, never inline secrets", () => {
		expect(servers.context7?.headers?.CONTEXT7_API_KEY).toBe("{env:CONTEXT7_API_KEY}");
	});
});

describe("the opt-in block is not merged into the project config", () => {
	const projectConfig = JSON.parse(
		fs.readFileSync(path.join(ROOT, ".opencode", "opencode.json"), "utf8"),
	);

	test("the project config declares no MCP servers", () => {
		expect(projectConfig.mcp).toBeUndefined();
	});
});
