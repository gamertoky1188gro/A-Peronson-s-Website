// server/services/investigation/activityLabel.js
//
// The one place a tool part becomes display text for the activity tree.
//Basename only, never a path; the investigation must not leak the repo
// layout to buyers. Anything unreadable degrades to "Working".

const READ_VERB = new Map([
	["read", "Reading"],
	["read_file", "Reading"],
	["write", "Writing"],
	["edit", "Editing"],
	["cat", "Reading"],
	["open", "Reading"],
]);
const SEARCH_TOOLS = new Set(["grep", "glob", "rg", "find", "ls"]);
const PATH_KEYS = ["path", "filePath", "file", "filepath", "target"];
// biome-ignore lint/suspicious/noControlCharactersInRegex: stripping control characters is the point
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/gu;
const UNSAFE = /[<>&"'`]/gu;

function sanitizeToolName(raw) {
	const cleaned = String(raw || "tool")
		.replace(/[^a-zA-Z0-9_-]/gu, "")
		.slice(0, 32);
	return cleaned || "tool";
}
function sanitizeLabelText(value, cap = 80) {
	return String(value || "")
		.replace(CONTROL_CHARS, " ")
		.replace(UNSAFE, "")
		.replace(/\s+/gu, " ")
		.trim()
		.slice(0, cap);
}
function pathBasename(raw) {
	const cleaned = String(raw || "")
		.replace(/["']/gu, "")
		.replace(/\\/gu, "/");
	if (cleaned.includes("../") || cleaned.includes("..\\") || cleaned.endsWith("..")) {
		return null;
	}
	const parts = cleaned.split("/").filter(Boolean);
	const base = parts[parts.length - 1] || "";
	if (!base || base === ".." || base.includes("\0")) {
		return null;
	}
	return base;
}

/**
 * @param {{ type?: string, name?: string, tool?: string, state?: { input?: unknown } | null } | null} part
 * @returns {{ kind: "read" | "search" | "other", label: string }}
 */
export function activityLabelFor(part) {
	try {
		if (!part || part.type !== "tool") {
			return { kind: "other", label: "Working" };
		}
		const tool = sanitizeToolName(part.name || part.tool).toLowerCase();
		const verb = READ_VERB.get(tool);
		if (verb) {
			const input = part.state?.input;
			for (const key of PATH_KEYS) {
				const raw = input && typeof input === "object" ? input[key] : null;
				const base = typeof raw === "string" ? pathBasename(raw) : null;
				if (base) {
					return { kind: "read", label: sanitizeLabelText(`${verb} ${base}`) };
				}
			}
			return { kind: "read", label: `${verb} files` };
		}
		if (SEARCH_TOOLS.has(tool)) {
			return { kind: "search", label: "Searching code" };
		}
		return { kind: "other", label: `Using ${sanitizeToolName(tool)}` };
	} catch {
		return { kind: "other", label: "Working" };
	}
}
