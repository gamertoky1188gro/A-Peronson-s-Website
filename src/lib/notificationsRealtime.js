import { getToken } from "./auth";

const WS_BASE = (() => {
  if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL;
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws`;
})();

const HEARTBEAT_INTERVAL = 25000;
const MAX_RECONNECT_DELAY = 120000;

let socket = null;
let currentToken = "";
let reconnectTimer = null;
let heartbeatTimer = null;
let reconnectAttempts = 0;
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

function startHeartbeat() {
  stopHeartbeat();
  heartbeatTimer = window.setInterval(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(JSON.stringify({ type: "ping" }));
      } catch {
        // connection will be handled by onclose
      }
    }
  }, HEARTBEAT_INTERVAL);
}

function stopHeartbeat() {
  if (heartbeatTimer) {
    window.clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

function scheduleReconnect(token) {
  if (reconnectTimer) return;
  reconnectAttempts += 1;
  const delay = Math.min(
    1000 * 2 ** reconnectAttempts,
    MAX_RECONNECT_DELAY,
  );
  reconnectTimer = window.setTimeout(() => {
    reconnectTimer = null;
    connectNotificationsRealtime(token);
  }, delay);
}

export function subscribeNotificationsRealtime(cb) {
  if (typeof cb !== "function") return () => {};
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function disconnectNotificationsRealtime() {
  currentToken = "";
  reconnectAttempts = 0;
  stopHeartbeat();
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
  reconnectAttempts = 0;

  try {
    if (socket) socket.close();
  } catch {
    // ignore
  }

  socket = new WebSocket(WS_BASE);

  socket.addEventListener("open", () => {
    reconnectAttempts = 0;
    startHeartbeat();
    try {
      socket.send(JSON.stringify({ type: "identify", token: nextToken }));
    } catch {
      // ignore
    }
  });

  socket.addEventListener("message", (event) => {
    const msg = safeParse(event?.data);
    if (!msg) return;
    if (msg.type === "pong") return;
    if (
      msg.type === "notification_created" ||
      msg.type === "notification_read"
    ) {
      emit(msg);
    }
  });

  socket.addEventListener("close", () => {
    stopHeartbeat();
    if (!currentToken) return;
    scheduleReconnect(currentToken);
  });

  socket.addEventListener("error", () => {
    stopHeartbeat();
    if (!currentToken) return;
    scheduleReconnect(currentToken);
  });
}
