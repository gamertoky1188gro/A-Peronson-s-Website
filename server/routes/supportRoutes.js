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

const router = Router();

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
