// HyperCache Phase 2 — broadcast wrapper (multi-tab notify).
// Uses BroadcastChannel when available; falls back to a local listener set
// (same-tab) and localStorage events (cross-tab legacy) so callers never branch.

const CHANNEL_NAME = "gartexhub-hypercache";

export { CHANNEL_NAME };

const localListeners = new Set();
let _channel = null;

function getChannel() {
	if (_channel) return _channel;
	try {
		if (typeof BroadcastChannel !== "undefined") {
			_channel = new BroadcastChannel(CHANNEL_NAME);
			_channel.onmessage = (event) => {
				const msg = event?.data;
				for (const fn of localListeners) {
					try {
						fn(msg);
					} catch {
						/* ignore listener errors */
					}
				}
			};
		}
	} catch {
		_channel = null;
	}
	return _channel;
}

function storageFallbackPost(message) {
	try {
		if (typeof localStorage === "undefined") return;
		localStorage.setItem(
			"__hypercache_bc__",
			JSON.stringify({ message, at: Date.now(), nonce: Math.random() }),
		);
	} catch {
		/* storage unavailable */
	}
}

if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
	window.addEventListener("storage", (event) => {
		if (event?.key !== "__hypercache_bc__" || !event.newValue) return;
		try {
			const parsed = JSON.parse(event.newValue);
			for (const fn of localListeners) {
				try {
					fn(parsed.message);
				} catch {
					/* ignore */
				}
			}
		} catch {
			/* ignore malformed */
		}
	});
}

export function broadcast(message) {
	const ch = getChannel();
	if (ch) {
		try {
			ch.postMessage(message);
			return;
		} catch {
			/* fall through */
		}
	}
	// Same-tab delivery + cross-tab fallback.
	for (const fn of localListeners) {
		try {
			fn(message);
		} catch {
			/* ignore */
		}
	}
	storageFallbackPost(message);
}

export function subscribe(fn) {
	localListeners.add(fn);
	getChannel();
	return () => localListeners.delete(fn);
}

export function notifyEntity(entity, ids = []) {
	broadcast({ type: "hypercache:update", entity, ids, at: Date.now() });
}

export function notifyFullResync(reason = "") {
	broadcast({ type: "hypercache:reset", reason, at: Date.now() });
}

export function notifyOutboxCount(count) {
	broadcast({ type: "hypercache:outbox", count: Number(count) || 0, at: Date.now() });
}

export default {
	broadcast,
	subscribe,
	notifyEntity,
	notifyFullResync,
	notifyOutboxCount,
	CHANNEL_NAME,
};
