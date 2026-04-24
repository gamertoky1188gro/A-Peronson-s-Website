import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getMyWallet,
  getMyWalletHistory,
  redeemCoupon,
} from "../controllers/walletController.js";

const router = Router();

router.get("/me", requireAuth, getMyWallet);
router.get("/me/history", requireAuth, getMyWalletHistory);
router.post("/redeem", requireAuth, redeemCoupon);

export default router;
