import jwt from "jsonwebtoken";
import { REALTIME_EVENTS, realtimeBus } from "../realtime/realtimeBus.js";

const KEEPALIVE_MS = 30_000;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
	throw new Error("JWT_SECRET environment variable is required");
}
const JWT_ISSUER = process.env.JWT_ISSUER || "gartexhub-api";
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "gartexhub-client";

function sendEvent(res, event, data, id) {
	if (id !== undefined && id !== null) {
		res.write(`id: ${id}\n`);
	}
	res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

export async function feedStream(req, res) {
	const authHeader = req.headers.authorization || "";
	const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
	if (!token) {
		return res.status(401).json({ error: "token required" });
	}

	let userId;
	try {
		const payload = jwt.verify(token, JWT_SECRET, {
			issuer: JWT_ISSUER,
			audience: JWT_AUDIENCE,
		});
		userId = String(payload.sub || payload.id || "");
		if (!userId) {
			throw new Error("no user id");
		}
	} catch {
		return res.status(401).json({ error: "invalid token" });
	}

	res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache, no-transform",
		Connection: "keep-alive",
		"X-Accel-Buffering": "no",
	});

	res.write("retry: 3000\n\n");

	const onCreated = ({ post }) => {
		sendEvent(res, "new_post", post);
	};
	const onUpdated = ({ post }) => {
		sendEvent(res, "updated_post", post);
	};
	const onDeleted = ({ postId }) => {
		sendEvent(res, "deleted_post", { id: postId });
	};
	const onInvalidate = (payload = {}) => {
		sendEvent(
			res,
			"invalidate",
			{
				type: "invalidate",
				seq: payload.seq ?? null,
				entity: payload.entity,
				id: payload.id !== undefined && payload.id !== null ? String(payload.id) : payload.id,
				version: payload.version,
				hash: payload.hash,
			},
			payload.seq ?? undefined,
		);
	};

	const invalidateEvent = REALTIME_EVENTS.feedInvalidated || "feed:invalidated";
	realtimeBus.on(REALTIME_EVENTS.feedPostCreated, onCreated);
	realtimeBus.on(REALTIME_EVENTS.feedPostUpdated, onUpdated);
	realtimeBus.on(REALTIME_EVENTS.feedPostDeleted, onDeleted);
	realtimeBus.on(invalidateEvent, onInvalidate);

	// Optional replay: Last-Event-ID header or ?since= query replays missed
	// invalidations via syncService.getDelta(since, limit). Best effort — if
	// the Phase 2 syncService track hasn't landed, skip replay and stream live.
	const sinceRaw = req.query?.since ?? req.headers["last-event-id"];
	const since =
		sinceRaw !== undefined && sinceRaw !== null && sinceRaw !== "" ? Number(sinceRaw) : null;
	if (Number.isFinite(since)) {
		try {
			const syncService = await import("../services/syncService.js");
			if (typeof syncService.getDelta === "function") {
				const delta = await syncService.getDelta(since, 200);
				for (const change of delta?.changes || []) {
					onInvalidate({
						seq: change.seqNumber ?? change.seq ?? null,
						entity: change.entity_type,
						id: change.entity_id,
						version: change.entity_version,
						hash: change.content_hash ?? null,
					});
				}
			}
		} catch {
			/* syncService not present yet — live stream only */
		}
	}

	const keepalive = setInterval(() => {
		res.write(":keepalive\n\n");
	}, KEEPALIVE_MS);

	req.on("close", () => {
		realtimeBus.off(REALTIME_EVENTS.feedPostCreated, onCreated);
		realtimeBus.off(REALTIME_EVENTS.feedPostUpdated, onUpdated);
		realtimeBus.off(REALTIME_EVENTS.feedPostDeleted, onDeleted);
		realtimeBus.off(invalidateEvent, onInvalidate);
		clearInterval(keepalive);
	});
}
