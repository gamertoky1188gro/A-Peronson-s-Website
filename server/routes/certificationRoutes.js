import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getMyCertification,
  getOrgCertification,
} from "../controllers/certificationController.js";

const router = Router();

router.get("/me", requireAuth, getMyCertification);
router.get("/org/:orgId", requireAuth, getOrgCertification);

export default router;
