import {
	getInvestigationModelConfig,
	setInvestigationModelConfig,
} from "../services/investigation/investigationModelConfigService.js";
import { getModelHealth } from "../services/investigation/modelHealthService.js";
import { handleControllerError } from "../utils/permissions.js";

// GET/PUT /api/admin/support-models — the investigation model configuration
// for the support portal. The persist path is the Task 2 service, which
// validates against the live catalog and writes the admin_config_history
// audit row itself; this controller only shapes the request and the answer.

function shape(config, health) {
	return {
		allowed: config.allowed,
		default: config.default,
		buyerSelectEnabled: config.buyerSelectEnabled,
		catalogStale: Boolean(config.catalogStale),
		catalogFetchedAt: config.catalogFetchedAt ?? null,
		// The catalog array ({ id, name, providerID, created, ownedBy }) — the
		// admin "Investigation Models" tab renders it.
		catalog: Array.isArray(config.catalog) ? config.catalog : [],
		// What those models actually did over the recent window.
		health: health ?? { windowDays: 0, runs: 0, models: {} },
	};
}

export async function getAdminSupportModels(req, res) {
	try {
		// ?refresh=1 forces a live catalog fetch; otherwise the service's
		// TTL cache may serve.
		const config = await getInvestigationModelConfig({
			forceCatalogRefresh: req.query?.refresh === "1",
		});
		// Health is a read of run history; a failure there must not take the
		// configuration down with it, so the service answers empty rather than
		// throwing and the config still renders.
		const health = await getModelHealth().catch(() => ({ windowDays: 0, runs: 0, models: {} }));
		return res.json({ ok: true, ...shape(config, health) });
	} catch (error) {
		return handleControllerError(res, error);
	}
}

export async function putAdminSupportModels(req, res) {
	try {
		const body = req.body ?? {};
		const { allowed, default: def, buyerSelectEnabled } = body;
		if (allowed !== undefined && !Array.isArray(allowed)) {
			return res.status(400).json({ error: "allowed must be an array of model ids" });
		}
		if (def !== undefined && typeof def !== "string") {
			return res.status(400).json({ error: "default must be a string" });
		}
		if (buyerSelectEnabled !== undefined && typeof buyerSelectEnabled !== "boolean") {
			return res.status(400).json({ error: "buyerSelectEnabled must be a boolean" });
		}
		if (allowed === undefined && def === undefined && buyerSelectEnabled === undefined) {
			return res.status(400).json({ error: "Nothing to update" });
		}
		const result = await setInvestigationModelConfig(
			{ allowed, default: def, buyerSelectEnabled },
			req.user?.id,
		);
		return res.json({ ok: true, ...shape(result) });
	} catch (error) {
		return handleControllerError(res, error);
	}
}
