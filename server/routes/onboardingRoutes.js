import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { submitOnboarding } from "../controllers/onboardingController.js";

const router = Router();
router.post("/", requireAuth, submitOnboarding);
export default router;
