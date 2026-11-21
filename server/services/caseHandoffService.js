/**
 * Human-support handoff for a support case.
 *
 * The buyer can ask for a human at any time. The handoff carries the full
 * context — conversation, confirmed problem brief, findings and the reason —
 * so the representative never asks the buyer to repeat themselves.
 *
 * The request is recorded in local JSON (like feedback and discussion state),
 * the case is flagged `escalated`, its status moves to `human_support`, every
 * owner/admin is notified in-app, and a status event is emitted on the case's
 * realtime channel. This module never throws: a notification failure must not
 * leave the buyer thinking the request was lost.
 */

import crypto from "node:crypto";
import { CASE_EVENTS, emitCaseEvent } from "../realtime/realtimeBus.js";
import { readLocalJson, writeLocalJson } from "../utils/localStore.js";
import { logInfo, logWarn } from "../utils/logger.js";
import prisma from "../utils/prisma.js";
import { sanitizeString } from "../utils/validators.js";
import { createNotification } from "./notificationService.js";

const HANDOFF_STORE = "support_case_handoffs.json";
const OWNER_ADMIN_ROLES = ["owner", "admin"];

const REASON_MAX = 2000;

/**
 * Request a human handoff for a case.
 *
 * @param {Object} params
 * @param {string} params.caseId
 * @param {Object} [params.caseRow] The SupportCase row.
 * @param {Array<Object>} [params.messages] The conversation, oldest first.
 * @param {Array<Object>} [params.findings] The recorded findings.
 * @param {string} [params.reason] Why the buyer wants a human.
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
export async function requestHandoff({ caseId, caseRow, messages, findings, reason } = {}) {
	const id = String(caseId || "");
	if (!id) {
		return { ok: false, error: "caseId required" };
	}

	// A terminal case cannot be handed off — it is already closed history.
	const currentStatus = String(caseRow?.status || "");
	if (currentStatus === "completed") {
		return { ok: false, error: "This case is already completed." };
	}

	const handoff = {
		id: crypto.randomUUID(),
		case_id: id,
		reason: sanitizeString(
			String(reason || "Buyer requested a human support representative."),
			REASON_MAX,
		),
		requested_at: new Date().toISOString(),
		problemBrief: String(caseRow?.summary || ""),
		subject: String(caseRow?.subject || ""),
		// The full conversation and findings go to the representative, not the
		// buyer-facing UI. Stored as-is (they are already redacted upstream).
		conversation: Array.isArray(messages)
			? messages.map((m) => ({
					role: String(m?.role || ""),
					content: String(m?.content || ""),
				}))
			: [],
		findings: Array.isArray(findings)
			? findings.map((f) => ({
					role: String(f?.role || ""),
					detail: String(f?.finding?.detail || ""),
				}))
			: [],
		status: "pending",
	};

	try {
		const store = await readLocalJson(HANDOFF_STORE, {});
		store[id] = handoff;
		await writeLocalJson(HANDOFF_STORE, store);
	} catch (error) {
		logWarn("case handoff record failed", { caseId: id, error: error?.message || String(error) });
		return { ok: false, error: "Unable to record the handoff request." };
	}

	// Flag the case and move it to human_support. Forward-only: a case that
	// already left its active state keeps its status.
	try {
		await prisma.supportCase.updateMany({
			where: { id, status: { in: ["collecting", "investigating", "reporting", "verifying"] } },
			data: { escalated: true, status: "human_support", updated_at: new Date() },
		});
	} catch (error) {
		logWarn("case handoff status write failed", {
			caseId: id,
			error: error?.message || String(error),
		});
	}

	try {
		emitCaseEvent(id, CASE_EVENTS?.status ?? "support.case.status", {
			caseId: id,
			status: "human_support",
			summary: handoff.problemBrief || handoff.subject,
		});
	} catch {
		// telemetry must never break the handoff
	}

	// Notify every owner/admin with the handoff context.
	try {
		const staff = await prisma.user.findMany({
			where: { role: { in: OWNER_ADMIN_ROLES } },
			select: { id: true },
		});
		await Promise.all(
			staff.map((user) =>
				createNotification(user.id, {
					type: "support_case_handoff",
					entity_type: "support_case",
					entity_id: id,
					message: `Human support requested for case ${id}`,
					meta: {
						case_id: id,
						reason: handoff.reason,
						subject: handoff.subject,
						problem_brief: handoff.problemBrief,
						turns: handoff.conversation.length,
						findings: handoff.findings.length,
					},
				}).catch((error) => {
					logWarn("case handoff notification failed", {
						caseId: id,
						error: error?.message || String(error),
					});
				}),
			),
		);
	} catch (error) {
		logWarn("case handoff staff lookup failed", {
			caseId: id,
			error: error?.message || String(error),
		});
	}

	logInfo("case handoff requested", { caseId: id, reason: handoff.reason });
	return { ok: true };
}

/** The handoff record for a case (for the admin console), if any. */
export async function getHandoff(caseId) {
	const id = String(caseId || "");
	if (!id) {
		return null;
	}
	try {
		const store = await readLocalJson(HANDOFF_STORE, {});
		return store[id] ?? null;
	} catch {
		return null;
	}
}
