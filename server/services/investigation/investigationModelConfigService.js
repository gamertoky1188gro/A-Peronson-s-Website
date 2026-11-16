import { logWarn } from "../../utils/logger.js";
import prisma from "../../utils/prisma.js";
import { getOpenCodeFreeModels } from "./modelCatalog.js";
import { parseModelChain } from "./modelChain.js";

const KEY_ALLOWED = "ai.opencode.investigation_allowed";
const KEY_DEFAULT = "ai.opencode.investigation_default";
const KEY_BUYER_TOGGLE = "ai.opencode.buyer_model_select";
const KEY_ROLE_MODELS = "ai.opencode.investigation_role_models";
const KEY_ROUTING = "ai.opencode.investigation_routing";

// The roles a model can be pinned to. Kept as a literal so this module does
// not depend on the agent prompts; the queue is the one that reads it.
const ASSIGNMENT_ROLES = ["lead", "code", "repo", "research", "verify"];

async function readRows() {
	try {
		const rows = await prisma.adminBranding.findMany({
			where: {
				brand_key: {
					in: [KEY_ALLOWED, KEY_DEFAULT, KEY_BUYER_TOGGLE, KEY_ROLE_MODELS, KEY_ROUTING],
				},
			},
		});
		const map = {};
		for (const row of rows) map[row.brand_key] = row;
		return map;
	} catch (error) {
		logWarn("investigation_model_config_read_failed", { error: error?.message });
		return {};
	}
}
const FREE_ID = (id) =>
	typeof id === "string" && (id.endsWith("-free") || id === "big-pickle") && id !== "iceman-free";

/**
 * The per-role model pins, as a plain `{ role: modelId }` map.
 *
 * A pin only survives while its model is allowed and free: a pin that names
 * a model the owner has since removed is dropped, not honoured.
 */
function sanitizeRoleModels(raw, allowed) {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
		return {};
	}
	const out = {};
	for (const role of ASSIGNMENT_ROLES) {
		const id = typeof raw[role] === "string" ? raw[role].trim() : "";
		if (id && FREE_ID(id) && allowed.includes(id)) {
			out[role] = id;
		}
	}
	return out;
}

/**
 * The auto-routing rules: `{ keyword, modelId, role? }`.
 *
 * A rule names a keyword in the case description and the model that should
 * lead the chain when that keyword is there. A rule with no role applies to
 * every role; one with a role applies to that role only.
 *
 * A rule survives only while its model is allowed and free — the same rule
 * the per-role pins follow, because both of them only reorder a chain the
 * runtime already agreed to.
 */
function sanitizeRouting(raw, allowed) {
	if (!Array.isArray(raw)) {
		return [];
	}
	const out = [];
	for (const rule of raw) {
		const keyword = typeof rule?.keyword === "string" ? rule.keyword.trim().slice(0, 60) : "";
		const modelId = typeof rule?.modelId === "string" ? rule.modelId.trim() : "";
		if (!(keyword && FREE_ID(modelId) && allowed.includes(modelId))) {
			continue;
		}
		const role = typeof rule?.role === "string" ? rule.role.trim() : "";
		out.push(
			role && ASSIGNMENT_ROLES.includes(role) ? { keyword, modelId, role } : { keyword, modelId },
		);
	}
	return out;
}

export async function getInvestigationModelConfig({ forceCatalogRefresh = false } = {}) {
	const catalogResult = await getOpenCodeFreeModels({ forceRefresh: forceCatalogRefresh }).catch(
		async () => ({ models: [], stale: true, fetchedAt: null }),
	);
	const catalog = catalogResult.models;
	const catalogIds = new Set(catalog.map((m) => m.id));
	const persisted = await readRows();
	let allowed = null;
	try {
		if (persisted[KEY_ALLOWED]?.value) allowed = JSON.parse(persisted[KEY_ALLOWED].value);
		if (!Array.isArray(allowed)) allowed = null;
	} catch {
		allowed = null;
	}
	if (!allowed) {
		allowed = catalog.filter((m) => m.id !== "longcat-2.5-free").map((m) => m.id);
	}
	allowed = allowed.filter(FREE_ID).filter((id) => catalogIds.size === 0 || catalogIds.has(id));
	let def = persisted[KEY_DEFAULT]?.value;
	if (!(def && allowed.includes(def)))
		def = allowed.includes("minimax-m3.1-flash-free")
			? "minimax-m3.1-flash-free"
			: (allowed[0] ?? "minimax-m3.1-flash-free");
	const buyerSelectEnabled = persisted[KEY_BUYER_TOGGLE]?.value !== "0";
	let rawRoleModels = null;
	try {
		if (persisted[KEY_ROLE_MODELS]?.value)
			rawRoleModels = JSON.parse(persisted[KEY_ROLE_MODELS].value);
	} catch {
		rawRoleModels = null;
	}
	let rawRouting = null;
	try {
		if (persisted[KEY_ROUTING]?.value) rawRouting = JSON.parse(persisted[KEY_ROUTING].value);
	} catch {
		rawRouting = null;
	}
	return {
		allowed,
		default: def,
		buyerSelectEnabled,
		roleModels: sanitizeRoleModels(rawRoleModels, allowed),
		routing: sanitizeRouting(rawRouting, allowed),
		catalog,
		catalogStale: Boolean(catalogResult.stale),
		catalogFetchedAt: catalogResult.fetchedAt ?? null,
	};
}

