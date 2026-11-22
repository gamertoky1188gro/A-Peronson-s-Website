import crypto from "node:crypto";
import { logError, logInfo, logWarn } from "../utils/logger.js";
import prisma from "../utils/prisma.js";
import { sanitizeString } from "../utils/validators.js";
import { getAdminConfig } from "./adminConfigService.js";

function isConfigured(value) {
	return Boolean(String(value || "").trim());
}

export function isSmtpConfigured() {
	return isConfigured(process.env.SMTP_HOST) && isConfigured(process.env.SMTP_USER);
}

/**
 * Gmail over SMTP with an App Password.
 *
 * This is NOT the `gmail_api` provider: that one drives the Gmail REST API and
 * needs an OAuth2 client id, a client secret and a refresh token. An App
 * Password is a plain SMTP credential, so it gets its own transport with its
 * own settings, and it does NOT read SMTP_HOST or SMTP_USER - those belong to
 * the other transport, and a fallback would silently send "Gmail" mail
 * through Brevo.
 */
export function isGmailAppPasswordConfigured() {
	return isConfigured(process.env.GMAIL_USER) && isConfigured(process.env.GMAIL_APP_PASSWORD);
}

function isGmailConfigured() {
	return (
		isConfigured(process.env.GMAIL_CLIENT_ID) &&
		isConfigured(process.env.GMAIL_CLIENT_SECRET) &&
		isConfigured(process.env.GMAIL_REFRESH_TOKEN) &&
		isConfigured(process.env.GMAIL_SENDER)
	);
}

/**
 * The provider a send uses.
 *
 * A send may PIN its provider (the investigation report pins "gmail"), then
 * the EMAIL_PROVIDER env override, then the admin config. The env override
 * exists so the transport can be changed without a database write, but a
 * pinned provider wins over it.
 */
function resolveProvider(emailConfig, pinned) {
	return String(
		pinned || process.env.EMAIL_PROVIDER || emailConfig?.provider || "smtp",
	).toLowerCase();
}

async function getEmailConfig() {
	const config = await getAdminConfig();
	const emailConfig = config?.notifications?.email || {};
	return {
		enabled: Boolean(emailConfig?.enabled),
		provider: String(emailConfig?.provider || "smtp"),
		from_name: sanitizeString(String(emailConfig?.from_name || ""), 120),
		from_email: sanitizeString(String(emailConfig?.from_email || ""), 160),
		test_recipient: sanitizeString(String(emailConfig?.test_recipient || ""), 160),
	};
}

export async function getEmailDeliveryStatus() {
	const emailConfig = await getEmailConfig();
	const provider = resolveProvider(emailConfig, null);
	const smtpConfigured = isSmtpConfigured();
	const gmailConfigured = isGmailConfigured();
	const gmailAppPasswordConfigured = isGmailAppPasswordConfigured();
	const providerConfigured =
		provider === "smtp"
			? smtpConfigured
			: provider === "gmail"
				? gmailAppPasswordConfigured
				: provider === "gmail_api"
					? gmailConfigured
					: false;

	return {
		enabled: Boolean(emailConfig.enabled),
		provider,
		provider_configured: providerConfigured,
		ready: Boolean(emailConfig.enabled && providerConfigured),
		smtp: { configured: smtpConfigured },
		gmail: { configured: gmailAppPasswordConfigured },
		gmail_api: { configured: gmailConfigured },
		from_name_set: Boolean(emailConfig.from_name),
		from_email_set: Boolean(emailConfig.from_email),
	};
}

function normalizeRecipients(to) {
	if (Array.isArray(to)) {
		return to.map((value) => sanitizeString(String(value || ""), 160)).filter(Boolean);
	}
	const value = sanitizeString(String(to || ""), 160);
	return value ? [value] : [];
}

async function queueEmail(entry) {
	return prisma.emailOutbox.create({ data: entry });
}

// Emails whose body is a credential (a one-time reset link) are logged
// without it: the log is readable by admins and anyone with database access.
const REDACTED_BODY_SOURCES = new Set(["password_reset"]);

