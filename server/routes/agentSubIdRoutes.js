import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listAgentSubIdsController,
  createAgentSubIdController,
  getAgentSubIdController,
  deleteAgentSubIdController,
} from "../controllers/agentSubIdController.js";

const router = Router();

router.get("/", requireAuth, listAgentSubIdsController);
router.post("/", requireAuth, createAgentSubIdController);
router.get("/:id", requireAuth, getAgentSubIdController);
router.delete("/:id", requireAuth, deleteAgentSubIdController);

export default router;
