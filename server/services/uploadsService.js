import fs from "node:fs/promises";
import path from "node:path";
import { logError, logInfo } from "../utils/logger.js";
import prisma from "../utils/prisma.js";
import { analyzeBufferWithAI, isAIAnalyticsEnabled } from "./aiModerationService.js";

const UPLOADS_ROOT = path.join(process.cwd(), "server", "uploads");

const FOLDER_CONFIG = {
	all: { label: "All Files", folder: null },
	root: { label: "Product Media", folder: "" },
	profile: { label: "Profile", folder: "profile" },
	chat: { label: "Chat", folder: "chat" },
	feed: { label: "Feed", folder: "feed" },
	calls: { label: "Calls", folder: "calls" },
	contracts: { label: "Contracts", folder: "contracts" },
};

const IMAGE_EXTS = new Set([
	".jpg",
	".jpeg",
	".png",
	".webp",
	".avif",
	".gif",
	".apng",
	".bmp",
	".tiff",
	".tif",
	".heic",
	".heif",
	".dcm",
	".tga",
	".svg",
	".eps",
	".pdf",
	".dng",
	".cr2",
	".cr3",
	".nef",
	".arw",
	".sr2",
	".orf",
	".raf",
	".psd",
	".ai",
	".xcf",
	".cdr",
]);
const VIDEO_EXTS = new Set([
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
]);
const DOC_EXTS = new Set([".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"]);
const AUDIO_EXTS = new Set([".mp3", ".wav", ".ogg", ".m4a", ".flac"]);

function getFileType(filename) {
	const ext = path.extname(filename).toLowerCase();
	if (IMAGE_EXTS.has(ext)) {
		return "image";
	}
	if (VIDEO_EXTS.has(ext)) {
		return "video";
	}
	if (DOC_EXTS.has(ext)) {
		return "document";
	}
	if (AUDIO_EXTS.has(ext)) {
		return "audio";
	}
	return "other";
}

function formatBytes(bytes) {
	if (bytes === 0) {
		return "0 B";
	}
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}

function isMediaFile(type) {
	return type === "image" || type === "video";
}

function isAutoApprovedLabel(label) {
	return label === "SAFE" || label === "QUESTIONABLE";
}

async function runAIAnalysisOnFile(fullPath, docId) {
	if (!isAIAnalyticsEnabled()) {
		return;
	}
	try {
		const buffer = await fs.readFile(fullPath);
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
				moderation_status: autoApproved ? "auto_approved" : "pending_review",
			},
		});

		logInfo("AI Moderation scanned file", { filename, label, score });
	} catch (err) {
		logError("AI Moderation file scan failed", new Error(`${fullPath}: ${err.message}`));
	}
}

const SCAN_QUEUE = [];
let SCAN_RUNNING = false;
const MAX_CONCURRENT = 2;

async function processQueue() {
	while (SCAN_QUEUE.length > 0) {
		const batch = SCAN_QUEUE.splice(0, MAX_CONCURRENT);
		await Promise.all(
			batch.map(({ fullPath, docId }) =>
				runAIAnalysisOnFile(fullPath, docId).catch((err) =>
					logError("AI Moderation queue item failed", err),
				),
			),
		);
	}
	SCAN_RUNNING = false;
}

function enqueueScan(fullPath, docId) {
	SCAN_QUEUE.push({ fullPath, docId });
	if (!SCAN_RUNNING) {
		SCAN_RUNNING = true;
		processQueue().catch((err) => logError("AI Moderation queue processing failed", err));
	}
}

