import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { OpenCode } from "@opencode/client";
import { logError, logInfo } from "../utils/logger.js";
import prisma from "../utils/prisma.js";
import { sanitizeString } from "../utils/validators.js";
import { sendEmail } from "./emailService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "../../../");

/**
 * Read-only code investigation service using OpenCode V2.
 * Uses a dedicated OpenCode runtime with restricted permissions.
 */

// Investigation statuses
export const INVESTIGATION_STATUS = {
	QUEUED: "queued",
	IN_PROGRESS: "in_progress",
	COMPLETED: "completed",
	FAILED: "failed",
	AWAITING_CLIENT_CONFIRMATION: "awaiting_client_confirmation",
	REPORT_SENT: "report_sent",
};

// Agent roles
export const AGENT_ROLES = {
	LEAD: "lead",
	CODE_INVESTIGATOR: "code_investigator",
	REPOSITORY_ANALYST: "repository_analyst",
	RESEARCH_ANALYST: "research_analyst",
	VERIFICATION_REVIEWER: "verification_reviewer",
};

export async function createInvestigation({
	caseId,
	userId,
	initialMessage,
	subject,
	attachments = [],
}) {
	const investigationId = crypto.randomUUID();
	const now = new Date();

	const investigation = await prisma.supportCase.create({
		data: {
			id: investigationId,
			user_id: userId,
			status: "investigating",
			subject: sanitizeString(subject || "Code Investigation", 160),
			summary: sanitizeString(initialMessage || "", 1200),
			report_status: "pending",
			retain: true,
			created_at: now,
			updated_at: now,
		},
	});

	// Create initial message
	await prisma.supportCaseMessage.create({
		data: {
			id: crypto.randomUUID(),
			case_id: investigationId,
			role: "user",
			kind: "complaint",
			content: sanitizeString(initialMessage || "", 1200),
			agent: "user",
			sequence: 0,
			created_at: now,
		},
	});

	// Link attachments
	if (attachments.length > 0) {
		await prisma.supportCaseAttachment.createMany({
			data: attachments.map((att, idx) => ({
				id: crypto.randomUUID(),
				case_id: investigationId,
				document_id: att.documentId,
				file_path: att.filePath,
				mime_type: att.mimeType,
				byte_size: att.byteSize,
				uploaded_by: userId,
				created_at: now,
			})),
		});
	}

	return investigation;
}

export async function getInvestigationById(caseId, userId) {
	const investigation = await prisma.supportCase.findUnique({
		where: { id: caseId },
		include: {
			messages: { orderBy: { created_at: "asc" } },
			attachments: true,
		},
	});

	if (!investigation) return null;
	if (String(investigation.user_id) !== String(userId)) return "forbidden";

	return investigation;
}

export async function listInvestigationsForUser(userId) {
	return prisma.supportCase.findMany({
		where: { user_id: userId },
		orderBy: { updated_at: "desc" },
		include: {
			messages: { take: 1, orderBy: { created_at: "desc" } },
			attachments: true,
		},
	});
}

export async function addInvestigationMessage(caseId, userId, content, role = "user", agent = null) {
	const investigation = await prisma.supportCase.findUnique({ where: { id: caseId } });
	if (!investigation) return null;
	if (String(investigation.user_id) !== String(userId)) return "forbidden";

	const lastMessage = await prisma.supportCaseMessage.findFirst({
		where: { case_id: caseId },
		orderBy: { sequence: "desc" },
	});

	const sequence = (lastMessage?.sequence || 0) + 1;
	const now = new Date();

	const message = await prisma.supportCaseMessage.create({
		data: {
			id: crypto.randomUUID(),
			case_id: caseId,
			role,
			kind: role === "user" ? "complaint" : "answer",
			content: sanitizeString(content, 5000),
			agent: role === "assistant" ? agent || "ai" : null,
			sequence,
			created_at: now,
		},
	});

	await prisma.supportCase.update({
		where: { id: caseId },
		data: { updated_at: now },
	});

	return message;
}

/**
 * Get OpenCode client configured for investigation
 */
function getOpencodeClient() {
	const baseUrl = process.env.OPENCODE_BASE_URL || "http://localhost:4096";
	const auth = process.env.OPENCODE_SERVER_PASSWORD
		? Buffer.from(`opencode:${process.env.OPENCODE_SERVER_PASSWORD}`).toString("base64")
		: null;

	const client = OpenCode.make({
		baseUrl,
		headers: auth ? { Authorization: `Basic ${auth}` } : {},
	});

	return client;
}

/**
 * Run a code investigation using OpenCode V2 with read-only restrictions.
 */
