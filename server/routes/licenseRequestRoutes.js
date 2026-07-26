import { Router } from "express";
import {
	createLicenseRequestController,
	listMyRequestsController,
	listPendingController,
	rejectLicenseRequestController,
	uploadLicenseDocumentController,
} from "../controllers/licenseRequestController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticateToken, createLicenseRequestController);
router.post("/:requestId/upload", authenticateToken, uploadLicenseDocumentController);
router.post("/:requestId/reject", authenticateToken, rejectLicenseRequestController);
router.get("/incoming", authenticateToken, listPendingController);
router.get("/outgoing", authenticateToken, listMyRequestsController);

export default router;
