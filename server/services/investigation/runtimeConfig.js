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

export function buildInvestigationConfig({ mcpTools = [] } = {}) {
	const permission = {
		"*": "deny",
		read: {
			"*": "allow",
			"*.env": "deny",
			"*.env.*": "deny",
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

	return {
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
}

export const ALWAYS_DENIED_TOOL_NAMES = ALWAYS_DENIED_TOOLS;
export const ALWAYS_DISABLED_MCP_PATTERNS = ALWAYS_DISABLED_MCP_TOOLS;
