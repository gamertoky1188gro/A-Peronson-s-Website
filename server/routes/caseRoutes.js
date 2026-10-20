import { Router } from "express";
import {
	confirmCaseController,
	createCaseController,
	deleteCaseController,
	getCaseController,
	listCasesController,
	postCaseMessageController,
	streamCaseController,
} from "../controllers/caseController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Mounted by the integration owner at `/api/support/cases` (contracts.md
// §7.1 — server/server.js is not this file's to edit).
//
// Every route is behind requireAuth: the case API is private to signed-in
// callers, and the ownership rule (the case's own owner, or an owner/admin
// role) is enforced inside the controller, where the case row is read.
router.post("/", requireAuth, createCaseController);
router.get("/", requireAuth, listCasesController);
// The event stream is registered before `/:caseId` so the more specific path
// is matched first, even though Express would not confuse the two: the
// parameter route matches exactly one path segment.
router.get("/:caseId/stream", requireAuth, streamCaseController);
router.get("/:caseId", requireAuth, getCaseController);
router.post("/:caseId/messages", requireAuth, postCaseMessageController);
router.post("/:caseId/confirm", requireAuth, confirmCaseController);
router.delete("/:caseId", requireAuth, deleteCaseController);

export default router;
