import fs from "node:fs";
import path from "node:path";

// Investigation MCP policy (owner decision 2026-11-16): the repository's
// project opencode.json carries NO MCP servers, because anything in
// opencode.json binds every opencode started in this repo — including the
// operator's own session. MCP is opt-in only via opencode.mcp.optional.json.
// context7 stays OUT because no CONTEXT7_API_KEY exists in the investigation
// environment.
const ROOT = process.cwd();
const projectConfig = JSON.parse(
	fs.readFileSync(path.join(ROOT, ".opencode", "opencode.json"), "utf8"),
);
const optionalPath = path.join(ROOT, ".opencode", "opencode.mcp.optional.json");
const optional = JSON.parse(fs.readFileSync(optionalPath, "utf8"));

describe("investigation MCP servers in the project config (.opencode/opencode.json)", () => {
	const servers = projectConfig.mcp?.servers ?? {};

	it("the project declares no MCP servers (opt-in only via optional block)", () => {
		expect(Object.keys(servers)).toEqual([]);
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
