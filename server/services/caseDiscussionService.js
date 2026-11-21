/**
 * The interactive support discussion.
 *
 * A client opens a case and the assistant and client discuss the problem
 * back and forth before any investigation runs. The assistant may:
 *
 *   1. Ask the client ONE clarifying question.
 *   2. Request to read a file from the repository (`READ: <path>` on its own
 *      line) — the server reads it, redacts secrets, and feeds the content
 *      back so the assistant can discuss findings.
 *   3. Propose a summary when it understands the problem (`SUMMARY: <text>`
 *      on its own line) — the client then confirms ("yes, that's it") or
 *      denies ("nope, keep looking").
 *
 * When the client confirms, the case moves to the investigation pipeline
 * and the report is emailed. When the client denies, discussion continues.
 * The assistant never asks unnecessary questions and never reveals secrets.
 *
 * Discussion state lives in a local JSON file (like case feedback) so no
 * schema change is needed. This module never throws — a provider failure
 * degrades to a fixed question, and a missing runtime means no code reads.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { CASE_EVENTS, emitCaseEvent } from "../realtime/realtimeBus.js";
import { readLocalJson, writeLocalJson } from "../utils/localStore.js";
import { logInfo, logWarn } from "../utils/logger.js";
import { makeClarificationProvider } from "./clarificationOpencodeProvider.js";
import { getInvestigationModelConfig } from "./investigation/investigationModelConfigService.js";
import { REPOSITORY_ROOT } from "./investigation/opencodeRuntime.js";
import { redactReportSecrets } from "./investigation/redaction.js";

const DISCUSSION_STORE = "support_case_discussion.json";
const MAX_DISCUSSION_ROUNDS = 10;
const MAX_FILE_READS_PER_ROUND = 3;
const MAX_FILE_CHARS = 12_000;
// One discussion sub-turn can be a long model turn (measured ~9 min on a
// free model that reads several files). Keep this generous; the frontend
// browser fetch and the API request logger allow the same budget.
const READ_TIMEOUT_MS = 15 * 60_000;

/**
 * Bound AI prose without touching it.
 *
 * `sanitizeString` escapes HTML and collapses newlines, which is wrong on a
 * React-rendered path (React escapes at render) and destroys the structure a
 * client reads. The discussion reply is therefore trimmed and sliced raw, and
 * secrets are removed by shape afterwards.
 */
function boundRaw(value, max) {
	return String(value ?? "")
		.replace(/\r\n?/gu, "\n")
		.trim()
		.slice(0, max);
}

/** Bound, then redact the secret shapes out of one piece of AI prose. */
function safeProse(value, max) {
	return redactReportSecrets(boundRaw(value, max));
}

// Protocol markers the assistant emits on their own line.
const READ_MARKER = /^READ:\s*(.+)$/iu;
const SUMMARY_MARKER = /^SUMMARY:\s*(.+)$/iu;

/**
 * Emit one live activity row so the buyer sees every action as it happens,
 * not just a count after the turn finishes. Uses the same
 * `support.case.activity` wire shape as the investigation roles, so the
 * ActivityTree renders both phases identically.
 */
function emitDiscussionActivity(caseId, state, kind, label, status = "done") {
	// Persist first so a reload re-seeds the tree; then emit live over SSE.
	recordActivity(state, kind, label, status);
	try {
		emitCaseEvent(caseId, CASE_EVENTS?.activity ?? "support.case.activity", {
			caseId,
			...state.activity[state.activity.length - 1],
		});
	} catch {
		// telemetry must never break the discussion loop
	}
}

// The assistant may only read files inside the repository root, never
// uploads, env files, or anything outside the tree.
function isReadableRepoFile(file) {
	const relative = String(file || "")
		.trim()
		.replace(/\\/gu, "/");
	if (!relative || relative.includes("..")) {
		return false;
	}
	const lower = relative.toLowerCase();
	if (
		lower.startsWith("uploads/") ||
		lower === ".env" ||
		lower.endsWith(".env") ||
		lower.includes("/.env") ||
		lower.includes("\\.env") ||
		lower.startsWith("node_modules/") ||
		lower.startsWith("dist/") ||
		lower.startsWith("build/") ||
		lower.startsWith(".next/") ||
		lower.startsWith("coverage/")
	) {
		return false;
	}
	const resolved = path.resolve(REPOSITORY_ROOT, relative);
	return resolved === REPOSITORY_ROOT || resolved.startsWith(`${REPOSITORY_ROOT}${path.sep}`);
}

