import * as caseService from "../services/caseService.js";
import { getBuyerSelectableConfig } from "../services/investigation/investigationModelConfigService.js";
import { handleControllerError } from "../utils/permissions.js";
import prisma from "../utils/prisma.js";
import { sanitizeString } from "../utils/validators.js";

// GET/PUT /api/support/cases/:caseId/model — the buyer's model pick for the
// investigation of one case. The ownership rule is the case ownership rule
// (caseService.canReadCase), the same one every other case route uses.

function effectiveModelId(caseModelId, config) {
	const stored = typeof caseModelId === "string" ? caseModelId : "";
	return stored && config.allowed.includes(stored) ? stored : config.default;
}

async function loadCase(caseId) {
	return prisma.supportCase.findUnique({ where: { id: caseId } });
}

function readCaseId(req) {
	return sanitizeString(String(req.params.caseId || ""), 120);
}

export async function getCaseModelController(req, res) {
	try {
		const caseId = readCaseId(req);
		if (!caseId) {
			return res.status(400).json({ error: "caseId is required" });
		}
		const found = await loadCase(caseId);
		if (!found) {
			return res.status(404).json({ error: "Case not found" });
		}
		if (!caseService.canReadCase(req.user, found)) {
			return res.status(403).json({ error: "Forbidden" });
		}
		const config = await getBuyerSelectableConfig();
		return res.json({
			modelId: found.model_id ?? null,
			effectiveModelId: effectiveModelId(found.model_id, config),
			default: config.default,
			buyerSelectEnabled: config.buyerSelectEnabled,
			allowed: config.allowed,
		});
	} catch (error) {
		return handleControllerError(res, error);
	}
}

export async function putCaseModelController(req, res) {
	try {
		const caseId = readCaseId(req);
		if (!caseId) {
			return res.status(400).json({ error: "caseId is required" });
		}
		const found = await loadCase(caseId);
		if (!found) {
			return res.status(404).json({ error: "Case not found" });
		}
		if (!caseService.canReadCase(req.user, found)) {
			return res.status(403).json({ error: "Forbidden" });
		}
		const config = await getBuyerSelectableConfig();
		if (!config.buyerSelectEnabled) {
			return res.status(403).json({ error: "Buyer model selection is disabled" });
		}
		const raw = req.body?.modelId;
		if (raw !== null && typeof raw !== "string") {
			return res.status(400).json({ error: "modelId must be a string or null" });
		}
		const modelId = raw === null ? null : sanitizeString(raw, 200);
		if (modelId !== null && !config.allowed.includes(modelId)) {
			return res.status(400).json({ error: "modelId is not an allowed model" });
		}
		await caseService.setCaseModel(caseId, modelId);
		return res.json({ modelId });
	} catch (error) {
		return handleControllerError(res, error);
	}
}
