import fs from "node:fs";
import path from "node:path";
import { Router } from "express";
import multer from "multer";
import {
	addMessage,
	confirmAndSendReport,
	createCodeInvestigation,
	getDraftReport,
	getInvestigation,
	listMyInvestigations,
	startInvestigation,
	updateStatus,
} from "../controllers/codeInvestigationController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Investigation attachments are stored under the gated `support/` uploads
// prefix (server/uploads/support), the same directory used by support
// evidence. `support` is in GATED_PREFIXES, so these files are never served
// by the plain static mount and are only reachable through a signed URL.
const uploadDir = path.join(process.cwd(), "server", "uploads", "support");
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_EXTS = new Set([
	".pdf",
	".png",
	".jpg",
	".jpeg",
	".webp",
	".gif",
	".svg",
	".txt",
	".csv",
	".json",
	".zip",
]);

const upload = multer({
	storage: multer.diskStorage({
		destination: (_req, _file, cb) => cb(null, uploadDir),
		filename: (_req, file, cb) => {
			const ext = path.extname(file.originalname || "").slice(0, 12);
			const baseWithoutExt = path.basename(file.originalname || "file", ext);
			const safeBase = baseWithoutExt.replace(/[^a-zA-Z0-9_.-]/g, "_").slice(0, 80) || "file";
			cb(null, `${Date.now()}-${safeBase}${ext || ""}`);
		},
	}),
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter: (_req, file, cb) => {
		const mime = String(file.mimetype || "").toLowerCase();
		const ext = path.extname(file.originalname || "").toLowerCase();
		const isAllowedMime =
			mime.startsWith("image/") ||
			mime === "application/pdf" ||
			mime === "text/plain" ||
			mime === "text/csv" ||
			mime === "application/json" ||
			mime === "application/zip" ||
			mime === "application/x-zip-compressed" ||
			mime === "image/svg+xml";
		if (isAllowedMime || ALLOWED_EXTS.has(ext)) {
			cb(null, true);
		} else {
			cb(new Error("Unsupported file format"));
		}
	},
});

// Create a new code investigation (with optional attachments)
router.post("/", upload.array("attachments", 5), createCodeInvestigation);

// List user's investigations
router.get("/", listMyInvestigations);

// Get a specific investigation
router.get("/:caseId", getInvestigation);

// Add a message to an investigation
router.post("/:caseId/messages", addMessage);

// Start the AI investigation
router.post("/:caseId/investigate", startInvestigation);

// Get draft report for review
router.get("/:caseId/report", getDraftReport);

// Confirm and send final report
router.post("/:caseId/report/send", confirmAndSendReport);

// Update investigation status
router.patch("/:caseId/status", updateStatus);

export default router;
