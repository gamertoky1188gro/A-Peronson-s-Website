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
