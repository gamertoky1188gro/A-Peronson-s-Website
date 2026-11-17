import { useCallback, useEffect, useReducer } from "react";
import { apiRequest, getToken } from "../lib/auth.js";
import { subscribeToCase } from "../lib/caseRealtime.js";

// The state hook for one support investigation case.
//
// It owns the case row, the conversation, the live progress and the report,
// and it is the only thing that talks to the case API: the page renders what
// this hook returns and calls the actions it exposes.
//
// The HTTP contract is contracts.md §3 and the event contract is §4. Both
// belong to the server; this hook only reads them.

const INITIAL_CASE_STATE = {
	caseRow: null,
	messages: [],
	status: null,
	error: null,
	errorStatus: null,
	report: null,
	progress: [],
	findings: [],
	activity: [],
	attachments: [],
	usage: null,
	loading: false,
	feedback: null,
};

function compareBySequence(a, b) {
	const left = Number(a?.sequence);
	const right = Number(b?.sequence);
	if (Number.isFinite(left) && Number.isFinite(right) && left !== right) {
		return left - right;
	}
	return 0;
}

// Merges messages into a conversation, replacing a message already there.
//
// The same message arrives twice: once as the POST response and once over the
// event stream, because the server appends it and then announces it. Without
// this, every message would appear twice in the transcript.
function mergeMessages(existing, incoming) {
	const list = Array.isArray(existing) ? [...existing] : [];
	for (const message of incoming || []) {
		if (message && typeof message === "object") {
			const id = message.id ?? null;
			const index = id ? list.findIndex((entry) => entry?.id === id) : -1;
			if (index >= 0) {
				list[index] = { ...list[index], ...message };
			} else {
				list.push(message);
			}
		}
	}
	return list.sort(compareBySequence);
}

// Adds attachments to the case's attachment list, without duplicating one
// that is already there. An attachment that carries an id is matched on it;
// one without (the local payload kept for a send that has not been
// re-fetched) is matched on its path, so a send-then-reload does not show
// the same file twice.
function mergeAttachments(existing, incoming) {
	const list = Array.isArray(existing) ? [...existing] : [];
	for (const attachment of incoming || []) {
		if (!attachment || typeof attachment !== "object") {
			continue;
		}
		const id = attachment.id ?? null;
		const filePath = attachment.file_path ?? null;
		if (!(id || filePath)) {
			continue;
		}
		const index = list.findIndex((entry) => {
			if (id && entry?.id) {
				return entry.id === id;
			}
			if (filePath && entry?.file_path) {
				return entry.file_path === filePath;
			}
			return false;
		});
		if (index >= 0) {
			list[index] = { ...list[index], ...attachment };
		} else {
			list.push(attachment);
		}
	}
	return list;
}

// Puts one investigation role's progress in the list, replacing its earlier
// entry and keeping its position.
function upsertProgress(list, entry) {
	const rows = Array.isArray(list) ? [...list] : [];
	const index = rows.findIndex((row) => row?.role === entry?.role);
	if (index >= 0) {
		rows[index] = { ...rows[index], ...entry };
	} else {
		rows.push(entry);
	}
	return rows;
}

// Puts one activity row in the list, replacing the row with the same id.
// Capped at the last 200 rows; the tree never renders more than that.
function upsertActivityRow(list, entry) {
	const rows = Array.isArray(list) ? [...list] : [];
	const index = rows.findIndex((row) => row?.id === entry.id);
	if (index >= 0) {
		rows[index] = { ...rows[index], ...entry };
	} else {
		rows.push(entry);
	}
	return rows.slice(-200);
}

// Merges the persisted seed rows with the live rows (which arrive over SSE
// after mount and carry server uuids — they never collide with the seeded
// persist:* ids, but dedupe by id anyway). Live rows are kept; the cap is 200.
function mergeActivity(live, seeds) {
	const merged = [...(Array.isArray(seeds) ? seeds : []), ...(Array.isArray(live) ? live : [])];
	const byId = new Map();
	for (const row of merged) {
		if (row && typeof row === "object" && row.id) {
			byId.set(row.id, { ...byId.get(row.id), ...row });
		}
	}
	return [...byId.values()].slice(-200);
}

