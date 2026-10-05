import { getCombinedFeed } from "../services/feedService.js";

export async function combinedFeed(req, res) {
	const unique = req.query.unique === "true";
	const type = req.query.type || "all";
	const category = req.query.category || "";
	const cursor = Number.isFinite(Number(req.query.cursor))
		? Math.max(0, Math.floor(Number(req.query.cursor)))
		: 0;
	const limitRaw = Number.isFinite(Number(req.query.limit))
		? Math.floor(Number(req.query.limit))
		: 12;
	const limit = Math.min(50, Math.max(1, limitRaw));
	// Phase 5: stable opaque cursor. Optional; old clients omit it and get
	// exact legacy integer-offset behavior (cursor + next_cursor).
	const cursor_v2 =
		typeof req.query.cursor_v2 === "string" && req.query.cursor_v2
			? req.query.cursor_v2
			: typeof req.query.cursorV2 === "string" && req.query.cursorV2
				? req.query.cursorV2
				: null;
	const data = await getCombinedFeed({
		unique,
		type,
		category,
		cursor,
		cursor_v2,
		limit,
		viewer: req.user,
	});
	return res.json(data);
}