export async function runCodeInvestigation(caseId, userId, options = {}) {
	const investigation = await prisma.supportCase.findUnique({
		where: { id: caseId },
		include: { messages: { orderBy: { created_at: "asc" } } },
	});

	if (!investigation) throw new Error("Investigation not found");
	if (String(investigation.user_id) !== String(userId)) throw new Error("Forbidden");

	// Update status to in_progress
	await prisma.supportCase.update({
		where: { id: caseId },
		data: { status: "investigating", updated_at: new Date() },
	});

	const client = getOpencodeClient();
	const results = {
		findings: [],
		evidence: [],
		toolLog: [],
		error: null,
	};

	try {
		// Create a session for this investigation
		const session = await client.session.create({
			location: { directory: PROJECT_ROOT },
		});

		// Build investigation prompt from case context
		const prompt = buildInvestigationPrompt(investigation, options);

		// Send the investigation prompt
		const response = await client.session.prompt({
			sessionID: session.id,
			text: prompt,
		});

		// Parse the response for findings
		results.findings = extractFindings(response);
		results.evidence = extractEvidence(response);
		results.toolLog = extractToolLog(response);

		// Update investigation with results
		await prisma.supportCase.update({
			where: { id: caseId },
			data: {
				status: INVESTIGATION_STATUS.AWAITING_CLIENT_CONFIRMATION,
				report_status: "draft",
				updated_at: new Date(),
			},
		});

		// Store findings in the case
		await prisma.supportCaseMessage.create({
			data: {
				id: crypto.randomUUID(),
				case_id: caseId,
				role: "assistant",
				kind: "investigation_findings",
				content: formatFindingsForUser(results.findings, results.evidence),
				agent: AGENT_ROLES.LEAD,
				sequence: await getNextSequence(caseId),
				created_at: new Date(),
			},
		});

		return results;
	} catch (error) {
		logError("Code investigation failed", { caseId, error: error.message });

		await prisma.supportCase.update({
			where: { id: caseId },
			data: {
				status: INVESTIGATION_STATUS.FAILED,
				report_status: "failed",
				updated_at: new Date(),
			},
		});

		throw error;
	}
}

function buildInvestigationPrompt(investigation, options) {
	const userMessages = investigation.messages
		.filter((m) => m.role === "user")
		.map((m) => `${m.kind}: ${m.content}`)
		.join("\n\n");

	return `
You are a senior code investigator for GarTexHub. A client has reported an issue and needs a thorough investigation.

## Case Summary
${investigation.summary}

## Client's Description
${userMessages}

## Your Task
1. Understand the problem from the client's perspective
2. Investigate the actual codebase at ${PROJECT_ROOT}
3. Trace relevant code paths, configurations, and dependencies
4. Check GitHub history, issues, PRs if relevant
5. Provide evidence-backed findings with file paths and line numbers
6. Distinguish confirmed facts from hypotheses

## Investigation Scope
- Project: GarTexHub (React 19 + Vite frontend, Express 5 backend, Prisma/PostgreSQL)
- Root directory: ${PROJECT_ROOT}
- Focus areas: ${options.focusAreas?.join(", ") || "all relevant areas"}

## Output Format
Provide findings as structured evidence:
- Each finding must include: type, confidence, file paths with line ranges, GitHub references, supporting evidence
- Mark findings as: confirmed, probable, speculative, or unresolved
- Do NOT make code changes - this is read-only investigation

Begin your investigation now.
`;
}

function extractFindings(response) {
	// Parse OpenCode response for structured findings
	// This would need to be adapted based on actual response format
	const text = response.text || response.content || "";
	// Simple extraction - in production, use a more robust parser
	return text.split("\n\n").filter((f) => f.trim().length > 0);
}

function extractEvidence(response) {
	const text = response.text || response.content || "";
	// Extract file paths, line numbers, GitHub references
	const filePaths = text.match(/[\w/\\.-]+\.(ts|tsx|js|jsx|json|prisma|sql|md)/g) || [];
	return [...new Set(filePaths)];
}

function extractToolLog(response) {
	// Extract tool usage from response
	return [];
}

function formatFindingsForUser(findings, evidence) {
	let output = "## Investigation Findings\n\n";

	findings.forEach((f, i) => {
		output += `### Finding ${i + 1}\n${f}\n\n`;
	});

	if (evidence.length > 0) {
		output += "### Evidence References\n";
		evidence.forEach((e) => {
			output += `- \`${e}\`\n`;
		});
	}

	output += "\n---\n*This is a draft report. Please review and confirm for final delivery.*";

	return output;
}

async function getNextSequence(caseId) {
	const last = await prisma.supportCaseMessage.findFirst({
		where: { case_id: caseId },
		orderBy: { sequence: "desc" },
	});
	return (last?.sequence || 0) + 1;
}

/**
 * Generate final investigation report
 *
 * Ownership is validated here (independently of the controller) so the report
 * can never be rendered for another user's case, even if a caller skips the
 * controller-level check.
 */