// Reduces the persisted investigation projection (GET /support/cases/:caseId)
// to activity rows, so a page reload re-seeds the tree from what the server
// actually recorded. Labels come from the server's tool log verbatim (already
// sanitized there); an entry without one degrades to "Using <tool>". Capped
// at the last 200 rows, like the live upsert path — a long rerun across all
// roles can exceed that, and the tree never renders more.
function seedActivityFromInvestigations(investigations) {
	const rows = [];
	for (const investigation of Array.isArray(investigations) ? investigations : []) {
		const role = investigation?.role ?? null;
		const completedAt = investigation?.completed_at;
		const date = completedAt ? new Date(completedAt) : null;
		const at = date && !Number.isNaN(date.getTime()) ? date.toISOString() : "";
		const seedTag = Date.parse(at) || "x";
		const entries = Array.isArray(investigation?.tool_log) ? investigation.tool_log : [];
		entries.forEach((entry, index) => {
			const kind = typeof entry?.kind === "string" ? entry.kind : "other";
			const label =
				typeof entry?.label === "string" && entry.label.trim()
					? entry.label.trim()
					: `Using ${String(entry?.tool ?? "tool").slice(0, 32)}`;
			const failed = entry?.status === "failed" || entry?.status === "error";
			rows.push({
				id: `persist:${role}:${index}:${seedTag}`,
				role,
				kind,
				label: String(label).slice(0, 80),
				status: failed ? "failed" : "done",
				at,
			});
		});
	}
	return rows.slice(-200);
}

// Reduces an attachment to the three keys the message endpoint accepts.
function toAttachmentPayload(attachment) {
	const filePath = attachment?.file_path ?? null;
	if (!filePath) {
		return null;
	}
	const payload = { file_path: String(filePath) };
	if (attachment?.mime_type) {
		payload.mime_type = String(attachment.mime_type);
	}
	const byteSize = Number(attachment?.byte_size);
	if (Number.isFinite(byteSize) && byteSize > 0) {
		payload.byte_size = byteSize;
	}
	return payload;
}

function buildAttachmentPayload(attachments) {
	const payload = [];
	for (const attachment of attachments || []) {
		const entry = toAttachmentPayload(attachment);
		if (entry) {
			payload.push(entry);
		}
	}
	return payload;
}

// The case status changed.
function applyStatusEvent(state, payload) {
	const status = payload?.status ?? null;
	if (!status) {
		return state;
	}
	const summary = payload?.summary ? { summary: payload.summary } : {};
	const caseRow = state.caseRow ? { ...state.caseRow, status, ...summary } : state.caseRow;
	return { ...state, status, caseRow };
}

// The report is ready.
function applyReportEvent(state, payload) {
	const reportStatus = payload?.reportStatus ?? null;
	const caseRow = state.caseRow
		? { ...state.caseRow, report_status: reportStatus ?? state.caseRow.report_status }
		: state.caseRow;
	return {
		...state,
		report: { report: payload?.report ?? null, reportStatus },
		caseRow,
	};
}

