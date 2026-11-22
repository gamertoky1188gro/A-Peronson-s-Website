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
import prisma from "../utils/prisma.js";
import { makeClarificationProvider } from "./clarificationOpencodeProvider.js";
import { getInvestigationModelConfig } from "./investigation/investigationModelConfigService.js";
import { REPOSITORY_ROOT } from "./investigation/opencodeRuntime.js";
import { redactReportSecrets } from "./investigation/redaction.js";

const DISCUSSION_STORE = "support_case_discussion.json";
const MAX_DISCUSSION_ROUNDS = 10;
// After this many rounds without a summary, the assistant offers a human.
// The offer is a suggestion, not a decision: the buyer stays in control.
const SUGGEST_HUMAN_ROUNDS = 6;
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
// The assistant records the structured problem brief as one JSON object, and
// flags a genuinely different problem so the buyer can open a new case.
const BRIEF_MARKER = /^BRIEF:\s*(\{.*\})\s*$/iu;
const NEW_CASE_MARKER = /^NEW_CASE:\s*(.+)$/iu;

/** The structured brief fields, in the order the buyer sees them. */
export const BRIEF_FIELDS = [
	"description",
	"expected",
	"actual",
	"page",
	"firstSeen",
	"frequency",
	"impact",
	"evidence",
];

export const BRIEF_FIELD_LABELS = {
	description: "What happened?",
	expected: "What should have happened?",
	actual: "What happened instead?",
	page: "Affected page or feature",
	firstSeen: "When did it start?",
	frequency: "How often?",
	impact: "Business impact",
	evidence: "Evidence",
};

/** Coerce a raw brief object into `{ fields, answered }`. */
function normalizeBriefFields(raw) {
	const fields = {};
	const answered = [];
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
		return { fields, answered };
	}
	for (const key of BRIEF_FIELDS) {
		const value = raw[key];
		if (key === "evidence" && Array.isArray(value)) {
			const list = value
				.map((entry) => String(entry).trim())
				.filter(Boolean)
				.slice(0, 10);
			if (list.length > 0) {
				fields[key] = list;
				answered.push(key);
			}
			continue;
		}
		if (typeof value === "string" && value.trim()) {
			fields[key] = value.trim().slice(0, 2000);
			answered.push(key);
		}
	}
	return { fields, answered };
}

/** Merge an incoming brief into the stored one; a field never disappears. */
export function mergeBrief(existing, incoming) {
	const fields = { ...(existing?.fields || {}) };
	const answered = new Set(Array.isArray(existing?.answered) ? existing.answered : []);
	for (const [key, value] of Object.entries(incoming?.fields || {})) {
		fields[key] = value;
		answered.add(key);
	}
	return { fields, answered: [...answered], updatedAt: new Date().toISOString() };
}

/** Persist the brief to the case row (DB-backed: survives a redeploy). */
async function persistBrief(caseId, brief) {
	try {
		await prisma.supportCase.update({
			where: { id: String(caseId) },
			data: { brief },
		});
	} catch (error) {
		logWarn("brief persist failed", { caseId, error: error?.message || String(error) });
	}
}

/**
 * Emit one live activity row so the buyer sees every action as it happens,
 * not just a count after the turn finishes. Uses the same
 * `support.case.activity` wire shape as the investigation roles, so the
 * ActivityTree renders both phases identically.
 *
 * `id` is optional: when given, re-emitting with the same id updates the
 * existing row (used for the Thinking running→done lifecycle). Without an id
 * a fresh row is created.
 */
