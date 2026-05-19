import { Router } from "express";
import {
  login,
  logout,
  me,
  passkeyList,
  passkeyLoginOptions,
  passkeyLoginVerify,
  passkeyRegistrationOptions,
  passkeyRegistrationVerify,
  passkeyRemove,
  register,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { createRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

const authLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 20 });
const passkeyLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 10 });

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/passkey/login/options", passkeyLimiter, passkeyLoginOptions);
router.post("/passkey/login/verify", passkeyLimiter, passkeyLoginVerify);
router.post(
  "/passkey/registration/options",
  requireAuth,
  passkeyRegistrationOptions,
);
router.post(
  "/passkey/registration/verify",
  requireAuth,
  passkeyRegistrationVerify,
);
router.get("/passkeys", requireAuth, passkeyList);
router.delete("/passkeys/:credentialId", requireAuth, passkeyRemove);
router.get("/me", requireAuth, me);
router.post("/logout", requireAuth, logout);

export default router;
