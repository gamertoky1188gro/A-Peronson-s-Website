import {
	fetchEntitiesByIds,
	getDelta,
	getHead,
	hydratableTypes,
	parseDeltaParams,
} from "../services/syncService.js";
import { handleControllerError } from "../utils/permissions.js";

// HyperCache Phase 3 — sync protocol endpoints.
// Mounted behind requireAuth (see syncRoutes.js).

export async function getSyncHead(req, res) {
	try {
		const head = await getHead({ user: req.user || null, filters: req.query || {} });
		return res.json(head);
	} catch (error) {
		return handleControllerError(res, error);
	}
}

export async function getSyncDelta(req, res) {
	try {
		const { since, limit } = parseDeltaParams(req.query || {});
		const delta = await getDelta(since, limit);
		return res.json({ since, limit, ...delta });
	} catch (error) {
		return handleControllerError(res, error);
	}
}

// Hydration: fetch current entity snapshots by id for delta application.
// Whitelisted to feed_post/product/requirement/notification only.
export async function hydrateSyncEntities(req, res) {
	try {
		const entityType = String(req.query.entity_type || req.body?.entity_type || "");
		const rawIds = req.query.ids ?? req.body?.ids ?? [];
		const ids = Array.isArray(rawIds) ? rawIds : String(rawIds || "").split(",");
		if (!hydratableTypes().includes(entityType)) {
			return res.status(400).json({
				error: `Unsupported entity_type. Allowed: ${hydratableTypes().join(", ")}`,
			});
		}
		const rows = await fetchEntitiesByIds(entityType, ids);
		return res.json({ entity_type: entityType, items: rows });
	} catch (error) {
		return handleControllerError(res, error);
	}
}
