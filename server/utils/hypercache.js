import { createHash } from "node:crypto";

// HyperCache Phase 4 — pure, unit-testable helpers (no DB/redis/network).
// Phase 1-3 tracks own persistence; these functions only shape/order/hash data.

export function stableStringify(value) {
	if (value === null || typeof value !== "object") {
		return JSON.stringify(value);
	}
	if (Array.isArray(value)) {
		return `[${value.map((v) => stableStringify(v)).join(",")}]`;
	}
	const keys = Object.keys(value).sort();
	return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(",")}}`;
}

export function computeHash(payload) {
	return createHash("sha256").update(stableStringify(payload)).digest("hex");
}

export function buildSyncHead({ entity, version, hash, seq = null } = {}) {
	return { entity: String(entity), version: Number(version), hash: String(hash), seq };
}

export function buildInvalidatePayload({ entity, id, version, hash, seq = null } = {}) {
	return {
		type: "invalidate",
		seq,
		entity: String(entity),
		id: String(id),
		version: Number(version),
		hash: String(hash),
	};
}

export function sortDeltaBySeq(entries = []) {
	return [...entries].sort((a, b) => Number(a.seq) - Number(b.seq));
}

// Gap detection: returns { ok:true } or { ok:false, code:"RESET_REQUIRED" }.
export function needsReset({ lastSeq, entries = [] } = {}) {
	const sorted = sortDeltaBySeq(entries);
	if (sorted.length === 0) {
		return { ok: true };
	}
	const base = Number(lastSeq);
	if (!Number.isFinite(base)) {
		return { ok: true };
	}
	const first = Number(sorted[0].seq);
	if (!Number.isFinite(first) || first > base + 1) {
		return { ok: false, code: "RESET_REQUIRED", expectedSeq: base + 1, gotSeq: sorted[0].seq };
	}
	for (let i = 1; i < sorted.length; i += 1) {
		const prev = Number(sorted[i - 1].seq);
		const cur = Number(sorted[i].seq);
		if (Number.isFinite(prev) && Number.isFinite(cur) && cur > prev + 1) {
			return { ok: false, code: "RESET_REQUIRED", expectedSeq: prev + 1, gotSeq: sorted[i].seq };
		}
	}
	return { ok: true };
}

// Outbox dedupe by idempotency key. Returns { inserted:boolean, key }.
// `store` is any Map-like (key -> record); no persistence here.
export function outboxInsert(store, { idempotencyKey, ...record } = {}) {
	const key = String(idempotencyKey || "");
	if (!key) {
		throw new Error("idempotencyKey required");
	}
	if (store.has(key)) {
		return { inserted: false, key };
	}
	store.set(key, { ...record, idempotencyKey: key });
	return { inserted: true, key };
}
