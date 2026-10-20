import {
	buildInvestigationConfig,
	resolveEffectivePermission,
} from "../../server/services/investigation/runtimeConfig.js";

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

	// The `tools` block disables the TOOLS of a named MCP server, not the
	// server itself. The containment that actually removes the servers is the
	// isolated config directory the runtime is spawned with, and that is proved
	// live by the spike gate (`mcp.list()` is empty).
	test("disables the tools of the named MCP servers by tool glob", () => {
		const config = buildInvestigationConfig();
		expect(config.tools["render_*"]).toBe(false);
		expect(config.tools["chrome-devtools_*"]).toBe(false);
		expect(config.tools["blender-mcp_*"]).toBe(false);
		expect(config.tools["minecraft_*"]).toBe(false);
		expect(config.tools["github_*"]).toBe(false);
	});

	test("disables the tools of an explicitly requested extra MCP server too", () => {
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

	// The NON-LIVE gate. The live spike proves the behaviour; this proves the
	// CONFIG, so a regression in the permission set fails an ordinary commit
	// instead of waiting for a night-time run of the spike.
	describe("the resolved permission set", () => {
		const { permission, agents } = buildInvestigationConfig();

		test("denies every mutating tool", () => {
			for (const action of ["edit", "write", "patch", "bash", "shell", "task", "subagent"]) {
				expect(resolveEffectivePermission(permission, action, "*")).toBe("deny");
			}
		});

		test("denies every ambient capability", () => {
			for (const action of [
				"webfetch",
				"websearch",
				"question",
				"external_directory",
				"doom_loop",
				"todowrite",
				"skill",
				"lsp",
			]) {
				expect(resolveEffectivePermission(permission, action, "*")).toBe("deny");
			}
		});

		test("allows exactly the read-only tools", () => {
			for (const action of ["read", "glob", "grep", "list"]) {
				expect(resolveEffectivePermission(permission, action, "server/server.js")).toBe("allow");
			}
		});

		test("denies reading .env and everything that looks like one", () => {
			expect(resolveEffectivePermission(permission, "read", ".env")).toBe("deny");
			expect(resolveEffectivePermission(permission, "read", "*.env")).toBe("deny");
			expect(resolveEffectivePermission(permission, "read", "*.env.local")).toBe("deny");
			expect(resolveEffectivePermission(permission, "read", "*.env.production")).toBe("deny");
		});

		test("still allows the committed example file", () => {
			expect(resolveEffectivePermission(permission, "read", "*.env.example")).toBe("allow");
		});

		test("denies a tool that is not named at all", () => {
			expect(resolveEffectivePermission(permission, "some_unknown_tool", "*")).toBe("deny");
		});

		// The agent's own permission block is resolved AFTER the global one, so
		// it has the last word. Widening it - "write": "allow", or a read rule
		// that re-opens "*.env" - would hand the investigator a capability the
		// global map denies, and the global map alone would not notice.
		test("the investigator's own permission set grants nothing the global set denies", () => {
			const agentPermission = agents.investigator.permission;

			for (const action of [
				"edit",
				"write",
				"patch",
				"bash",
				"shell",
				"task",
				"subagent",
				"webfetch",
				"websearch",
				"external_directory",
			]) {
				// The global map denies it ...
				expect(resolveEffectivePermission(permission, action, "*")).toBe("deny");
				// ... and the agent's own block must not hand it back.
				expect(resolveEffectivePermission([permission, agentPermission], action, "*")).toBe("deny");
			}
		});

		test("the investigator's own permission set does not re-open a denied read", () => {
			const agentPermission = agents.investigator.permission;
			for (const resource of [".env", "*.env", "*.env.local"]) {
				expect(resolveEffectivePermission(permission, "read", resource)).toBe("deny");
				expect(resolveEffectivePermission([permission, agentPermission], "read", resource)).toBe(
					"deny",
				);
			}
		});

		test("the investigator's own permission set grants nothing at all", () => {
			const agentPermission = agents.investigator.permission;
			for (const action of ["read", "glob", "grep", "list"]) {
				// The global map allows these, and the agent's block must not
				// turn one of them off (that would be a narrowing, which is
				// safe, but the block is meant to only ever take permissions
				// away).
				expect(resolveEffectivePermission(permission, action, "*")).toBe("allow");
			}
			for (const [action, value] of Object.entries(agentPermission)) {
				expect(value).not.toBe("allow");
			}
		});
	});
});
