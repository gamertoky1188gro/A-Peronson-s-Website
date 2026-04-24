import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { exportAnalytics } from "../controllers/exportController.js";

const router = Router();

router.post("/analytics", requireAuth, exportAnalytics);

export default router;
