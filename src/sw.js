// HyperCache Phase 1 — offline app shell service worker.
// Built via vite-plugin-pwa `injectManifest` strategy: the build injects the
// precache manifest into `self.__WB_MANIFEST`. Vanilla Cache API only — no
// workbox runtime imports, so the SW never breaks on missing workbox deps.
//
// Routing policy:
// - NetworkOnly: /api/*, /ws*, /api/feed/stream (never cached, incl. SSE)
// - CacheFirst: /assets/* (hashed at build time)
// - StaleWhileRevalidate: fonts (googleapis/gstatic) + icons (svg/png/ico/woff2)
// - Navigations: cached /index.html served app-shell-first, network revalidates;
//   network fallback when nothing cached yet. Offline -> cached shell.
// - skipWaiting + clientsClaim ONLY via explicit SKIP_WAITING message (never forced).

/* global self, caches, fetch, Response, Request, URL */

const SHELL_CACHE = "gartexhub-app-shell-v1";
const ASSETS_CACHE = "gartexhub-assets-v1";
const RUNTIME_CACHE = "gartexhub-runtime-v1";
const OFFLINE_URL = "/index.html";

// Injected at build time by vite-plugin-pwa. Empty array in dev / before build.
const PRECACHE_MANIFEST = self.__WB_MANIFEST || [];

const NETWORK_ONLY_PATTERNS = [/^\/api\//, /^\/ws(\/|$)/];
const STREAM_PATHS = ["/api/feed/stream"];

function isNetworkOnly(url) {
	if (url.origin !== self.location.origin) return false;
	const path = url.pathname;
	if (STREAM_PATHS.some((p) => path === p || path.startsWith(`${p}/`))) return true;
	return NETWORK_ONLY_PATTERNS.some((re) => re.test(path));
}

function isHashedAsset(url) {
	return url.origin === self.location.origin && url.pathname.startsWith("/assets/");
}

function isFontOrIcon(request, url) {
	if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") return true;
	if (url.origin !== self.location.origin) return false;
	return /\.(?:svg|png|ico|woff2?)$/i.test(url.pathname);
}

async function cacheFirst(request, cacheName) {
	const cache = await caches.open(cacheName);
	const cached = await cache.match(request, { ignoreSearch: false });
	if (cached) return cached;
	const response = await fetch(request);
	if (response && (response.status === 200 || response.type === "opaque")) {
		cache.put(request, response.clone()).catch(() => {});
	}
	return response;
}

async function staleWhileRevalidate(request, cacheName) {
	const cache = await caches.open(cacheName);
	const cached = await cache.match(request);
	const networkPromise = fetch(request)
		.then((response) => {
			if (response && (response.status === 200 || response.type === "opaque")) {
				cache.put(request, response.clone()).catch(() => {});
			}
			return response;
		})
		.catch(() => null);
	if (cached) return cached;
	const networked = await networkPromise;
	return networked || Response.error();
}

// Navigations: serve the cached app shell instantly (offline-capable),
// revalidate /index.html in the background. If nothing cached yet, try the
// network, then fall back to the cached shell on failure.
async function handleNavigation(event) {
	const cache = await caches.open(SHELL_CACHE);
	const cachedShell = (await cache.match(OFFLINE_URL)) || (await cache.match("/")) || null;

	// Use navigation preload when available to shave a round-trip.
	const preload = event.preloadResponse ? await event.preloadResponse.catch(() => null) : null;

	if (cachedShell) {
		// Background revalidation — never blocks the response.
		event.waitUntil(
			(async () => {
				try {
					const fresh = preload || (await fetch(OFFLINE_URL, { cache: "no-store" }));
					if (fresh && fresh.status === 200) await cache.put(OFFLINE_URL, fresh.clone());
				} catch {
					/* offline — keep serving the cached shell */
				}
			})(),
		);
		return cachedShell;
	}

	try {
		const response = preload || (await fetch(event.request));
		if (response && response.status === 200) {
			const copy = response.clone();
			event.waitUntil(cache.put(OFFLINE_URL, copy).catch(() => {}));
		}
		return response;
	} catch {
		const fallback = await cache.match(OFFLINE_URL);
		return fallback || Response.error();
	}
}

// --- Lifecycle ---

self.addEventListener("install", (event) => {
	// Precaching only — do NOT skipWaiting here (update is opt-in via message).
	event.waitUntil(
		(async () => {
			const cache = await caches.open(SHELL_CACHE);
			const entries = PRECACHE_MANIFEST.map((entry) =>
				typeof entry === "string" ? entry : entry.url,
			).filter(Boolean);
			// Cache each entry individually so one 404 doesn't fail the batch.
			await Promise.all(
				entries.map(async (url) => {
					try {
						const res = await fetch(url, { cache: "no-store" });
						if (res && (res.status === 200 || res.type === "opaque")) {
							await cache.put(url, res.clone());
						}
					} catch {
						/* asset unavailable at install — runtime caching covers it */
					}
				}),
			);
		})(),
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		(async () => {
			// Navigation preload for faster navigations.
			try {
				if ("navigationPreload" in self.registration) {
					await self.registration.navigationPreload.enable();
				}
			} catch {
				/* preload unsupported */
			}
			// Drop stale versioned caches.
			const keep = new Set([SHELL_CACHE, ASSETS_CACHE, RUNTIME_CACHE]);
			const names = await caches.keys();
			await Promise.all(names.map((n) => (keep.has(n) ? null : caches.delete(n))));
			// Claim clients ONLY when an update was explicitly accepted (see message).
			if (self.__gartexClaim === true) {
				self.__gartexClaim = false;
				try {
					await self.clients.claim();
				} catch {
					/* ignore */
				}
			}
		})(),
	);
});

// Opt-in update channel: the page posts { type: "SKIP_WAITING" } only after
// the user accepts the refresh (OfflineBanner). Never forced on install.
self.addEventListener("message", (event) => {
	const type = event?.data?.type || event?.data;
	if (type === "SKIP_WAITING") {
		self.__gartexClaim = true;
		self.skipWaiting().catch(() => {});
	}
	if (type === "GET_VERSION") {
		event?.ports?.[0]?.postMessage?.({ version: SHELL_CACHE });
	}
});

// --- Fetch ---

self.addEventListener("fetch", (event) => {
	const { request } = event;
	if (request.method !== "GET") return;

	let url;
	try {
		url = new URL(request.url);
	} catch {
		return;
	}

	// API / WebSocket / SSE: pure network, never cached, never intercepted.
	if (isNetworkOnly(url)) return;

	// App navigations: offline-capable shell.
	if (request.mode === "navigate") {
		event.respondWith(handleNavigation(event));
		return;
	}

	// Hashed build assets: immutable, cache-first.
	if (isHashedAsset(url)) {
		event.respondWith(cacheFirst(request, ASSETS_CACHE));
		return;
	}

	// Fonts + icons: stale-while-revalidate.
	if (isFontOrIcon(request, url)) {
		event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
	}
});
