import jwt from "jsonwebtoken";
import { realtimeBus, REALTIME_EVENTS } from "../realtime/realtimeBus.js";

const KEEPALIVE_MS = 30000;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
const JWT_ISSUER = process.env.JWT_ISSUER || "gartexhub-api";
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "gartexhub-client";

function sendEvent(res, event, data) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

export function feedStream(req, res) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return res.status(401).json({ error: "token required" });

  let userId;
  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    userId = String(payload.sub || payload.id || "");
    if (!userId) throw new Error("no user id");
  } catch {
    return res.status(401).json({ error: "invalid token" });
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  res.write(`retry: 3000\n\n`);

  const onCreated = ({ post }) => {
    sendEvent(res, "new_post", post);
  };
  const onUpdated = ({ post }) => {
    sendEvent(res, "updated_post", post);
  };
  const onDeleted = ({ postId }) => {
    sendEvent(res, "deleted_post", { id: postId });
  };

  realtimeBus.on(REALTIME_EVENTS.feedPostCreated, onCreated);
  realtimeBus.on(REALTIME_EVENTS.feedPostUpdated, onUpdated);
  realtimeBus.on(REALTIME_EVENTS.feedPostDeleted, onDeleted);

  const keepalive = setInterval(() => {
    res.write(`:keepalive\n\n`);
  }, KEEPALIVE_MS);

  req.on("close", () => {
    realtimeBus.off(REALTIME_EVENTS.feedPostCreated, onCreated);
    realtimeBus.off(REALTIME_EVENTS.feedPostUpdated, onUpdated);
    realtimeBus.off(REALTIME_EVENTS.feedPostDeleted, onDeleted);
    clearInterval(keepalive);
  });
}
