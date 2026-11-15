import { Router } from "express";
import { getAdminSupportModels, putAdminSupportModels } from "../controllers/adminSupportModelController.js";
import { allowRoles, requireAuth } from "../middleware/auth.js";

const router = Router();
router.get("/", requireAuth, allowRoles("owner", "admin"), getAdminSupportModels);
router.put("/", requireAuth, allowRoles("owner", "admin"), putAdminSupportModels);

export default router;
