import { getToken } from "./auth";

const WS_BASE = (() => {
  if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL;
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws`;
})();

let socket = null;
let currentToken = "";
let reconnectTimer = null;
let reconnectDelayMs = 750;
const listeners = new Set();

function safeParse(raw) {
  try {
    return JSON.parse(String(raw || ""));
  } catch {
    return null;
  }
}

function emit(msg) {
  listeners.forEach((cb) => {
    try {
      cb(msg);
    } catch {
      // ignore listener errors
    }
  });
}

function scheduleReconnect(token) {
  if (reconnectTimer) return;
  reconnectTimer = window.setTimeout(() => {
    reconnectTimer = null;
    connectNotificationsRealtime(token);
  }, reconnectDelayMs);
  reconnectDelayMs = Math.min(15000, Math.round(reconnectDelayMs * 1.5));
}

export function subscribeNotificationsRealtime(cb) {
  if (typeof cb !== "function") return () => {};
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function disconnectNotificationsRealtime() {
  currentToken = "";
  reconnectDelayMs = 750;
  if (reconnectTimer) {
    window.clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (socket) {
    try {
      socket.close();
    } catch {
      // ignore
    }
  }
  socket = null;
}

export function connectNotificationsRealtime(token = getToken()) {
  const nextToken = String(token || "");
  if (!nextToken) return;

  if (
    socket &&
    socket.readyState === WebSocket.OPEN &&
    currentToken === nextToken
  )
    return;

  currentToken = nextToken;
  reconnectDelayMs = 750;

  try {
    if (socket) socket.close();
  } catch {
    // ignore
  }

  socket = new WebSocket(WS_BASE);

  socket.addEventListener("open", () => {
    try {
      socket.send(JSON.stringify({ type: "identify", token: nextToken }));
    } catch {
      // ignore
    }
  });

  socket.addEventListener("message", (event) => {
    const msg = safeParse(event?.data);
    if (!msg) return;
    if (
      msg.type === "notification_created" ||
      msg.type === "notification_read"
    ) {
      emit(msg);
    }
  });

  socket.addEventListener("close", () => {
    if (!currentToken) return;
    scheduleReconnect(currentToken);
  });

  socket.addEventListener("error", () => {
    if (!currentToken) return;
    scheduleReconnect(currentToken);
  });
}
