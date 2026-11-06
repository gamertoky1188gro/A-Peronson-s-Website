import { requireAuth } from "../middleware/auth.js";
import {
	addInvestigationMessage,
	createInvestigation,
	generateFinalReport,
	getInvestigationById,
	INVESTIGATION_STATUS,
	listInvestigationsForUser,
	runCodeInvestigation,
	sendInvestigationReportEmail,
	updateInvestigationStatus,
} from "../services/codeInvestigationService.js";
import { PRIVATE_ENTITY_TYPE, recordPrivateUpload } from "../services/privateDocumentService.js";
import prisma from "../utils/prisma.js";
import { sanitizeString } from "../utils/validators.js";

const ALLOWED_STATUSES = new Set([
	INVESTIGATION_STATUS.QUEUED,
	INVESTIGATION_STATUS.IN_PROGRESS,
	INVESTIGATION_STATUS.COMPLETED,
	INVESTIGATION_STATUS.FAILED,
	INVESTIGATION_STATUS.AWAITING_CLIENT_CONFIRMATION,
	INVESTIGATION_STATUS.REPORT_SENT,
]);

/**
 * Create a new code investigation case
 */
export async function createCodeInvestigation(req, res) {
	const userId = req.user.id;
	const { subject, description, focusAreas } = req.body;

	if (!subject || !description) {
		return res.status(400).json({ error: "Subject and description are required" });
	}

	// Create the investigation case first. This anchors ownership (user_id) and
	// produces the case id that upload rows are authorized against. A file has
	// no authorization row until it is written to disk, so anchoring must happen
	// after the case exists.
	const investigation = await createInvestigation({
		caseId: crypto.randomUUID(),
		userId,
		initialMessage: description,
		subject: sanitizeString(subject, 160),
		attachments: [],
	});

	// Anchor any uploaded files under the gated `support/` prefix and attach
	// them to the case. `upload.array` populates req.files; when no files are
	// sent it is an empty array.
	const files = req.files || [];
	const attachments = [];
	for (const file of files) {
		const filePath = `/uploads/support/${file.filename}`;
		const row = await recordPrivateUpload({
			entityType: PRIVATE_ENTITY_TYPE.SUPPORT_CASE,
			entityId: investigation.id,
			filePath,
			uploadedBy: userId,
			type: "other",
		});
		if (!row) {
			// The bytes are on disk but could not be authorized: do not surface a
			// path the client can never read. Skip the attachment rather than
			// pretending it is reachable.
			continue;
		}
		await prisma.supportCaseAttachment.create({
			data: {
				id: crypto.randomUUID(),
				case_id: investigation.id,
				document_id: row.id,
				file_path: filePath,
				mime_type: file.mimetype,
				byte_size: file.size,
				uploaded_by: userId,
				created_at: new Date(),
			},
		});
		attachments.push({
			documentId: row.id,
			filePath,
			mimeType: file.mimetype,
			byteSize: file.size,
		});
	}

	return res.status(201).json({ investigation, attachments });
}

/**
 * List all investigations for the current user
 */
export async function listMyInvestigations(req, res) {
	const userId = req.user.id;
	const investigations = await listInvestigationsForUser(userId);
	return res.json({ items: investigations });
}

/**
 * Get a specific investigation with all messages
 */
export async function getInvestigation(req, res) {
	const userId = req.user.id;
	const caseId = sanitizeString(req.params.caseId || "", 120);

	if (!caseId) {
		return res.status(400).json({ error: "Case ID is required" });
	}

	const investigation = await getInvestigationById(caseId, userId);
	if (!investigation) {
		return res.status(404).json({ error: "Investigation not found" });
	}
	if (investigation === "forbidden") {
		return res.status(403).json({ error: "Forbidden" });
	}

	return res.json({ investigation });
}

/**
 * Add a message to an investigation (client follow-up)
 */
export async function addMessage(req, res) {
	const userId = req.user.id;
	const caseId = sanitizeString(req.params.caseId || "", 120);
	const { content } = req.body;

	if (!caseId || !content) {
		return res.status(400).json({ error: "Case ID and content are required" });
	}

	const message = await addInvestigationMessage(caseId, userId, content);
	if (!message) {
		return res.status(404).json({ error: "Investigation not found" });
	}
	if (message === "forbidden") {
		return res.status(403).json({ error: "Forbidden" });
	}

	return res.status(201).json({ message });
}

/**
 * Start the AI investigation
 */
export async function startInvestigation(req, res) {
	const userId = req.user.id;
	const caseId = sanitizeString(req.params.caseId || "", 120);
	const { focusAreas } = req.body;

	if (!caseId) {
		return res.status(400).json({ error: "Case ID is required" });
	}

	try {
		const results = await runCodeInvestigation(caseId, userId, { focusAreas });
		return res.json({ results });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

/**
 * Get the draft report for review
 */
export async function getDraftReport(req, res) {
	const userId = req.user.id;
	const caseId = sanitizeString(req.params.caseId || "", 120);

	if (!caseId) {
		return res.status(400).json({ error: "Case ID is required" });
	}

	const investigation = await getInvestigationById(caseId, userId);
	if (!investigation) {
		return res.status(404).json({ error: "Investigation not found" });
	}
	if (investigation === "forbidden") {
		return res.status(403).json({ error: "Forbidden" });
	}

	const report = await generateFinalReport(caseId, userId);
	return res.json({ report });
}

/**
 * Confirm and send the final report
 */
export async function confirmAndSendReport(req, res) {
	const userId = req.user.id;
	const caseId = sanitizeString(req.params.caseId || "", 120);
	const { recipientEmail } = req.body;

	if (!caseId) {
		return res.status(400).json({ error: "Case ID is required" });
	}

	const investigation = await getInvestigationById(caseId, userId);
	if (!investigation) {
		return res.status(404).json({ error: "Investigation not found" });
	}
	if (investigation === "forbidden") {
		return res.status(403).json({ error: "Forbidden" });
	}

	const email = sanitizeString(recipientEmail || req.user.email || "", 200);
	if (!email) {
		return res.status(400).json({ error: "No recipient email provided" });
	}

	try {
		const result = await sendInvestigationReportEmail(caseId, email, userId);
		return res.json({ result });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

/**
 * Update investigation status
 */
export async function updateStatus(req, res) {
	const userId = req.user.id;
	const caseId = sanitizeString(req.params.caseId || "", 120);
	const { status } = req.body;

	if (!caseId || !status) {
		return res.status(400).json({ error: "Case ID and status are required" });
	}

	if (!ALLOWED_STATUSES.has(String(status))) {
		return res.status(400).json({ error: "Invalid status" });
	}

	const result = await updateInvestigationStatus(caseId, String(status), userId);
	if (!result) {
		return res.status(404).json({ error: "Investigation not found" });
	}
	if (result === "forbidden") {
		return res.status(403).json({ error: "Forbidden" });
	}

	return res.json({ investigation: result });
}
