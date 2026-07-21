import { getToken } from "./auth";

const BASE = import.meta.env.VITE_API_URL || "";
const RECONNECT_BASE_MS = 3000;
const RECONNECT_MAX_MS = 30000;

export function subscribeFeedRealtime({
  onNewPost,
  onUpdatedPost,
  onDeletedPost,
}) {
  const token = getToken();
  if (!token) return null;

  let abortController = new AbortController();
  let retryDelay = RECONNECT_BASE_MS;
  let reconnectTimer = null;

  async function connect() {
    const token = getToken();
    if (!token) return;

    abortController = new AbortController();

    try {
      const response = await fetch(`${BASE}/api/feed/stream`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: abortController.signal,
      });

      if (!response.ok) {
        scheduleReconnect();
        return;
      }

      retryDelay = RECONNECT_BASE_MS;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let eventType = "";
        let eventData = "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            eventType = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            eventData = line.slice(6).trim();
          } else if (line === "" && eventType && eventData) {
            try {
              const data = JSON.parse(eventData);
              if (eventType === "new_post") onNewPost?.(data);
              else if (eventType === "updated_post") onUpdatedPost?.(data);
              else if (eventType === "deleted_post") onDeletedPost?.(data.id);
            } catch {
              /* ignore parse errors */
            }
            eventType = "";
            eventData = "";
          }
        }
      }

      scheduleReconnect();
    } catch (err) {
      if (err.name !== "AbortError") scheduleReconnect();
    }
  }

  function scheduleReconnect() {
    clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(() => {
      retryDelay = Math.min(retryDelay * 1.5, RECONNECT_MAX_MS);
      connect();
    }, retryDelay);
  }

  connect();

  return {
    close() {
      clearTimeout(reconnectTimer);
      abortController.abort();
    },
  };
}
