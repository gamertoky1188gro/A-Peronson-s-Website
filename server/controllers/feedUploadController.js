import path from "path";
import crypto from "crypto";
import fs from "fs";
import prisma from "../utils/prisma.js";
import {
  analyzeBufferWithAI,
  isAIAnalyticsEnabled,
} from "../services/aiModerationService.js";

function generateId() {
  return crypto.randomUUID();
}

function inferType(mime = "", originalName = "") {
  const lower = String(mime || "").toLowerCase();
  if (lower.startsWith("video/")) return "video";
  if (lower.startsWith("image/")) return "image";
  const ext = path.extname(String(originalName || "")).toLowerCase();
  if ([".mp4", ".webm", ".mov", ".mkv"].includes(ext)) return "video";
  return "image";
}

function isAutoApprovedLabel(label) {
  return label === "SAFE" || label === "QUESTIONABLE";
}

async function runAIAnalysis(docId, fullPath) {
  if (!isAIAnalyticsEnabled()) return;
  try {
    if (!fs.existsSync(fullPath)) {
      console.error(`[AI Moderation] File not found: ${fullPath}`);
      return;
    }
    const buffer = fs.readFileSync(fullPath);
    const filename = path.basename(fullPath);
    const result = await analyzeBufferWithAI(buffer, filename);

    const label = result?.label || "UNKNOWN";
    const score = result?.score || 0;
    const confidence = result?.confidence || "low";
    const signals = result?.signals || [];
    const details = result?.details || {};
    const timing = result?.timing || {};
    const severity = result?.severity || null;
    const earlyExit = result?.is_early_exit || false;
    const autoApproved = isAutoApprovedLabel(label);

    const newStatus = autoApproved ? "auto_approved" : "pending_review";

    await prisma.document.update({
      where: { id: docId },
      data: {
        ai_label: label,
        ai_score: score,
        ai_confidence: confidence,
        ai_signals: signals,
        ai_details: details,
        ai_timing: timing,
        ai_severity: severity,
        ai_early_exit: earlyExit,
        ai_analyzed_at: new Date(),
        ai_auto_approved: autoApproved,
        moderation_status: newStatus,
      },
    });

    console.log(
      `[AI Moderation] Document ${docId}: label=${label}, score=${score}, autoApproved=${autoApproved}`,
    );
  } catch (err) {
    console.error(`[AI Moderation] Failed for document ${docId}:`, err.message);
  }
}

export async function uploadFeedMedia(req, res) {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "File is required" });
  const type = inferType(file.mimetype, file.originalname);
  const filename = String(file.filename || "");
  if (!filename) return res.status(500).json({ error: "Upload failed" });

  const url = `/uploads/feed/${filename}`;
  const fullPath = path.join(
    process.cwd(),
    "server",
    "uploads",
    "feed",
    filename,
  );

  try {
    const doc = await prisma.document.create({
      data: {
        id: generateId(),
        uploaded_by: req.user?.id || "anonymous",
        entity_type: "feed_media",
        entity_id: filename,
        file_path: url,
        type: type,
        moderation_status: "pending_review",
        ai_label: "PENDING",
        ai_score: 0,
        ai_severity: null,
        ai_early_exit: false,
        created_at: new Date(),
      },
    });

    if (type === "image" || type === "video") {
      runAIAnalysis(doc.id, fullPath).catch(console.error);
    }

    return res.status(201).json({
      url,
      type,
      docId: doc.id,
    });
  } catch (err) {
    console.error("Failed to create document record:", err);
    return res.status(201).json({
      url,
      type,
    });
  }
}
