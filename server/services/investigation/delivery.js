// Delivery of the support investigation report, and the escalation that must
// NOT wait for it.
//
// This file exists for one reason: the case has to record the SERVER'S
// verdict, never the mail provider's optimism. `emailService.sendEmail`
// answers `{ ok: false, status: "logged_no_gmail" }` when it could only log
// the message instead of sending it, and a case that says "sent" for that is
// a lie the admin console would repeat back to a client. So every path in
// here ends in exactly one of two recorded states - "sent" or "failed" - and
// "sent" is written ONLY when sendEmail itself said ok.
//
// The two exports are deliberately independent. `deliverReport` is the mail
// path; `escalateIfNeeded` is the urgent path. A confirmed data-loss finding
// must reach the owners even when the mail provider is broken, so the
// escalation never reads the email result and the email never reads the
// escalation. The orchestrator calls both, in whatever order it likes.

import MarkdownIt from "markdown-it";
import { logError, logInfo, logWarn } from "../../utils/logger.js";
import prisma from "../../utils/prisma.js";
import { escapeHtml, sanitizeString } from "../../utils/validators.js";
import { sendEmail } from "../emailService.js";
import { createNotification } from "../notificationService.js";
import { redactReportSecrets } from "./redaction.js";

// The plain-text body is what matters for plain-text clients: the full
// report lives in the HTML body as <pre>, so the text body carries only a
// header and a short summary.

// How long the summary may get before it is cut short.
const SUMMARY_MAX_CHARS = 280;

// The longest subject emailService accepts.
const SUBJECT_MAX_CHARS = 200;

// The longest finding detail kept in the notification meta.
const DETAIL_MAX_CHARS = 500;

// Marks the mail in the email log / outbox.
const EMAIL_SOURCE = "support_investigation_report";

/**
 * The transport the investigation report is sent through.
 *
 * Override with INVESTIGATION_REPORT_EMAIL_PROVIDER - "gmail" (SMTP with an
 * App Password), "smtp" (the generic SMTP transport) or "gmail_api" (the
 * Gmail REST API). It is PINNED here so that changing the admin config's
 * provider, or the EMAIL_PROVIDER env override, cannot silently move the
 * report off the transport the owner chose for it.
 */
const REPORT_EMAIL_PROVIDER = String(
	process.env.INVESTIGATION_REPORT_EMAIL_PROVIDER || "gmail",
).toLowerCase();

// The notification type used for the in-app escalation ping.
const NOTIFICATION_TYPE = "support_case_escalated";

// The two recorded delivery states. There is no third one.
const STATUS_SENT = "sent";
const STATUS_FAILED = "failed";

// A base url with no scheme is not a url a mail client can open: it is a
// relative path. Render's `fromService: { property: host }` produces exactly
// that - a bare hostname - so the scheme is added back.

const OWNER_ADMIN_ROLES = ["owner", "admin"];

