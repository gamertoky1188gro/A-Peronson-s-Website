// HyperCache Phase 2 — sync engine skeleton.
// Flow: head → compare serverSequence → delta → hash-verify → Dexie
// transaction → BroadcastChannel notify. RESET_REQUIRED → full-resync flag.

import { notifyEntity, notifyFullResync } from "./broadcast.js";
import { getDb } from "./db.js";
import { contentHash } from "./hash.js";
import { fetchSyncDelta, fetchSyncHead } from "./syncTransport.js";

// Maps sync change `entity` names to Dexie store names.
const ENTITY_TO_STORE = {
	user: "users",
	users: "users",
	profile: "profiles",
	profiles: "profiles",
	feedPost: "feedPosts",
	feedPosts: "feedPosts",
	feed_post: "feedPosts",
	product: "products",
	products: "products",
	requirement: "requirements",
	requirements: "requirements",
	notification: "notifications",
	notifications: "notifications",
	message: "messages",
	messages: "messages",
	conversation: "conversations",
	conversations: "conversations",
	media: "media",
};

function storeFor(entity) {
	return ENTITY_TO_STORE[entity] || ENTITY_TO_STORE[String(entity || "").toLowerCase()] || null;
}

export async function getLocalSequence() {
	try {
		const db = getDb();
		const row = await db.table("syncState").get("serverSequence");
		return Number(row?.value ?? 0) || 0;
	} catch {
		return 0;
	}
}

export async function setLocalSequence(seq) {
	try {
		const db = getDb();
		await db.table("syncState").put({ key: "serverSequence", value: seq, updatedAt: Date.now() });
	} catch {
		/* IndexedDB unavailable */
	}
}

export async function isFullResyncPending() {
	try {
		const db = getDb();
		const row = await db.table("syncState").get("fullResync");
		return row?.value === true;
	} catch {
		return false;
	}
}

export async function setFullResyncPending(pending, reason = "") {
	try {
		const db = getDb();
		await db
			.table("syncState")
			.put({ key: "fullResync", value: Boolean(pending), reason, updatedAt: Date.now() });
		notifyFullResync(reason);
	} catch {
		/* IndexedDB unavailable */
	}
}

async function applyChanges(changes) {
	if (!changes || changes.length === 0) return { applied: 0, skipped: 0 };
	const db = getDb();
	let applied = 0;
	let skipped = 0;
	const touched = new Map(); // store -> Set(ids)

	// Group by store for single-transaction efficiency.
	// Accepts engine shape (entity/entityId/record/op) and server-mapped
	// equivalents (entity_type/entity_id/operation).
	const byStore = new Map();
	for (const change of changes) {
		const entity = change?.entity ?? change?.entity_type ?? "";
		const store = storeFor(entity);
		if (!store) {
			skipped++;
			if (typeof console !== "undefined" && typeof console.debug === "function") {
				console.debug("[syncEngine] skipped change: unknown entity", {
					entity,
					entityId: change?.entityId ?? change?.entity_id ?? null,
					op: change?.op ?? change?.operation ?? null,
				});
			}
			continue;
		}
		if (!byStore.has(store)) byStore.set(store, []);
		byStore.get(store).push(change);
	}

	const stores = [...byStore.keys(), "syncChanges"];
	await db.transaction("rw", stores, async () => {
		for (const [store, items] of byStore) {
			const table = db.table(store);
			for (const change of items) {
				const rawOp = change?.op ?? change?.operation ?? "upsert";
				const op = String(rawOp).toLowerCase();
				const entity = change?.entity ?? change?.entity_type ?? "";
				const entityId = change?.entityId ?? change?.entity_id ?? change?.record?.id ?? null;
				try {
					if (op === "delete" || op === "tombstone") {
						if (entityId != null) await table.delete(entityId);
					} else {
						const record = { ...(change?.record || {}), id: entityId ?? change?.record?.id };
						if (record.id == null) {
							skipped++;
							if (typeof console !== "undefined" && typeof console.debug === "function") {
								console.debug("[syncEngine] skipped change: missing id", { entity });
							}
							continue;
						}
						await table.put(record);
					}
					applied++;
					if (!touched.has(store)) touched.set(store, new Set());
					if (entityId != null) touched.get(store).add(entityId);
				} catch {
					skipped++;
				}
			}
		}
		// Audit trail of applied changes.
		try {
			await db.table("syncChanges").bulkAdd(
				changes.map((c) => ({
					entity: c?.entity ?? c?.entity_type ?? "",
					entityId: c?.entityId ?? c?.entity_id ?? c?.record?.id ?? null,
					serverSequence: c?.serverSequence ?? c?.seqNumber ?? null,
					receivedAt: Date.now(),
				})),
			);
		} catch {
			/* audit is best-effort */
		}
	});

	for (const [store, ids] of touched) {
		notifyEntity(store, [...ids]);
	}
	return { applied, skipped };
}

