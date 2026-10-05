// HyperCache Phase 2 — outbox: offline CREATE queue with retry + idempotency keys.
// Local ids look like `offline-<uuid-ish>`; idempotency key = localId (stable across retries).

import { broadcast } from "./broadcast.js";
import { getDb } from "./db.js";

const MAX_ATTEMPTS = 8;
const PUSH_CONCURRENCY = 3;

// HyperCache Phase 6 — offline outbox SEND path (safe-ops only).
// Only requirement drafts + feed post drafts may be pushed. Everything
// else matching BLOCKLIST is refused (never sent) with a console.warn.
const SAFE_ENTITIES = new Set([
	"requirement",
	"requirements",
	"requirement_draft",
	"feedpost",
	"feedposts",
	"feed_post",
	"feedpost_draft",
]);

const BLOCKLIST = ["payment", "password", "contract", "admin"];

const ENDPOINT_FOR = {
	requirement: "/requirements",
	requirements: "/requirements",
	requirement_draft: "/requirements",
	feedpost: "/feed/posts",
	feedposts: "/feed/posts",
	feed_post: "/feed/posts",
	feedpost_draft: "/feed/posts",
};

function normalizeEntity(entity) {
	return String(entity || "")
		.toLowerCase()
		.trim();
}

export function isBlockedEntity(entity) {
	const name = normalizeEntity(entity);
	return BLOCKLIST.some((b) => name.includes(b));
}

export function isSafeEntity(entity) {
	if (isBlockedEntity(entity)) return false;
	return SAFE_ENTITIES.has(normalizeEntity(entity));
}

export function endpointFor(entity) {
	if (!isSafeEntity(entity)) return null;
	return ENDPOINT_FOR[normalizeEntity(entity)] || null;
}

export function getBlocklist() {
	return [...BLOCKLIST];
}

export function makeLocalId(prefix = "offline") {
	const rand =
		globalThis.crypto?.randomUUID?.() ||
		`x${Date.now().toString(36)}${Math.floor(Math.random() * 1e9).toString(36)}`;
	return `${prefix}-${rand}`;
}

export function idempotencyKeyFor(entry) {
	return entry?.idempotencyKey || entry?.localId;
}

export async function enqueueDraft({ entity, payload = {}, idempotencyKey = null } = {}) {
	if (!entity) throw new TypeError("enqueueDraft requires entity");
	const localId = makeLocalId();
	const entry = {
		localId,
		entity,
		payload,
		idempotencyKey: idempotencyKey || localId,
		status: "queued",
		attempts: 0,
		createdAt: Date.now(),
		updatedAt: Date.now(),
		lastError: "",
	};
	try {
		await getDb().table("outbox").add(entry);
	} catch {
		/* IndexedDB unavailable — return entry anyway */
	}
	try {
		await emitOutboxCount();
	} catch {
		/* ignore */
	}
	return entry;
}

export async function listPending(limit = 50) {
	try {
		return await getDb()
			.table("outbox")
			.where("status")
			.anyOf(["queued", "retry"])
			.limit(limit)
			.toArray();
	} catch {
		return [];
	}
}

function backoffMs(attempts) {
	// 2s, 4s, 8s ... capped at 2 minutes.
	return Math.min(120_000, 2000 * 2 ** Math.max(0, attempts - 1));
}

export function isDue(entry, now = Date.now()) {
	if (!entry) return false;
	if (entry.status === "queued") return true;
	if (entry.status !== "retry") return false;
	const nextAt = Number(entry.nextAttemptAt || 0);
	return now >= nextAt;
}

/**
 * Flush queued entries with a sender fn (legacy/test path):
 *   sender(entry) -> Promise<{ serverId }> (resolves on success)
 * On success the entry is marked done; on failure it retries with backoff.
 *
 * Phase 6 overload: flushOutbox({ apiRequest, token, ... }) pushes queued
 * requirement/feed-post drafts to the real endpoints (SEND path). The first
 * argument decides: function -> sender path, object with apiRequest -> push.
 */