const LINE_BREAK_RE = /\r?\n/u;
const MARKDOWN_NOISE_RE = /[*_`>#]/gu;

// ---------------------------------------------------------------------------
// Recipients
// ---------------------------------------------------------------------------

/**
 * The owner/admin staff users.
 *
 * Same resolution as the ticket-created email (supportTicketService): the
 * `role in (owner, admin)` query. Returns [{ id, email }].
 *
 * @returns {Promise<Array<{id: string, email: string}>>}
 */
async function resolveStaffUsers() {
	const admins = await prisma.user.findMany({
		where: { role: { in: OWNER_ADMIN_ROLES } },
	});
	const rows = Array.isArray(admins) ? admins : [];
	const users = [];
	const seen = new Set();
	for (const row of rows) {
		const { id = "", email = "" } = row ?? {};
		const mail = String(email).trim();
		const key = mail.toLowerCase();
		if (id && mail && !seen.has(key)) {
			seen.add(key);
			users.push({ id: String(id), email: mail });
		}
	}
	return users;
}

/**
 * `ADMIN_OWNER_EMAILS` is the optional extra source of staff addresses named
 * by the design spec (section 10). It is not set in the deployed
 * configuration, so the recipient set is exactly the ticket-created email's
 * set: the owner/admin users found by the role query.
 *
 * @returns {string[]}
 */
function extraStaffEmails() {
	return String(process.env.ADMIN_OWNER_EMAILS || "")
		.split(",")
		.map((value) => value.trim())
		.filter(Boolean);
}

/**
 * The recipient email addresses for the report mail.
 *
 * @returns {Promise<string[]>}
 */
async function resolveRecipientEmails() {
	const staff = await resolveStaffUsers();
	const candidates = [...staff.map((user) => user.email), ...extraStaffEmails()];
	const emails = [];
	const seen = new Set();
	for (const candidate of candidates) {
		const mail = String(candidate || "").trim();
		const key = mail.toLowerCase();
		if (mail && !seen.has(key)) {
			seen.add(key);
			emails.push(mail);
		}
	}
	return emails;
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

/**
 * The first real paragraph of the Markdown report: no headings, no blank
 * lines in the middle, stopped as soon as it is long enough to be a summary.
 *
 * @param {string} markdown
 * @returns {string}
 */
function firstMeaningfulParagraph(markdown) {
	const lines = String(markdown || "").split(LINE_BREAK_RE);
	const collected = [];
	for (const line of lines) {
		const trimmed = line.trim();
		const isBlank = trimmed.length === 0;
		const isHeading = trimmed.startsWith("#");
		if (isBlank && collected.length > 0) {
			break;
		}
		if (!(isBlank || isHeading)) {
			collected.push(trimmed);
		}
		if (collected.join(" ").length >= SUMMARY_MAX_CHARS) {
			break;
		}
	}
	return collected.join(" ").replace(MARKDOWN_NOISE_RE, "").trim();
}

/**
 * The short summary that goes into the mail body.
 *
 * @param {Object} params
 * @param {Object} params.caseRow The SupportCase row.
 * @param {string} params.report The Markdown report.
 * @returns {string}
 */
function buildSummary({ caseRow, report }) {
	const fromCase = String(caseRow?.summary || "").trim();
	if (fromCase) {
		return fromCase;
	}
	return firstMeaningfulParagraph(report) || "Investigation report ready.";
}

/**
 * The plain-text body: a compact header and the report summary. The full
 * report itself lives in the HTML body as escaped <pre>, because emailService
 * caps the text part; HTML clients get everything, plain-text clients get
 * the same short digest.
 *
 * @param {Object} params
 * @returns {string}
 */
function buildPlainText({ caseRow, summary }) {
	const head = [
		"GarTexHub support investigation report",
		`Case: ${caseRow?.id || ""}`,
		caseRow?.subject ? `Subject: ${caseRow.subject}` : null,
		`Status: ${caseRow?.status || "unknown"}`,
		"",
		String(summary || "").trim(),
		"",
		"The full report is in this email; open the HTML part to read it.",
	]
		.filter((line) => line !== null)
		.join("\n");
	return head;
}

/**
 * The HTML variant. It carries the full REDACTED report, escaped and rendered
 * inline in a <pre> block — that's the whole artefact the client already
 * agreed the investigation could produce, sitting in the inbox like a
 * document they can read, not a link to a UI they may not reach.
 *
 * @param {Object} params
 * @returns {string}
 */
// One shared markdown renderer, configured for mail: html disabled (we
// escape anything the model emitted as raw tag text), linkify on,
// hard breaks off, typographer off so the report says exactly what
// the agent wrote.
const md = new MarkdownIt({ html: false, linkify: true, breaks: false, typographer: false });

function buildHtml({ caseRow, summary, report }) {
	const subjectLine = caseRow?.subject
		? `<p><strong>Subject:</strong> ${escapeHtml(String(caseRow.subject))}</p>`
		: "";
	const body = String(report || "").trim();
	const rendered = md.render(body);
	return [
		'<div style="font-family:Segoe UI,Arial,Helvetica,sans-serif;font-size:14px;color:#0f172a;max-width:920px">',
		"<style>",
		// Gmail strips most <style> rules but allows inline style on key elements, so rules are doubled with inline style where practical.
		"body { background:#f1f5f9; margin:0; padding:24px; }",
		".report h1 { font-size:24px; margin:0 0 12px; padding-bottom:8px; border-bottom:2px solid #1e293b; color:#0f172a; }",
		".report h2 { font-size:18px; margin:24px 0 10px; padding-bottom:6px; border-bottom:1px solid #cbd5e1; color:#1e293b; }",
		".report h3 { font-size:16px; margin:18px 0 8px; color:#1e293b; }",
		".report p { margin:0 0 12px; line-height:1.6; }",
		".report ul, .report ol { margin:0 0 12px 22px; line-height:1.6; }",
		".report li { margin:2px 0; }",
		".report code { background:#f1f5f9; padding:1px 5px; border-radius:4px; font-family:Consolas,Menlo,monospace; font-size:12px; }",
		".report pre { background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; overflow:auto; font-size:12px; line-height:1.5; }",
		".report pre code { background:transparent; padding:0; }",
		".report table { border-collapse:collapse; width:100%; margin:0 0 12px; font-size:13px; }",
		".report th, .report td { border:1px solid #e2e8f0; padding:6px 10px; text-align:left; vertical-align:top; }",
		".report th { background:#f8fafc; font-weight:700; }",
		".report strong { color:#0f172a; }",
		".report hr { border:none; border-top:1px solid #e2e8f0; margin:18px 0; }",
		".report a { color:#2563eb; }",
		".report blockquote { border-left:4px solid #cbd5e1; margin:0 0 12px 0; padding:4px 12px; color:#475569; background:#f8fafc; }",
		"</style>",
		'<h2 style="margin:0 0 12px">GarTexHub support investigation report</h2>',
		`<p><strong>Case:</strong> ${escapeHtml(String(caseRow?.id || ""))}</p>`,
		subjectLine,
		`<p><strong>Status:</strong> ${escapeHtml(String(caseRow?.status || "unknown"))}</p>`,
		summary
			? `<p style="background:#eff6ff;border:1px solid #bfdbfe;padding:10px 14px;border-radius:8px">${escapeHtml(String(summary))}</p>`
			: "",
		'<div class="report" style="background:#ffffff;border-radius:10px;padding:20px;box-shadow:0 1px 3px rgba(15,23,42,0.08)">',
		rendered,
		"</div>",
		"</div>",
	].join("");
}

/**
 * @param {Object} caseRow
 * @returns {string}
 */
function buildSubject(caseRow) {
	const subject = String(caseRow?.subject || "support case").trim();
	return sanitizeString(`[GarTexHub Support] Investigation report: ${subject}`, SUBJECT_MAX_CHARS);
}

// ---------------------------------------------------------------------------
// The verdict
// ---------------------------------------------------------------------------

/**
 * Turns the mail result into the server's own verdict.
 *
 * `res.ok === true` is the ONLY thing that can produce "sent". A status
 * string on its own is never enough: emailService returns
 * `{ ok: false, status: "logged_no_gmail" }` when it logged instead of
 * sending, and trusting that status would report a message nobody received
 * as delivered.
 *
 * @param {Object} res The value sendEmail resolved with.
 * @returns {{ok: boolean, status: string, error?: string}}
 */
function interpretSendResult(res) {
	if (res?.ok === true) {
		return { ok: true, status: STATUS_SENT };
	}
	const reason = String(res?.error || res?.status || "send_failed").trim() || "send_failed";
	return { ok: false, status: STATUS_FAILED, error: reason };
}

/**
 * Writes the verdict to the case. This is the only place report_status is
 * set, and it is written from the server's verdict - never from the mail
 * provider's status string.
 *
 * @param {string} caseId
 * @param {boolean} delivered
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
async function persistDelivery(caseId, delivered) {
	const now = new Date();
	try {
		await prisma.supportCase.update({
			where: { id: String(caseId) },
			data: {
				report_status: delivered ? STATUS_SENT : STATUS_FAILED,
				report_delivered_at: delivered ? now : null,
				updated_at: now,
			},
		});
		return { ok: true };
	} catch (error) {
		logError("support_report_delivery_status_write_failed", error);
		return { ok: false, error: error?.message || "status_write_failed" };
	}
}

/**
 * Sends the mail and turns the result into the server's verdict.
 *
 * @param {Object} params
 * @returns {Promise<{ok: boolean, status: string, error?: string}>}
 */
async function sendReportMail({ caseRow, text, html }) {
	try {
		const to = await resolveRecipientEmails();
		const result = await sendEmail({
			to,
			subject: buildSubject(caseRow),
			text,
			html,
			source: EMAIL_SOURCE,
			// The investigation report is PINNED to Gmail (SMTP with an App
			// Password). The other three email sources - ticket notifications,
			// lead reminders, admin actions - keep whatever transport the admin
			// config names, so pinning this one does not change the rest of
			// the app's mail.
			provider: REPORT_EMAIL_PROVIDER,
		});
		return interpretSendResult(result);
	} catch (error) {
		logError("support_report_delivery_send_failed", error);
		return {
			ok: false,
			status: STATUS_FAILED,
			error: String(error?.message || "send_failed"),
		};
	}
}

/**
 * Fires `support.case.report` on the realtime bus, if the bus exposes it.
 *
 * The emitter belongs to another workstream (contracts.md section 4), so it
 * is imported lazily and defensively: a missing emitter must never break
 * delivery.
 *
 * @param {string} caseId
 * @param {string} report
 * @param {string} reportStatus
 */
async function emitReportReady(caseId, report, reportStatus) {
	try {
		const bus = await import("../../realtime/realtimeBus.js");
		if (typeof bus?.emitCaseEvent === "function") {
			bus.emitCaseEvent(caseId, "support.case.report", { caseId, report, reportStatus });
		}
	} catch (error) {
		logWarn("support_report_event_skipped", { message: error?.message || "bus_unavailable" });
	}
}

// ---------------------------------------------------------------------------
// Escalation
// ---------------------------------------------------------------------------

// Finding classification (kind + severity) lives in ./classification.js so
// the report renderer can classify a finding without importing the mail
// stack. Re-exported here so this module's public API is unchanged.
import { classifyFinding, severityOf } from "./classification.js";

export { classifyFinding, severityOf };

/**
 * File a GitHub issue for every CONFIRMED security / data-loss finding.
 *
 * A confirmed finding cites file, lines and commit; filing it by hand is the
 * step where good investigations die. This files them through the GitHub REST
 * API with the SAME token the investigation runtime uses, so no new credential
 * is introduced.
 *
 * Fail-safe by design:
 *  - off unless GITHUB_SUPPORT_REPO (`owner/repo`) AND
 *    GITHUB_PERSONAL_ACCESS_TOKEN are both set - the deployed configuration
 *    does not set them, so this is opt-in for the owner;
 *  - one issue per finding, capped at GITHUB_ISSUES_MAX (default 3);
 *  - a failed issue is logged and skipped; it never delays or fails delivery.
 *
 * @param {string} caseId
 * @param {unknown} findings The final findings (array or wrapper).
 * @returns {Promise<{created: number, skipped: number}>}
 */
/**
 * Accepts the findings as an array, as the `{ summary, findings, limitations }`
 * wrapper the investigation row stores, or as a JSON string of either.
 *
 * @param {unknown} findings
 * @returns {Array<Object>}
 */
function normalizeFindings(findings) {
	if (Array.isArray(findings)) {
		return findings.filter((finding) => finding && typeof finding === "object");
	}
	if (typeof findings === "string") {
		try {
			return normalizeFindings(JSON.parse(findings));
		} catch {
			return [];
		}
	}
	if (findings && typeof findings === "object" && Array.isArray(findings.findings)) {
		return findings.findings.filter((finding) => finding && typeof finding === "object");
	}
	return [];
}

/**
 * The findings that must escalate: CONFIRMED, and a security or data-loss
 * issue. A confirmed finding of any other kind does not escalate.
 *
 * @param {unknown} findings
 * @returns {Array<{category: string, detail: string}>}
 */
function collectEscalationTriggers(findings) {
	const triggers = [];
	for (const finding of normalizeFindings(findings)) {
		const confidence = String(finding?.confidence || "").toLowerCase();
		const category = confidence === "confirmed" ? classifyFinding(finding) : null;
		if (category) {
			triggers.push({ category, detail: String(finding?.detail || "") });
		}
	}
	return triggers;
}

/**
 * Reads the case row, defensively: a missing delegate is not an error here.
 *
 * @param {string} caseId
 * @returns {Promise<Object|null>}
 */
async function readCase(caseId) {
	try {
		const row = await prisma.supportCase.findUnique({ where: { id: String(caseId) } });
		return row && typeof row === "object" ? row : null;
	} catch {
		return null;
	}
}

/**
 * Pings every owner/admin in-app. This is the notification the client sees
 * live (createNotification also emits on the realtime bus), so a confirmed
 * data-loss finding reaches the staff even when the mail never left the box.
 *
 * @param {Object} params
 */
async function notifyStaffOfEscalation({ caseId, category, detail, triggerCount, subject }) {
	const staff = await resolveStaffUsers();
	await Promise.all(
		staff.map((user) =>
			createNotification(user.id, {
				type: NOTIFICATION_TYPE,
				entity_type: "support_case",
				entity_id: caseId,
				message: `Escalated support case ${caseId}: confirmed ${category} finding`,
				meta: {
					case_id: caseId,
					subject: String(subject || ""),
					confidence: "confirmed",
					category,
					detail: sanitizeString(detail, DETAIL_MAX_CHARS),
					findings: triggerCount,
				},
			}).catch((error) => {
				logError("support_case_escalation_notification_failed", error);
			}),
		),
	);
	return staff.length;
}

/**
 * Ping every owner/admin in-app that a report is ready, with its delivery
 * verdict. This is the "report ready" notification — unlike escalation it
 * fires for EVERY case, not just security/data-loss ones, so the owner sees
 * a completed investigation even when there is nothing urgent in it.
 */
async function notifyStaffOfReportReady({ caseId, subject, summary, delivered }) {
	const staff = await resolveStaffUsers();
	await Promise.all(
		staff.map((user) =>
			createNotification(user.id, {
				type: "support_case_report_ready",
				entity_type: "support_case",
				entity_id: caseId,
				message: delivered
					? `Investigation report ready for case ${caseId}`
					: `Report generated but email delivery failed for case ${caseId}`,
				meta: {
					case_id: caseId,
					subject: String(subject || ""),
					summary: sanitizeString(summary, DETAIL_MAX_CHARS),
					delivered,
				},
			}).catch((error) => {
				logError("support_report_ready_notification_failed", error);
			}),
		),
	);
	return staff.length;
}

export async function deliverReport({ caseRow, report } = {}) {
	const caseId = String(caseRow?.id || "");
	if (!caseId) {
		logWarn("support_report_delivery_without_case", {});
		return { ok: false, status: STATUS_FAILED, error: "case_row_required" };
	}

	// Dedupe: if this case's report was already delivered, do not send again.
	// The mail path is idempotent - a re-run must not duplicate the report in
	// the owner's inbox.
	if (String(caseRow?.report_status || "").toLowerCase() === STATUS_SENT) {
		logInfo("support_report_delivery_dedupe", { case_id: caseId });
		return { ok: true, status: STATUS_SENT };
	}

	// The report is redacted BEFORE anything reads it. The investigators can
	// read the whole repository, and the repository holds credentials, so a
	// report that quotes one would carry it into the database, into the
	// owner's inbox and into the client's browser.
	const safeReport = redactReportSecrets(String(report || ""));
	const summary = redactReportSecrets(buildSummary({ caseRow, report: safeReport }));
	const text = buildPlainText({ caseRow, summary });
	const html = buildHtml({ caseRow, summary, report: safeReport });

	const outcome = await sendReportMail({ caseRow, text, html });
	const persisted = await persistDelivery(caseId, outcome.ok);
	const errors = [outcome.error, persisted.ok ? null : `status_not_recorded: ${persisted.error}`]
		.filter(Boolean)
		.join("; ");

	// The report event is fired BEFORE the success check, and it carries the
	// delivery verdict either way. The report body is a shared artefact: the
	// client is waiting for it, and a mail provider that is down does not
	// make the report stop existing. Emitting it only on the success path
	// left the client waiting forever for a report the server had already
	// written down.
	const reportStatus = outcome.ok ? STATUS_SENT : STATUS_FAILED;
	await emitReportReady(caseId, safeReport, reportStatus);
	// In-app "report ready" ping for the owner/admin, independent of mail.
	await notifyStaffOfReportReady({
		caseId,
		subject: caseRow?.subject,
		summary,
		delivered: outcome.ok,
	});

	if (!outcome.ok) {
		logWarn("support_report_delivery_failed", {
			case_id: caseId,
			reason: outcome.error,
			report_status: STATUS_FAILED,
		});
		return { ok: false, status: STATUS_FAILED, error: errors || outcome.error };
	}

	if (!persisted.ok) {
		// The mail went out but the verdict could not be written down. The
		// case therefore does NOT know it was delivered, so this is reported
		// as a failure rather than as a success.
		logError("support_report_delivery_unrecorded", new Error(persisted.error));
		return { ok: false, status: STATUS_FAILED, error: errors };
	}

	logInfo("support_report_delivered", {
		case_id: caseId,
		report_status: STATUS_SENT,
		body_length: text.length,
	});
	return { ok: true, status: STATUS_SENT };
}

/**
 * Escalates a case when a CONFIRMED finding is a security or data-loss
 * issue.
 *
 * This path is independent of the mail path on purpose: a confirmed
 * data-loss finding must not be delayed by (or swallowed by) a mail failure.
 * It flags the case and pings every owner/admin in-app, and it returns true
 * only when it escalated.
 *
 * A confirmed finding that is neither a security nor a data-loss issue does
 * NOT escalate automatically - it stays in the report and the admin console
 * like any other finding.
 *
 * @param {string} caseId
 * @param {unknown} findings The findings array (or the investigation's findings wrapper).
 * @returns {Promise<boolean>}
 */
export async function escalateIfNeeded(caseId, findings) {
	const id = String(caseId || "");
	if (!id) {
		logWarn("support_escalation_without_case", {});
		return false;
	}

	const triggers = collectEscalationTriggers(findings);
	if (triggers.length === 0) {
		return false;
	}

	const existing = await readCase(id);
	if (existing?.escalated === true) {
		logInfo("support_case_already_escalated", { case_id: id });
		return true;
	}

	const { category, detail } = triggers[0];
	try {
		await prisma.supportCase.update({
			where: { id },
			data: { escalated: true, updated_at: new Date() },
		});
	} catch (error) {
		logError("support_case_escalation_persist_failed", error);
		return false;
	}

	const notified = await notifyStaffOfEscalation({
		caseId: id,
		category,
		detail,
		triggerCount: triggers.length,
		subject: existing?.subject,
	});

	logInfo("support_case_escalated", { case_id: id, category, notified });
	return true;
}

export async function createGitHubIssuesForFindings(caseId, findings) {
	const token = String(process.env.GITHUB_PERSONAL_ACCESS_TOKEN || "").trim();
	const repo = String(process.env.GITHUB_SUPPORT_REPO || "").trim();
	if (!(token && repo)) {
		return { created: 0, skipped: 0 };
	}

	const maxIssues = Number.parseInt(process.env.GITHUB_ISSUES_MAX ?? "", 10);
	const triggers = collectEscalationTriggers(findings).slice(
		0,
		Number.isFinite(maxIssues) && maxIssues > 0 ? maxIssues : 3,
	);
	if (triggers.length === 0) {
		return { created: 0, skipped: 0 };
	}

	let created = 0;
	let skipped = 0;
	for (const trigger of triggers) {
		const severity = severityOf({ confidence: "confirmed", detail: trigger.detail });
		const title = sanitizeString(`[GarTexHub support] ${severity}: ${trigger.detail}`, 200);
		const body = [
			`Filed automatically from GarTexHub support case \`${caseId}\`.`,
			"",
			`**Severity:** ${severity}`,
			`**Category:** ${trigger.category}`,
			"",
			trigger.detail,
			"",
			"_This issue was created by the AI support investigation. Verify the cited evidence before acting._",
		].join("\n");
		try {
			const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/vnd.github+json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ title, body, labels: ["support-investigation", severity] }),
			});
			if (response.ok) {
				created += 1;
			} else {
				skipped += 1;
				logWarn("support_finding_issue_create_failed", {
					case_id: caseId,
					status: response.status,
				});
			}
		} catch (error) {
			skipped += 1;
			logWarn("support_finding_issue_create_error", {
				case_id: caseId,
				error: error?.message || String(error),
			});
		}
	}
	if (created > 0) {
		logInfo("support_findings_filed_as_issues", { case_id: caseId, created, skipped });
	}
	return { created, skipped };
}
