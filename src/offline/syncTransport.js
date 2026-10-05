// HyperCache Phase 2 — sync transport over apiRequest.
// GET /api/sync/head  -> { serverSequence, contentHash, resetRequired }
// GET /api/sync/delta?since=<seq> -> { serverSequence, changes: [...], resetRequired }
// Graceful fallback: if the backend has no /api/sync/* routes (404/501),
// treat sync as unavailable (no-sync) — never throw to callers.

export const SYNC_UNAVAILABLE = "SYNC_UNAVAILABLE";

function isNoSyncError(err) {
	const status = err?.status ?? err?.details?.status;
	return status === 404 || status === 405 || status === 501;
}

// 401/403 = signed out (or token expired). Sync is per-user, so there is
// nothing to sync — report signed-out instead of throwing, otherwise every
// logged-out heartbeat spams the console + server logs with 401 noise.
function isAuthError(err) {
	const status = err?.status ?? err?.details?.status;
	return status === 401 || status === 403;
}

export async function fetchSyncHead(apiRequest, token) {
	try {
		const data = await apiRequest("/sync/head", { token });
		return {
			serverSequence: Number(data?.serverSequence ?? data?.sequence ?? 0) || 0,
			contentHash: data?.contentHash ?? data?.hash ?? null,
			resetRequired: Boolean(data?.resetRequired || data?.action === "RESET_REQUIRED"),
			raw: data,
		};
	} catch (err) {
		if (isNoSyncError(err)) return { unavailable: true, reason: SYNC_UNAVAILABLE };
		if (isAuthError(err)) return { unauthenticated: true };
		throw err;
	}
}

export async function fetchSyncDelta(
	apiRequest,
	token,
	since,
	{ limit = 200, hydrate = true } = {},
) {
	try {
		const params = new URLSearchParams({
			since: String(since ?? 0),
			limit: String(limit ?? 200),
		});
		const data = await apiRequest(`/sync/delta?${params.toString()}`, {
			token,
		});
		const rawChanges = Array.isArray(data?.changes) ? data.changes : [];
		// Map server shape (syncService.js:74-116: seq/seqNumber/scope/
		// entity_type/entity_id/operation/entity_version/content_hash/
		// occurred_at) into engine shape (entity/entityId/op/record/
		// serverSequence). Server rows carry no record payload.
		const changes = rawChanges.map((row) => ({
			entity: row?.entity_type ?? row?.entity ?? "",
			entity_type: row?.entity_type ?? row?.entity ?? "",
			entityId: row?.entity_id ?? row?.entityId ?? row?.record?.id ?? null,
			entity_id: row?.entity_id ?? row?.entityId ?? null,
			op: row?.operation ?? row?.op ?? "upsert",
			operation: row?.operation ?? row?.op ?? "upsert",
			record: row?.record ?? null,
			serverSequence: Number(row?.seqNumber ?? row?.seq ?? data?.headSeq ?? since ?? 0) || 0,
			seq: row?.seq ?? null,
			seqNumber: Number(row?.seqNumber ?? row?.seq ?? 0) || 0,
			scope: row?.scope ?? null,
			entity_version: row?.entity_version ?? null,
			content_hash: row?.content_hash ?? null,
			occurred_at: row?.occurred_at ?? null,
		}));
		// Hydrate records via GET /sync/hydrate?entity_type=&ids= (whitelisted:
		// feed_post/product/requirement/notification). Best-effort: on any
		// failure keep the change rows without records.
		if (hydrate && changes.length > 0) {
			try {
				const byType = new Map();
				for (const c of changes) {
					if (c?.record != null) continue;
					if (c?.op === "delete" || c?.op === "tombstone") continue;
					if (!c?.entity || c?.entityId == null) continue;
					if (!byType.has(c.entity)) byType.set(c.entity, new Set());
					byType.get(c.entity).add(String(c.entityId));
				}
				for (const [entityType, idSet] of byType) {
					const ids = [...idSet].slice(0, 100);
					if (ids.length === 0) continue;
					const qp = new URLSearchParams({
						entity_type: String(entityType),
						ids: ids.join(","),
					});
					const hydrated = await apiRequest(`/sync/hydrate?${qp.toString()}`, { token });
					const items = Array.isArray(hydrated?.items) ? hydrated.items : [];
					const byId = new Map(items.map((it) => [String(it?.id), it]));
					for (const c of changes) {
						if (c?.record != null) continue;
						if (String(c?.entity) !== String(entityType)) continue;
						const hit = byId.get(String(c?.entityId));
						if (hit) c.record = hit;
					}
				}
			} catch {
				/* hydration best-effort — change rows still usable */
			}
		}
		const headSeq =
			Number(data?.headSeq ?? data?.serverSequence ?? data?.sequence ?? since ?? 0) || 0;
		return {
			serverSequence: headSeq,
			headSeq,
			hasMore: Boolean(data?.hasMore),
			contentHash: data?.contentHash ?? data?.hash ?? null,
			resetRequired: Boolean(
				data?.resetRequired ||
					data?.resetReason === "RESET_REQUIRED" ||
					data?.action === "RESET_REQUIRED",
			),
			resetReason: data?.resetReason ?? null,
			changes,
			raw: data,
		};
	} catch (err) {
		if (isNoSyncError(err)) return { unavailable: true, reason: SYNC_UNAVAILABLE, changes: [] };
		if (isAuthError(err)) return { unauthenticated: true, changes: [] };
		throw err;
	}
}

export default { fetchSyncHead, fetchSyncDelta, SYNC_UNAVAILABLE };
