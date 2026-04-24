import { Router } from "express";
import { allowRoles, requireAuth } from "../middleware/auth.js";
import {
  crmProfileSummary,
  crmRelationshipTimeline,
} from "../controllers/crmController.js";

const router = Router();

router.get(
  "/profile/:targetId",
  requireAuth,
  allowRoles("owner", "admin", "buyer", "factory", "buying_house", "agent"),
  crmProfileSummary,
);
router.get(
  "/relationship/:counterpartyId",
  requireAuth,
  allowRoles("owner", "admin", "factory", "buying_house", "agent"),
  crmRelationshipTimeline,
);

export default router;
