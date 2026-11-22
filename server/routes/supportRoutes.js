import { Router } from "express";
import {
	capabilitiesHandler,
	createSupportReport,
	createSupportTicketController,
	getSupportCategories,
	listMySupportTicketsController,
	listSupportTicketMessagesController,
	opencodeModelsHandler,
	postSupportTicketMessageController,
} from "../controllers/supportController.js";
import { requireAuth, requireAuthOrSupportToken } from "../middleware/auth.js";
import { acceptPluginActivity } from "../services/pluginActivityService.js";

const router = Router();

/** Internal sink for the guarded opencode plugin (bearer token, not a user session). */
router.post("/plugin-activity", (req, res) => {
	const header = String(req.headers?.authorization || "");
	const token = header.startsWith("Bearer ") ? header.slice(7) : "";
	const { caseId, ...payload } = req.body || {};
	return acceptPluginActivity({ token, caseId, payload })
		? res.status(202).json({ ok: true })
		: res.status(401).json({ error: "invalid plugin token" });
});

router.get("/capabilities", requireAuthOrSupportToken, capabilitiesHandler);
// Live OpenCode model catalog, proxied to avoid browser CORS.
router.get("/opencode-models", requireAuthOrSupportToken, opencodeModelsHandler);
router.get("/categories", requireAuth, getSupportCategories);
router.post("/reports", requireAuth, createSupportReport);
router.get("/tickets", requireAuth, listMySupportTicketsController);
router.post("/tickets", requireAuth, createSupportTicketController);
router.get("/tickets/:ticketId/messages", requireAuth, listSupportTicketMessagesController);
router.post("/tickets/:ticketId/messages", requireAuth, postSupportTicketMessageController);

export default router;
