// HyperCache Phase 2 — Dexie local database ('gartexhub-local').
import Dexie from "dexie";
import { SCHEMA_VERSION, STORES } from "./schema.js";

class GartexHubLocal extends Dexie {
	constructor() {
		super("gartexhub-local");
		this.version(SCHEMA_VERSION).stores(STORES);
	}
}

let _db = null;

export function getDb() {
	if (!_db) {
		_db = new GartexHubLocal();
	}
	return _db;
}

// Default export: lazily-constructed singleton accessor (avoids opening
// IndexedDB at import time, which keeps SSR/tests/vite builds safe).
const dbProxy = new Proxy(
	{},
	{
		get(_target, prop) {
			const db = getDb();
			const value = db[prop];
			return typeof value === "function" ? value.bind(db) : value;
		},
	},
);

export const db = dbProxy;
export default db;