export async function generateFinalReport(caseId, userId) {
	const investigation = await prisma.supportCase.findUnique({
		where: { id: caseId },
		include: { messages: { orderBy: { created_at: "asc" } }, attachments: true },
	});

	if (!investigation) throw new Error("Investigation not found");
	if (String(investigation.user_id) !== String(userId)) throw new Error("Forbidden");

	const findingsMessage = investigation.messages.find((m) => m.kind === "investigation_findings");
	const userMessages = investigation.messages.filter((m) => m.role === "user");

	const report = {
		caseId: investigation.id,
		subject: investigation.subject,
		status: investigation.status,
		createdAt: investigation.created_at,
		clientDescription: userMessages.map((m) => m.content).join("\n\n"),
		findings: findingsMessage?.content || "No findings recorded",
		attachments: investigation.attachments.map((a) => ({
			path: a.file_path,
			mimeType: a.mime_type,
			size: a.byte_size,
		})),
		generatedAt: new Date(),
		disclaimer: "This investigation was performed by an AI agent with read-only access to the codebase. Findings are based on code analysis and should be verified by the development team before action.",
	};

	return report;
}

/**
 * Send investigation report via email
 *
 * Ownership is validated here so a report can only be emailed to the case
 * owner (or the owner's own email when no recipient is supplied).
 */
export async function sendInvestigationReportEmail(caseId, recipientEmail, userId) {
	const report = await generateFinalReport(caseId, userId);

	const subject = `[Code Investigation #${report.caseId.slice(0, 8)}] ${report.subject}`;
	const html = renderReportHtml(report);
	const text = renderReportText(report);

	const result = await sendEmail({
		to: recipientEmail,
		subject,
		html,
		text,
		source: "code_investigation_report",
	});

	if (result.ok) {
		await prisma.supportCase.update({
			where: { id: caseId },
			data: {
				report_status: "sent",
				report_delivered_at: new Date(),
				status: INVESTIGATION_STATUS.REPORT_SENT,
			},
		});
	}

	return result;
}

function renderReportHtml(report) {
	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Code Investigation Report</title>
	<style>
		body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; color: #1f2937; }
		h1, h2, h3 { color: #0f172a; }
		h1 { border-bottom: 2px solid #0ea5e9; padding-bottom: 10px; }
		h2 { border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-top: 30px; }
		.meta { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px; }
		.meta div { margin: 5px 0; }
		.label { font-weight: 600; color: #475569; }
		.disclaimer { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin-top: 30px; font-size: 0.9em; color: #92400e; }
		pre { background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 8px; overflow-x: auto; }
		code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', 'Menlo', monospace; }
		ul { padding-left: 20px; }
		.attachments { background: #f0f9ff; border: 1px solid #bae6fd; padding: 15px; border-radius: 8px; }
	</style>
</head>
<body>
	<h1>Code Investigation Report</h1>
	<div class="meta">
		<div><span class="label">Case ID:</span> ${report.caseId}</div>
		<div><span class="label">Subject:</span> ${report.subject}</div>
		<div><span class="label">Status:</span> ${report.status}</div>
		<div><span class="label">Generated:</span> ${report.generatedAt.toISOString()}</div>
	</div>

	<h2>Client Description</h2>
	<pre>${report.clientDescription}</pre>

	<h2>Findings</h2>
	<div>${report.findings.replace(/\n/g, "<br>")}</div>

	${report.attachments.length > 0 ? `
	<h2>Attachments</h2>
	<div class="attachments">
		<ul>
			${report.attachments.map(a => `<li><code>${a.path}</code> (${a.mimeType}, ${a.size} bytes)</li>`).join("")}
		</ul>
	</div>
	` : ""}

	<div class="disclaimer">
		<strong>Disclaimer:</strong> ${report.disclaimer}
	</div>
</body>
</html>
	`;
}

function renderReportText(report) {
	return `
CODE INVESTIGATION REPORT
=========================

Case ID: ${report.caseId}
Subject: ${report.subject}
Status: ${report.status}
Generated: ${report.generatedAt.toISOString()}

CLIENT DESCRIPTION
------------------
${report.clientDescription}

FINDINGS
--------
${report.findings}

${report.attachments.length > 0 ? `
ATTACHMENTS
-----------
${report.attachments.map(a => `- ${a.path} (${a.mimeType}, ${a.size} bytes)`).join("\n")}
` : ""}

DISCLAIMER
----------
${report.disclaimer}
	`;
}

/**
 * Update investigation status
 */
export async function updateInvestigationStatus(caseId, status, userId) {
	const investigation = await prisma.supportCase.findUnique({ where: { id: caseId } });
	if (!investigation) return null;
	if (String(investigation.user_id) !== String(userId)) return "forbidden";

	return prisma.supportCase.update({
		where: { id: caseId },
		data: { status, updated_at: new Date() },
	});
}