// Applies one realtime event (contracts.md §4) to the case state.
function applyCaseEvent(state, action) {
	const { eventType, payload } = action;
	switch (eventType) {
		case "support.case.message":
			return { ...state, messages: mergeMessages(state.messages, [payload?.message]) };
		case "support.case.status":
			return applyStatusEvent(state, payload);
		case "support.case.progress": {
			const role = payload?.role ?? null;
			if (!role) {
				return state;
			}
			const entry = { role, status: payload?.status ?? null, detail: payload?.detail ?? null };
			return { ...state, progress: upsertProgress(state.progress, entry) };
		}
		case "support.case.finding": {
			const finding = payload?.finding ?? null;
			if (!finding) {
				return state;
			}
			return { ...state, findings: [...state.findings, { role: payload?.role ?? null, finding }] };
		}
		case "support.case.report":
			return applyReportEvent(state, payload);
		case "support.case.usage": {
			// A context ping from a role run. The payload is the model's own
			// report: `used` is the prompt size the newest assistant message
			// was fed, i.e. what the context window is holding right now. The
			// last event wins — a fresh role starts from zero.
			const used = Number(payload?.used);
			if (!Number.isFinite(used) || used < 0) {
				return state;
			}
			return {
				...state,
				usage: {
					used: Math.floor(used),
					output: Number.isFinite(Number(payload?.output))
						? Math.max(0, Math.floor(Number(payload.output)))
						: 0,
					reasoning: Number.isFinite(Number(payload?.reasoning))
						? Math.max(0, Math.floor(Number(payload.reasoning)))
						: 0,
					cacheRead: Number.isFinite(Number(payload?.cacheRead))
						? Math.max(0, Math.floor(Number(payload.cacheRead)))
						: 0,
					cacheWrite: Number.isFinite(Number(payload?.cacheWrite))
						? Math.max(0, Math.floor(Number(payload.cacheWrite)))
						: 0,
				},
			};
		}
		case "support.case.activity": {
			const activityPayload = payload;
			if (!activityPayload?.id) {
				return state;
			}
			const entry = {
				id: String(activityPayload.id),
				role: typeof activityPayload.role === "string" ? activityPayload.role : undefined,
				kind: typeof activityPayload.kind === "string" ? activityPayload.kind : "other",
				label:
					typeof activityPayload.label === "string"
						? activityPayload.label.slice(0, 80)
						: "Working",
				status: activityPayload.status === "failed" ? "failed" : "done",
				at: typeof activityPayload.at === "string" ? activityPayload.at : undefined,
			};
			return { ...state, activity: upsertActivityRow(state.activity, entry) };
		}
		default:
			return state;
	}
}

// Applies the answer to a posted message: the two new messages, the
// attachments that travelled with them, the "ready" flag, and the
// server-minted subject when this was the first client message.
function applySent(state, action) {
	const { data, attachments } = action;
	const ready = data?.ready === true;
	const subject =
		typeof data?.subject === "string" && data.subject.trim() ? data.subject.trim() : null;
	const caseRow =
		state.caseRow && (ready || subject)
			? {
					...state.caseRow,
					...(ready ? { status: "investigating" } : {}),
					...(subject ? { subject } : {}),
				}
			: state.caseRow;
	return {
		...state,
		messages: mergeMessages(state.messages, [data?.message, data?.reply]),
		attachments: mergeAttachments(state.attachments, attachments),
		status: ready ? "investigating" : state.status,
		caseRow,
	};
}

// Every state transition of the hook, in one place.
function caseReducer(state, action) {
	switch (action.type) {
		case "reset":
			return { ...INITIAL_CASE_STATE };
		case "load:start":
			return { ...state, loading: true, error: null };
		case "load:ok":
			return {
				...state,
				loading: false,
				error: null,
				errorStatus: null,
				caseRow: action.caseRow,
				messages: Array.isArray(action.messages) ? action.messages : [],
				status: action.status ?? null,
				attachments: mergeAttachments(state.attachments, action.attachments),
				feedback: action.feedback ?? null,
				activity: mergeActivity(
					state.activity,
					seedActivityFromInvestigations(action.investigations),
				),
			};
		case "feedback:set":
			return {
				...state,
				error: null,
				errorStatus: null,
				feedback: action.feedback ?? null,
			};
		case "error:set":
			return {
				...state,
				loading: false,
				error: action.error ?? null,
				errorStatus: action.status ?? null,
			};
		case "error:clear":
			return { ...state, error: null, errorStatus: null };
		case "event":
			return applyCaseEvent(state, action);
		case "sent":
			return applySent(state, action);
		case "attached":
			return { ...state, attachments: mergeAttachments(state.attachments, [action.attachment]) };
		case "confirmed":
			return {
				...state,
				caseRow: action.caseRow,
				status: action.caseRow?.status ?? "investigating",
			};
		default:
			return state;
	}
}