/**
 * Run one sync pass. Never throws for "no-sync" backends; returns a status object.
 * @param {{ apiRequest: Function, token?: string, verifyHash?: boolean }} args
 */
export async function runSync({ apiRequest, token = "", verifyHash = true } = {}) {
	if (typeof apiRequest !== "function") {
		throw new TypeError("runSync requires apiRequest fn");
	}
	if (await isFullResyncPending()) {
		return { status: "reset-pending", fullResync: true };
	}
	const localSeq = await getLocalSequence();

	let head;
	try {
		head = await fetchSyncHead(apiRequest, token);
	} catch (err) {
		return { status: "error", stage: "head", error: err?.message || String(err) };
	}
	if (head?.unavailable) return { status: "no-sync", localSeq };
	if (head?.resetRequired) {
		await setFullResyncPending(true, "server requested RESET_REQUIRED at head");
		return { status: "reset-required", fullResync: true };
	}

	const serverSeq = Number(head?.serverSequence ?? 0) || 0;
	if (serverSeq <= localSeq) {
		// Pull found nothing new — still push (pull-then-push order).
		let push = null;
		try {
			const mod = await import("./outbox.js");
			if (typeof mod.flushOutboxToServer === "function") {
				push = await mod.flushOutboxToServer({ apiRequest, token });
			}
		} catch {
			/* push is best-effort — never fail the sync pass */
		}
		return { status: "up-to-date", localSeq, serverSeq, push };
	}

	let delta;
	try {
		delta = await fetchSyncDelta(apiRequest, token, localSeq);
	} catch (err) {
		return { status: "error", stage: "delta", error: err?.message || String(err) };
	}
	if (delta?.unavailable) return { status: "no-sync", localSeq };
	if (delta?.resetRequired) {
		await setFullResyncPending(true, "server requested RESET_REQUIRED at delta");
		return { status: "reset-required", fullResync: true };
	}

	const changes = Array.isArray(delta?.changes) ? delta.changes : [];
	if (verifyHash && delta?.contentHash && changes.length > 0) {
		try {
			const actual = await contentHash(changes);
			if (actual !== delta.contentHash) {
				return {
					status: "hash-mismatch",
					localSeq,
					serverSeq: delta.serverSequence ?? serverSeq,
					expected: delta.contentHash,
					actual,
				};
			}
		} catch {
			/* hashing is advisory — continue to apply */
		}
	}

	const { applied, skipped } = await applyChanges(changes);
	// Never regress the cursor: clamp to max(localSeq, serverSeq, deltaSeq).
	const rawNext = Number(delta?.serverSequence ?? delta?.headSeq ?? serverSeq);
	const safeNext = Number.isFinite(rawNext) && rawNext > 0 ? rawNext : serverSeq;
	const nextSeq = Math.max(localSeq, serverSeq, safeNext);
	await setLocalSequence(nextSeq);
	// Pull-then-push: delta applied first, then flush offline-created drafts.
	let push = null;
	try {
		const mod = await import("./outbox.js");
		if (typeof mod.flushOutboxToServer === "function") {
			push = await mod.flushOutboxToServer({ apiRequest, token });
		}
	} catch {
		/* push is best-effort — never fail the sync pass */
	}
	return { status: "synced", localSeq, serverSeq: nextSeq, applied, skipped, push };
}

export async function clearFullResyncFlag() {
	await setFullResyncPending(false, "cleared");
}

export default {
	runSync,
	getLocalSequence,
	setLocalSequence,
	isFullResyncPending,
	setFullResyncPending,
};