function readRepoFile(file) {
	if (!isReadableRepoFile(file)) {
		return null;
	}
	const resolved = path.resolve(REPOSITORY_ROOT, file);
	try {
		const stat = fs.statSync(resolved);
		if (!stat.isFile()) {
			return null;
		}
		if (stat.size > MAX_FILE_CHARS) {
			return null;
		}
		const content = fs.readFileSync(resolved, "utf8");
		return redactReportSecrets(content);
	} catch {
		return null;
	}
}

function defaultDiscussionState() {
	return {
		rounds: 0,
		proposedSummary: null,
		discussionComplete: false,
		filesRead: [],
		// Live activity rows are persisted here so the tree survives a reload.
		activity: [],
		// Last token-usage ping, persisted so the context meter survives a reload
		// (the SSE stash is in-memory only and is lost on server restart).
		lastUsage: null,
	};
}

/** Append one activity row to the persisted state (capped, like the client). */
function recordActivity(state, kind, label, status = "done") {
	if (!Array.isArray(state.activity)) {
		state.activity = [];
	}
	state.activity.push({
		id: crypto.randomUUID(),
		role: "assistant",
		kind,
		label,
		status,
		at: new Date().toISOString(),
	});
	state.activity = state.activity.slice(-200);
}

async function readDiscussionState(caseId) {
	try {
		const store = await readLocalJson(DISCUSSION_STORE, {});
		return store[String(caseId)] || defaultDiscussionState();
	} catch {
		return defaultDiscussionState();
	}
}

async function writeDiscussionState(caseId, state) {
	try {
		const store = await readLocalJson(DISCUSSION_STORE, {});
		store[String(caseId)] = state;
		await writeLocalJson(DISCUSSION_STORE, store);
	} catch (error) {
		logWarn("discussion state write failed", { caseId, error: error?.message || String(error) });
	}
}

function clearDiscussionState(caseId) {
	return writeDiscussionState(caseId, defaultDiscussionState());
}

// Build the discussion prompt: case context, history, file contents, protocol.
function buildDiscussionPrompt({ subject, history, clientMessage, fileContents } = {}) {
	const sections = [];
	if (subject) {
		sections.push(`CASE SUBJECT: ${subject}`);
	}
	if (history.length > 0) {
		sections.push(`CONVERSATION SO FAR:\n${history}`);
	}
	if (fileContents.length > 0) {
		sections.push(`FILE CONTENTS YOU READ:\n${fileContents}`);
	}
	sections.push(`CLIENT SAYS: ${clientMessage}`);
	sections.push("");
	sections.push("DISCUSSION PROTOCOL:");
	sections.push(
		"- You are discussing a support problem with the client. Ask ONE short clarifying question at a time. Never ask two at once.",
	);
	sections.push("- Never ask again for something the client has already told you.");
	sections.push(
		`- If you need to look at code to understand the problem, request a file read on its own line: READ: <file path relative to repo root>. Only one file per line, up to ${MAX_FILE_READS_PER_ROUND} per turn.`,
	);
	sections.push(
		"- When you understand the problem well enough to investigate, propose a summary on its own line: SUMMARY: <one sentence describing the problem>.",
	);
	sections.push("- The client will confirm or deny your summary. If they deny, keep discussing.");
	sections.push(
		"- Never ask unnecessary questions. If you have enough to proceed, propose the summary instead of asking more.",
	);
	sections.push(
		"- Never reveal source code, credentials, secrets, internal identifiers, or implementation details to the client. Name the file and line, never the value.",
	);
	sections.push("- Never promise a fix, refund, or timeline.");
	sections.push("- Reply with the question or summary itself. No preamble, no sign-off.");
	return sections.join("\n\n");
}

// Split an assistant reply into plain text and any READ:/SUMMARY: markers.
function parseAssistantReply(text) {
	const lines = String(text || "").split("\n");
	const reads = [];
	let summary = null;
	const spoken = [];
	for (const line of lines) {
		const trimmed = line.trim();
		const readMatch = trimmed.match(READ_MARKER);
		if (readMatch) {
			const file = readMatch[1].trim();
			if (file && !reads.includes(file)) {
				reads.push(file);
			}
			continue;
		}
		const summaryMatch = trimmed.match(SUMMARY_MARKER);
		if (summaryMatch) {
			const s = summaryMatch[1].trim();
			if (s && !summary) {
				summary = s;
			}
			continue;
		}
		spoken.push(line);
	}
	return {
		spoken: spoken.join("\n").trim(),
		reads: reads.slice(0, MAX_FILE_READS_PER_ROUND),
		summary,
	};
}

