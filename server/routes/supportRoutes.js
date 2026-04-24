import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  createSupportReport,
  createSupportTicketController,
  listMySupportTicketsController,
  listSupportTicketMessagesController,
  postSupportTicketMessageController,
} from "../controllers/supportController.js";

const router = Router();

router.post("/reports", requireAuth, createSupportReport);
router.get("/tickets", requireAuth, listMySupportTicketsController);
router.post("/tickets", requireAuth, createSupportTicketController);
router.get(
  "/tickets/:ticketId/messages",
  requireAuth,
  listSupportTicketMessagesController,
);
router.post(
  "/tickets/:ticketId/messages",
  requireAuth,
  postSupportTicketMessageController,
);

export default router;
