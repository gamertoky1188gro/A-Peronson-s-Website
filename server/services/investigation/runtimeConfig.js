/**
 * Read-only opencode configuration for the AI support investigation portal.
 *
 * The read-only lever is the SINGULAR `permission` key, in object syntax, keyed
 * by tool name. Wildcards apply to the tool's input; the last matching rule wins.
 *
 * Two traps this file exists to avoid (both verified live against opencode v2):
 *  - The array form `permissions: [{ action, resource, effect }]` is silently
 *    ignored by opencode v2 and FAILS OPEN. Never convert this to that shape.
 *  - `task` (subagent delegation) is a privilege-escalation path: with no write
 *    tool of its own, an investigator can delegate the write to a subagent.
 *    `task: "deny"` is therefore mandatory, not optional.
 */

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

const ALWAYS_DENIED_TOOLS = [
	"edit",
	"bash",
	"webfetch",
	"websearch",
	"question",
	"external_directory",
	"doom_loop",
	"task",
];

const ALWAYS_DISABLED_MCP_TOOLS = [
	"render_*",
	"chrome-devtools_*",
	"blender-mcp_*",
	"minecraft_*",
	"github_*",
	"parallel-search_*",
];

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

export function buildInvestigationConfig({ mcpTools = [], skills, plugins, mcp } = {}) {
	const mcpEnabled = mcp !== false;
	// MCP: only servers whose credential (or public access) is available.
	const servers = {};
	if (mcpEnabled) {
		for (const [name, server] of Object.entries(MCP_SERVERS)) {
			const CRED = CRED_FOR[name];
			if (!CRED || process.env[CRED]) servers[name] = server;
		}
	}

	const permission = {
		"*": "deny",
		read: {
			"*": "allow",
			// The `.env` denies come in TWO shapes, because opencode matches
			// these patterns as GLOBS and a glob's `*` does not cross a `/`.
			// `*.env` therefore denies `.env` in the root only, and a
			// `server/.env` would slip through it. The `**/` forms deny the
			// file at any depth.
			"*.env": "deny",
			"*.env.*": "deny",
			"**/.env": "deny",
			"**/.env.*": "deny",
			// The example file is a template, not a secret, and it is allowed
			// LAST so that it wins over the denies above.
			"*.env.example": "allow",
		},
		glob: "allow",
		grep: "allow",
		list: "allow",
	};
	for (const tool of ALWAYS_DENIED_TOOLS) {
		permission[tool] = "deny";
	}

	const tools = {};
	for (const pattern of [...ALWAYS_DISABLED_MCP_TOOLS, ...mcpTools]) {
		tools[pattern] = false;
	}
	if (mcpEnabled) {
		for (const [server, allowlist] of Object.entries(MCP_TOOL_ALLOWLISTS)) {
			if (!servers[server]) continue;
			for (const tool of allowlist) tools[toolKey(server, tool)] = true;
		}

		for (const [server, allowlist] of Object.entries(MCP_TOOL_ALLOWLISTS)) {
			if (!servers[server]) continue;
			for (const tool of allowlist) permission[toolKey(server, tool)] = "allow";
		}
	}

	const config = {
		default_agent: "investigator",
		permission,
		tools,
		agents: {
			investigator: {
				mode: "primary",
				description:
					"Read-only codebase investigator. Reads and searches source files. Cannot modify files, run commands, delegate to subagents, or use MCP integrations.",
				permission: {
					edit: "deny",
					bash: "deny",
					webfetch: "deny",
					task: "deny",
				},
			},
		},
	};

	const skillsDir = skills === false ? undefined : (skills ?? (exists(SKILLS_DIR) ? [SKILLS_DIR] : undefined));
	if (skillsDir?.length) config.skills = skillsDir;
	const pluginDirs = plugins === false ? undefined : (plugins ?? PLUGIN_DIRS.filter(exists));
	if (pluginDirs?.length) config.plugins = pluginDirs;
	if (mcpEnabled && Object.keys(servers).length) config.mcp = { servers };

	return config;
}

export const ALWAYS_DENIED_TOOL_NAMES = ALWAYS_DENIED_TOOLS;
export const ALWAYS_DISABLED_MCP_PATTERNS = ALWAYS_DISABLED_MCP_TOOLS;

/**
 * Does a permission pattern match a value? `*` matches everything, and `*`
 * inside a pattern matches any run of characters.
 */
function matchesPattern(pattern, value) {
	if (pattern === "*") return true;
	const escaped = String(pattern)
		.replace(/[.+^${}()|[\]\\]/g, "\\$&")
		.replace(/\*/g, ".*");
	return new RegExp(`^${escaped}$`).test(String(value));
}

/**
 * Resolve the EFFECT opencode would apply to one tool action on one resource.
 *
 * opencode's own rule is "last matching rule wins", and it normalises the
 * singular `permission` object into an ordered rule list: the catch-all `*`
 * rule first, then the rules of the named action, in the order they were
 * written. This mirrors that, so the same answer can be reached from the
 * config the runtime is about to send and from the rule list the server
 * resolved from it.
 *
 * Accepts either shape:
 *  - the object form  `{ "*": "deny", read: { "*": "allow", "*.env": "deny" } }`
 *  - the array form   `[{ action, resource, effect }]`
 *
 * An ARRAY OF SOURCES is also accepted, and is how the agent's own permission
 * block is composed with the global one: `[{...global}, {...agent}]`. The
 * later source wins, exactly as it does on the server, where the agent's
 * rules are resolved after the global ones.
 */
export function resolveEffectivePermission(permission, action, resource = "*") {
	const rules = normalizePermissionSources(permission);
	let effect = null;
	for (const rule of rules) {
		if (!matchesPattern(rule.action, action)) continue;
		if (!matchesPattern(rule.resource, resource)) continue;
		effect = rule.effect;
	}
	return effect;
}

/**
 * Turn a permission source (or a list of them) into the ordered rule list
 * opencode would resolve.
 */
function normalizePermissionSources(permission) {
	if (!permission) return [];

	if (Array.isArray(permission)) {
		// A rule list, or a list of permission sources.
		const isRuleList =
			permission.length > 0 &&
			permission.every((entry) => entry && typeof entry === "object" && "effect" in entry);
		if (isRuleList) {
			return permission.map((rule) => ({
				action: rule.action ?? "*",
				resource: rule.resource ?? "*",
				effect: rule.effect,
			}));
		}
		return permission.flatMap((source) => normalizePermissionSources(source));
	}

	if (typeof permission !== "object") return [];

	const rules = [];
	const wildcard = permission["*"];
	if (typeof wildcard === "string") {
		rules.push({ action: "*", resource: "*", effect: wildcard });
	}
	for (const [action, value] of Object.entries(permission)) {
		if (action === "*") continue;
		if (typeof value === "string") {
			rules.push({ action, resource: "*", effect: value });
		} else if (value && typeof value === "object") {
			for (const [pattern, effect] of Object.entries(value)) {
				rules.push({ action, resource: pattern, effect });
			}
		}
	}
	return rules;
}