export async function scanAndAnalyzeExistingFiles() {
	if (!isAIAnalyticsEnabled()) {
		logInfo("AI Moderation skipping scan — AI_HARAM_ANALYTICS_ENABLED is false");
		return;
	}
	logInfo("AI Moderation scanning existing uploads for unanalyzed media...");
	try {
		const basePath = UPLOADS_ROOT;
		const subfolders = ["profile", "feed", "chat", "calls", "contracts", ""];

		for (const subfolder of subfolders) {
			const scanPath = subfolder ? path.join(basePath, subfolder) : basePath;
			try {
				const items = await fs.readdir(scanPath, { withFileTypes: true });
				for (const item of items) {
					if (item.isDirectory()) {
						continue;
					}
					const fullPath = path.join(scanPath, item.name);
					const type = getFileType(item.name);
					if (!isMediaFile(type)) {
						continue;
					}

					const existing = await prisma.document.findFirst({
						where: { file_path: { endsWith: item.name } },
					});

					const alreadyAnalyzed =
						existing?.ai_analyzed_at &&
						existing.ai_label &&
						!["PENDING", "ANALYZING"].includes(existing.ai_label);
					if (alreadyAnalyzed) {
						continue;
					}

					if (existing) {
						enqueueScan(fullPath, existing.id);
					} else {
						const docId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
						const publicUrl = `/uploads${subfolder ? `/${subfolder}` : ""}/${item.name}`;
						const entityType =
							subfolder === "feed"
								? "feed_media"
								: subfolder === "profile"
									? "profile_pic"
									: subfolder === "chat"
										? "chat_attachment"
										: subfolder === "calls"
											? "call_recording"
											: subfolder === "contracts"
												? "contract"
												: "uploads";

						const created = await prisma.document.create({
							data: {
								id: docId,
								uploaded_by: "system",
								entity_type: entityType,
								entity_id: item.name,
								file_path: publicUrl,
								type,
								moderation_status: "pending_review",
								ai_label: "ANALYZING",
								ai_score: 0,
							},
						});

						enqueueScan(fullPath, created.id);
					}
				}
			} catch {
				/* ignore folder */
			}
		}
		logInfo("AI Moderation scan queued. Waiting for analysis...");
	} catch (err) {
		logError("AI Moderation scan error", err);
	}
}

async function _getDocumentUsages(filename) {
	const usages = [];
	const normalizedName = filename.toLowerCase();
	try {
		const docs = await prisma.document.findMany({
			where: { file_path: { not: null } },
			select: {
				id: true,
				file_path: true,
				entity_type: true,
				entity_id: true,
				moderation_status: true,
			},
		});
		for (const doc of docs || []) {
			const docPath = doc.file_path || "";
			const docName = docPath.split("/").pop() || "";
			if (
				docName.toLowerCase().includes(normalizedName) ||
				normalizedName.includes(docName.toLowerCase())
			) {
				usages.push({
					entity_type: doc.entity_type,
					entity_id: doc.entity_id,
					doc_id: doc.id,
					moderation_status: doc.moderation_status,
				});
			}
		}
	} catch {
		/* ignore */
	}
	return usages;
}

async function _getProductUsages(filename) {
	const usages = [];
	const normalizedName = filename.toLowerCase();
	try {
		const products = await prisma.product.findMany({
			where: {
				OR: [
					{ image_urls: { not: null } },
					{ cover_image_url: { not: null } },
					{ video_url: { not: null } },
				],
			},
			select: {
				id: true,
				title: true,
				image_urls: true,
				cover_image_url: true,
				video_url: true,
			},
		});
		for (const product of products || []) {
			const images = Array.isArray(product.image_urls) ? product.image_urls : [];
			for (const img of images) {
				const imgName =
					(typeof img === "string" ? img : img.url || img.path || "").split("/").pop() || "";
				if (
					imgName.toLowerCase().includes(normalizedName) ||
					normalizedName.includes(imgName.toLowerCase())
				) {
					usages.push({
						entity_type: "product",
						entity_id: product.id,
						field: "images",
						title: product.title,
					});
				}
			}
			const coverName = (product.cover_image_url || "").split("/").pop() || "";
			if (
				coverName &&
				(coverName.toLowerCase().includes(normalizedName) ||
					normalizedName.includes(coverName.toLowerCase()))
			) {
				usages.push({
					entity_type: "product",
					entity_id: product.id,
					field: "cover_image_url",
					title: product.title,
				});
			}
			const vidName = (product.video_url || "").split("/").pop() || "";
			if (
				vidName &&
				(vidName.toLowerCase().includes(normalizedName) ||
					normalizedName.includes(vidName.toLowerCase()))
			) {
				usages.push({
					entity_type: "product",
					entity_id: product.id,
					field: "video_url",
					title: product.title,
				});
			}
		}
	} catch {
		/* ignore */
	}
	return usages;
}

