import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
// Same reasoning as the service namespace above: the emitter is Workstream 1's
// own Part 3C addition, and a case API that cannot boot is worse than one
// that cannot announce a status change.
// biome-ignore lint/performance/noNamespaceImport: the namespace import is deliberate
import * as realtime from "../realtime/realtimeBus.js";
// The namespace is read at call time, so the controller keeps working whether
// or not the service's canReadCase / countClientMessages exports have landed.
// biome-ignore lint/performance/noNamespaceImport: the namespace import is deliberate
import * as caseService from "../services/caseService.js";
import { isSupportEvidenceEntityType } from "../services/documentService.js";
import { authorizeFilePath } from "../services/fileAccessService.js";
import { logError, logInfo, logWarn } from "../utils/logger.js";
import { handleControllerError, isOwnerOrAdmin } from "../utils/permissions.js";
import prisma from "../utils/prisma.js";
import { resolveWithinUploads, uploadsRoot } from "../utils/signedFileUrl.js";
import { sanitizeString } from "../utils/validators.js";

// The case API — the six routes of contracts.md §3:
//
//   POST   /                       -> { case }
//   GET    /                       -> { cases }            (the caller's own)
//   GET    /:caseId                -> { case, messages }
//   POST   /:caseId/messages       -> { message, reply, ready }
//   POST   /:caseId/confirm        -> { case }
//   DELETE /:caseId                -> { ok: true }
//
// The ownership rule is the same on every route: the caller owns the case, or
// the caller holds an owner/admin role. A stranger gets 403 — not 404, not an
// empty body — because a case that exists must never be disguised as one that
// does not.
//
// `ready` is contracts.md §3's rule: the case is ready to be investigated when
// the client confirmed the summary, or when MAX_CLARIFICATION_ROUNDS client
// messages have been sent. When it is ready the case becomes `investigating`
// and the investigation is enqueued.

// Exported so the cap is testable from the outside, not just asserted here.
export const MAX_CLARIFICATION_ROUNDS = caseService.MAX_CLARIFICATION_ROUNDS;

const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_SUMMARY_LENGTH = 2000;
const MAX_ATTACHMENTS_PER_MESSAGE = 10;
const MAX_HISTORY_MESSAGES = 20;
const MAX_FILE_PATH_LENGTH = 400;
const MAX_MIME_TYPE_LENGTH = 120;
const MAX_CLIENT_MESSAGE_SUMMARY_LENGTH = 600;

// The evidence namespace. Support evidence is uploaded through
// POST /api/documents/upload with entity_type "support_case" and entity_id
// <caseId>, and it lands in the gated /uploads/support prefix. Nothing else
// can be attached to a case: a chat file or a contract PDF is anchored by a
// different Document row and a different authorization rule.
const SUPPORT_EVIDENCE_PREFIX = "/uploads/support/";

// A case that has already left `collecting` was confirmed (or is being
// investigated) — the client does not have to confirm it twice.
const CONFIRMED_STATUSES = new Set(["investigating", "reporting", "completed"]);

// The event type is fixed by contracts.md §4.
const CASE_STATUS_EVENT = "support.case.status";

// The five event types of contracts.md §4, in the order they are subscribed.
// The list is READ FROM the realtime bus rather than re-declared here: the
// bus is where the contract's strings live, and a second copy of them is a
// second thing to keep in step. The filter drops anything that is not a
// string, so a bus that has not grown the export yet yields an empty list -
// a stream that forwards nothing, rather than a module that throws on import
// and takes the whole route table down with it.
const CASE_STREAM_EVENT_TYPES = Object.freeze(
	[
		realtime.CASE_EVENTS?.message,
		realtime.CASE_EVENTS?.status,
		realtime.CASE_EVENTS?.progress,
		realtime.CASE_EVENTS?.finding,
		realtime.CASE_EVENTS?.report,
	].filter((type) => typeof type === "string"),
);