// A "sending" row older than this is assumed to belong to a crashed process.
// The recovery flags it as outcome-unknown rather than retrying it blindly.
const STALE_SENDING_MS = 15 * 60_000;

async function logEmailToDb({ to, subject, text, html, status, source, error, caseId }) {
	if (REDACTED_BODY_SOURCES.has(source)) {
		text = "[redacted: contains a one-time password reset link]";
		html = null;
	}
	try {
		await prisma.emailLog.create({
			data: {
				to: Array.isArray(to) ? to.join(", ") : String(to || ""),
				subject: sanitizeString(String(subject || ""), 200),
				body: sanitizeString(String(text || ""), 5000),
				html: html ? String(html) : null,
				status: status || "logged",
				source: source || "email_service",
				error: error || null,
				case_id: caseId ? String(caseId) : null,
			},
		});
	} catch (dbError) {
		logError("email_log_db_failed", dbError);
	}
}

/**
 * Send through the resolved provider. Extracted so a retry reuses the exact
 * same transport code instead of duplicating it.
 */
async function deliverViaProvider({
	provider,
	fromName,
	fromEmail,
	recipients,
	subject,
	text,
	html,
}) {
	if (provider === "smtp" || provider === "gmail") {
		const nodemailer = await import("nodemailer");
		const isGmail = provider === "gmail";
		// The Gmail transport has its OWN settings and credentials. It must not
		// fall back to SMTP_HOST or SMTP_USER: those belong to the other
		// transport, and a fallback would send "Gmail" mail through a different
		// provider and call it a day.
		const host = isGmail ? process.env.GMAIL_SMTP_HOST || "smtp.gmail.com" : process.env.SMTP_HOST;
		const port = Number(
			isGmail ? process.env.GMAIL_SMTP_PORT || 465 : process.env.SMTP_PORT || 587,
		);
		const secure = isGmail
			? String(process.env.GMAIL_SMTP_SECURE || "").toLowerCase() === "true" || port === 465
			: String(process.env.SMTP_SECURE || "").toLowerCase() === "true" || port === 465;
		const user = isGmail ? process.env.GMAIL_USER || "" : process.env.SMTP_USER;
		const pass = isGmail ? process.env.GMAIL_APP_PASSWORD || "" : process.env.SMTP_PASS || "";
		const transport = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
		const sent = await transport.sendMail({
			from: `${fromName} <${fromEmail}>`,
			to: recipients.join(","),
			subject,
			text,
			html: html || undefined,
		});
		// nodemailer returns messageId — persist it so a later retry can detect
		// a possible duplicate after a stale "sending" row.
		return String(sent?.messageId || "");
	}
	if (provider === "gmail_api") {
		const { google } = await import("googleapis");
		const oauth2Client = new google.auth.OAuth2(
			process.env.GMAIL_CLIENT_ID,
			process.env.GMAIL_CLIENT_SECRET,
		);
		oauth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });
		const gmail = google.gmail({ version: "v1", auth: oauth2Client });
		const messageLines = [
			`From: ${fromName} <${fromEmail}>`,
			`To: ${recipients.join(",")}`,
			`Subject: ${subject}`,
			"MIME-Version: 1.0",
			html ? "Content-Type: text/html; charset=UTF-8" : "Content-Type: text/plain; charset=UTF-8",
			"",
			html ? html : text,
		];
		const message = messageLines.join("\r\n");
		const encodedMessage = Buffer.from(message)
			.toString("base64")
			.replace(/\+/gu, "-")
			.replace(/\//gu, "_")
			.replace(/[=]+$/u, "");
		const sent = await gmail.users.messages.send({
			userId: process.env.GMAIL_SENDER,
			requestBody: { raw: encodedMessage },
		});
		return String(sent?.data?.id || "");
	}
	return "";
}

function resolveFromAddress(emailConfig, provider) {
	const isGmail = provider === "gmail";
	return (
		emailConfig.from_email ||
		(isGmail
			? process.env.GMAIL_SENDER || process.env.GMAIL_USER
			: process.env.SMTP_FROM || process.env.SMTP_USER) ||
		process.env.GMAIL_SENDER ||
		"noreply@gartexhub.local"
	);
}