async function _getUserAvatarUsages(filename) {
	const usages = [];
	const normalizedName = filename.toLowerCase();
	try {
		const users = await prisma.user.findMany({
			where: { profile: { not: null } },
			select: { id: true, name: true, profile: true },
		});
		for (const user of users || []) {
			const profile = user.profile || {};
			const avatar = profile.avatar || profile.avatar_url || "";
			const avatarName = avatar.split("/").pop() || "";
			if (
				avatarName &&
				(avatarName.toLowerCase().includes(normalizedName) ||
					normalizedName.includes(avatarName.toLowerCase()))
			) {
				usages.push({
					entity_type: "user",
					entity_id: user.id,
					field: "avatar",
					name: user.name,
				});
			}
		}
	} catch {
		/* ignore */
	}
	return usages;
}

async function _getFeedUsages(filename) {
	const usages = [];
	const normalizedName = filename.toLowerCase();
	try {
		const feeds = await prisma.feedPost.findMany({
			where: { media: { not: null } },
			select: { id: true, title: true, media: true },
		});
		for (const post of feeds || []) {
			const media = Array.isArray(post.media) ? post.media : [];
			for (const m of media) {
				const mName = (typeof m === "string" ? m : m.url || m.path || "").split("/").pop() || "";
				if (
					mName.toLowerCase().includes(normalizedName) ||
					normalizedName.includes(mName.toLowerCase())
				) {
					usages.push({
						entity_type: "feed_post",
						entity_id: post.id,
						title: post.title,
					});
				}
			}
		}
	} catch {
		/* ignore */
	}
	return usages;
}

async function _getChatUsages(filename) {
	const usages = [];
	const normalizedName = filename.toLowerCase();
	try {
		const messages = await prisma.message.findMany({
			where: { attachment: { not: null } },
			select: { id: true, match_id: true, attachment: true },
			take: 1000,
		});
		for (const msg of messages || []) {
			const attachments = Array.isArray(msg.attachment)
				? msg.attachment
				: [msg.attachment].filter(Boolean);
			for (const att of attachments) {
				const attName =
					(typeof att === "string" ? att : att.url || att.path || "").split("/").pop() || "";
				if (
					attName &&
					(attName.toLowerCase().includes(normalizedName) ||
						normalizedName.includes(attName.toLowerCase()))
				) {
					usages.push({
						entity_type: "message",
						entity_id: msg.id,
						thread_id: msg.match_id,
					});
				}
			}
		}
	} catch {
		/* ignore */
	}
	return usages;
}

async function _getCallUsages(filename) {
	const usages = [];
	const normalizedName = filename.toLowerCase();
	try {
		const calls = await prisma.callSession.findMany({
			where: { recording_url: { not: null } },
			select: { id: true, title: true, recording_url: true },
		});
		for (const call of calls || []) {
			const recName = (call.recording_url || "").split("/").pop() || "";
			if (
				recName &&
				(recName.toLowerCase().includes(normalizedName) ||
					normalizedName.includes(recName.toLowerCase()))
			) {
				usages.push({
					entity_type: "call_session",
					entity_id: call.id,
					title: call.title,
				});
			}
		}
	} catch {
		/* ignore */
	}
	return usages;
}