// How often a comment frame is written while the case is quiet. Proxies and
// load balancers close an idle connection; a comment keeps the pipe open
// without looking like an event to the client, which ignores every line that
// starts with a colon.
const CASE_STREAM_KEEPALIVE_MS = 30_000;

/**
 * May this caller read this case?
 *
 * `canReadCase` is the service-level helper Workstream 1 added to
 * `caseService.js` (contracts.md §2). The local branch below is the SAME rule
 * written out — the case's own owner, or an owner/admin role — and is used
 * only while that export is absent, so this controller keeps working in the
 * window where the two halves of the workstream have not been merged yet. It
 * is dead code the moment the service export lands.
 *
 * @param {Object} user The authenticated caller.
 * @param {Object|null} caseRow The case row, or null.
 * @returns {boolean}
 */
function canReadCase(user, caseRow) {
	if (!caseRow) {
		return false;
	}
	if (typeof caseService.canReadCase === "function") {
		return Boolean(caseService.canReadCase(user, caseRow));
	}
	if (!user?.id) {
		return false;
	}
	if (String(caseRow.user_id) === String(user.id)) {
		return true;
	}
	return isOwnerOrAdmin(user);
}

/**
 * How many client messages has this case collected?
 *
 * Same arrangement as canReadCase: the service owns the count, the local
 * branch counts the message list the controller has already read.
 *
 * @param {string} caseId
 * @param {Array<Object>} [messages] The case's messages, oldest first.
 * @returns {Promise<number>}
 */
async function countClientMessages(caseId, messages) {
	if (typeof caseService.countClientMessages === "function") {
		const counted = Number(await caseService.countClientMessages(caseId));
		return Number.isFinite(counted) ? counted : 0;
	}
	return (messages || []).filter((message) => message?.role === "client").length;
}

/**
 * The kind of message a client turn is.
 *
 * A client that asks something is a question; a client that describes what
 * happened is an answer. The distinction is what lets the report and the
 * admin console tell the thread's shape apart from its content.
 *
 * @param {string} content
 * @returns {string} "question" | "answer"
 */
function deriveClientMessageKind(content) {
	return content.includes("?") ? "question" : "answer";
}

/**
 * The summary the case is investigated under.
 *
 * The clarification contract (`caseConversationService`) answers with a reply
 * and a ready flag — it carries no summary field — so the summary is composed
 * here, from the subject the client opened the case with and the client's own
 * first description. It is deterministic: the same thread always produces the
 * same summary.
 *
 * @param {Object} caseRow
 * @param {Array<Object>} [messages]
 * @returns {string}
 */
export function buildCaseSummary(caseRow, messages) {
	const subject = sanitizeString(String(caseRow?.subject || ""), MAX_SUMMARY_LENGTH);
	const clientTexts = (messages || [])
		.filter((message) => message?.role === "client")
		.map((message) =>
			sanitizeString(String(message.content || ""), MAX_CLIENT_MESSAGE_SUMMARY_LENGTH),
		);
	const firstClient = clientTexts[0] || "";
	const combined =
		subject && firstClient && subject !== firstClient
			? `${subject} - ${firstClient}`
			: subject || firstClient;
	return sanitizeString(combined, MAX_SUMMARY_LENGTH) || "Support investigation case";
}

/**
 * The offline clarifying question.
 *
 * Deterministic, always available, never a throw: the clarification turn must
 * not fail because a provider is unconfigured, offline or slow. The
 * conversation service owns the wording when it is present; this is the copy
 * used when it is not.
 *
 * @param {number} round The client's current round (1-based).
 * @returns {string}
 */
export function fallbackClarification(round) {
	return `Clarification ${round} of ${MAX_CLARIFICATION_ROUNDS}: which page or feature were you on when this happened, and what did you expect to happen instead?`;
}

