/**
 * The tool names the support investigation runtime refuses to expose, and the
 * permission-resolution helper used by the read-only spike test to ask the
 * server's own resolved rule set for the effective effect of an action.
 *
 * The actual gating happens in the committed `.opencode/agents/` frontmatter
 * (deny-first, pinned to sessions via `agent:`), never in the project
 * config. This file exists so report.js can describe what the runtime
 * cannot do and the spike can read the server's resolved rule set without
 * reimplementing the resolver.
 */

// Tool names that are refused on EVERY resource. These are the mutating and
// delegation tools — the trust boundary. `shell`/`bash` and `websearch` are
// deliberately NOT here: the investigator agent (`.opencode/agents/investigator.md`)
// allows a narrow read-only git shell allowlist and websearch, per AGENTS.md §33.
// A shell action still resolves to `deny` for an arbitrary resource because the
// allow rules only name specific git patterns; only `read`/`glob`/`grep` and
// those narrow patterns are permitted.
const ALWAYS_DENIED_TOOL_NAMES = [
	"edit",
	"write",
	"patch",
	"task",
	"subagent",
	"webfetch",
	"question",
	"external_directory",
	"doom_loop",
];

const ALWAYS_DISABLED_MCP_PATTERNS = ["chrome-devtools_*", "blender-mcp_*", "minecraft_*"];

/**
 * Deprecated no-op. Kept only because the read-only spike still imports it;
 * its value is never consumed (the spawn ignores an injected config).
 */
export function buildInvestigationConfig() {
	return {};
}

/**
 * Resolve the effect opencode would apply to one action on one resource.
 *
 * Mirrors opencode's resolution: a catch-all `*` rule is applied first, then
 * the rules of the named action in the order they were written; the LAST
 * matching rule wins. `resource` defaults to `*` (i.e. "somewhere arbitrary"),
 * the question the spike asks for every denied action.
 */
export function resolveEffectivePermission(permission, action, resource = "*") {
	let effect = null;
	for (const rule of normalizePermissionSources(permission)) {
		if (!matchesPattern(rule.action, action)) continue;
		if (!matchesPattern(rule.resource, resource)) continue;
		effect = rule.effect;
	}
	return effect;
}

function normalizePermissionSources(permission) {
	if (!permission) return [];
	if (Array.isArray(permission)) {
		// Native V2 rule list: [{ action, resource, effect }, ...]
		const rules = [];
		for (const rule of permission) {
			if (
				rule &&
				typeof rule.action === "string" &&
				typeof rule.resource === "string" &&
				typeof rule.effect === "string"
			) {
				rules.push({ action: rule.action, resource: rule.resource, effect: rule.effect });
			}
		}
		return rules;
	}
	const rules = [];
	if (typeof permission["*"] === "string") {
		rules.push({ action: "*", resource: "*", effect: permission["*"] });
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

function matchesPattern(pattern, value) {
	if (pattern === "*") return true;
	const escaped = String(pattern)
		.replace(/[.+^${}()|[\]\\]/gu, "\\$&")
		.replace(/\*/gu, ".*");
	return new RegExp(`^${escaped}$`).test(String(value));
}

export { ALWAYS_DENIED_TOOL_NAMES, ALWAYS_DISABLED_MCP_PATTERNS };
