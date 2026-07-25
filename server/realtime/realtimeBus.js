import { EventEmitter } from "node:events";

export const REALTIME_EVENTS = {
	notificationCreated: "notification:created",
	notificationRead: "notification:read",
	feedPostCreated: "feed:post:created",
	feedPostUpdated: "feed:post:updated",
	feedPostDeleted: "feed:post:deleted",
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
