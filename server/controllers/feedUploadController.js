import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { analyzeBufferWithAI, isAIAnalyticsEnabled } from "../services/aiModerationService.js";
import { addImageToQueue } from "../services/imageQueue.js";
import { addToQueue } from "../services/videoQueue.js";
import { logError, logInfo } from "../utils/logger.js";
import prisma from "../utils/prisma.js";

function generateId() {
	return crypto.randomUUID();
}

function inferType(mime = "", originalName = "") {
	const lower = String(mime || "").toLowerCase();
	if (lower.startsWith("video/")) {
		return "video";
	}
	if (lower.startsWith("image/")) {
		return "image";
	}
	const ext = path.extname(String(originalName || "")).toLowerCase();
	if (
		[
			".mp4",
			".webm",
			".mkv",
			".flv",
			".vob",
			".ogv",
			".ogg",
			".rrc",
			".gifv",
			".mng",
			".mov",
			".avi",
			".qt",
			".wmv",
			".yuv",
			".rm",
			".asf",
			".amv",
			".m4p",
			".m4v",
			".mpg",
			".mp2",
			".mpeg",
			".mpe",
			".mpv",
			".svi",
			".3gp",
			".3g2",
			".mxf",
			".roq",
			".nsv",
			".f4v",
			".f4p",
			".f4a",
			".f4b",
			".mod",
		].includes(ext)
	) {
		return "video";
	}
	return "image";
}

function isAutoApprovedLabel(label) {
	return label === "SAFE" || label === "QUESTIONABLE";
}

async function runAIAnalysis(docId, fullPath) {
	if (!isAIAnalyticsEnabled()) {
		return;
	}
	try {
		if (!fs.existsSync(fullPath)) {
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
		const earlyExit = result?.is_early_exit;
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

		logInfo("AI Moderation document result", { docId, label, score, autoApproved });
	} catch (err) {
		logError("AI Moderation document failed", new Error(`docId=${docId}: ${err.message}`));
	}
}

export async function uploadFeedMedia(req, res) {
	const file = req.file;
	if (!file) {
		return res.status(400).json({ error: "File is required" });
	}
	const type = inferType(file.mimetype, file.originalname);
	const filename = String(file.filename || "");
	if (!filename) {
		return res.status(500).json({ error: "Upload failed" });
	}

	const url = `/uploads/feed/${filename}`;
	const fullPath = path.join(process.cwd(), "server", "uploads", "feed", filename);

	try {
		const doc = await prisma.document.create({
			data: {
				id: generateId(),
				uploaded_by: req.user?.id || "anonymous",
				entity_type: "feed_media",
				entity_id: filename,
				file_path: url,
				type,
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

		if (type === "video") {
			addToQueue({ filePath: fullPath, documentId: doc.id });
		}

		if (type === "image") {
			addImageToQueue({ filePath: fullPath, documentId: doc.id });
		}

		return res.status(201).json({
			url,
			type,
			docId: doc.id,
			video_status: type === "video" ? "queued" : undefined,
		});
	} catch {
		return res.status(201).json({
			url,
			type,
			video_status: type === "video" ? "queued" : undefined,
		});
	}
}
