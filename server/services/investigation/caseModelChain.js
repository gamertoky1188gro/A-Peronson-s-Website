import { DEFAULT_MODEL_CHAIN } from "./modelChain.js";

const FORBIDDEN = new Set(["iceman-free"]);
const okId = (id) => typeof id === "string" && (id.endsWith("-free") || id === "big-pickle") && !FORBIDDEN.has(id);
const offerSet = (available) => new Set((available || []).map((m) => (typeof m === "string" ? m : m?.id)));

export function computeCaseModelOrder({ caseModelId = null, allowed = [], available = [] } = {}) {
	const offered = offerSet(available);
	const allowedClean = (Array.isArray(allowed) ? allowed : []).filter(okId);
	const offeredAllowed = allowedClean.filter((id) => offered.has(id));
	const order = [];
	const push = (id) => {
		if (!order.some((m) => m.id === id) && !FORBIDDEN.has(id)) {
			order.push({ id, providerID: "opencode" });
		}
	};
	if (caseModelId && okId(caseModelId) && allowedClean.includes(caseModelId) && offered.has(caseModelId)) {
		push(caseModelId);
	}
	for (const id of offeredAllowed) push(id);
	for (const entry of DEFAULT_MODEL_CHAIN) {
		if (offered.has(entry.id)) push(entry.id);
	}
	return order;
}
