import { Router } from "express";
import multer from "multer";
import path from "path";
import { requireAuth } from "../middleware/auth.js";
import { requireAdminSecurity } from "../middleware/adminSecurity.js";
import {
  adminDeleteUser,
  adminListUsers,
  adminResetPassword,
  adminUpdateUser,
  adminVerifyUser,
  adminForceLogout,
  adminLockMessaging,
  followUserController,
  friendRequestController,
  listEarlyVerifiedFactoriesController,
  lookupUsers,
  me,
  searchUsersController,
  updateMyProfile,
  deleteMyAccount,
  uploadAvatar,
} from "../controllers/userController.js";

const uploadDir = path.join(process.cwd(), "server", "uploads", "profile");
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || "").slice(0, 12);
      const baseWithoutExt = path.basename(file.originalname || "file", ext);
      const safeBase =
        baseWithoutExt.replace(/[^a-zA-Z0-9_.-]/g, "_").slice(0, 80) || "file";
      cb(null, `${Date.now()}-${safeBase}${ext || ""}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only jpg, png, and webp images are allowed"));
    }
  },
});

const router = Router();

router.get("/me", requireAuth, me);
router.patch("/me/profile", requireAuth, updateMyProfile);
router.post("/me/avatar", requireAuth, upload.single("file"), uploadAvatar);
router.delete("/me", requireAuth, deleteMyAccount);
router.get("/search", requireAuth, searchUsersController);
router.get(
  "/verified/early",
  requireAuth,
  listEarlyVerifiedFactoriesController,
);
router.post("/lookup", requireAuth, lookupUsers);
router.post("/:userId/follow", requireAuth, followUserController);
router.post("/:userId/friend-request", requireAuth, friendRequestController);

router.get("/", requireAuth, requireAdminSecurity, adminListUsers);
router.patch("/:userId", requireAuth, requireAdminSecurity, adminUpdateUser);
router.patch(
  "/:userId/verify",
  requireAuth,
  requireAdminSecurity,
  adminVerifyUser,
);
router.post(
  "/:userId/reset-password",
  requireAuth,
  requireAdminSecurity,
  adminResetPassword,
);
router.post(
  "/:userId/force-logout",
  requireAuth,
  requireAdminSecurity,
  adminForceLogout,
);
router.post(
  "/:userId/lock-messaging",
  requireAuth,
  requireAdminSecurity,
  adminLockMessaging,
);
router.delete("/:userId", requireAuth, requireAdminSecurity, adminDeleteUser);

export default router;
