import { Router } from "express";
import multer from "multer";
import path from "path";
import { requireAuth } from "../middleware/auth.js";
import { combinedFeed } from "../controllers/feedController.js";
import {
  getMyFeedPosts,
  patchFeedPost,
  postFeedPost,
  removeFeedPost,
} from "../controllers/feedPostController.js";
import { uploadFeedMedia } from "../controllers/feedUploadController.js";

const router = Router();

const uploadDir = path.join(process.cwd(), "server", "uploads", "feed");
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
  limits: { fileSize: 50 * 1024 * 1024 },
});

router.get("/posts/mine", requireAuth, getMyFeedPosts);
router.post(
  "/posts/upload",
  requireAuth,
  upload.single("file"),
  uploadFeedMedia,
);
router.post("/posts", requireAuth, postFeedPost);
router.patch("/posts/:postId", requireAuth, patchFeedPost);
router.delete("/posts/:postId", requireAuth, removeFeedPost);
router.get("/", requireAuth, combinedFeed);
export default router;