export async function setInvestigationModelConfig(
	{ allowed, default: def, buyerSelectEnabled, roleModels, routing },
	actorId,
) {
	const catalogResult = await getOpenCodeFreeModels({ forceRefresh: true }).catch(() => ({
		models: [],
	}));
	const catalogIds = new Set(catalogResult.models.map((m) => m.id));
	// When the live catalog is unreachable, validate against the known free
	// chain plus whatever was persisted before — never against nothing.
	const catalogDown = catalogIds.size === 0;
	const previous = await getInvestigationModelConfig();
	const fallbackIds = catalogDown
		? new Set([...parseModelChain().map((m) => m.id), ...previous.allowed])
		: catalogIds;
	const nextAllowed = Array.isArray(allowed) ? allowed.filter(FREE_ID) : previous.allowed;
	if (nextAllowed.length < 1) {
		const error = new Error("At least one allowed model is required");
		error.status = 400;
		throw error;
	}
	for (const id of nextAllowed) {
		if (!fallbackIds.has(id)) {
			const error = new Error(
				catalogDown
					? `"${id}" is not a known free model (catalog unavailable)`
					: `"${id}" is not in the live free catalog`,
			);
			error.status = 400;
			throw error;
		}
	}
	const nextDefault = def ?? previous.default;
	if (!nextAllowed.includes(nextDefault)) {
		const error = new Error("The default model must be in the allowed set");
		error.status = 400;
		throw error;
	}
	const nextToggle =
		typeof buyerSelectEnabled === "boolean" ? buyerSelectEnabled : previous.buyerSelectEnabled;
	// The per-role pins. A pin must name a model that is allowed, or the
	// owner would be configuring a model the runtime may never use.
	const nextRoleModels = roleModels === undefined ? { ...previous.roleModels } : {};
	if (roleModels !== undefined) {
		if (!roleModels || typeof roleModels !== "object" || Array.isArray(roleModels)) {
			const error = new Error("roleModels must be an object of role -> model id");
			error.status = 400;
			throw error;
		}
		for (const [role, id] of Object.entries(roleModels)) {
			if (!ASSIGNMENT_ROLES.includes(role)) {
				const error = new Error(`Unknown investigation role "${role}"`);
				error.status = 400;
				throw error;
			}
			if (typeof id !== "string" || !id.trim()) {
				continue;
			}
			if (!nextAllowed.includes(id.trim())) {
				const error = new Error(`The model pinned to "${role}" is not in the allowed set`);
				error.status = 400;
				throw error;
			}
			nextRoleModels[role] = id.trim();
		}
	}
	// The auto-routing rules. A rule must name a model that is allowed, or
	// the owner would be routing investigations to a model the chain can
	// never use.
	const nextRouting = routing === undefined ? [...(previous.routing || [])] : [];
	if (routing !== undefined) {
		if (!Array.isArray(routing)) {
			const error = new Error("routing must be an array of rules");
			error.status = 400;
			throw error;
		}
		for (const rule of routing) {
			const keyword = typeof rule?.keyword === "string" ? rule.keyword.trim() : "";
			const modelId = typeof rule?.modelId === "string" ? rule.modelId.trim() : "";
			if (!keyword) {
				const error = new Error("A routing rule needs a keyword");
				error.status = 400;
				throw error;
			}
			if (!nextAllowed.includes(modelId)) {
				const error = new Error(
					`The routing rule for "${keyword}" names a model that is not allowed`,
				);
				error.status = 400;
				throw error;
			}
			const role = typeof rule?.role === "string" ? rule.role.trim() : "";
			if (role && !ASSIGNMENT_ROLES.includes(role)) {
				const error = new Error(`Unknown investigation role "${role}"`);
				error.status = 400;
				throw error;
			}
			nextRouting.push(role ? { keyword, modelId, role } : { keyword, modelId });
		}
	}
	const write = (key, value) =>
		prisma.adminBranding.upsert({
			where: { brand_key: key },
			update: { value, active: true },
			create: { brand_key: key, value, active: true },
		});
	try {
		await prisma.$transaction([
			write(KEY_ALLOWED, JSON.stringify(nextAllowed)),
			write(KEY_DEFAULT, nextDefault),
			write(KEY_BUYER_TOGGLE, nextToggle ? "1" : "0"),
			write(KEY_ROLE_MODELS, JSON.stringify(nextRoleModels)),
			write(KEY_ROUTING, JSON.stringify(nextRouting)),
			prisma.adminConfigHistory.create({
				data: {
					config_type: "investigation_model_config",
					changed_by: String(actorId || "unknown"),
					previous_value: JSON.stringify({
						allowed: previous.allowed,
						default: previous.default,
						buyerSelectEnabled: previous.buyerSelectEnabled,
						roleModels: previous.roleModels,
						routing: previous.routing,
					}),
					new_value: JSON.stringify({
						allowed: nextAllowed,
						default: nextDefault,
						buyerSelectEnabled: nextToggle,
						roleModels: nextRoleModels,
						routing: nextRouting,
					}),
				},
			}),
		]);
	} catch (error) {
		logWarn("investigation model config persist failed", { error: error?.message });
		const wrapped = new Error(
			`Could not persist the investigation model config: ${error?.message}`,
		);
		wrapped.status = 500;
		throw wrapped;
	}
	return getInvestigationModelConfig();
}

export async function getBuyerSelectableConfig() {
	return getInvestigationModelConfig();
}
