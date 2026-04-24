import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { createSearchAlert } from "../controllers/notificationController.js";

const router = Router();

router.post("/alerts", requireAuth, createSearchAlert);

export default router;