export async function sendEmail({
	to,
	subject,
	text,
	html,
	source,
	provider: pinnedProvider,
	caseId,
}) {
	const recipients = normalizeRecipients(to);
	if (recipients.length === 0) {
		return { ok: false, status: "no_recipients" };
	}

	const emailConfig = await getEmailConfig();

	const payload = {
		id: crypto.randomUUID(),
		to: recipients,
		subject: sanitizeString(String(subject || "Notification"), 200),
		text: sanitizeString(String(text || ""), 2000),
		html: html ? String(html) : "",
		created_at: new Date().toISOString(),
		status: "queued",
		error: "",
		case_id: caseId ? String(caseId) : null,
		attempts: 1,
	};

	const log = (status, error) =>
		logEmailToDb({
			to: recipients,
			subject: payload.subject,
			text: payload.text,
			html: payload.html,
			status,
			source,
			error,
			caseId,
		});

	// Durable outbox: persist the delivery record BEFORE any external call, so
	// a crash can never leave an email with no record of its intended delivery.
	// State machine: queued → sending → sent | failed. An unconfigured or
	// disabled provider is recorded as failed so the retry endpoint can see it.
	const outbox = await queueEmail({ ...payload }).catch(() => null);
	const outboxId = outbox?.id;
	const updateOutbox = async (patch) => {
		if (!outboxId) {
			return;
		}
		try {
			await prisma.emailOutbox.update({ where: { id: outboxId }, data: patch });
		} catch {
			// the log below is the authoritative record if this write fails
		}
	};
	const failOutbox = (reason) =>
		updateOutbox({ status: "failed", error: reason, last_error: reason });

	if (!emailConfig.enabled) {
		await failOutbox("logged_disabled");
		await log("logged_disabled");
		logWarn("email_logged_disabled", { to: recipients, subject: payload.subject });
		return { ok: false, status: "logged_disabled" };
	}

	const provider = resolveProvider(emailConfig, pinnedProvider);
	if (provider === "smtp" || provider === "gmail") {
		const configured = provider === "gmail" ? isGmailAppPasswordConfigured() : isSmtpConfigured();
		if (!configured) {
			const status = provider === "gmail" ? "logged_no_gmail" : "logged_no_smtp";
			await failOutbox(status);
			await log(status);
			logWarn(provider === "gmail" ? "email_logged_no_gmail" : "email_logged_no_smtp", {
				to: recipients,
				subject: payload.subject,
			});
			return { ok: false, status };
		}
	} else if (provider === "gmail_api") {
		if (!isGmailConfigured()) {
			await failOutbox("logged_no_gmail");
			await log("logged_no_gmail");
			logWarn("email_logged_no_gmail", { to: recipients, subject: payload.subject });
			return { ok: false, status: "logged_no_gmail" };
		}
	} else {
		await failOutbox("logged_unsupported");
		await log("logged_unsupported");
		logWarn("email_logged_unsupported", { to: recipients, subject: payload.subject });
		return { ok: false, status: "logged_unsupported" };
	}

	try {
		// Mark "sending" before the external call. If the process dies here the
		// row is stale and recovery can flag it as "outcome unknown" instead of
		// silently losing it.
		await updateOutbox({ status: "sending" });
		const messageId = await deliverViaProvider({
			provider,
			fromName: emailConfig.from_name || "GarTexHub",
			fromEmail: resolveFromAddress(emailConfig, provider),
			recipients,
			subject: payload.subject,
			text: payload.text,
			html: payload.html,
		});
		await updateOutbox({ status: "sent", message_id: messageId || null, error: "" });
		await log("sent");
		logInfo("email_sent", { to: recipients });
		return { ok: true, status: "sent" };
	} catch (error) {
		const message = error?.message || "smtp_error";
		await updateOutbox({ status: "failed", last_error: message, error: message });
		await log("failed", message);
		logError("email_send_failed", error);
		return { ok: false, status: "failed", error: message };
	}
}

