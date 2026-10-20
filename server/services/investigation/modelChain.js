/**
 * Model chain for the read-only investigation runtime.
 *
 * Only free `opencode/*` models are used. The chain is ordered: the first model
 * that the spawned server actually offers wins, the rest are fallbacks.
 */

export const DEFAULT_MODEL_CHAIN = [
	"deepseek-v4.1-flash-free",
	"mimo-v2.6-flash-free",
	"glm-5.3-flash-free",
	"minimax-m3.1-flash-free",
	"nemotron-3-ultra-free",
	"longcat-2.5-preview-free",
	"nemotron-3.5-lightning-free",
	"beam-free",
	"nemotron-3.5-super-vl-free",
	"big-pickle",
].map((id) => ({ id, providerID: "opencode" }));

export function parseModelChain(value) {
	if (typeof value !== "string" || !value.trim()) return [...DEFAULT_MODEL_CHAIN];
	const seen = new Set();
	const chain = [];
	for (const raw of value.split(",")) {
		const entry = raw.trim();
		if (entry) {
			const slash = entry.indexOf("/");
			const providerID = slash > 0 ? entry.slice(0, slash) : "opencode";
			const id = slash > 0 ? entry.slice(slash + 1) : entry;
			if (id && !seen.has(id)) {
				seen.add(id);
				chain.push({ id, providerID });
			}
		}
	}
	return chain.length > 0 ? chain : [...DEFAULT_MODEL_CHAIN];
}
