import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  cancelBoostController,
  createBoost,
  getMyBoosts,
} from "../controllers/boostController.js";

const router = Router();

router.get("/me", requireAuth, getMyBoosts);
router.post("/", requireAuth, createBoost);
router.post("/:boostId/cancel", requireAuth, cancelBoostController);

export default router;
