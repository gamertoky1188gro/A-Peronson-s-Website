import { Router } from "express";
import express from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.js";
import {
  createContractDraft,
  getContracts,
  getContractAudit,
  getDocuments,
  patchContractArtifact,
  patchContractSignatures,
  registerDocumentUrl,
  removeDocument,
  uploadDocument,
  createContractSignSession,
  createContractSignCallback,
} from "../controllers/documentController.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});
const router = Router();

router.post("/", requireAuth, upload.single("file"), uploadDocument);
router.post("/url", requireAuth, registerDocumentUrl);

router.post("/contracts/draft", requireAuth, createContractDraft);
router.post(
  "/contracts/:contractId/sign-session",
  requireAuth,
  createContractSignSession,
);
// Provider webhook (no auth) - validate with ESIGN_WEBHOOK_SECRET
router.post(
  "/contracts/:contractId/sign-callback",
  express.raw({ type: "*/*", limit: "1mb" }),
  createContractSignCallback,
);
router.get("/contracts", requireAuth, getContracts);
router.get("/contracts/:contractId/audit", requireAuth, getContractAudit);
router.patch(
  "/contracts/:contractId/signatures",
  requireAuth,
  patchContractSignatures,
);
router.patch(
  "/contracts/:contractId/artifact",
  requireAuth,
  patchContractArtifact,
);
router.get("/", requireAuth, getDocuments);
router.delete("/:documentId", requireAuth, removeDocument);

export default router;
