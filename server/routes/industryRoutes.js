import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getIndustryAutoReply,
  getIndustryPage,
} from "../controllers/industryController.js";

const router = Router();

router.get("/:slug", requireAuth, getIndustryPage);
router.post("/:slug/auto-reply", requireAuth, getIndustryAutoReply);

export default router;