// The entry points `caseConversationService` may export. The first one is the
// canonical name in Part 3C; the rest are accepted so the two halves of the
// workstream do not have to agree on the spelling to work.
const CONVERSATION_ENTRYPOINTS = [
	"answerClarification",
	"answerClarifyingQuestion",
	"answerCaseMessage",
	"getClarifyingReply",
];

/**
 * Asks the clarification assistant for the next question.
 *
 * The conversation service belongs to another part of this workstream, so it
 * is loaded lazily: a static import of a module that is not there yet takes
 * the whole route table (and with it the server) down, while a dynamic one
 * degrades to the offline question. The controller owns `ready` — the service
 * is told whether the case is already ready, so it answers with the hand-over
 * notice instead of asking another question.
 *
 * @param {Object} params
 * @param {string} params.subject
 * @param {Array<Object>} params.messages The recent thread.
 * @param {string} params.clientMessage The turn the client just sent.
 * @param {boolean} params.ready Whether the case is already ready.
 * @param {number} params.round
 * @returns {Promise<{ reply: string, ready: boolean, degraded: boolean }>}
 */
async function askClarifyingQuestion({ subject, messages, clientMessage, ready, round }) {
	const history = (messages || [])
		.slice(-MAX_HISTORY_MESSAGES)
		.map((message) => ({ role: message.role, content: message.content }));
	let conversation = null;
	try {
		conversation = await import("../services/caseConversationService.js");
		const entry = CONVERSATION_ENTRYPOINTS.map((name) => conversation?.[name]).find(
			(candidate) => typeof candidate === "function",
		);
		if (!entry) {
			throw new Error("caseConversationService exports no answering function");
		}
		const answer = await entry({
			subject,
			history,
			// The service accepts either name for the transcript.
			messages: history,
			clientMessage,
			ready,
			maxRounds: MAX_CLARIFICATION_ROUNDS,
		});
		const reply = sanitizeString(String(answer?.reply || ""), MAX_MESSAGE_LENGTH);
		if (!reply) {
			throw new Error("caseConversationService returned no reply");
		}
		return {
			reply,
			ready: typeof answer?.ready === "boolean" ? answer.ready : ready,
			degraded: false,
		};
	} catch (error) {
		logWarn("case clarification degraded to the offline question", { reason: error.message });
		const reply = ready
			? conversation?.READY_REPLY ||
				"Thanks - that is enough for the investigation to start. The case is moving to investigation now."
			: conversation?.FALLBACK_CLARIFYING_QUESTION || fallbackClarification(round);
		return { reply: sanitizeString(String(reply), MAX_MESSAGE_LENGTH), ready, degraded: true };
	}
}

/**
 * Hands the case to the investigation queue.
 *
 * The queue belongs to the investigation workstream, so it is loaded lazily
 * for the same reason the conversation service is. A queue that is missing or
 * refuses the job must not undo the transition: the case stays
 * `investigating`, the failure is logged, and the admin console can re-run
 * the investigation. Silently leaving the case in `collecting` would throw
 * the client's answer away.
 *
 * @param {string} caseId
 * @returns {Promise<boolean>} True when the job was handed over.
 */
async function enqueueInvestigation(caseId) {
	try {
		const queue = await import("../services/investigationQueue.js");
		if (typeof queue?.enqueueInvestigation !== "function") {
			throw new Error("investigationQueue exports no enqueueInvestigation");
		}
		await queue.enqueueInvestigation(caseId);
		return true;
	} catch (error) {
		logError("case investigation enqueue failed", { caseId, reason: error.message });
		return false;
	}
}

/**
 * Moves the case into `investigating` and starts the investigation.
 *
 * The status is written before the job is handed over, so the queue's worker
 * reads a case that already says what it is. The status change is announced
 * on the realtime bus (contracts.md §4) — this controller is what changes it.
 *
 * @param {Object} caseRow
 * @param {Array<Object>} [messages]
 * @returns {Promise<Object>} The updated case row.
 */
