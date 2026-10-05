import { emitSyncInvalidated } from "../realtime/realtimeBus.js";

// HyperCache Phase 3 — append-only change ledger writer.
// MUST be called with the transaction client (tx) inside the same
// prisma.$transaction that mutates the entity, so the ledger row
// and the entity write commit atomically. Follows the
// messageService.js $transaction shape.
//
// Realtime fan-out is best-effort and happens OUTSIDE the tx:
// call emitAfterCommit(returnedRow) after the transaction commits.

const OPERATIONS = new Set(["CREATE", "UPDATE", "DELETE"]);

export async function appendChange(
	tx,
	{ scope = null, entity_type, entity_id, operation, entity_version, content_hash = null } = {},
) {
	if (!tx?.syncChange?.create) {
		const err = new Error("appendChange requires a transaction client with syncChange delegate");
		err.status = 500;
		throw err;
	}
	if (!(entity_type && entity_id)) {
		const err = new Error("appendChange requires entity_type and entity_id");
		err.status = 400;
		throw err;
	}
	const op = String(operation || "").toUpperCase();
	if (!OPERATIONS.has(op)) {
		const err = new Error(`appendChange: invalid operation ${operation}`);
		err.status = 400;
		throw err;
	}
	const version = Number(entity_version);
	if (!Number.isInteger(version) || version < 1) {
		const err = new Error("appendChange requires entity_version >= 1");
		err.status = 400;
		throw err;
	}
	const row = await tx.syncChange.create({
		data: {
			scope: scope ? String(scope) : null,
			entity_type: String(entity_type),
			entity_id: String(entity_id),
			operation: op,
			entity_version: version,
			content_hash: content_hash ? String(content_hash) : null,
		},
	});
	return row;
}

// Best-effort realtime fan-out AFTER the transaction commits.
// Never throws — ledger durability must not depend on sockets.
export function emitAfterCommit(row) {
	if (!row) {
		return;
	}
	try {
		const seqNum = row.seq == null ? null : Number(row.seq);
		emitSyncInvalidated({
			seq: Number.isFinite(seqNum) ? seqNum : null,
			entity_type: row.entity_type,
			entity_id: row.entity_id,
			operation: row.operation,
			entity_version: row.entity_version,
			content_hash: row.content_hash ?? null,
		});
	} catch {
		// best-effort only
	}
}
