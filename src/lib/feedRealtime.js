import { getToken } from "./auth";

const BASE = import.meta.env.VITE_API_URL || "";

export function subscribeFeedRealtime({
  onNewPost,
  onUpdatedPost,
  onDeletedPost,
}) {
  const token = getToken();
  if (!token) return null;

  const url = `${BASE}/api/feed/stream?token=${encodeURIComponent(token)}`;
  const source = new EventSource(url);

  source.addEventListener("new_post", (e) => {
    try {
      const post = JSON.parse(e.data);
      onNewPost?.(post);
    } catch {
      /* ignore parse errors */
    }
  });

  source.addEventListener("updated_post", (e) => {
    try {
      const post = JSON.parse(e.data);
      onUpdatedPost?.(post);
    } catch {
      /* ignore parse errors */
    }
  });

  source.addEventListener("deleted_post", (e) => {
    try {
      const { id } = JSON.parse(e.data);
      onDeletedPost?.(id);
    } catch {
      /* ignore parse errors */
    }
  });

  source.onerror = () => {
    // EventSource auto-reconnects; no action needed
  };

  return source;
}
