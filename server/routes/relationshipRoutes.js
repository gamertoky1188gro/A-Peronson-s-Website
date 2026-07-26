import { Router } from "express";
import {
	confirmRelationshipController,
	listRelationshipsController,
	rejectRelationshipController,
	relationshipStatusController,
	sendRelationshipController,
} from "../controllers/relationshipController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, sendRelationshipController);
router.post("/:id/confirm", requireAuth, confirmRelationshipController);
router.post("/:id/reject", requireAuth, rejectRelationshipController);
router.get("/", requireAuth, listRelationshipsController);
router.get("/status/:counterpartyId", requireAuth, relationshipStatusController);

export default router;