async function startInvestigation(caseRow, messages) {
	const summary = buildCaseSummary(caseRow, messages);
	const updated = await prisma.supportCase.update({
		where: { id: caseRow.id },
		data: {
			status: "investigating",
			summary,
			// updated_at is a plain default(now()) column, not @updatedAt, so
			// the ordering the case list uses only moves when it is set here.
			updated_at: new Date(),
		},
	});
	// biome-ignore lint/suspicious/noUnnecessaryConditions: the emitter is a sibling part of this workstream and may not be in the tree yet
	realtime.emitCaseEvent?.(caseRow.id, CASE_STATUS_EVENT, {
		caseId: caseRow.id,
		status: "investigating",
		summary,
	});
	await enqueueInvestigation(caseRow.id);
	logInfo("case investigation started", { caseId: caseRow.id, summary });
	return updated;
}

/**
 * Normalizes one attachment the client sent.
 *
 * @param {Object} entry
 * @returns {Object} The candidate attachment.
 */
function normalizeAttachment(entry) {
	const byteSize = Number(entry?.byte_size);
	return {
		file_path: sanitizeString(String(entry?.file_path || ""), MAX_FILE_PATH_LENGTH),
		mime_type: entry?.mime_type
			? sanitizeString(String(entry.mime_type), MAX_MIME_TYPE_LENGTH)
			: null,
		byte_size: Number.isFinite(byteSize) ? Math.trunc(byteSize) : null,
	};
}

/**
 * Checks the shape of the attachments before anything is looked up.
 *
 * @param {Array<Object>} candidates
 * @returns {string|null} The error, or null when the shapes are acceptable.
 */
function validateAttachmentShape(candidates) {
	if (candidates.some((candidate) => !candidate.file_path)) {
		return "attachment.file_path is required";
	}
	if (
		candidates.some(
			(candidate) => !candidate.file_path.toLowerCase().startsWith(SUPPORT_EVIDENCE_PREFIX),
		)
	) {
		return "attachment.file_path must be under /uploads/support/";
	}
	return null;
}

/**
 * Validates the attachments a client sent with a message.
 *
 * Every attachment must be evidence the caller uploaded for THIS case: the
 * path has to be in the gated support namespace, the caller has to be
 * authorized for it, and the Document row behind it has to name this case.
 * A path alone is not a claim — `file_path` is caller-supplied through
 * POST /api/documents/url — so it is checked against the row that anchors it.
 *
 * @param {Object} params
 * @param {Object} params.user The authenticated caller.
 * @param {string} params.caseId
 * @param {unknown} params.raw The request's `attachments` field.
 * @returns {Promise<{ rows: Array<Object>, error: string|null }>}
 */
async function resolveAttachments({ user, caseId, raw }) {
	if (raw === undefined || raw === null) {
		return { rows: [], error: null };
	}
	if (!Array.isArray(raw)) {
		return { rows: [], error: "attachments must be an array" };
	}
	if (raw.length > MAX_ATTACHMENTS_PER_MESSAGE) {
		return { rows: [], error: "too many attachments" };
	}

	const candidates = raw.map(normalizeAttachment);
	const shapeError = validateAttachmentShape(candidates);
	if (shapeError) {
		return { rows: [], error: shapeError };
	}

	// The authorizations do not depend on each other, so they run together.
	const verdicts = await Promise.all(
		candidates.map((candidate) => authorizeFilePath(user, candidate.file_path)),
	);

	const rows = [];
	for (const [index, candidate] of candidates.entries()) {
		const verdict = verdicts[index];
		if (!verdict.ok) {
			return { rows: [], error: "attachment is not accessible" };
		}
		const doc = verdict.doc || {};
		if (
			!isSupportEvidenceEntityType(doc.entity_type) ||
			String(doc.entity_id || "") !== String(caseId)
		) {
			return { rows: [], error: "attachment does not belong to this case" };
		}
		rows.push({ document_id: doc.id || null, ...candidate });
	}
	return { rows, error: null };
}

