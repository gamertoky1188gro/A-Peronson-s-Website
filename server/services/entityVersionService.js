// HyperCache Phase 3 — entity version helpers.
// Entities carry `version Int @default(1)` + `content_hash String?`.
// Every mutation must bump version by exactly 1 inside the same
// transaction that appends the ledger row (see changeLogService).

export function nextVersion(current) {
	const base = Number(current ?? 0);
	if (!Number.isFinite(base) || base < 0) {
		return 1;
	}
	return Math.floor(base) + 1;
}

export function initialVersion() {
	return 1;
}

// Shape the version/hash fields for a create payload.
export function withInitialVersionHash(payload, hash) {
	return {
		...payload,
		version: 1,
		content_hash: hash ?? null,
	};
}

// Shape the version/hash fields for an update inside a $transaction.
// Usage: tx.feedPost.update({ where, data: withBumpedVersionHash(data, current.version, hash) })
export function withBumpedVersionHash(data, currentVersion, hash) {
	return {
		...data,
		version: nextVersion(currentVersion),
		content_hash: hash ?? null,
	};
}
