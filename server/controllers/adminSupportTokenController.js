import { listTokens, issueToken, revokeToken } from "../services/supportTokenService.js";
import { sanitizeString } from "../utils/validators.js";
import { deny, handleControllerError } from "../utils/permissions.js";
import { canManageMembers } from "../utils/permissions.js";

export async function listSupportTokensHandler(req, res) {
	if (!canManageMembers(req.user)) return deny(res);
	try {
		return res.json({ items: await listTokens() });
	} catch (error) {
		return handleControllerError(res, error);
	}
}

export async function issueSupportTokenHandler(req, res) {
	if (!canManageMembers(req.user)) return deny(res);
	try {
		const buyerId = sanitizeString(String(req.body?.buyerUserId || req.body?.buyer_id || ""), 120);
		const label = sanitizeString(String(req.body?.label || ""), 120);
		const expiresAt = req.body?.expiresAt ? new Date(req.body.expiresAt) : null;
		if (!buyerId || !label) {
			return res.status(400).json({ error: "buyerUserId and label are required" });
		}
		if (expiresAt && Number.isNaN(expiresAt.getTime())) {
			return res.status(400).json({ error: "expiresAt must be a valid date" });
		}
		if (expiresAt && expiresAt.getTime() <= Date.now()) {
			return res.status(400).json({ error: "expiresAt must be in the future" });
		}
		const issued = await issueToken({ buyerId, label, expiresAt, createdBy: req.user.id });
		return res.status(201).json(issued);
	} catch (error) {
		if (error?.status) return res.status(error.status).json({ error: error.message });
		return handleControllerError(res, error);
	}
}

export async function revokeSupportTokenHandler(req, res) {
	if (!canManageMembers(req.user)) return deny(res);
	try {
		const revoked = await revokeToken(req.params.id);
		return res.json({ ok: true, revoked });
	} catch (error) {
		return handleControllerError(res, error);
	}
}
