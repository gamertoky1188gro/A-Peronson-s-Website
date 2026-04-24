import { EventEmitter } from "events";

export const REALTIME_EVENTS = {
  notificationCreated: "notification:created",
  notificationRead: "notification:read",
};

export const realtimeBus = new EventEmitter();
realtimeBus.setMaxListeners(50);

export function emitNotificationCreated(userId, notification) {
  if (!userId || !notification) return;
  realtimeBus.emit(REALTIME_EVENTS.notificationCreated, {
    userId: String(userId),
    notification,
  });
}

export function emitNotificationRead(userId, notificationId) {
  if (!userId || !notificationId) return;
  realtimeBus.emit(REALTIME_EVENTS.notificationRead, {
    userId: String(userId),
    id: String(notificationId),
  });
}
