import fs from "node:fs";
import path from "node:path";

// Investigation MCP policy (owner decision 2026-11-16): the repository's
// project opencode.json carries github, render and parallel-search so the
// investigator can use its read-only web/repo/search tools. context7 stays
// OUT because no CONTEXT7_API_KEY exists in the investigation environment.
// The optional block below the merged set exists only for that future case.

const ROOT = process.cwd();
const projectConfig = JSON.parse(
	fs.readFileSync(path.join(ROOT, ".opencode", "opencode.json"), "utf8"),
);
const optionalPath = path.join(ROOT, ".opencode", "opencode.mcp.optional.json");
const optional = JSON.parse(fs.readFileSync(optionalPath, "utf8"));

describe("investigation MCP servers in the project config (.opencode/opencode.json)", () => {
	const servers = projectConfig.mcp?.servers ?? {};

	it("the project declares github, render and parallel-search only", () => {
		expect(Object.keys(servers).sort()).toEqual(["github", "parallel-search", "render"]);
	});

	it("no server uses OAuth or codemode", () => {
		for (const server of Object.values(servers)) {
			expect(server.oauth).toBe(false);
			expect(server.codemode).toBe(false);
		}
	});

	it("github and render use env-interpolated bearer auth, never inline secrets", () => {
		const ghHeaders = servers.github?.headers ?? {};
		const rndHeaders = servers.render?.headers ?? {};
		expect(ghHeaders.Authorization).toBe("Bearer {env:GITHUB_PERSONAL_ACCESS_TOKEN}");
		expect(rndHeaders.Authorization).toBe("Bearer {env:RENDER_API_KEY}");
		expect(JSON.stringify(servers)).not.toMatch(/ghp_|rnd_|ctx7sk-|tvly-/u);
	});

	it("parallel-search needs no key", () => {
		const ps = servers["parallel-search"];
		expect(ps.url).toBe("https://search.parallel.ai/mcp");
		expect(ps.headers).toBeUndefined();
	});

	it("context7 is deliberately absent (no key in the environment)", () => {
		expect(servers.context7).toBeUndefined();
	});
});

describe("the context7 optional block remains unmerged", () => {
	it("optional block declares context7 only, with env-interpolated key", () => {
		const servers = optional.mcp?.servers ?? {};
		expect(Object.keys(servers)).toEqual(["context7"]);
		expect(servers.context7.headers?.CONTEXT7_API_KEY).toBe("{env:CONTEXT7_API_KEY}");
		expect(servers.context7.oauth).toBe(false);
		expect(servers.context7.codemode).toBe(false);
	});
});
