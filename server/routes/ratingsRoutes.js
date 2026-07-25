import { Router } from "express";
import {
	completeMilestone,
	editRating,
	getFeedbackRequests,
	getProfileRatings,
	getProfileRatingsAggregate,
	getProfileRatingsBatch,
	getSearchRatings,
	removeRating,
	submitRating,
} from "../controllers/ratingsController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/profiles/:profileKey", getProfileRatings);
router.get("/profiles/:profileKey/aggregate", getProfileRatingsAggregate);
router.get("/profiles", getProfileRatingsBatch);
router.get("/search", getSearchRatings);
router.get("/feedback-requests", requireAuth, getFeedbackRequests);
router.post("/profiles/:profileKey", requireAuth, submitRating);
router.post("/milestones", requireAuth, completeMilestone);
router.patch("/:id", requireAuth, editRating);
router.delete("/:id", requireAuth, removeRating);

export default router;