function emitDiscussionActivity(caseId, state, kind, label, status = "done", id) {
	// Persist first so a reload re-seeds the tree; then emit live over SSE.
	// recordActivity returns the exact row written (it may UPDATE an existing
	// id in place rather than append), so emit that row — not the last one.
	const row = recordActivity(state, kind, label, status, id);
	try {
		emitCaseEvent(caseId, CASE_EVENTS?.activity ?? "support.case.activity", {
			caseId,
			...row,
			...(id ? { runId: state.runId } : {}),
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
		problemBrief: null,
		briefStatus: "draft",
		discussionComplete: false,
		filesRead: [],
		// Isolates this discussion's activity from investigation runs and from
		// other discussion rounds on the same case.
		runId: crypto.randomUUID(),
		// Live activity rows are persisted here so the tree survives a reload.
		activity: [],
		// Last token-usage ping, persisted so the context meter survives a reload
		// (the SSE stash is in-memory only and is lost on server restart).
		lastUsage: null,
	};
}

/** Append one activity row to the persisted state (capped, like the client).
 * When `id` is given, replace the existing row with that id instead of
 * appending — used for the Thinking running→done lifecycle. */
function recordActivity(state, kind, label, status = "done", id) {
	if (!Array.isArray(state.activity)) {
		state.activity = [];
	}
	const row = {
		id: id ?? crypto.randomUUID(),
		role: "assistant",
		kind,
		label,
		status,
		runId: state.runId,
		at: new Date().toISOString(),
	};
	if (id) {
		const index = state.activity.findIndex((entry) => entry.id === id);
		if (index >= 0) {
			state.activity[index] = row;
		} else {
			state.activity.push(row);
		}
	} else {
		state.activity.push(row);
	}
	state.activity = state.activity.slice(-200);
	return row;
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

/**
 * After enough rounds without progress, offer a human. The offer is appended
 * to the assistant's question and flagged in the result so the UI can show a
 * "talk to a human" hint. The buyer decides; the assistant never escalates on
 * its own.
 */
function withHumanOffer(text, rounds, state) {
	const suggestHuman = rounds >= SUGGEST_HUMAN_ROUNDS && !state?.proposedSummary;
	if (!suggestHuman) {
		return { text, suggestHuman: false };
	}
	return {
		text: `${text}\n\nWe've been going back and forth for a while now. If you'd prefer, I can bring in a human support representative - just say so.`,
		suggestHuman: true,
	};
}

// Build the discussion prompt: case context, history, file contents, protocol.
function buildDiscussionPrompt({ subject, history, clientMessage, fileContents, brief } = {}) {
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
	if (brief) {
		const answered = Object.entries(brief.fields || {})
			.map(
				([key, value]) =>
					`- ${BRIEF_FIELD_LABELS[key] || key}: ${Array.isArray(value) ? value.join(", ") : value}`,
			)
			.join("\n");
		const answeredBlock = answered || "(none answered yet)";
		sections.push(`PROBLEM BRIEF ANSWERED SO FAR (do NOT ask again for these):\n${answeredBlock}`);
		sections.push(
			'- When you learn a new field, record it on its own line as a JSON object: BRIEF: {"description":"...","expected":"...","actual":"...","page":"...","firstSeen":"...","frequency":"always|sometimes|once","impact":"...","evidence":["file.png"]}. Only include the fields you actually learned; omit the rest.',
		);
		sections.push(
			"- Ask for the fields that are still missing, one question at a time. Do not re-ask a field that is already answered above.",
		);
	}
	sections.push(
		`- If you need to look at code to understand the problem, request a file read on its own line: READ: <file path relative to repo root>. Only one file per line, up to ${MAX_FILE_READS_PER_ROUND} per turn.`,
	);
	sections.push(
		"- When the client describes a DIFFERENT problem from the one this case is about, say so on its own line: NEW_CASE: <one sentence explaining why it looks like a different problem>. Do NOT use this for the same problem described differently.",
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

// Split an assistant reply into plain text and any READ:/SUMMARY:/BRIEF:/NEW_CASE: markers.
function parseAssistantReply(text) {
	const lines = String(text || "").split("\n");
	const reads = [];
	let summary = null;
	let briefRaw = null;
	let newCase = null;
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
		const briefMatch = trimmed.match(BRIEF_MARKER);
		if (briefMatch) {
			try {
				const parsed = JSON.parse(briefMatch[1]);
				if (parsed && typeof parsed === "object") {
					briefRaw = parsed;
				}
			} catch {
				// A malformed BRIEF is ignored; the spoken text still answers.
			}
			continue;
		}
		const newCaseMatch = trimmed.match(NEW_CASE_MARKER);
		if (newCaseMatch) {
			const reason = newCaseMatch[1].trim();
			if (reason && !newCase) {
				newCase = reason;
			}
			continue;
		}
		spoken.push(line);
	}
	return {
		spoken: spoken.join("\n").trim(),
		reads: reads.slice(0, MAX_FILE_READS_PER_ROUND),
		summary,
		brief: briefRaw ? normalizeBriefFields(briefRaw) : null,
		newCase,
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
	let currentBrief = caseRow?.brief ?? state.brief ?? null;
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
			brief: currentBrief,
		});

		// Thinking starts as "running" while the provider works, and flips to
		// "done" once the reply settles — a proper lifecycle instead of
		// recording completion before the provider has finished.
		const thinkingId = `thinking-${subTurn}`;
		emitDiscussionActivity(id, state, "think", "Thinking", "running", thinkingId);

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
		emitDiscussionActivity(id, state, "think", "Thinking", "done", thinkingId);

		if (!reply) {
			// No provider: degrade to a fixed clarifying question.
			reply =
				"Could you describe the problem in a little more detail - what you expected to happen, what actually happened, and which page or workflow you were on?";
		}

		const parsed = parseAssistantReply(reply);

		// Record any structured brief fields the assistant learned this turn.
		// Merged into the stored brief and persisted to the case row (DB), so
		// the answers survive a redeploy and are visible in the admin console.
		if (parsed.brief) {
			currentBrief = mergeBrief(currentBrief, parsed.brief);
			state.brief = currentBrief;
			await persistBrief(id, currentBrief);
		}

		// The assistant believes this is a genuinely different problem. It must
		// NOT decide that silently: the buyer is told and chooses.
		if (parsed.newCase) {
			const replyText = safeProse(
				parsed.spoken ||
					"It sounds like this might be a different problem from the one this case is about.",
				2000,
			);
			const nextState = {
				...state,
				rounds,
				filesRead: [...state.filesRead, ...filesReadThisTurn],
			};
			await writeDiscussionState(id, nextState);
			return {
				state: "new_problem",
				reply: replyText,
				newCaseReason: safeProse(parsed.newCase, 500),
				rounds,
				reads: filesReadThisTurn,
			};
		}

		if (parsed.summary) {
			// The assistant proposes a summary. Store it as the editable
			// problem brief and ask the client to confirm.
			const summary = safeProse(parsed.summary, 200);
			const nextState = {
				...state,
				rounds,
				proposedSummary: summary,
				problemBrief: summary,
				briefStatus: "draft",
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
				problemBrief: summary,
				briefStatus: "draft",
				brief: currentBrief,
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
		const offered = withHumanOffer(replyText, rounds, state);
		const nextState = { ...state, rounds, filesRead: [...state.filesRead, ...filesReadThisTurn] };
		await writeDiscussionState(id, nextState);
		return {
			state: "question",
			reply: offered.text,
			rounds,
			reads: filesReadThisTurn,
			brief: currentBrief,
			suggestHuman: offered.suggestHuman,
		};
	}

	// Loop cap reached without a summary or question: fall back to a question.
	const replyText = safeProse(
		`I'm still working to understand the problem. Could you tell me more about what you expected to happen versus what actually happened?`,
		2000,
	);
	const nextState = { ...state, rounds, filesRead: [...state.filesRead, ...filesReadThisTurn] };
	await writeDiscussionState(id, nextState);
	const offeredFallback = withHumanOffer(replyText, rounds, state);
	return {
		state: "question",
		reply: offeredFallback.text,
		rounds,
		reads: filesReadThisTurn,
		brief: currentBrief,
		suggestHuman: offeredFallback.suggestHuman,
	};
}

/**
 * The client edits the proposed problem brief before confirming.
 *
 * @param {Object} params
 * @param {string} params.caseId
 * @param {string} params.brief The edited brief text.
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function updateProblemBrief({ caseId, brief, fields } = {}) {
	const id = String(caseId || "");
	if (!id) {
		return { ok: false, error: "caseId required" };
	}
	const state = await readDiscussionState(id);
	const text = String(brief ?? "").trim();
	const incomingFields = fields ? normalizeBriefFields(fields) : null;
	if (!(text || incomingFields)) {
		return { ok: false, error: "brief required" };
	}
	// Structured fields are merged into the case brief and persisted to the DB.
	let merged = state.brief ?? null;
	if (incomingFields) {
		merged = mergeBrief(merged, incomingFields);
		state.brief = merged;
		await persistBrief(id, merged);
	}
	if (text) {
		state.problemBrief = text;
	}
	state.briefStatus = "draft";
	await writeDiscussionState(id, state);
	logInfo("problem brief updated", { caseId: id, fields: merged?.answered ?? [] });
	return { ok: true, brief: merged };
}

/**
 * The client confirms the proposed summary. The case moves to investigation.
 * The confirmed brief (possibly edited) becomes the case summary.
 *
 * @param {Object} params
 * @param {string} params.caseId
 * @param {string} [params.brief] Optional edited brief; falls back to the
 *   proposed summary.
 * @returns {Promise<{ ok: boolean, summary?: string, error?: string }>}
 */
export async function confirmDiscussionSummary({ caseId, brief } = {}) {
	const id = String(caseId || "");
	if (!id) {
		return { ok: false, error: "caseId required" };
	}
	const state = await readDiscussionState(id);
	if (!(state.proposedSummary || brief)) {
		return { ok: false, error: "No summary to confirm" };
	}
	const confirmedBrief = brief && brief.trim() ? brief.trim() : state.proposedSummary;
	const nextState = {
		...state,
		discussionComplete: true,
		briefStatus: "confirmed",
	};
	if (confirmedBrief) {
		nextState.problemBrief = confirmedBrief;
		nextState.proposedSummary = confirmedBrief;
	}
	await writeDiscussionState(id, nextState);
	logInfo("discussion summary confirmed", { caseId: id, summary: confirmedBrief });
	return { ok: true, summary: confirmedBrief };
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