export async function flushOutbox(senderOrPush, opts = {}) {
	if (
		senderOrPush &&
		typeof senderOrPush === "object" &&
		typeof senderOrPush.apiRequest === "function"
	) {
		return flushOutboxToServer(senderOrPush);
	}
	const sender = senderOrPush;
	const { limit = 20, now = Date.now() } = opts;
	if (typeof sender !== "function") throw new TypeError("flushOutbox requires sender fn");
	const pending = (await listPending(limit)).filter((e) => isDue(e, now));
	const result = { attempted: 0, succeeded: 0, failed: 0, done: [] };
	for (const entry of pending) {
		result.attempted++;
		try {
			const res = await sender(entry);
			try {
				await getDb()
					.table("outbox")
					.where("localId")
					.equals(entry.localId)
					.modify({
						status: "done",
						serverId: res?.serverId ?? null,
						updatedAt: Date.now(),
						lastError: "",
					});
			} catch {
				/* ignore */
			}
			result.succeeded++;
			result.done.push(entry.localId);
		} catch (err) {
			result.failed++;
			const attempts = Number(entry?.attempts || 0) + 1;
			const exhausted = attempts >= MAX_ATTEMPTS;
			try {
				await getDb()
					.table("outbox")
					.where("localId")
					.equals(entry.localId)
					.modify({
						status: exhausted ? "failed" : "retry",
						attempts,
						nextAttemptAt: now + backoffMs(attempts),
						updatedAt: now,
						lastError: err?.message || String(err),
					});
			} catch {
				/* ignore */
			}
		}
	}
	try {
		await emitOutboxCount();
	} catch {
		/* ignore */
	}
	return result;
}

export async function removeEntry(localId) {
	try {
		await getDb().table("outbox").where("localId").equals(localId).delete();
	} catch {
		/* ignore */
	}
	try {
		await emitOutboxCount();
	} catch {
		/* ignore */
	}
}

// --- HyperCache Phase 6: SEND path (pull-then-push; server flush) ---

function statusOf(err) {
	return err?.status ?? err?.details?.status ?? null;
}

function isRetryableFailure(err) {
	// Network errors (no status) + 401/408/429/5xx are retryable.
	// 401 refreshes/clears the session client-side; keep the op queued.
	const status = statusOf(err);
	if (status == null) return true;
	if (status === 401 || status === 408 || status === 429) return true;
	return status >= 500;
}

function extractServerId(data, entry) {
	if (data == null) return null;
	if (typeof data === "string" || typeof data === "number") return data;
	return (
		data?.id ??
		data?.requirement?.id ??
		data?.post?.id ??
		data?.data?.id ??
		data?.serverId ??
		entry?.serverId ??
		null
	);
}

function toRecord(data, fallbackPayload, serverId) {
	const base =
		data && typeof data === "object" && !Array.isArray(data)
			? data?.requirement && typeof data.requirement === "object"
				? data.requirement
				: data?.post && typeof data.post === "object"
					? data.post
					: data?.data && typeof data.data === "object"
						? data.data
						: data
			: {};
	return { ...(fallbackPayload || {}), ...base, id: serverId, updatedAt: Date.now() };
}

// Replace the local temp id (offline-*) with the real server id in every
// mirror store that may hold it (requirements + mirrored feedPosts).
async function replaceTempId(localId, serverId, serverRecord) {
	if (localId == null || serverId == null || String(localId) === String(serverId)) return;
	for (const store of ["requirements", "feedPosts"]) {
		try {
			const table = getDb().table(store);
			const existing = await table.get(localId);
			if (existing == null) continue;
			await table.delete(localId);
			await table.put({ ...existing, ...(serverRecord || {}), id: serverId });
		} catch {
			/* store may not exist — best-effort */
		}
	}
	// Ensure the server record itself is cached even with no local mirror.
	if (serverRecord && typeof serverRecord === "object") {
		const store =
			serverId != null && String(serverRecord?.feed_type || "") !== "" ? "feedPosts" : null;
		try {
			if (store)
				await getDb()
					.table(store)
					.put({ ...serverRecord, id: serverId });
		} catch {
			/* best-effort */
		}
	}
}

async function markDone(entry, serverId) {
	try {
		await getDb()
			.table("outbox")
			.where("localId")
			.equals(entry.localId)
			.modify({
				status: "done",
				serverId: serverId ?? null,
				updatedAt: Date.now(),
				lastError: "",
			});
	} catch {
		/* ignore */
	}
}

async function markRetryable(entry, err, now) {
	const attempts = Number(entry?.attempts || entry?.retryCount || 0) + 1;
	const exhausted = attempts >= MAX_ATTEMPTS;
	try {
		await getDb()
			.table("outbox")
			.where("localId")
			.equals(entry.localId)
			.modify({
				status: exhausted ? "failed" : "retry",
				attempts,
				retryCount: attempts,
				nextAttemptAt: now + backoffMs(attempts),
				updatedAt: now,
				lastError: err?.message || String(err),
			});
	} catch {
		/* ignore */
	}
	return { attempts, exhausted };
}

// Non-retryable 4xx (except 409-already-applied): audit to conflicts store,
// drop from the outbox so it never retries.
async function moveToConflicts(entry, err) {
	const status = statusOf(err);
	try {
		await getDb()
			.table("conflicts")
			.add({
				entity: entry?.entity || "",
				entityId: entry?.localId ?? null,
				localRecord: { localId: entry?.localId, payload: entry?.payload ?? null },
				serverRecord: err?.details ?? null,
				resolution: {
					winner: "server",
					reason: `outbox push rejected (status=${status ?? "unknown"}): ${err?.message || String(err)}`,
				},
				detectedAt: Date.now(),
			});
	} catch {
		/* audit is best-effort */
	}
	try {
		await getDb()
			.table("outbox")
			.where("localId")
			.equals(entry.localId)
			.modify({
				status: "failed",
				attempts: Number(entry?.attempts || 0) + 1,
				updatedAt: Date.now(),
				lastError: err?.message || String(err),
			});
	} catch {
		/* ignore */
	}
}

