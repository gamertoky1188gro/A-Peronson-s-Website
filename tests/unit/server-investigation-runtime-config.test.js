import { buildInvestigationConfig } from "../../server/services/investigation/runtimeConfig.js";

describe("investigation runtime config (server/services/investigation/runtimeConfig.js)", () => {
	test("uses the singular 'permission' key in object syntax", () => {
		const config = buildInvestigationConfig();
		expect(config.permission).toBeDefined();
		expect(config.permissions).toBeUndefined();
		expect(typeof config.permission).toBe("object");
	});

	test("denies everything first, then allows only read-only tools", () => {
		const { permission } = buildInvestigationConfig();
		expect(permission["*"]).toBe("deny");
		expect(permission.read).toEqual({
			"*": "allow",
			"*.env": "deny",
			"*.env.*": "deny",
			"*.env.example": "allow",
		});
		expect(permission.glob).toBe("allow");
		expect(permission.grep).toBe("allow");
		expect(permission.list).toBe("allow");
	});

	test("denies every mutating or ambient capability", () => {
		const { permission } = buildInvestigationConfig();
		for (const key of [
			"edit",
			"bash",
			"webfetch",
			"websearch",
			"question",
			"external_directory",
			"doom_loop",
			"task",
		]) {
			expect(permission[key]).toBe("deny");
		}
	});

	test("denies the named MCP servers by tool glob", () => {
		const config = buildInvestigationConfig();
		expect(config.tools["render_*"]).toBe(false);
		expect(config.tools["chrome-devtools_*"]).toBe(false);
		expect(config.tools["blender-mcp_*"]).toBe(false);
		expect(config.tools["minecraft_*"]).toBe(false);
		expect(config.tools["github_*"]).toBe(false);
	});

	test("denies an explicitly requested extra MCP server too", () => {
		const config = buildInvestigationConfig({ mcpTools: ["my-server_*"] });
		expect(config.tools["my-server_*"]).toBe(false);
	});

	test("ships an investigator agent that also denies edit and bash", () => {
		const { agents } = buildInvestigationConfig();
		expect(agents.investigator.mode).toBe("primary");
		expect(agents.investigator.permission.edit).toBe("deny");
		expect(agents.investigator.permission.bash).toBe("deny");
		expect(agents.investigator.permission.task).toBe("deny");
		expect(buildInvestigationConfig().default_agent).toBe("investigator");
	});
});
