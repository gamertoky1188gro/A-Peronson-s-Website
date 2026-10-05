import { EventEmitter } from "node:events";

export const REALTIME_EVENTS = {
	notificationCreated: "notification:created",
	notificationRead: "notification:read",
	feedPostCreated: "feed:post:created",
	feedPostUpdated: "feed:post:updated",
	feedPostDeleted: "feed:post:deleted",
	syncInvalidated: "sync:invalidated",
	feedInvalidated: "feed:invalidated",
};

export const realtimeBus = new EventEmitter();
realtimeBus.setMaxListeners(100);

export function emitNotificationCreated(userId, notification) {
	if (!(userId && notification)) {
		return;
	}
	realtimeBus.emit(REALTIME_EVENTS.notificationCreated, {
		userId: String(userId),
		notification,
	});
}

export function emitNotificationRead(userId, notificationId) {
	if (!(userId && notificationId)) {
		return;
	}
	realtimeBus.emit(REALTIME_EVENTS.notificationRead, {
		userId: String(userId),
		id: String(notificationId),
	});
}

export function emitFeedPostCreated(post) {
	if (!post) {
		return;
	}
	realtimeBus.emit(REALTIME_EVENTS.feedPostCreated, { post });
}

export function emitFeedPostUpdated(post) {
	if (!post) {
		return;
	}
	realtimeBus.emit(REALTIME_EVENTS.feedPostUpdated, { post });
}

export function emitFeedPostDeleted(postId) {
	if (!postId) {
		return;
	}
	realtimeBus.emit(REALTIME_EVENTS.feedPostDeleted, { postId });
}

// HyperCache Phase 3 — generic invalidation fan-out. Emitted best-effort
// by changeLogService.emitAfterCommit AFTER the ledger transaction commits.
// Existing feed:post:* events are preserved untouched.
//
// Canonical path: callers emit ONLY sync:invalidated via emitSyncInvalidated.
// The forwarder below re-emits the same payload on feed:invalidated so the
// SSE controller (subscribed to feed:invalidated) receives every change.
// seq is numeric on both sides (matches syncService.getDelta seqNumber);
// parseInvalidateEvent passes seq through untouched, so Numbers flow fine.
export function emitSyncInvalidated({
	seq = null,
	entity_type,
	entity_id,
	operation,
	entity_version,
	content_hash = null,
} = {}) {
	if (!(entity_type && entity_id)) {
		return;
	}
	const seqNum = seq == null ? null : Number(seq);
	realtimeBus.emit(REALTIME_EVENTS.syncInvalidated, {
		type: "invalidate",
		seq: Number.isFinite(seqNum) ? seqNum : null,
		entity: String(entity_type),
		id: String(entity_id),
		operation: operation ? String(operation) : null,
		version: entity_version == null ? null : Number(entity_version),
		hash: content_hash ? String(content_hash) : null,
	});
}

// Forward sync:invalidated to feed:invalidated listeners (canonical path).
// Registered once at module load; covers direct realtimeBus.emit calls too.
realtimeBus.on(REALTIME_EVENTS.syncInvalidated, (payload) => {
	realtimeBus.emit(REALTIME_EVENTS.feedInvalidated, payload);
});
