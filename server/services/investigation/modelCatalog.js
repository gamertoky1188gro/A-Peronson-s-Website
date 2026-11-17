/**
 * Dynamic discovery of FREE OpenCode-tier models for the support portal.
 *
 * Source of truth is the public inference catalog
 * (https://opencode.ai/inference/v1/models). Cached for 5 minutes; a failed
 * refresh serves the last good copy marked `stale`. iceman-free is excluded
 * permanently: it is documented to train on prompts.
 */
const CATALOG_URL = "https://opencode.ai/inference/v1/models";
const TTL_MS = 5 * 60_000;
const TIMEOUT_MS = 10_000;
const PERMANENTLY_EXCLUDED = new Set(["iceman-free"]);

let cache = null; // { models, fetchedAt }

export function __resetModelCatalogForTests() {
	cache = null;
}

function normalizeModalityList(value) {
	return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function normalizeEntry(model) {
	const id = String(model?.id || "").trim();
	const modalities =
		model?.modalities && typeof model.modalities === "object" ? model.modalities : {};
	const limit = model?.limit && typeof model.limit === "object" ? model.limit : {};
	return {
		id,
		name: String(model?.name || model?.id || ""),
		providerID: "opencode",
		created: Number.isFinite(model?.created) ? model.created : null,
		ownedBy: model?.owned_by ?? null,
		// What the model can read and how big its context is — the client
		// uses both: media attach controls (input) and the context meter
		// (limit.context). Absent fields stay null, never invented.
		inputModalities: normalizeModalityList(modalities?.input),
		outputModalities: normalizeModalityList(modalities?.output),
		contextLimit: Number.isFinite(limit?.context) ? limit.context : null,
		maxOutput: Number.isFinite(limit?.output) ? limit.output : null,
	};
}

export async function getOpenCodeFreeModels({
	forceRefresh = false,
	fetchImpl = globalThis.fetch,
	ttlMs = TTL_MS,
	now = () => Date.now(),
} = {}) {
	if (!forceRefresh && cache && now() - cache.fetchedAt < ttlMs) {
		return { models: cache.models, cached: true, fetchedAt: cache.fetchedAt };
	}
	try {
		const response = await fetchImpl(CATALOG_URL, {
			signal: AbortSignal.timeout(TIMEOUT_MS),
			headers: { Accept: "application/json" },
		});
		if (!response.ok) throw new Error(`OpenCode catalog HTTP ${response.status}`);
		const payload = await response.json();
		const raw = Array.isArray(payload?.data)
			? payload.data
			: Array.isArray(payload)
				? payload
				: null;
		if (!raw) throw new Error("OpenCode catalog: unexpected response shape");
		const models = raw
			.map(normalizeEntry)
			.filter((m) => m.id.length > 0)
			.filter((m) => m.id.endsWith("-free") || m.id === "big-pickle")
			.filter((m) => !PERMANENTLY_EXCLUDED.has(m.id));
		cache = { models, fetchedAt: now() };
		return { models, cached: false, fetchedAt: cache.fetchedAt };
	} catch (error) {
		if (cache) {
			return { models: cache.models, cached: true, stale: true, fetchedAt: cache.fetchedAt };
		}
		const wrapped = new Error(`OpenCode model catalog unavailable: ${error?.message || "unknown"}`);
		wrapped.status = 503;
		throw wrapped;
	}
}