async function getEffectiveModelId(caseRow) {
	const { allowed, default: configDefault } = await getInvestigationModelConfig();
	const caseModelId = caseRow?.model_id || null;
	if (caseModelId && Array.isArray(allowed) && allowed.includes(caseModelId)) {
		return caseModelId;
	}
	return configDefault || null;
}

/**
 * Process one discussion turn.
 *
 * @param {Object} params
 * @param {string} params.caseId
 * @param {Object} params.caseRow The SupportCase row.
 * @param {Array<Object>} params.history The transcript, oldest first.
 * @param {string} params.clientMessage The message the client just sent.
 * @returns {Promise<{ state: "question" | "summary_proposed" | "error", reply?: string, reads?: string[], summary?: string, rounds?: number }>}
 *   Never throws.
 */
export async function discuss({ caseId, caseRow, history, clientMessage } = {}) {
	const id = String(caseId || "");
	if (!(id && clientMessage)) {
		return { state: "error", reply: "Unable to start the discussion." };
	}

	const state = await readDiscussionState(id);
	const rounds = Number(state.rounds || 0) + 1;
	if (rounds > MAX_DISCUSSION_ROUNDS) {
		// Cap reached: force a summary from what we have, or fall back.
		const forced =
			state.proposedSummary || `Support case ${id.slice(0, 8)} — problem described by the client.`;
		await writeDiscussionState(id, {
			...state,
			rounds,
			discussionComplete: true,
			proposedSummary: forced,
		});
		return { state: "summary_proposed", summary: forced, rounds };
	}

	let modelId = null;
	let provider = null;
	try {
		modelId = await getEffectiveModelId(caseRow);
		if (modelId) {
			// Mirror the provider's default onUsage but ALSO persist the last
			// ping into the discussion state, so the context meter survives a
			// reload / server restart instead of reading 0 until the next turn.
			provider = makeClarificationProvider({
				modelId,
				caseId: id,
				timeoutMs: READ_TIMEOUT_MS,
				onUsage: (usage) => {
					const point = {
						used: Number(usage?.used) || 0,
						output: Number(usage?.output) || 0,
						reasoning: Number(usage?.reasoning) || 0,
						cacheRead: Number(usage?.cacheRead) || 0,
						cacheWrite: Number(usage?.cacheWrite) || 0,
					};
					state.lastUsage = point;
					try {
						emitCaseEvent(id, CASE_EVENTS?.usage ?? "support.case.usage", {
							caseId: id,
							role: "assistant",
							...point,
						});
					} catch {
						// telemetry must never break the turn
					}
				},
			});
		}
	} catch {
		provider = null;
	}

	const answer = null;
	let currentMessage = clientMessage;
	const fileContents = [];
	const filesReadThisTurn = [];

	// The discussion loop: the assistant may request file reads across
	// multiple sub-turns before replying to the client.
	for (let subTurn = 0; subTurn < 4; subTurn += 1) {
		const prompt = buildDiscussionPrompt({
			subject: caseRow?.subject || "",
			history,
			clientMessage: currentMessage,
			fileContents,
		});

		emitDiscussionActivity(id, state, "other", "Thinking");

		let reply = null;
		if (provider) {
			try {
				reply = await Promise.race([
					provider(prompt, ""),
					new Promise((_, reject) =>
						setTimeout(() => reject(new Error("discussion provider timed out")), READ_TIMEOUT_MS),
					),
				]);
			} catch {
				reply = null;
			}
		}

		if (!reply) {
			// No provider: degrade to a fixed clarifying question.
			reply =
				"Could you describe the problem in a little more detail - what you expected to happen, what actually happened, and which page or workflow you were on?";
		}

		const parsed = parseAssistantReply(reply);

		if (parsed.summary) {
			// The assistant proposes a summary. Store it and ask the client to confirm.
			const summary = safeProse(parsed.summary, 200);
			const nextState = {
				...state,
				rounds,
				proposedSummary: summary,
				discussionComplete: true,
				filesRead: [...state.filesRead, ...filesReadThisTurn],
			};
			await writeDiscussionState(id, nextState);
			emitCaseEvent(id, CASE_EVENTS?.status ?? "support.case.status", {
				caseId: id,
				status: "collecting",
				summary,
			});
			return {
				state: "summary_proposed",
				reply: summary,
				summary,
				rounds,
				reads: filesReadThisTurn,
			};
		}

		if (parsed.reads.length > 0) {
			// The assistant wants to read files. Read them, redact, and feed back.
			const newReads = [];
			for (const file of parsed.reads) {
				if (filesReadThisTurn.includes(file) || state.filesRead.includes(file)) {
					continue;
				}
				const content = readRepoFile(file);
				if (content) {
					emitDiscussionActivity(id, state, "read", `Reading ${path.basename(file)}`);
					newReads.push(file);
					filesReadThisTurn.push(file);
					fileContents.push(`=== ${file} ===\n${content}`);
				}
			}
			if (newReads.length === 0) {
				// Nothing new to read; treat the spoken text as the reply.
				currentMessage =
					parsed.spoken ||
					"I could not read any of the requested files. What else can you tell me about the problem?";
				continue;
			}
			currentMessage = `I read ${newReads.join(", ")}. Based on what I found, what do you think?`;
			continue;
		}

		// Plain text: a question for the client. The controller persists this
		// reply with `appendCaseMessage`, which already emits the SSE event —
		// do NOT emit it here too, or the client merges two copies (one with
		// an id, one without) and shows the reply twice.
		const replyText = safeProse(parsed.spoken || reply, 2000);
		const nextState = { ...state, rounds, filesRead: [...state.filesRead, ...filesReadThisTurn] };
		await writeDiscussionState(id, nextState);
		return { state: "question", reply: replyText, rounds, reads: filesReadThisTurn };
	}

	// Loop cap reached without a summary or question: fall back to a question.
	const replyText = safeProse(
		`I'm still working to understand the problem. Could you tell me more about what you expected to happen versus what actually happened?`,
		2000,
	);
	const nextState = { ...state, rounds, filesRead: [...state.filesRead, ...filesReadThisTurn] };
	await writeDiscussionState(id, nextState);
	return { state: "question", reply: replyText, rounds, reads: filesReadThisTurn };
}

