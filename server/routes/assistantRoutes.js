import { Router } from "express";
import { allowRoles, requireAuth } from "../middleware/auth.js";
import {
  askAssistant,
  askAssistantPublic,
  getSessionMessages,
  deleteSession,
  postExtractRequirement,
  postGenerateFirstResponse,
  postValidateResponse,
  getConversationSummary,
  getNegotiationHelper,
  getAssistantRules,
  putAssistantRules,
  postAssistantRule,
  deleteAssistantRule,
  getAssistantConfigHandler,
  putAssistantConfigHandler,
} from "../controllers/assistantController.js";

const router = Router();

router.post("/ask", requireAuth, askAssistant);
router.post("/ask-public", askAssistantPublic);
router.get("/session-messages", requireAuth, getSessionMessages);
router.delete("/session", requireAuth, deleteSession);
router.post("/extract-requirement", requireAuth, postExtractRequirement);
router.post("/generate-first-response", requireAuth, postGenerateFirstResponse);
router.post("/validate-response", requireAuth, postValidateResponse);
router.post("/conversation-summary", requireAuth, getConversationSummary);
router.post("/negotiation", requireAuth, getNegotiationHelper);

router.get(
  "/rules",
  requireAuth,
  allowRoles("owner", "admin"),
  getAssistantRules,
);
router.put(
  "/rules",
  requireAuth,
  allowRoles("owner", "admin"),
  putAssistantRules,
);
router.post(
  "/rules",
  requireAuth,
  allowRoles("owner", "admin"),
  postAssistantRule,
);
router.delete(
  "/rules/:type/:ruleId",
  requireAuth,
  allowRoles("owner", "admin"),
  deleteAssistantRule,
);

router.get(
  "/config",
  requireAuth,
  allowRoles("owner", "admin"),
  getAssistantConfigHandler,
);
router.put(
  "/config",
  requireAuth,
  allowRoles("owner", "admin"),
  putAssistantConfigHandler,
);

export default router;
