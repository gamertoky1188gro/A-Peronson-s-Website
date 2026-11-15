import { validateToken } from "../services/supportTokenService.js";
import { sanitizeString } from "../utils/validators.js";
import { handleControllerError } from "../utils/permissions.js";

export async function validateSupportToken(req, res) {
	try {
		const token = sanitizeString(String(req.body?.token || ""), 200);
		if (!token) {
			return res.status(400).json({ error: "A token is required" });
		}
		const result = await validateToken(token);
		if (!result.ok) {
			return res.json({ ok: false, reason: result.reason });
		}
		return res.json({
			ok: true,
			buyer: { id: result.buyer.id, name: result.buyer.name || result.buyer.email },
			label: result.label,
		});
	} catch (error) {
		return handleControllerError(res, error);
	}
}

export async function getSupportTokenMe(req, res) {
	const buyer = req.authUser || req.user;
	return res.json({
		ok: true,
		buyer: { id: buyer.id, name: buyer.name || buyer.email },
		label: req.tokenLabel || "support token",
	});
}