async function sendOne(entry, { apiRequest, token }) {
	const endpoint = endpointFor(entry?.entity);
	// Defensive: endpointFor already enforces safe-ops; never send otherwise.
	if (!endpoint) {
		if (typeof console !== "undefined") {
			console.warn("[outbox] refused blocked/unsafe entity (not sent)", {
				entity: entry?.entity,
				localId: entry?.localId,
			});
		}
		await moveToConflicts(
			entry,
			Object.assign(new Error(`blocked entity: ${entry?.entity}`), { status: 422 }),
		);
		return { outcome: "blocked", localId: entry.localId };
	}
	const key = idempotencyKeyFor(entry);
	let data;
	try {
		data = await apiRequest(endpoint, {
			method: "POST",
			token,
			body: entry?.payload ?? {},
			headers: { "Idempotency-Key": String(key) },
		});
	} catch (err) {
		if (statusOf(err) === 409) {
			// Already applied server-side (idempotent replay) -> success.
			await markDone(entry, extractServerId(err?.details, entry));
			return { outcome: "applied", localId: entry.localId, deduped: true };
		}
		if (isRetryableFailure(err)) {
			const { exhausted } = await markRetryable(entry, err, Date.now());
			return { outcome: exhausted ? "exhausted" : "retried", localId: entry.localId };
		}
		await moveToConflicts(entry, err);
		return { outcome: "conflict", localId: entry.localId };
	}
	const serverId = extractServerId(data, entry);
	try {
		await replaceTempId(entry.localId, serverId, toRecord(data, entry?.payload, serverId));
	} catch {
		/* mirror swap is best-effort */
	}
	await markDone(entry, serverId);
	return { outcome: "sent", localId: entry.localId, serverId };
}

/**
 * Phase 6 SEND path: push queued requirement/feed-post drafts to the real
 * endpoints. Assumes authentication (token passed through to apiRequest).
 * Pull-then-push ordering is enforced by the caller (syncEngine.runSync).
 */
export async function flushOutboxToServer({
	apiRequest,
	token = "",
	limit = 20,
	now = Date.now(),
	concurrency = PUSH_CONCURRENCY,
} = {}) {
	if (typeof apiRequest !== "function")
		throw new TypeError("flushOutboxToServer requires apiRequest fn");
	const pending = (await listPending(limit)).filter((e) => isDue(e, now));
	const result = {
		attempted: 0,
		succeeded: 0,
		failed: 0,
		retried: 0,
		conflicts: 0,
		blocked: 0,
		done: [],
	};
	if (pending.length === 0) {
		try {
			await emitOutboxCount();
		} catch {
			/* ignore */
		}
		return result;
	}
	const slots = Math.max(1, Math.min(Number(concurrency) || PUSH_CONCURRENCY, 3, pending.length));
	const queue = pending.slice();
	const workers = Array.from({ length: slots }, async () => {
		for (;;) {
			const entry = queue.shift();
			if (!entry) return;
			result.attempted++;
			try {
				const r = await sendOne(entry, { apiRequest, token });
				if (r.outcome === "sent" || r.outcome === "applied") {
					result.succeeded++;
					result.done.push(r.localId);
				} else if (r.outcome === "conflict" || r.outcome === "exhausted") {
					result.failed++;
					if (r.outcome === "conflict") result.conflicts++;
				} else if (r.outcome === "blocked") {
					result.failed++;
					result.blocked++;
				} else {
					result.retried++;
				}
			} catch {
				result.failed++;
				result.retried++;
			}
		}
	});
	await Promise.all(workers);
	try {
		await emitOutboxCount();
	} catch {
		/* ignore */
	}
	return result;
}

export async function getOutboxCount() {
	try {
		return await getDb().table("outbox").where("status").anyOf(["queued", "retry"]).count();
	} catch {
		return 0;
	}
}

export async function emitOutboxCount() {
	const count = await getOutboxCount();
	try {
		broadcast({ type: "hypercache:outbox", count, at: Date.now() });
	} catch {
		/* ignore */
	}
	return count;
}

export default {
	enqueueDraft,
	listPending,
	flushOutbox,
	flushOutboxToServer,
	removeEntry,
	makeLocalId,
	idempotencyKeyFor,
	getOutboxCount,
	emitOutboxCount,
	isSafeEntity,
	isBlockedEntity,
	endpointFor,
	getBlocklist,
};
