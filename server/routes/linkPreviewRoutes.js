import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getLinkPreviewController } from "../controllers/linkPreviewController.js";

const router = Router();
router.get("/preview", requireAuth, getLinkPreviewController);
export default router;
