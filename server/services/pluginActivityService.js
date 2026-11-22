/**
 * Short-lived tokens for the guarded GarTexHub opencode plugin.
 *
 * The plugin posts tool-lifecycle, retry and activity events back to the app.
 * Each investigation run mints one token, passed to the spawned child via env;
 * the sink route verifies it before publishing to the case's realtime channel.
 * Tokens are in-memory only — a process restart invalidates all of them, which
 * is fine because a restart also kills the child that held the token.
 */

import crypto from "node:crypto";
import { CASE_EVENTS, emitCaseEvent } from "../realtime/realtimeBus.js";
import { logWarn } from "../utils/logger.js";

const tokens = new Map(); // token -> { caseId, expiresAt }

/** Mint a token for one case, valid for the lifetime of its runtime. */
export function mintPluginToken(caseId, ttlMs = 60 * 60_000) {
	const id = String(caseId || "");
	if (!id) return null;
	const token = crypto.randomBytes(24).toString("hex");
	tokens.set(token, { caseId: id, expiresAt: Date.now() + ttlMs });
	return token;
}

export function revokePluginToken(token) {
	if (token) tokens.delete(String(token));
}

function consume(token) {
	if (!token) return null;
	const entry = tokens.get(String(token));
	if (!entry) return null;
	if (Date.now() > entry.expiresAt) {
		tokens.delete(String(token));
		return null;
	}
	return entry;
}

/**
 * Verify a token and publish one plugin activity row to the case stream.
 * Returns true when the event was accepted.
 */
export function acceptPluginActivity({ token, caseId, payload }) {
	const entry = consume(token);
	if (!entry || entry.caseId !== String(caseId || "")) {
		return false;
	}
	if (!payload || typeof payload !== "object") {
		return false;
	}
	try {
		emitCaseEvent(entry.caseId, CASE_EVENTS?.activity ?? "support.case.activity", {
			caseId: entry.caseId,
			id: String(payload.id || ""),
			role: typeof payload.role === "string" ? payload.role : "lead",
			kind: typeof payload.kind === "string" ? payload.kind : "tool",
			label: String(payload.label || "Working").slice(0, 80),
			status: ["running", "done", "failed"].includes(payload.status) ? payload.status : "done",
			at: typeof payload.at === "string" ? payload.at : new Date().toISOString(),
			...(payload.error ? { error: String(payload.error).slice(0, 300) } : {}),
			source: "plugin",
		});
		return true;
	} catch (error) {
		logWarn("plugin activity publish failed", { error: error?.message || String(error) });
		return false;
	}
}
