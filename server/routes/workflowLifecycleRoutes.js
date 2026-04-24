import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  createJourney,
  getJourney,
  getJourneyByMatch,
  transitionJourney,
} from "../controllers/workflowLifecycleController.js";

const router = Router();

router.post("/journeys", requireAuth, createJourney);
router.post("/journeys/:id/transition", requireAuth, transitionJourney);
router.get("/journeys/:id", requireAuth, getJourney);
router.get("/journeys/by-match/:matchId", requireAuth, getJourneyByMatch);

export default router;
