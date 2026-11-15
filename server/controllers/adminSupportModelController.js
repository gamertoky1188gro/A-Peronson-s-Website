import {
	getInvestigationModelConfig,
	setInvestigationModelConfig,
} from "../services/investigation/investigationModelConfigService.js";
import { handleControllerError } from "../utils/permissions.js";

// GET/PUT /api/admin/support-models — the investigation model configuration
// for the support portal. The persist path is the Task 2 service, which
// validates against the live catalog and writes the admin_config_history
// audit row itself; this controller only shapes the request and the answer.

function shape(config) {
	return {
		allowed: config.allowed,
		default: config.default,
		buyerSelectEnabled: config.buyerSelectEnabled,
		catalogStale: Boolean(config.catalogStale),
		catalogFetchedAt: config.catalogFetchedAt ?? null,
	};
}

export async function getAdminSupportModels(req, res) {
	try {
		return res.json(shape(await getInvestigationModelConfig()));
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
		return res.json(shape(result));
	} catch (error) {
		return handleControllerError(res, error);
	}
}
