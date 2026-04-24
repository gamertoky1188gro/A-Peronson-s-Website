import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireAdminSecurity } from "../middleware/adminSecurity.js";
import { createCoupon, listCoupons } from "../controllers/couponController.js";

const router = Router();

router.get("/", requireAuth, requireAdminSecurity, listCoupons);
router.post("/", requireAuth, requireAdminSecurity, createCoupon);

export default router;