/**
 * Writes the attachment rows for a case.
 *
 * @param {Object} params
 * @param {string} params.caseId
 * @param {string} params.userId
 * @param {Array<Object>} params.rows
 * @returns {Promise<void>}
 */
async function recordAttachments({ caseId, userId, rows }) {
	await Promise.all(
		rows.map((row) =>
			prisma.supportCaseAttachment.create({
				data: {
					id: crypto.randomUUID(),
					case_id: caseId,
					document_id: row.document_id,
					file_path: row.file_path,
					mime_type: row.mime_type,
					byte_size: row.byte_size,
					uploaded_by: userId,
				},
			}),
		),
	);
}

/**
 * Removes the evidence of a deleted case: the bytes and the Document rows
 * that anchor them.
 *
 * The attachment rows go with the case (the relation cascades), but the
 * Document rows and the files they point at do not — they are not part of the
 * case's foreign key, so the database cannot remove them. Left behind, the
 * uploader would keep a signed URL to a case they asked to be deleted.
 *
 * @param {Array<Object>} attachments The rows `deleteCase` removed.
 * @returns {Promise<void>}
 */
async function removeEvidence(attachments) {
	const supportRoot = path.join(uploadsRoot(), "support");
	await Promise.all(
		(attachments || []).map(async (attachment) => {
			const filePath = String(attachment?.file_path || "");
			if (!filePath) {
				return;
			}

			const abs = resolveWithinUploads(filePath);
			// Only ever unlink inside the evidence namespace: a path that
			// resolves anywhere else is not ours to delete.
			if (abs?.startsWith(supportRoot + path.sep)) {
				try {
					await fs.unlink(abs);
				} catch (error) {
					logWarn("case evidence bytes not removed", { filePath, reason: error.message });
				}
			}

			try {
				await prisma.document.deleteMany?.({ where: { file_path: filePath } });
			} catch (error) {
				logWarn("case evidence row not removed", { filePath, reason: error.message });
			}
		}),
	);
}

/**
 * POST /api/support/cases — opens a case.
 *
 * @param {Object} req
 * @param {Object} res
 */
export async function createCaseController(req, res) {
	try {
		const subject = sanitizeString(String(req.body?.subject || ""), MAX_SUBJECT_LENGTH);
		const created = await caseService.createCase({ userId: req.user.id, subject });
		logInfo("support case opened", { caseId: created?.id, userId: req.user.id });
		return res.status(201).json({ case: created });
	} catch (error) {
		return handleControllerError(res, error);
	}
}

/**
 * GET /api/support/cases — the caller's own cases, most recently touched
 * first.
 *
 * @param {Object} req
 * @param {Object} res
 */
export async function listCasesController(req, res) {
	try {
		const cases = await caseService.listCasesForUser(req.user.id);
		return res.json({ cases });
	} catch (error) {
		return handleControllerError(res, error);
	}
}

/**
 * GET /api/support/cases/:caseId — one case and its thread.
 *
 * @param {Object} req
 * @param {Object} res
 */
export async function getCaseController(req, res) {
	try {
		const caseId = sanitizeString(String(req.params.caseId || ""), 120);
		if (!caseId) {
			return res.status(400).json({ error: "caseId is required" });
		}

		const found = await caseService.getCaseWithMessages(caseId);
		if (!found) {
			return res.status(404).json({ error: "Case not found" });
		}
		if (!canReadCase(req.user, found)) {
			return res.status(403).json({ error: "Forbidden" });
		}

		const { messages, ...caseRow } = found;
		return res.json({ case: caseRow, messages: messages || [] });
	} catch (error) {
		return handleControllerError(res, error);
	}
}

