/**
 * Reading an opencode v2 assistant turn.
 *
 * The v2 API answers `session.prompt` asynchronously: it returns as soon as the
 * user message is queued, and the assistant's turn has to be polled for.
 *
 * Two facts about the v2 message list are easy to get wrong, and both of them
 * have broken this codebase before:
 *
 *  - The list is ordered NEWEST FIRST. `messages[messages.length - 1]` is the
 *    message that opened the session, not the one that answered the question.
 *    Picking the last element therefore answers with the PREVIOUS turn's
 *    reply, and it settles the poll early because that stale message already
 *    carries `finish: "stop"`.
 *  - A tool call's state moves streaming -> running -> completed without the
 *    content array changing size, so "the content stopped growing" is not a
 *    settle signal.
 *
 * This module has no dependencies on purpose: it is imported by the server
 * service and by the unit tests, and it has to be importable without a
 * database, a model provider or a network.
 */

const DEFAULT_POLL_INTERVAL_MS = 1200;
const DEFAULT_STABLE_POLLS = 20;
const DEFAULT_TIMEOUT_MS = 180_000;

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/** The v2 message list, however it was wrapped. */
export function collectMessages(listed) {
	const messages = listed?.data || listed || [];
	return Array.isArray(messages) ? messages : [];
}

/**
 * The v2 tool error payload is a structured object, not a string. `String()`
 * on it yields "[object Object]", which hides the reason a call was refused.
 */
export function formatToolError(error) {
	if (!error) return;
	if (typeof error === "string") return error;
	const message = error.data?.message || error.message || error.name;
	const detail = message ? String(message) : JSON.stringify(error);
	return detail.slice(0, 400);
}

/** Map a v2 assistant content part onto the part shape the server uses. */
export function mapAssistantPart(part) {
	if (part.type === "text" || part.type === "reasoning") {
		return { type: part.type, text: part.text || "" };
	}
	if (part.type === "tool") {
		const failed = part.state?.status === "error";
		return {
			type: failed ? "tool-result" : "tool-call",
			toolName: part.name || part.tool || "unknown",
			args: part.state?.input || {},
			result: part.state?.content || part.state?.error || null,
		};
	}
	return { type: part.type };
}

/**
 * Put a message list in chronological order.
 *
 * The server is asked for `order: "asc"`, but the list is also sorted here, so
 * a server that answers in the other order cannot make the caller read the
 * wrong message.
 */
export function toChronologicalOrder(messages) {
	if (!Array.isArray(messages) || messages.length < 2) return messages || [];
	const first = messages[0]?.time?.created ?? 0;
	const last = messages[messages.length - 1]?.time?.created ?? 0;
	return first > last ? [...messages].reverse() : messages;
}

/**
 * The newest assistant message of a list, whichever order the list came in.
 * A later message wins a tie on `time.created`.
 */
export function selectNewestAssistant(assistants) {
	let newest = null;
	for (const message of assistants || []) {
		if (!newest) {
			newest = message;
			continue;
		}
		const created = message?.time?.created ?? 0;
		const newestCreated = newest?.time?.created ?? 0;
		if (created >= newestCreated) newest = message;
	}
	return newest;
}

/**
 * Send a prompt and wait for the assistant turn to settle.
 *
 * The turn is tracked by MESSAGE ID: the ids the session already held are
 * snapshotted before the prompt, and only messages the session did not have
 * before belong to this turn. A session that already holds earlier turns
 * therefore cannot answer with them.
 *
 * Returns:
 *  - `messages`  the messages of THIS turn, oldest first
 *  - `assistants` this turn's assistant messages, oldest first
 *  - `newest`    this turn's newest assistant message
 *  - `content`   this turn's raw assistant content parts, oldest first
 *  - `parts`     the newest assistant message's parts, mapped
 *  - `text`      this turn's text, oldest first
 */
export async function waitForAssistantTurn({
	client,
	sessionID,
	text,
	timeoutMs = DEFAULT_TIMEOUT_MS,
	pollIntervalMs = DEFAULT_POLL_INTERVAL_MS,
	stablePollsToSettle = DEFAULT_STABLE_POLLS,
	onText = null,
}) {
	let seen = new Set();
	try {
		seen = new Set(
			collectMessages(await client.message.list({ sessionID }))
				.map((message) => message.id)
				.filter(Boolean),
		);
	} catch {
		seen = new Set();
	}

	await client.session.prompt({ sessionID, text });

	const deadline = Date.now() + timeoutMs;
	let fresh = [];
	let assistants = [];
	let newest = null;
	let content = [];
	let parts = [];
	let texts = [];
	let stablePolls = 0;
	let signature = "";
	let emitted = 0;

	while (Date.now() < deadline) {
		await sleep(pollIntervalMs);
		let listed = [];
		try {
			listed = collectMessages(await client.message.list({ sessionID, order: "asc" }));
		} catch {
			continue;
		}

		fresh = toChronologicalOrder(listed.filter((message) => !seen.has(message.id)));
		assistants = fresh.filter((message) => message.type === "assistant");
		newest = selectNewestAssistant(assistants);
		content = assistants.flatMap((message) => message.content || []);
		parts = (newest?.content || []).map(mapAssistantPart);
		texts = content.filter((part) => part.type === "text").map((part) => part.text || "");

		if (onText) {
			const total = texts.join("\n");
			if (total.length > emitted) {
				onText(total.slice(emitted.length), total);
				emitted = total.length;
			}
		}

		const nextSignature = JSON.stringify([
			assistants.length,
			content.length,
			content.map((part) =>
				part.type === "tool" ? `${part.name || part.tool}:${part.state?.status}` : part.type,
			),
		]);
		if (nextSignature === signature) stablePolls += 1;
		else {
			signature = nextSignature;
			stablePolls = 0;
		}

		const finished = Boolean(newest?.finish) && newest.finish !== "tool-calls";
		const idle = fresh.some((message) => message.type === "idle");
		const stillRunning = content.some(
			(part) =>
				part.type === "tool" &&
				(part.state?.status === "running" || part.state?.status === "streaming"),
		);
		if (finished) break;
		if (idle && stablePolls >= 2) break;
		if (stablePolls >= stablePollsToSettle && !stillRunning) break;
	}

	return {
		messages: fresh,
		assistants,
		newest,
		content,
		parts,
		text: texts.join("\n"),
	};
}
