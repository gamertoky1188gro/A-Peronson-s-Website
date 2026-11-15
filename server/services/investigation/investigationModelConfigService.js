import prisma from "../../utils/prisma.js";
import { logWarn } from "../../utils/logger.js";
import { getOpenCodeFreeModels } from "./modelCatalog.js";
import { parseModelChain } from "./modelChain.js";

const KEY_ALLOWED = "ai.opencode.investigation_allowed";
const KEY_DEFAULT = "ai.opencode.investigation_default";
const KEY_BUYER_TOGGLE = "ai.opencode.buyer_model_select";

async function readRows() {
	try {
		const rows = await prisma.adminBranding.findMany({ where: { brand_key: { in: [KEY_ALLOWED, KEY_DEFAULT, KEY_BUYER_TOGGLE] } } });
		const map = {};
		for (const row of rows) map[row.brand_key] = row;
		return map;
	} catch {
		return {};
	}
}
const FREE_ID = (id) => typeof id === "string" && (id.endsWith("-free") || id === "big-pickle") && id !== "iceman-free";

export async function getInvestigationModelConfig() {
	const catalogResult = await getOpenCodeFreeModels().catch(async () => ({ models: [], stale: true, fetchedAt: null }));
	const catalog = catalogResult.models;
	const catalogIds = new Set(catalog.map((m) => m.id));
	const persisted = await readRows();
	let allowed = null;
	try {
		if (persisted[KEY_ALLOWED]?.value) allowed = JSON.parse(persisted[KEY_ALLOWED].value);
		if (!Array.isArray(allowed)) allowed = null;
	} catch { allowed = null; }
	if (!allowed) {
		allowed = catalog.filter((m) => m.id !== "longcat-2.5-free").map((m) => m.id);
	}
	allowed = allowed.filter(FREE_ID).filter((id) => catalogIds.size === 0 || catalogIds.has(id));
	let def = persisted[KEY_DEFAULT]?.value;
	if (!def || !allowed.includes(def)) def = allowed.includes("minimax-m3.1-flash-free") ? "minimax-m3.1-flash-free" : allowed[0] ?? "minimax-m3.1-flash-free";
	const buyerSelectEnabled = persisted[KEY_BUYER_TOGGLE]?.value !== "0";
	return {
		allowed,
		default: def,
		buyerSelectEnabled,
		catalog,
		catalogStale: Boolean(catalogResult.stale),
		catalogFetchedAt: catalogResult.fetchedAt ?? null,
	};
}

export async function setInvestigationModelConfig({ allowed, default: def, buyerSelectEnabled }, actorId) {
	const catalogResult = await getOpenCodeFreeModels({ forceRefresh: true }).catch(() => ({ models: [] }));
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
			const error = new Error(catalogDown
				? `"${id}" is not a known free model (catalog unavailable)`
				: `"${id}" is not in the live free catalog`);
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
	const nextToggle = typeof buyerSelectEnabled === "boolean" ? buyerSelectEnabled : previous.buyerSelectEnabled;
	const write = async (key, value) => prisma.adminBranding.upsert({
		where: { brand_key: key },
		update: { value, active: true },
		create: { brand_key: key, value, active: true },
	});
	try {
		await write(KEY_ALLOWED, JSON.stringify(nextAllowed));
		await write(KEY_DEFAULT, nextDefault);
		await write(KEY_BUYER_TOGGLE, nextToggle ? "1" : "0");
		await prisma.adminConfigHistory.create({
			data: {
				config_type: "investigation_model_config",
				changed_by: String(actorId || "unknown"),
				previous_value: JSON.stringify({ allowed: previous.allowed, default: previous.default, buyerSelectEnabled: previous.buyerSelectEnabled }),
				new_value: JSON.stringify({ allowed: nextAllowed, default: nextDefault, buyerSelectEnabled: nextToggle }),
			},
		});
	} catch (error) {
		logWarn("investigation model config persist failed", { error: error?.message });
		const wrapped = new Error(`Could not persist the investigation model config: ${error?.message}`);
		wrapped.status = 500;
		throw wrapped;
	}
	return getInvestigationModelConfig();
}

export async function getBuyerSelectableConfig() {
	return getInvestigationModelConfig();
}