// The support token, when a buyer is in "ai" care mode. Spread into apiRequest's
// headers only then; signed-in requests carry nothing new.
function supportTokenHeaders(supportToken) {
	return supportToken ? { "x-support-token": supportToken } : undefined;
}

// GET /support/cases/:caseId
async function loadCaseAction(caseId, dispatch, supportToken = "") {
	if (!caseId) {
		dispatch({ type: "reset" });
		return null;
	}
	dispatch({ type: "load:start" });
	try {
		const data = await apiRequest(`/support/cases/${caseId}`, {
			token: getToken(),
			headers: supportTokenHeaders(supportToken),
			skipSessionClear: Boolean(supportToken),
		});
		dispatch({
			type: "load:ok",
			caseRow: data?.case ?? null,
			messages: data?.messages,
			status: data?.case?.status ?? null,
			attachments: data?.attachments,
			feedback: data?.feedback ?? null,
			investigations: data?.investigations,
		});
		return data?.case ?? null;
	} catch (err) {
		dispatch({
			type: "error:set",
			error: err?.message || "Unable to load this support case.",
			status: err?.status ?? null,
		});
		return null;
	}
}

// POST /support/cases/:caseId/messages
async function sendMessageAction(caseId, dispatch, content, attachmentList, supportToken = "") {
	const text = String(content ?? "").trim();
	if (!caseId) {
		dispatch({ type: "error:set", error: "No support case is open." });
		return null;
	}
	if (!text) {
		dispatch({ type: "error:set", error: "Write a message before sending." });
		return null;
	}
	const attachments = buildAttachmentPayload(attachmentList);
	try {
		const data = await apiRequest(`/support/cases/${caseId}/messages`, {
			method: "POST",
			token: getToken(),
			headers: supportTokenHeaders(supportToken),
			skipSessionClear: Boolean(supportToken),
			body: { content: text, ...(attachments.length > 0 ? { attachments } : {}) },
		});
		dispatch({ type: "sent", data, attachments });
		return data ?? null;
	} catch (err) {
		dispatch({
			type: "error:set",
			error: err?.message || "Unable to send the message.",
			status: err?.status ?? null,
		});
		return null;
	}
}

// POST /documents - the file lands in the gated /uploads/support namespace and
// is served only through a signed url. The document row is anchored on the
// CASE, and it is written at upload time, which is the only moment the
// uploader is known.
async function attachFileAction(caseId, dispatch, file, supportToken = "") {
	if (!caseId) {
		dispatch({ type: "error:set", error: "No support case is open." });
		return null;
	}
	if (!file) {
		dispatch({ type: "error:set", error: "No file was chosen." });
		return null;
	}
	const form = new FormData();
	form.append("file", file);
	form.append("entity_type", "support_case");
	form.append("entity_id", caseId);
	form.append("type", "attachment");
	try {
		const doc = await apiRequest("/documents", {
			method: "POST",
			token: getToken(),
			headers: supportTokenHeaders(supportToken),
			skipSessionClear: Boolean(supportToken),
			body: form,
		});
		const descriptor = toAttachmentPayload({
			file_path: doc?.file_path,
			mime_type: file.type || null,
			byte_size: file.size,
		});
		if (!descriptor) {
			dispatch({
				type: "error:set",
				error: "The file was uploaded but the server did not return a path.",
			});
			return null;
		}
		dispatch({ type: "attached", attachment: descriptor });
		return descriptor;
	} catch (err) {
		// No status on purpose: a /documents 401 is JWT-only and must not be
		// read as a support-token 401 by the panel's watcher. The panel shows
		// the message; it must not exit.
		dispatch({
			type: "error:set",
			error: err?.message || "Unable to upload the attachment.",
		});
		return null;
	}
}