/**
 * Recover outbox rows stuck in "sending" from a crashed process.
 *
 * A "sending" row means the external call was attempted but its outcome was
 * never recorded. We can't know whether the provider delivered it, so we do
 * NOT silently retry it here — we mark it failed with an explicit warning that
 * a retry MAY duplicate. That makes the ambiguity visible in the history.
 *
 * @returns {Promise<number>} The number of rows recovered.
 */
export async function recoverStaleSending() {
	const staleAfter = new Date(Date.now() - STALE_SENDING_MS);
	const stale = await prisma.emailOutbox
		.findMany({ where: { status: "sending", created_at: { lt: staleAfter } } })
		.catch(() => []);
	let recovered = 0;
	for (const row of Array.isArray(stale) ? stale : []) {
		const note = "Delivery outcome unknown: sending row was stale; a retry may duplicate.";
		await prisma.emailOutbox
			.update({
				where: { id: row.id },
				data: { status: "failed", error: "stale_sending", last_error: note },
			})
			.catch(() => {});
		recovered += 1;
	}
	if (recovered > 0) {
		logWarn("stale_sending_recovered", { recovered });
	}
	return recovered;
}

/**
 * Retry every failed outbox message for one case.
 *
 * The message id and the attempt count are durable: a retry increments
 * `attempts` and records the newest failure, so the delivery history shows the
 * whole story rather than only the last try. Exactly-once delivery cannot be
 * guaranteed for every SMTP failure window; a recovered "sending" row carries
 * an explicit duplicate warning so the retry decision is informed.
 *
 * @param {string} caseId
 * @returns {Promise<{ok: number, results: Array}>}
 */
export async function retryCaseEmails(caseId) {
	const id = String(caseId || "");
	if (!id) {
		return { ok: 0, results: [] };
	}
	// Recover rows whose outcome was lost in a crash before retrying.
	await recoverStaleSending();
	const failed = await prisma.emailOutbox.findMany({
		where: { case_id: id, status: { in: ["failed", "queued"] } },
		orderBy: { created_at: "asc" },
	});
	const emailConfig = await getEmailConfig();
	// Retry uses the admin-configured transport. The report mail itself is
	// pinned to Gmail at send time; a retry goes through whichever transport
	// the owner has configured, which is the recovery path.
	const provider = resolveProvider(emailConfig, null);
	let ok = 0;
	const results = [];
	for (const row of failed) {
		const recipients = Array.isArray(row.to) ? row.to : [];
		const attempt = Number(row.attempts || 0) + 1;
		try {
			await deliverViaProvider({
				provider,
				fromName: emailConfig.from_name || "GarTexHub",
				fromEmail: resolveFromAddress(emailConfig, provider),
				recipients,
				subject: row.subject,
				text: row.text || "",
				html: row.html || "",
			});
			await prisma.emailOutbox.update({
				where: { id: row.id },
				data: { status: "sent", attempts: attempt, last_error: null, error: "" },
			});
			await logEmailToDb({
				to: recipients,
				subject: row.subject,
				text: row.text || "",
				html: row.html,
				status: "sent",
				source: "email_retry",
				caseId: id,
			});
			ok += 1;
			results.push({ id: row.id, ok: true });
		} catch (error) {
			const message = error?.message || "smtp_error";
			await prisma.emailOutbox.update({
				where: { id: row.id },
				data: { status: "failed", attempts: attempt, last_error: message, error: message },
			});
			results.push({ id: row.id, ok: false, error: message });
		}
	}
	logInfo("case_emails_retried", { case_id: id, ok, attempted: failed.length });
	return { ok, results };
}

/** Per-case email delivery history, newest first. */
export async function getCaseEmailHistory(caseId) {
	const id = String(caseId || "");
	if (!id) {
		return [];
	}
	const rows = await prisma.emailLog.findMany({
		where: { case_id: id },
		orderBy: { created_at: "desc" },
		take: 50,
	});
	return rows.map((row) => ({
		id: row.id,
		to: row.to,
		subject: row.subject,
		status: row.status,
		source: row.source,
		error: row.error,
		at: row.created_at,
	}));
}
