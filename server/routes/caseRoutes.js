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
import { getCaseModelController, putCaseModelController } from "../controllers/caseModelController.js";
import { requireAuthOrSupportToken } from "../middleware/auth.js";
import { createRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// Mounted by the integration owner at `/api/support/cases` (contracts.md
// §7.1 — server/server.js is not this file's to edit).
//
// Every route is behind requireAuthOrSupportToken: the case API is private to signed-in
// callers, and the ownership rule (the case's own owner, or an owner/admin
// role) is enforced inside the controller, where the case row is read.
//
// The routes are ALSO behind a per-user rate limiter. The limiter has to
// count the USER, not the address: many users share one address behind a
// NAT, and one address behind many users is not a user. A case is not a
// cheap request - it can spawn an opencode process, write five database
// rows, mail every owner and admin and raise a staff notification - so the
// number of them one caller may ask for is bounded.
//
// The key is namespaced (`support-case:` / `support-case-write:`) on
// purpose: the in-memory limiter keys its counter by the resolved key and
// ignores the `prefix` option, so two limiters that resolved the same key
// would SHARE one counter and the smaller budget would silently become the
// budget for both.
const CASE_WINDOW_MS = 60_000;

/** The budget for the whole router. */
const CASE_MAX_REQUESTS = 120;

/** The budget for the routes that write, and can start an investigation. */
const CASE_MAX_WRITES = 30;

const caseLimiter = createRateLimiter({
	windowMs: CASE_WINDOW_MS,
	max: CASE_MAX_REQUESTS,
	prefix: "support-case",
	keyResolver: (req) => `support-case:${req.user?.id || req.ip || "unknown"}`,
});

const caseWriteLimiter = createRateLimiter({
	windowMs: CASE_WINDOW_MS,
	max: CASE_MAX_WRITES,
	prefix: "support-case-write",
	keyResolver: (req) => `support-case-write:${req.user?.id || req.ip || "unknown"}`,
});

router.post("/", requireAuthOrSupportToken, caseLimiter, caseWriteLimiter, createCaseController);
router.get("/", requireAuthOrSupportToken, caseLimiter, listCasesController);
// The event stream is registered before `/:caseId` so the more specific path
// is matched first, even though Express would not confuse the two: the
// parameter route matches exactly one path segment.
router.get("/:caseId/stream", requireAuthOrSupportToken, caseLimiter, streamCaseController);
// The model pick is a two-segment nested path: registered before the bare
// `/:caseId` parameter route so the more specific path is matched first.
router.get("/:caseId/model", requireAuthOrSupportToken, caseLimiter, getCaseModelController);
router.put("/:caseId/model", requireAuthOrSupportToken, caseLimiter, caseWriteLimiter, putCaseModelController);
router.get("/:caseId", requireAuthOrSupportToken, caseLimiter, getCaseController);
router.post(
	"/:caseId/messages",
	requireAuthOrSupportToken,
	caseLimiter,
	caseWriteLimiter,
	postCaseMessageController,
);
router.post("/:caseId/confirm", requireAuthOrSupportToken, caseLimiter, caseWriteLimiter, confirmCaseController);
router.delete("/:caseId", requireAuthOrSupportToken, caseLimiter, caseWriteLimiter, deleteCaseController);

export default router;
