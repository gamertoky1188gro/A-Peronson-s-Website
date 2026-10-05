// HyperCache Phase 2 — route cacheMode registry (spec section 20).
// Modes:
// - local-first: render Dexie snapshot instantly, refresh in background.
// - local-first+realtime: local-first plus live subscription/polling.
// - static: content rarely changes; long TTL, manual invalidation.
// - network-required: never serve stale (admin / sensitive surfaces).

export const CACHE_MODES = {
	LOCAL_FIRST: "local-first",
	LOCAL_FIRST_REALTIME: "local-first+realtime",
	STATIC: "static",
	NETWORK_REQUIRED: "network-required",
};

const ROUTE_CACHE_MODES = [
	{ pattern: /^\/feed(\/|$)/, mode: CACHE_MODES.LOCAL_FIRST, ttlMs: 5 * 60_000 },
	{ pattern: /^\/pricing(\/|$)/, mode: CACHE_MODES.STATIC, ttlMs: 24 * 60 * 60_000 },
	{ pattern: /^\/chat(\/|$)/, mode: CACHE_MODES.LOCAL_FIRST_REALTIME, ttlMs: 60_000 },
	{ pattern: /^\/admin(\/|$)/, mode: CACHE_MODES.NETWORK_REQUIRED, ttlMs: 0 },
];

export function getRouteCacheMode(route) {
	const path =
		String(route || "")
			.split("?")[0]
			.split("#")[0] || "/";
	for (const entry of ROUTE_CACHE_MODES) {
		if (entry.pattern.test(path)) return { route: path, mode: entry.mode, ttlMs: entry.ttlMs };
	}
	return { route: path, mode: CACHE_MODES.NETWORK_REQUIRED, ttlMs: 0 };
}

export function isCacheableRoute(route) {
	return getRouteCacheMode(route).mode !== CACHE_MODES.NETWORK_REQUIRED;
}

export function registerRouteCacheMode(pattern, mode, ttlMs = 0) {
	if (!(pattern instanceof RegExp)) throw new TypeError("pattern must be a RegExp");
	ROUTE_CACHE_MODES.push({ pattern, mode, ttlMs });
	return () => {
		const idx = ROUTE_CACHE_MODES.findIndex((e) => e.pattern === pattern && e.mode === mode);
		if (idx >= 0) ROUTE_CACHE_MODES.splice(idx, 1);
	};
}

export default { CACHE_MODES, getRouteCacheMode, isCacheableRoute, registerRouteCacheMode };