/**
 * The client confirms the proposed summary. The case moves to investigation.
 *
 * @param {string} caseId
 * @returns {Promise<{ ok: boolean, summary?: string, error?: string }>}
 */
export async function confirmDiscussionSummary({ caseId } = {}) {
	const id = String(caseId || "");
	if (!id) {
		return { ok: false, error: "caseId required" };
	}
	const state = await readDiscussionState(id);
	if (!state.proposedSummary) {
		return { ok: false, error: "No summary to confirm" };
	}
	const nextState = { ...state, discussionComplete: true };
	await writeDiscussionState(id, nextState);
	logInfo("discussion summary confirmed", { caseId: id, summary: state.proposedSummary });
	return { ok: true, summary: state.proposedSummary };
}

/**
 * The client denies the proposed summary. Discussion continues.
 *
 * @param {Object} params
 * @param {string} params.caseId
 * @param {string} [params.clientMessage] The client's denial / clarification.
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function denyDiscussionSummary({ caseId, clientMessage } = {}) {
	const id = String(caseId || "");
	if (!id) {
		return { ok: false, error: "caseId required" };
	}
	const state = await readDiscussionState(id);
	if (!state.proposedSummary) {
		return { ok: false, error: "No summary to deny" };
	}
	// Clear the proposed summary so the assistant re-proposes after hearing
	// the client's denial. Keep the round count so we still cap at MAX.
	const nextState = { ...state, proposedSummary: null, discussionComplete: false };
	await writeDiscussionState(id, nextState);
	logInfo("discussion summary denied", { caseId: id });
	return { ok: true };
}

/**
 * Get the current discussion state for a case (for the admin console / UI).
 *
 * @param {string} caseId
 * @returns {Promise<Object|null>}
 */
export async function getDiscussionState(caseId) {
	const id = String(caseId || "");
	if (!id) {
		return null;
	}
	return readDiscussionState(id);
}

/**
 * Clear discussion state for a case (e.g. when the case is deleted).
 *
 * @param {string} caseId
 */
export async function clearDiscussion(caseId) {
	await clearDiscussionState(String(caseId || ""));
}
