/**
 * OpenCode model fetching, switching and per-turn auto-fallback for the
 * floating assistant. The support-investigation portal has its own chain;
 * this module is the assistant's equivalent, plus runtime switching backed
 * by the DB (AdminBranding) instead of an env var.
 *
 * Invariants (spec §Decisions):
 *  - FREE-TIER opencode models only, enforced by isFreeOpencodeModel.
 *  - A timeout is never retried; only a model refusal advances the chain.
 *  - The active model is the admin's pick when one exists, else
 *    OPENCODE_MODEL_ID, else minimax-m3.1-flash-free.
 */

import { logError, logInfo, logWarn } from "../utils/logger.js";
import prisma from "../utils/prisma.js";
import { DEFAULT_MODEL_CHAIN, isFreeOpencodeModel } from "./investigation/modelChain.js";
import { REPOSITORY_ROOT } from "./investigation/opencodeRuntime.js";
import { waitForAssistantTurn } from "./opencodeTurns.js";

const BRANDING_KEY = "ai.opencode.model_id";
const DEFAULT_MODEL_ID = "minimax-m3.1-flash-free";
const FREE_PROVIDER_ID = "opencode";

export async function fetchAvailableModels(client) {
	const response = await client.model.list();
	const flat = Object.values(response?.data || response || {}).flat();
	const seen = new Set();
	const models = [];
	for (const model of flat) {
		const id = model?.modelID || model?.id;
		if (!id) continue;
		const providerID = model?.providerID || FREE_PROVIDER_ID;
		if (!isFreeOpencodeModel(id, providerID)) continue;
		if (seen.has(id)) continue;
		seen.add(id);
		models.push({ id, providerID });
	}
	return models;
}

async function readAdminPick() {
	try {
		const row = await prisma.adminBranding.findUnique({ where: { brand_key: BRANDING_KEY } });
		if (row?.active && typeof row?.value === "string" && row.value.trim()) {
			return row.value.trim();
		}
	} catch (error) {
		logError("opencode_model_branding_read_failed", { message: error?.message });
	}
	return null;
}

