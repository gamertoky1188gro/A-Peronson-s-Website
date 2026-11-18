/**
 * OpenCode provider for the intake clarification conversation.
 *
 * Deliberately narrow: it talks to the ALREADY-WARM shared OpenCode runtime
 * (the same one the assistant spawns — read-only, free models, isolated
 * config). It never spawns a server: if the assistant's runtime is not up,
 * the provider returns null and the clarification service falls back to its
 * env chain, exactly as before this branch existed.
 */

import { CASE_EVENTS, emitCaseEvent } from "../realtime/realtimeBus.js";
import { logInfo, logWarn } from "../utils/logger.js";
import { getRunningOpencodeClient } from "./assistantService.js";
import { REPOSITORY_ROOT } from "./investigation/opencodeRuntime.js";
import { waitForAssistantTurn } from "./opencodeTurns.js";

const TIMEOUT_MS = 60_000;

export function makeClarificationProvider({
	modelId,
	caseId,
	timeoutMs = TIMEOUT_MS,
	onChunk = null,
	onUsage = null,
} = {}) {
	if (!modelId) return null;
	// The buyer's meter should tick for the clarifying chat too, not only
	// for the investigation roles. Emit the same SSE envelope the queue uses.
	if (typeof onUsage !== "function" && typeof caseId === "string" && caseId) {
		onUsage = (usage) => {
			try {
				emitCaseEvent(caseId, CASE_EVENTS?.usage ?? "support.case.usage", {
					caseId,
					role: "intake",
					used: Number(usage?.used) || 0,
					output: Number(usage?.output) || 0,
					reasoning: Number(usage?.reasoning) || 0,
					cacheRead: Number(usage?.cacheRead) || 0,
					cacheWrite: Number(usage?.cacheWrite) || 0,
				});
			} catch (error) {
				logInfo("clarification usage ping could not be published", {
					case_id: caseId,
					reason: error?.message || String(error),
				});
			}
		};
	}
	return async function clarificationOpencode(prompt, systemPrompt) {
		const client = getRunningOpencodeClient();
		if (!client) return null; // runtime cold — env chain takes over
		let sessionId = null;
		try {
			const created = await client.session.create({
				title: `support-clarification-${caseId}`,
				model: { id: modelId, providerID: "opencode" },
				location: { directory: REPOSITORY_ROOT },
			});
			sessionId = created?.data?.id || created?.id;
			if (!sessionId) return null;
			const turn = await waitForAssistantTurn({
				client,
				sessionID: sessionId,
				text: `${systemPrompt}\n\n${prompt}`,
				timeoutMs,
				pollIntervalMs: 800,
				stablePollsToSettle: 6,
				// Live broadcast for the buyer's typing indicator. onText carries
				// the ACCUMULATED text of the turn so far; it fires once per poll
				// only when the text actually grew.
				onText: typeof onChunk === "function" ? (_delta, full) => onChunk(full) : null,
				onUsage: typeof onUsage === "function" ? onUsage : null,
			});
			const text = String(turn?.text || "").trim();
			if (turn.modelError || turn.timedOut || !text) {
				logWarn("clarification_opencode_failed", {
					model: modelId,
					reason: turn.modelError?.message || (turn.timedOut ? "timeout" : "empty"),
				});
				return null;
			}
			logInfo("clarification_model_used", { case_id: caseId, model: modelId });
			return text;
		} catch (error) {
			logWarn("clarification_opencode_failed", { model: modelId, reason: error?.message });
			return null;
		} finally {
			if (sessionId) {
				client.session.remove({ sessionID: sessionId }).catch(() => {});
			}
		}
	};
}
