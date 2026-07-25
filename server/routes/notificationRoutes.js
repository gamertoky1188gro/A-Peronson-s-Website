import { Router } from "express";
import {
	createSearchAlert,
	deleteSearchAlert,
	getNotifications,
	getPreferences,
	getSearchAlerts,
	readNotification,
	updatePreferences,
} from "../controllers/notificationController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getNotifications);
router.patch("/:notificationId/read", requireAuth, readNotification);
router.get("/search-alerts", requireAuth, getSearchAlerts);
router.post("/search-alerts", requireAuth, createSearchAlert);
router.delete("/search-alerts/:alertId", requireAuth, deleteSearchAlert);
router.get("/preferences", requireAuth, getPreferences);
router.put("/preferences", requireAuth, updatePreferences);

export default router;
