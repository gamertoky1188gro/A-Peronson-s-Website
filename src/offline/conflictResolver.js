// HyperCache Phase 2 — conflict resolution: last-write-wins + version compare.
// Strategy:
// - If either side carries a numeric `version`, higher version wins.
// - Otherwise the newer `updatedAt` wins; ties prefer the server copy.
// - Losing side is recorded in the `conflicts` store for audit/debug.

import { getDb } from "./db.js";

function versionOf(record) {
	const v = Number(record?.version ?? record?.v ?? Number.NaN);
	return Number.isFinite(v) ? v : null;
}

function timeOf(record) {
	const t = Number(
		record?.updatedAt ?? record?.updated_at ?? record?.modifiedAt ?? record?.createdAt ?? 0,
	);
	return Number.isFinite(t) ? t : 0;
}

export function resolveConflict(localRecord, serverRecord) {
	const lv = versionOf(localRecord);
	const sv = versionOf(serverRecord);
	if (lv !== null && sv !== null && lv !== sv) {
		return {
			winner: sv > lv ? "server" : "local",
			record: sv > lv ? serverRecord : localRecord,
			reason: `version compare (local=${lv}, server=${sv})`,
		};
	}
	const lt = timeOf(localRecord);
	const st = timeOf(serverRecord);
	if (st !== lt) {
		return {
			winner: st > lt ? "server" : "local",
			record: st > lt ? serverRecord : localRecord,
			reason: `last-write-wins (local=${lt}, server=${st})`,
		};
	}
	return { winner: "server", record: serverRecord, reason: "tie prefers server" };
}

export async function recordConflict({ entity, entityId, localRecord, serverRecord, resolution }) {
	try {
		await getDb()
			.table("conflicts")
			.add({
				entity: entity || "",
				entityId: entityId ?? localRecord?.id ?? serverRecord?.id ?? null,
				localRecord: localRecord ?? null,
				serverRecord: serverRecord ?? null,
				resolution: resolution || null,
				detectedAt: Date.now(),
			});
	} catch {
		/* audit is best-effort */
	}
}

export async function resolveAndRecord(entity, entityId, localRecord, serverRecord) {
	const resolution = resolveConflict(localRecord, serverRecord);
	await recordConflict({ entity, entityId, localRecord, serverRecord, resolution });
	return resolution;
}

// Builds conditional-write headers for the winning local record.
export function ifMatchHeaders(localRecord) {
	const v = versionOf(localRecord);
	const etag = localRecord?.etag ?? localRecord?.ETag ?? null;
	const headers = {};
	if (etag) headers["If-Match"] = String(etag);
	else if (v !== null) headers["If-Match"] = `version-${v}`;
	return headers;
}

export default { resolveConflict, resolveAndRecord, recordConflict, ifMatchHeaders };