/**
 * POST /api/support/cases/:caseId/messages — one client turn.
 *
 * Appends the client's message, answers with a clarifying question (or with
 * the hand-over notice, once the case is ready), and starts the
 * investigation when the case becomes ready.
 *
 * @param {Object} req
 * @param {Object} res
 */
export async function postCaseMessageController(req, res) {
	try {
		const caseId = sanitizeString(String(req.params.caseId || ""), 120);
		if (!caseId) {
			return res.status(400).json({ error: "caseId is required" });
		}

		const found = await caseService.getCaseWithMessages(caseId);
		if (!found) {
			return res.status(404).json({ error: "Case not found" });
		}
		if (!canReadCase(req.user, found)) {
			return res.status(403).json({ error: "Forbidden" });
		}

		const content = sanitizeString(String(req.body?.content || ""), MAX_MESSAGE_LENGTH);
		if (!content) {
			return res.status(400).json({ error: "content is required" });
		}

		const attachments = await resolveAttachments({
			user: req.user,
			caseId,
			raw: req.body?.attachments,
		});
		if (attachments.error) {
			return res.status(400).json({ error: attachments.error });
		}

		const message = await caseService.appendCaseMessage({
			caseId,
			role: "client",
			kind: deriveClientMessageKind(content),
			content,
			agent: null,
		});
		await recordAttachments({ caseId, userId: req.user.id, rows: attachments.rows });

		const after = await caseService.getCaseWithMessages(caseId);
		const thread = after?.messages || [];
		const rounds = await countClientMessages(caseId, thread);
		const confirmed = CONFIRMED_STATUSES.has(String(found.status || ""));
		// contracts.md §3: ready is "the client confirmed the summary, OR
		// MAX_CLARIFICATION_ROUNDS client messages have been sent".
		const ready = confirmed || rounds >= MAX_CLARIFICATION_ROUNDS;

		const answer = await askClarifyingQuestion({
			subject: found.subject || "",
			messages: thread,
			clientMessage: content,
			ready,
			round: rounds,
		});
		const reply = await caseService.appendCaseMessage({
			caseId,
			role: "assistant",
			kind: ready ? "notice" : "question",
			content: answer.reply,
			agent: null,
		});

		// A case that is already confirmed must not be queued a second time:
		// the investigation is already running.
		if (ready && !confirmed) {
			await startInvestigation(found, thread);
		}

		return res.status(201).json({ message, reply, ready });
	} catch (error) {
		return handleControllerError(res, error);
	}
}

/**
 * POST /api/support/cases/:caseId/confirm — the client confirms the summary.
 *
 * Moves the case into `investigating`, stores the summary it is investigated
 * under, and hands the case to the investigation queue.
 *
 * @param {Object} req
 * @param {Object} res
 */
export async function confirmCaseController(req, res) {
	try {
		const caseId = sanitizeString(String(req.params.caseId || ""), 120);
		if (!caseId) {
			return res.status(400).json({ error: "caseId is required" });
		}

		const found = await caseService.getCaseWithMessages(caseId);
		if (!found) {
			return res.status(404).json({ error: "Case not found" });
		}
		if (!canReadCase(req.user, found)) {
			return res.status(403).json({ error: "Forbidden" });
		}

		const updated = await startInvestigation(found, found.messages || []);
		return res.json({ case: updated });
	} catch (error) {
		return handleControllerError(res, error);
	}
}

/**
 * GET /api/support/cases/:caseId/stream — the case's live event stream.
 *
 * Server-Sent Events. The client subscribes with a plain `fetch`, not an
 * EventSource, because an EventSource cannot carry the Authorization header
 * this server requires — and a token in a query string would put a credential
 * in a URL.
 *
 * The wire format is contracts.md §4's, unchanged:
 *
 *   event: support.case.message
 *   data: {"caseId":"<case id>","message":{...}}
 *
 * So every frame names one of the five fixed event types and carries a JSON
 * envelope that ALWAYS carries the case id. The envelope is flat: the
 * payload's own keys sit next to `caseId` rather than inside a nested
 * `payload` object, exactly as contracts.md §4 writes it.
 *
 * The stream is case-scoped. The bus is shared by every case, so an event
 * for another case is dropped instead of forwarded, and the case id in the
 * envelope is the one this stream is for.
 *
 * @param {Object} req
 * @param {Object} res
 */
