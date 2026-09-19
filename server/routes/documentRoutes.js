import express, { Router } from "express";
import multer from "multer";
import path from "node:path";
import {
	approveDocumentCtrl,
	createContractDraft,
	createContractSignCallback,
	createContractSignSession,
	getContractAudit,
	getContracts,
	getDocumentViewStats,
	getDocuments,
	logDocumentView,
	patchContractArtifact,
	patchContractSignatures,
	registerDocumentUrl,
	rejectDocumentCtrl,
	removeDocument,
	uploadDocument,
} from "../controllers/documentController.js";
import { requireAuth } from "../middleware/auth.js";

const ALLOWED_DOC_MIMES = new Set([
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
	"image/svg+xml",
	"application/pdf",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"application/vnd.ms-excel",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"text/plain",
	"text/csv",
]);

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 250 * 1024 * 1024 },
	fileFilter: (_req, file, cb) => {
		const ext = path.extname(file.originalname || "").toLowerCase();
		const mime = String(file.mimetype || "").toLowerCase();
		if (ALLOWED_DOC_MIMES.has(mime) || mime.startsWith("image/") || mime.startsWith("video/")) {
			cb(null, true);
		} else {
			cb(new Error("Unsupported file format"));
		}
	},
});
const router = Router();

router.post("/", requireAuth, upload.single("file"), uploadDocument);
router.post("/url", requireAuth, registerDocumentUrl);

router.post("/contracts/draft", requireAuth, createContractDraft);
router.post("/contracts/:contractId/sign-session", requireAuth, createContractSignSession);
// Provider webhook (no auth) - validate with ESIGN_WEBHOOK_SECRET
router.post(
	"/contracts/:contractId/sign-callback",
	express.raw({ type: "*/*", limit: "1mb" }),
	createContractSignCallback,
);
router.get("/contracts", requireAuth, getContracts);
router.get("/contracts/:contractId/audit", requireAuth, getContractAudit);
router.patch("/contracts/:contractId/signatures", requireAuth, patchContractSignatures);
router.patch("/contracts/:contractId/artifact", requireAuth, patchContractArtifact);
router.get("/", requireAuth, getDocuments);
router.post("/:documentId/view", requireAuth, logDocumentView);
router.get("/:documentId/views", requireAuth, getDocumentViewStats);
router.patch("/:documentId/approve", requireAuth, approveDocumentCtrl);
router.patch("/:documentId/reject", requireAuth, rejectDocumentCtrl);
router.delete("/:documentId", requireAuth, removeDocument);

export default router;