// POST /support/cases/:caseId/feedback
async function submitFeedbackAction(caseId, dispatch, payload, supportToken = "") {
	if (!caseId) {
		dispatch({ type: "error:set", error: "No support case is open." });
		return null;
	}
	try {
		const data = await apiRequest(`/support/cases/${caseId}/feedback`, {
			method: "POST",
			token: getToken(),
			headers: supportTokenHeaders(supportToken),
			skipSessionClear: Boolean(supportToken),
			body: payload,
		});
		dispatch({ type: "feedback:set", feedback: data?.feedback ?? null });
		return data?.feedback ?? null;
	} catch (err) {
		dispatch({
			type: "error:set",
			error: err?.message || "Unable to save feedback.",
			status: err?.status ?? null,
		});
		return null;
	}
}

// POST /support/cases/:caseId/confirm
async function confirmCaseAction(caseId, dispatch, supportToken = "") {
	if (!caseId) {
		dispatch({ type: "error:set", error: "No support case is open." });
		return null;
	}
	try {
		const data = await apiRequest(`/support/cases/${caseId}/confirm`, {
			method: "POST",
			token: getToken(),
			headers: supportTokenHeaders(supportToken),
			skipSessionClear: Boolean(supportToken),
		});
		const caseRow = data?.case ?? null;
		dispatch({ type: "confirmed", caseRow });
		return caseRow;
	} catch (err) {
		dispatch({
			type: "error:set",
			error: err?.message || "Unable to confirm the case.",
			status: err?.status ?? null,
		});
		return null;
	}
}

/**
 * Loads one case and keeps it live.
 *
 * @param {string | { caseId?: string }} [caseIdInput] - The support case id,
 *   either directly or as `{ caseId }`. With no id the hook is inert: it
 *   exposes the same actions and they report that no case is open.
 * @param {string} [supportToken] - The buyer support token, set only in the
 *   "ai" care mode. It rides the `x-support-token` header; nothing persists it.
 * @returns {Object} The case state and its actions.
 */
function useSupportCase(caseIdInput = null, supportToken = "") {
	const caseId = typeof caseIdInput === "string" ? caseIdInput : (caseIdInput?.caseId ?? null);
	const [state, dispatch] = useReducer(caseReducer, INITIAL_CASE_STATE);

	const clearError = useCallback(() => {
		dispatch({ type: "error:clear" });
	}, []);

	const refresh = useCallback(
		() => loadCaseAction(caseId, dispatch, supportToken),
		[caseId, supportToken],
	);

	const send = useCallback(
		(content, attachmentList) =>
			sendMessageAction(caseId, dispatch, content, attachmentList, supportToken),
		[caseId, supportToken],
	);

	const attach = useCallback(
		(file) => attachFileAction(caseId, dispatch, file, supportToken),
		[caseId, supportToken],
	);

	const confirm = useCallback(
		() => confirmCaseAction(caseId, dispatch, supportToken),
		[caseId, supportToken],
	);

	const submitFeedback = useCallback(
		(feedback) => submitFeedbackAction(caseId, dispatch, feedback, supportToken),
		[caseId, supportToken],
	);

	useEffect(() => {
		refresh();
		if (!caseId) {
			return;
		}
		const unsubscribe = subscribeToCase(
			caseId,
			(eventType, payload) => {
				dispatch({ type: "event", eventType, payload });
			},
			supportToken,
		);
		return () => {
			unsubscribe?.();
		};
	}, [caseId, refresh]);

	return {
		caseRow: state.caseRow,
		messages: state.messages,
		status: state.status,
		error: state.error,
		errorStatus: state.errorStatus,
		report: state.report,
		progress: state.progress,
		findings: state.findings,
		activity: state.activity,
		attachments: state.attachments,
		usage: state.usage,
		loading: state.loading,
		feedback: state.feedback,
		send,
		attach,
		confirm,
		submitFeedback,
		refresh,
		clearError,
	};
}

export {
	buildAttachmentPayload,
	caseReducer,
	mergeAttachments,
	mergeMessages,
	seedActivityFromInvestigations,
	toAttachmentPayload,
	upsertProgress,
	useSupportCase,
};