async function _getContractUsages(filename) {
	const usages = [];
	const normalizedName = filename.toLowerCase();
	try {
		const contracts = await prisma.document.findMany({
			where: {
				entity_type: "contract",
				OR: [{ artifact: { not: null } }],
			},
			select: { id: true, title: true, artifact: true },
		});
		for (const contract of contracts || []) {
			const pdfPath = contract.artifact?.pdf_path || "";
			const pdfName = pdfPath.split("/").pop() || "";
			if (
				pdfName &&
				(pdfName.toLowerCase().includes(normalizedName) ||
					normalizedName.includes(pdfName.toLowerCase()))
			) {
				usages.push({
					entity_type: "contract",
					entity_id: contract.id,
					title: contract.title,
				});
			}
		}
	} catch {
		/* ignore */
	}
	return usages;
}

function getFolderCategory(relativePath) {
	const parts = relativePath.split(path.sep);
	if (parts.length === 1) {
		return "root";
	}
	const subfolder = parts[0];
	const catMap = {
		profile: "profile",
		chat: "chat",
		feed: "feed",
		calls: "calls",
		contracts: "contracts",
	};
	return catMap[subfolder] || "other";
}

async function scanFolder(folderPath, basePath) {
	const entries = [];
	try {
		const items = await fs.readdir(folderPath, { withFileTypes: true });
		for (const item of items) {
			const fullPath = path.join(folderPath, item.name);
			if (item.isDirectory()) {
				const sub = await scanFolder(fullPath, basePath);
				entries.push(...sub);
			} else if (item.isFile()) {
				try {
					const stat = await fs.stat(fullPath);
					const relative = path.relative(basePath, fullPath);
					const category = getFolderCategory(relative);
					entries.push({
						filename: item.name,
						path: `/${relative.replace(/\\/g, "/")}`,
						size: stat.size,
						size_formatted: formatBytes(stat.size),
						created: stat.birthtime.toISOString(),
						modified: stat.mtime.toISOString(),
						type: getFileType(item.name),
						category,
					});
				} catch {
					/* ignore file stat errors */
				}
			}
		}
	} catch {
		/* ignore folder scan errors */
	}
	return entries;
}

export async function getUploadsListing(folderFilter = "all") {
	const basePath = UPLOADS_ROOT;
	const allFiles = [];

	try {
		const exists = await fs
			.access(basePath)
			.then(() => true)
			.catch(() => false);
		if (!exists) {
			await fs.mkdir(basePath, { recursive: true });
		}

		const scanOptions =
			folderFilter === "all" || folderFilter === null
				? Object.values(FOLDER_CONFIG)
						.map((c) => c.folder)
						.filter(Boolean)
				: [FOLDER_CONFIG[folderFilter]?.folder].filter(Boolean);

		for (const subfolder of scanOptions) {
			const scanPath = subfolder ? path.join(basePath, subfolder) : basePath;
			const files = await scanFolder(scanPath, basePath);
			allFiles.push(...files);
		}
	} catch {
		/* ignore scan errors */
	}

	allFiles.sort((a, b) => new Date(b.modified) - new Date(a.modified));

	return { files: allFiles, total: allFiles.length };
}

export async function deleteUploadFile(filePath) {
	const fullPath = path.join(UPLOADS_ROOT, filePath.replace(/^\//, "").replace(/\//g, path.sep));
	try {
		await fs.unlink(fullPath);
		return { ok: true };
	} catch (err) {
		return { error: err.message };
	}
}

export async function getUploadsStats() {
	const { files: allFiles } = await getUploadsListing("all", 0, 10_000);
	const byCategory = {};
	let totalSize = 0;

	for (const file of allFiles) {
		byCategory[file.category] = (byCategory[file.category] || 0) + 1;
		totalSize += file.size;
	}

	return {
		total_files: allFiles.length,
		total_size: totalSize,
		total_size_formatted: formatBytes(totalSize),
		by_category: byCategory,
		by_type: allFiles.reduce((acc, f) => {
			acc[f.type] = (acc[f.type] || 0) + 1;
			return acc;
		}, {}),
	};
}

export { FOLDER_CONFIG, formatBytes };
