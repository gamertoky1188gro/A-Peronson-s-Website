/**
 * OpenCode provider for the intake clarification conversation.
 *
 * Deliberately narrow: it talks to the ALREADY-WARM shared OpenCode runtime
 * (the same one the assistant spawns — read-only, free models, isolated
 * config). It never spawns a server: if the assistant's runtime is not up,
 * the provider returns null and the clarification service falls back to its
 * env chain, exactly as before this branch existed.
 */
import { logInfo, logWarn } from "../utils/logger.js";
import { sanitizeString } from "../utils/validators.js";
import { getRunningOpencodeClient } from "./assistantService.js";
import { REPOSITORY_ROOT } from "./investigation/opencodeRuntime.js";
import { waitForAssistantTurn } from "./opencodeTurns.js";

const TIMEOUT_MS = 8_000;

export function makeClarificationProvider({ modelId, caseId, timeoutMs = TIMEOUT_MS } = {}) {
	if (!modelId) return null;
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
			});
			const text = sanitizeString(String(turn?.text || ""), 2000).trim();
			if (turn.modelError || turn.timedOut || !text) {
				logWarn("clarification_opencode_failed", { model: modelId, reason: turn.modelError?.message || (turn.timedOut ? "timeout" : "empty") });
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