export async function getActiveModel() {
	const adminPick = await readAdminPick();
	if (adminPick && isFreeOpencodeModel(adminPick, FREE_PROVIDER_ID)) {
		return { id: adminPick, providerID: FREE_PROVIDER_ID, source: "admin" };
	}
	if (adminPick) {
		logWarn("opencode_model_admin_pick_ignored", {
			pick: adminPick,
			reason: "not a free opencode-tier model",
		});
	}
	const envId = String(process.env.OPENCODE_MODEL_ID || "")
		.replace(/^opencode\//u, "")
		.trim();
	if (envId && isFreeOpencodeModel(envId, FREE_PROVIDER_ID)) {
		return { id: envId, providerID: FREE_PROVIDER_ID, source: "env" };
	}
	if (envId) {
		logWarn("opencode_model_env_pick_ignored", {
			pick: envId,
			reason: "not a free opencode-tier model",
		});
	}
	return { id: DEFAULT_MODEL_ID, providerID: FREE_PROVIDER_ID, source: "default" };
}

export async function getCandidateChain() {
	const active = await getActiveModel();
	const chain = [{ id: active.id, providerID: active.providerID }];
	for (const model of DEFAULT_MODEL_CHAIN) {
		if (model.id === active.id) continue;
		chain.push(model);
	}
	return chain;
}

export async function setActiveModel(modelId, changedBy, client = null) {
	const id = String(modelId || "").trim();
	if (!(id && isFreeOpencodeModel(id, FREE_PROVIDER_ID))) {
		const error = new Error(
			`Refusing to persist "${id}": only free opencode-tier models may be selected.`,
		);
		error.status = 400;
		throw error;
	}
	if (client) {
		try {
			const live = await fetchAvailableModels(client);
			if (live.length === 0) {
				logWarn("opencode_model_live_list_empty", {
					reason: "server up but no free models offered; presence validation skipped",
				});
			}
			if (live.length > 0 && !live.some((m) => m.id === id)) {
				const error = new Error(
					`Refusing to persist "${id}": the running opencode server does not offer it.`,
				);
				error.status = 400;
				throw error;
			}
		} catch (error) {
			if (error.status === 400) throw error;
			logWarn("opencode_model_live_validation_skipped", { message: error?.message });
		}
	} else {
		logWarn("opencode_model_live_validation_skipped", { reason: "no running opencode server" });
	}

	const previous = await readAdminPick();
	try {
		await prisma.adminBranding.upsert({
			where: { brand_key: BRANDING_KEY },
			update: { value: id, active: true },
			create: { brand_key: BRANDING_KEY, value: id, active: true },
		});
		try {
			await prisma.adminConfigHistory.create({
				data: {
					config_type: "ai_opencode_model",
					changed_by: String(changedBy || "unknown"),
					previous_value: JSON.stringify({ model_id: previous }),
					new_value: JSON.stringify({ model_id: id }),
				},
			});
		} catch {
			// Audit or nothing: roll the branding row back to the previous pick.
			try {
				if (previous === null) {
					// There was NO admin pick before this switch. Upserting one
					// would turn "default/env" into an admin pick that nobody
					// chose, so the row is removed instead.
					await prisma.adminBranding.deleteMany({ where: { brand_key: BRANDING_KEY } });
				} else {
					await prisma.adminBranding.upsert({
						where: { brand_key: BRANDING_KEY },
						update: { value: previous, active: true },
						create: { brand_key: BRANDING_KEY, value: previous, active: true },
					});
				}
			} catch (rollbackError) {
				logError("opencode_model_rollback_failed", { message: rollbackError?.message });
			}
			const error = new Error(
				"Could not record the change in the audit log; the switch was not kept.",
			);
			error.status = 500;
			throw error;
		}
	} catch (error) {
		if (error.status) throw error;
		const wrapped = new Error(`Could not persist the model selection: ${error?.message}`);
		wrapped.status = 500;
		throw wrapped;
	}

	logInfo("opencode_model_switched", { model: id, changed_by: changedBy || "unknown" });
	return { id, providerID: FREE_PROVIDER_ID, source: "admin" };
}

export async function getModelsSnapshot(client = null) {
	const active = await getActiveModel();
	if (!client) {
		return { models: [], active: active.id, source: active.source, serverAvailable: false };
	}
	try {
		const models = await fetchAvailableModels(client);
		return { models, active: active.id, source: active.source, serverAvailable: true };
	} catch (error) {
		logWarn("opencode_model_list_failed", { message: error?.message });
		return { models: [], active: active.id, source: active.source, serverAvailable: false };
	}
}

/**
 * Run one assistant prompt with per-turn fallback. The first attempt uses the
 * caller's session (bound to the active model). On a model refusal, each
 * remaining chain candidate gets a FRESH EPHEMERAL session, which is deleted
 * after the turn. Timeouts and wedges are never retried.
 *
 * The outcome travels BY VALUE: the caller receives `{ text, parts, model,
 * providerID, attempts }` or null. Nothing is stashed in module scope, so
 * two concurrent requests can never read each other's outcome.
 */
export async function runAssistantPrompt({
	client,
	sessionID,
	text,
	timeoutMs = 120_000,
	onText = null,
}) {
	const chain = await getCandidateChain();
	const attempts = [];

	async function attempt(useSessionID) {
		try {
			return await waitForAssistantTurn({
				client,
				sessionID: useSessionID,
				text,
				timeoutMs,
				onText,
			});
		} catch (error) {
			logWarn("opencode_model_prompt_failed", { message: error?.message });
			// A prompt that throws is a failed CANDIDATE, not a failed run: report
			// it as a refusal so the chain advances instead of rejecting.
			return { text: "", parts: [], modelError: error ?? new Error("prompt failed") };
		}
	}

	for (let i = 0; i < chain.length; i += 1) {
		const candidate = chain[i];
		let targetSessionID = sessionID;
		let ephemeral = false;
		if (i > 0) {
			let created = null;
			try {
				created = await client.session.create({
					title: `assistant-fallback-${Date.now()}`,
					model: { id: candidate.id, providerID: candidate.providerID },
					location: { directory: REPOSITORY_ROOT },
				});
			} catch (error) {
				logWarn("opencode_model_fallback_session_failed", {
					model: candidate.id,
					message: error?.message,
				});
			}
			targetSessionID = created?.data?.id || created?.id;
			if (!targetSessionID) {
				attempts.push({ model: candidate.id, outcome: "refused" });
				continue;
			}
			ephemeral = true;
		}
		const turn = await attempt(targetSessionID);
		const refused = Boolean(turn.modelError);
		const outcome = refused ? "refused" : turn.timedOut ? "timeout" : turn.wedged ? "wedged" : "ok";
		attempts.push({ model: candidate.id, outcome });
		if (ephemeral) {
			client.session.remove({ sessionID: targetSessionID }).catch(() => {});
		}
		if (refused) continue;
		if (turn.timedOut || turn.wedged) {
			return null;
		}
		return {
			text: turn.text,
			parts: turn.parts,
			model: candidate.id,
			providerID: candidate.providerID,
			attempts,
		};
	}
	return null;
}
