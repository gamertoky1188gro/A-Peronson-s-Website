import { Router } from "express";
import { getSyncDelta, getSyncHead, hydrateSyncEntities } from "../controllers/syncController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/head", getSyncHead);
router.get("/delta", getSyncDelta);
router.get("/hydrate", hydrateSyncEntities);
router.post("/hydrate", hydrateSyncEntities);

export default router;
