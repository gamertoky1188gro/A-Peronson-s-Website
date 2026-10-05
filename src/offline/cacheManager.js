// HyperCache Phase 2 — cache manager: storage modes + persist() + quota helpers.
// Modes:
// - smart: keep working set only (pages + indexes + recent entities), default.
// - full: keep everything (all entity stores).
// - wifi-only: same retention as smart, but background sync/prefetch only on wifi.

import { getDb } from "./db.js";

export const STORAGE_MODES = {
	SMART: "smart",
	FULL: "full",
	WIFI_ONLY: "wifi-only",
};

const MODE_KEY = "hypercache.storageMode";
let currentMode = STORAGE_MODES.SMART;

try {
	const saved = typeof localStorage === "undefined" ? null : localStorage.getItem(MODE_KEY);
	if (saved && Object.values(STORAGE_MODES).includes(saved)) currentMode = saved;
} catch {
	/* storage unavailable */
}

export function getStorageMode() {
	return currentMode;
}

export function setStorageMode(mode) {
	if (!Object.values(STORAGE_MODES).includes(mode)) {
		throw new TypeError(`Unknown storage mode: ${mode}`);
	}
	currentMode = mode;
	try {
		localStorage.setItem(MODE_KEY, mode);
	} catch {
		/* ignore */
	}
	return currentMode;
}

export function isSyncAllowed() {
	if (currentMode !== STORAGE_MODES.WIFI_ONLY) return true;
	try {
		const conn = navigator?.connection;
		if (!conn) return true; // unknown — allow
		if (typeof conn.saveData === "boolean" && conn.saveData) return false;
		const type = String(conn.effectiveType || conn.type || "").toLowerCase();
		if (!type) return true;
		return type.includes("wifi") || type.includes("ethernet") || type.includes("4g");
	} catch {
		return true;
	}
}

// Ask the browser to persist site storage (survive storage pressure).
export async function persist() {
	try {
		if (navigator?.storage?.persist) {
			return await navigator.storage.persist();
		}
		return false;
	} catch {
		return false;
	}
}

export async function isPersisted() {
	try {
		if (navigator?.storage?.persisted) {
			return await navigator.storage.persisted();
		}
		return false;
	} catch {
		return false;
	}
}

// Human + machine readable quota snapshot.
export async function quotaInfo() {
	try {
		if (navigator?.storage?.estimate) {
			const { usage = 0, quota = 0 } = await navigator.storage.estimate();
			const pct = quota > 0 ? (usage / quota) * 100 : 0;
			return {
				usage,
				quota,
				percentUsed: pct,
				display: formatBytes(usage),
				quotaDisplay: formatBytes(quota),
			};
		}
	} catch {
		/* fall through */
	}
	return { usage: 0, quota: 0, percentUsed: 0, display: "n/a", quotaDisplay: "n/a" };
}

export function formatBytes(bytes) {
	const n = Number(bytes || 0);
	if (!Number.isFinite(n) || n <= 0) return "0 B";
	const units = ["B", "KB", "MB", "GB"];
	const idx = Math.min(units.length - 1, Math.floor(Math.log10(Math.max(1, n)) / 3));
	const val = n / 10 ** (3 * idx);
	return `${val >= 100 ? Math.round(val) : val.toFixed(1)} ${units[idx]}`;
}

// Approximate Dexie footprint (entity counts per store) for settings UI.
export async function storeFootprint() {
	try {
		const db = getDb();
		const names = db.tables.map((t) => t.name);
		const counts = {};
		for (const name of names) {
			try {
				counts[name] = await db.table(name).count();
			} catch {
				counts[name] = -1;
			}
		}
		return counts;
	} catch {
		return {};
	}
}

export default {
	getStorageMode,
	setStorageMode,
	isSyncAllowed,
	persist,
	isPersisted,
	quotaInfo,
	formatBytes,
	storeFootprint,
	STORAGE_MODES,
};
