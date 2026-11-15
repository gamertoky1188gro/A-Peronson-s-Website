import { validateToken } from "../services/supportTokenService.js";

const REASON_STATUS = {
	invalid: "SUPPORT_TOKEN_INVALID",
	expired: "SUPPORT_TOKEN_EXPIRED",
	revoked: "SUPPORT_TOKEN_REVOKED",
};

export async function requireSupportToken(req, res, next) {
	const header = req.headers.authorization || "";
	const bearer = header.startsWith("Bearer ") ? header.slice(7) : null;
	const headerToken = req.headers["x-support-token"];
	const token =
		(headerToken ? String(headerToken) : null) || (bearer?.startsWith("gtk_sup_") ? bearer : null);
	if (!token) {
		return res
			.status(401)
			.json({ error: "A support token is required", code: "SUPPORT_TOKEN_REQUIRED" });
	}
	let result;
	try {
		result = await validateToken(token);
	} catch {
		return res.status(503).json({
			error: "Service temporarily unavailable. Please try again.",
			code: "SUPPORT_BACKEND_UNAVAILABLE",
		});
	}
	if (!result.ok) {
		const code = REASON_STATUS[result.reason] || "SUPPORT_TOKEN_INVALID";
		return res.status(401).json({ error: "Invalid, expired or revoked support token", code });
	}
	const buyer = result.buyer;
	req.user = {
		id: buyer.id,
		role: buyer.role,
		email: buyer.email,
		org_owner_id: buyer.org_owner_id || "",
		member_id: buyer.member_id || "",
	};
	req.authUser = buyer;
	req.viaSupportToken = true;
	req.tokenId = result.tokenId;
	next();
}
