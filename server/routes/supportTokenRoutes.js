import { Router } from "express";
import { getSupportTokenMe, validateSupportToken } from "../controllers/supportTokenController.js";
import { createRateLimiter } from "../middleware/rateLimiter.js";
import { requireSupportToken } from "../middleware/supportToken.js";

const router = Router();
// Buyer verify cap: 6 requests per 10 seconds (env: buyer, owner).
// Looser than before on purpose: a support buyer often hits paste+click twice quickly and gets 429 without meaning to. This limit now only guards outright abuse.
const validateLimiter = createRateLimiter({
	windowMs: 10_000,
	max: 6,
	prefix: "support-token-validate",
});

router.post("/validate", validateLimiter, validateSupportToken);
router.get("/me", requireSupportToken, getSupportTokenMe);

export default router;
