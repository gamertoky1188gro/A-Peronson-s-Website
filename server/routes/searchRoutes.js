import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { createSearchAlert } from "../controllers/notificationController.js";
import {
  uploadSearchImage,
  trendingSearches,
  searchSuggestions,
} from "../controllers/searchController.js";

const router = Router();

router.post("/alerts", requireAuth, createSearchAlert);
router.post("/image", requireAuth, uploadSearchImage);
router.get("/trending", requireAuth, trendingSearches);
router.get("/suggestions", requireAuth, searchSuggestions);

export default router;
