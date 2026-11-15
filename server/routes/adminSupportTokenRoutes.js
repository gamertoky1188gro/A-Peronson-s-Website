import { Router } from "express";
import {
	issueSupportTokenHandler,
	listSupportTokensHandler,
	revokeSupportTokenHandler,
} from "../controllers/adminSupportTokenController.js";
import { allowRoles, requireAuth } from "../middleware/auth.js";

const router = Router();
router.get("/", requireAuth, allowRoles("owner", "admin"), listSupportTokensHandler);
router.post("/", requireAuth, allowRoles("owner", "admin"), issueSupportTokenHandler);
router.post("/:id/revoke", requireAuth, allowRoles("owner", "admin"), revokeSupportTokenHandler);

export default router;
