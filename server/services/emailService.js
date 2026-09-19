import crypto from "node:crypto";
import { logError, logInfo } from "../utils/logger.js";
import prisma from "../utils/prisma.js";
import { sanitizeString } from "../utils/validators.js";
import { getAdminConfig } from "./adminConfigService.js";

function isConfigured(value) {
	return Boolean(String(value || "").trim());
}

export function isSmtpConfigured() {
	return isConfigured(process.env.SMTP_HOST) && isConfigured(process.env.SMTP_USER);
}

function isGmailConfigured() {
	return (
		isConfigured(process.env.GMAIL_CLIENT_ID) &&
		isConfigured(process.env.GMAIL_CLIENT_SECRET) &&
		isConfigured(process.env.GMAIL_REFRESH_TOKEN) &&
		isConfigured(process.env.GMAIL_SENDER)
	);
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
	const provider = String(emailConfig.provider || "smtp").toLowerCase();
	const smtpConfigured = isSmtpConfigured();
	const gmailConfigured = isGmailConfigured();
	const providerConfigured =
		provider === "smtp" ? smtpConfigured : provider === "gmail_api" ? gmailConfigured : false;

	return {
		enabled: Boolean(emailConfig.enabled),
		provider,
		provider_configured: providerConfigured,
		ready: Boolean(emailConfig.enabled && providerConfigured),
		smtp: { configured: smtpConfigured },
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
	await prisma.emailOutbox.create({ data: entry });
}

async function logEmailToDb({ to, subject, text, html, status, source, error }) {
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
			},
		});
	} catch (dbError) {
		logError("email_log_db_failed", dbError);
	}
}

export async function sendEmail({ to, subject, text, html, source }) {
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
	};

	if (!emailConfig.enabled) {
		await logEmailToDb({ to: recipients, subject: payload.subject, text: payload.text, html: payload.html, status: "logged_disabled", source });
		logInfo("email_logged_disabled", { to: recipients, subject: payload.subject });
		return { ok: true, status: "logged_disabled" };
	}

	const provider = String(emailConfig.provider || "smtp").toLowerCase();
	if (provider === "smtp") {
		if (!isSmtpConfigured()) {
			await logEmailToDb({ to: recipients, subject: payload.subject, text: payload.text, html: payload.html, status: "logged_no_smtp", source });
			logInfo("email_logged_no_smtp", { to: recipients, subject: payload.subject });
			return { ok: true, status: "logged_no_smtp" };
		}
	} else if (provider === "gmail_api") {
		if (!isGmailConfigured()) {
			await logEmailToDb({ to: recipients, subject: payload.subject, text: payload.text, html: payload.html, status: "logged_no_gmail", source });
			logInfo("email_logged_no_gmail", { to: recipients, subject: payload.subject });
			return { ok: true, status: "logged_no_gmail" };
		}
	} else {
		await logEmailToDb({ to: recipients, subject: payload.subject, text: payload.text, html: payload.html, status: "logged_unsupported", source });
		return { ok: true, status: "logged_unsupported" };
	}

	try {
		const fromName = emailConfig.from_name || "GarTexHub";
		const fromEmail =
			emailConfig.from_email ||
			process.env.SMTP_FROM ||
			process.env.SMTP_USER ||
			process.env.GMAIL_SENDER ||
			"noreply@gartexhub.local";

		if (provider === "smtp") {
			const nodemailer = await import("nodemailer");
			const port = Number(process.env.SMTP_PORT || 587);
			const secure = String(process.env.SMTP_SECURE || "").toLowerCase() === "true" || port === 465;
			const transport = nodemailer.createTransport({
				host: process.env.SMTP_HOST,
				port,
				secure,
				auth: {
					user: process.env.SMTP_USER,
					pass: process.env.SMTP_PASS || "",
				},
			});

			await transport.sendMail({
				from: `${fromName} <${fromEmail}>`,
				to: recipients.join(","),
				subject: payload.subject,
				text: payload.text,
				html: payload.html || undefined,
			});
		}

		if (provider === "gmail_api") {
			const { google } = await import("googleapis");
			const oauth2Client = new google.auth.OAuth2(
				process.env.GMAIL_CLIENT_ID,
				process.env.GMAIL_CLIENT_SECRET,
			);
			oauth2Client.setCredentials({
				refresh_token: process.env.GMAIL_REFRESH_TOKEN,
			});
			const gmail = google.gmail({ version: "v1", auth: oauth2Client });
			const messageLines = [
				`From: ${fromName} <${fromEmail}>`,
				`To: ${recipients.join(",")}`,
				`Subject: ${payload.subject}`,
				"MIME-Version: 1.0",
				payload.html
					? "Content-Type: text/html; charset=UTF-8"
					: "Content-Type: text/plain; charset=UTF-8",
				"",
				payload.html ? payload.html : payload.text,
			];
			const message = messageLines.join("\r\n");
			const encodedMessage = Buffer.from(message)
				.toString("base64")
				.replace(/\+/g, "-")
				.replace(/\//g, "_")
				.replace(/[=]+$/, "");
			await gmail.users.messages.send({
				userId: process.env.GMAIL_SENDER,
				requestBody: { raw: encodedMessage },
			});
		}

		await queueEmail({ ...payload, status: "sent" });
		await logEmailToDb({ to: recipients, subject: payload.subject, text: payload.text, html: payload.html, status: "sent", source });
		logInfo("email_sent", { to: recipients });
		return { ok: true, status: "sent" };
	} catch (error) {
		const message = error?.message || "smtp_error";
		await queueEmail({ ...payload, status: "failed", error: message });
		await logEmailToDb({ to: recipients, subject: payload.subject, text: payload.text, html: payload.html, status: "failed", source, error: message });
		logError("email_send_failed", error);
		return { ok: false, status: "failed", error: message };
	}
}
