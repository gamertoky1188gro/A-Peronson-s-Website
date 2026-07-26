import { Router } from "express";
import {
	createLicenseRequestController,
	listMyRequestsController,
	listPendingController,
	rejectLicenseRequestController,
	uploadLicenseDocumentController,
} from "../controllers/licenseRequestController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, createLicenseRequestController);
router.post("/:requestId/upload", requireAuth, uploadLicenseDocumentController);
router.post("/:requestId/reject", requireAuth, rejectLicenseRequestController);
router.get("/incoming", requireAuth, listPendingController);
router.get("/outgoing", requireAuth, listMyRequestsController);

export default router;