export async function streamCaseController(req, res) {
	let caseId;
	try {
		caseId = sanitizeString(String(req.params.caseId || ""), 120);
		if (!caseId) {
			return res.status(400).json({ error: "caseId is required" });
		}

		const found = await caseService.getCaseWithMessages(caseId);
		if (!found) {
			return res.status(404).json({ error: "Case not found" });
		}
		// The stream is the case's own thread. A stranger gets the same 403
		// the read route gives them, not a silent empty stream.
		if (!canReadCase(req.user, found)) {
			return res.status(403).json({ error: "Forbidden" });
		}
	} catch (error) {
		return handleControllerError(res, error);
	}

	res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache, no-transform",
		Connection: "keep-alive",
		"X-Accel-Buffering": "no",
	});

	// The client's reconnect delay. It is read out of this frame, the same
	// way the feed stream publishes it.
	res.write("retry: 3000\n\n");

	let eventId = 0;
	let closed = false;

	const write = (frame) => {
		if (closed || res.writableEnded) {
			return;
		}
		try {
			res.write(frame);
		} catch {
			// The socket went away between the close event and this write.
			// Nothing to do here: the teardown below removes the listeners.
		}
	};

	const send = (type, payload) => {
		eventId += 1;
		const envelope = {
			...(payload && typeof payload === "object" ? payload : {}),
			// The case id in the envelope always wins over one inside the
			// payload: a client routes on it, and a payload that disagreed with
			// the stream would send the event to the wrong case.
			caseId,
		};
		write(`id: ${eventId}\nevent: ${type}\ndata: ${JSON.stringify(envelope)}\n\n`);
	};

	const handlers = new Map();
	for (const type of CASE_STREAM_EVENT_TYPES) {
		const handler = (payload) => {
			if (String(payload?.caseId ?? "") !== String(caseId)) {
				return;
			}
			send(type, payload);
		};
		handlers.set(type, handler);
		realtime.realtimeBus.on(type, handler);
	}

	const keepalive = setInterval(() => {
		write(":keepalive\n\n");
	}, CASE_STREAM_KEEPALIVE_MS);

	// The teardown is idempotent: both the request and the response emit
	// "close", and the listeners must be removed exactly once or every closed
	// stream would leak a handler on the bus.
	const teardown = () => {
		if (closed) {
			return;
		}
		closed = true;
		clearInterval(keepalive);
		for (const [type, handler] of handlers) {
			realtime.realtimeBus.off(type, handler);
		}
	};

	req.on("close", teardown);
	res.on("close", teardown);
}

/**
 * DELETE /api/support/cases/:caseId — the client throws the case away.
 *
 * The case and its thread go; the evidence goes with them, bytes included.
 *
 * @param {Object} req
 * @param {Object} res
 */
export async function deleteCaseController(req, res) {
	try {
		const caseId = sanitizeString(String(req.params.caseId || ""), 120);
		if (!caseId) {
			return res.status(400).json({ error: "caseId is required" });
		}

		const found = await caseService.getCaseWithMessages(caseId);
		if (!found) {
			return res.status(404).json({ error: "Case not found" });
		}
		if (!canReadCase(req.user, found)) {
			return res.status(403).json({ error: "Forbidden" });
		}

		const attachments = await caseService.deleteCase(caseId);
		await removeEvidence(attachments);
		logInfo("support case deleted", { caseId, userId: req.user.id });

		return res.json({ ok: true });
	} catch (error) {
		return handleControllerError(res, error);
	}
}
