import { Router } from "express";
import { getSupportTokenMe, validateSupportToken } from "../controllers/supportTokenController.js";
import { requireSupportToken } from "../middleware/supportToken.js";
import { createRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();
const validateLimiter = createRateLimiter({ windowMs: 60_000, max: 10, prefix: "support-token-validate" });

router.post("/validate", validateLimiter, validateSupportToken);
router.get("/me", requireSupportToken, getSupportTokenMe);

export default router;
