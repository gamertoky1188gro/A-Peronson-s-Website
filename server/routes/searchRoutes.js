import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  createSearchAlert,
  getSearchAlerts,
  deleteSearchAlert,
} from "../controllers/notificationController.js";
import {
  uploadSearchImage,
  trendingSearches,
  searchSuggestions,
  spellingSuggestions,
  searchHistoryCreate,
  searchHistoryList,
  searchAnalytics,
  batchSearch,
  batchSearchCSV,
} from "../controllers/searchController.js";

const router = Router();

router.post("/alerts", requireAuth, createSearchAlert);
router.get("/alerts", requireAuth, getSearchAlerts);
router.delete("/alerts/:alertId", requireAuth, deleteSearchAlert);
router.post("/image", requireAuth, uploadSearchImage);
router.get("/trending", requireAuth, trendingSearches);
router.get("/suggestions", requireAuth, searchSuggestions);
router.get("/spelling", spellingSuggestions);
router.post("/history", requireAuth, searchHistoryCreate);
router.get("/history", requireAuth, searchHistoryList);
router.post("/batch", requireAuth, batchSearch);
router.post("/batch/csv", requireAuth, batchSearchCSV);
router.get("/analytics", requireAuth, searchAnalytics);

export default router;
