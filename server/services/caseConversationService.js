import { logInfo, logWarn } from "../utils/logger.js";
import { sanitizeString } from "../utils/validators.js";
import { MAX_CLARIFICATION_ROUNDS } from "./caseService.js";

// The clarification conversation.
//
// A client opens a case and answers questions until the case has enough to be
// investigated. This module answers exactly ONE question per client message.
//
// Two properties are load-bearing and are enforced here rather than left to
// the caller:
//
// 1. It NEVER throws. The message route's response depends on this answer,
//    and a case that cannot be answered must still be answerable: a thrown
//    error would turn "the AI is down" into "the case is broken".
// 2. It NEVER hangs. A clarification round is a user-facing spinner. A
//    provider that never answers must not hold the request open, so the call
//    is raced against a timeout AND carries an abort signal.
//
// When no provider is configured - or the provider fails, times out, or
// answers with nothing usable - the service falls back to a fixed clarifying
// question and reports `ready: false`. The fallback is deliberately dull and
// always true: a wrong question costs the client one round, whereas an
// invented "ready" would start an investigation on a problem nobody
// described.
//
// It is a SELF-CONTAINED module on purpose. `assistantService.js` is the
// general-purpose chat assistant: it imports the Gemini SDK and the opencode
// client, it spawns an opencode server, and its default provider is a local
// Ollama that is "available" whether or not anything is listening on it.
// None of that belongs on the intake path, where the only acceptable
// outcome is a question or a graceful fallback.

const MAX_REPLY_CHARS = 2000;
const MAX_HISTORY_MESSAGES = 12;
// A clarifying question takes as long as a model turn, and a free model
// turn is commonly 10-60s. The old 8s budget answered the buyer with the
// canned question even when a warm runtime and a healthy model were both
// one second away from answering.
const DEFAULT_TIMEOUT_MS = 60_000;
const TRAILING_SLASHES = /\/+$/u;

/**
 * The question asked when the assistant cannot produce one.
 *
 * It asks for the three things a support investigation cannot proceed
 * without: what was expected, what happened, and where. It is a constant so
 * that the fallback is deterministic - the same case produces the same
 * question every time, which is what makes the offline path testable.
 */
const FALLBACK_CLARIFYING_QUESTION =
	"Could you describe the problem in a little more detail - what you expected to happen, what actually happened, and which page or workflow you were on when it went wrong?";

/** The message sent once the case has enough to be investigated. */
const READY_REPLY =
	"Thanks - that is enough for the investigation team to start. The case is moving to investigation now; each step will appear here as it happens.";

// biome-ignore lint/suspicious/noControlCharactersInRegex: stripping control characters is the point - titles must not carry them
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/gu;
// One shared punctuation/symbol class for every title path. All \p{P}
// categories EXCEPT Pc (connector punctuation), so the underscore - a word
// character in titles like requires_card - always survives. Em-dashes,
// ellipses and typographic quotes are all Pd/Po/Pi/Pf and are stripped.
const TITLE_PUNCT = /[\p{Pd}\p{Pe}\p{Pi}\p{Pf}\p{Po}\p{Ps}\p{S}]/gu;

function sanitizeTitle(value) {
	return String(value || "")
		.replace(CONTROL_CHARS, " ")
		.replace(TITLE_PUNCT, " ")
		.replace(/\s+/gu, " ")
		.trim()
		.slice(0, 80);
}

function firstLineTitle(raw) {
	const lines = String(raw ?? "").split("\n");
	const firstLine = String(lines[0] || "").trim();
	if (/^TITLE:\s*$/u.test(firstLine)) {
		return { title: "", cleaned: lines.slice(1).join("\n").trim() };
	}
	const match = firstLine.match(/^TITLE:\s*(.{1,80})\s*$/iu);
	if (!match) return null;
	return { title: sanitizeTitle(match[1]), cleaned: lines.slice(1).join("\n").trim() };
}

// The marker must never reach the buyer, on any line, on any turn. Drops every
// TITLE: fragment to end-of-line (a line that leads with the marker loses the
// whole line; a glued inline marker loses only its own tail), then collapses
// blank runs and trims.
function scrubTitleMarkers(text) {
	const lines = String(text ?? "")
		.split("\n")
		.map((line) => line.replace(/\s*\bTITLE\s*:[^\n]*/giu, "").trimEnd());
	const out = [];
	let blankRun = 0;
	for (const line of lines) {
		if (line.trim() === "") {
			blankRun += 1;
			if (blankRun > 1) {
				continue;
			}
			out.push("");
			continue;
		}
		blankRun = 0;
		out.push(line);
	}
	return out.join("\n").trim();
}

function extractTitleFromAnswer(raw, { enabled = true } = {}) {
	const text0 = String(raw ?? "").trim();
	if (!(enabled && text0)) {
		// The marker must never cross the wire, even on turns where it is not
		// armed: every TITLE: line is dropped and reported as no title.
		return { title: null, cleaned: scrubTitleMarkers(text0) };
	}
	const extracted = firstLineTitle(text0);
	if (extracted) {
		// The title used is the strict-extracted one; later lines may still
		// carry a stray marker, so the cleaned text is scrubbed too.
		return { title: extracted.title || null, cleaned: scrubTitleMarkers(extracted.cleaned) };
	}
	if (/^\s*TITLE\s*:/iu.test(text0)) {
		// Glued or over-long marker line: the strict regex cannot match, but
		// the prefix must never reach the buyer's bubble. The line's remainder
		// is kept verbatim and the caller derives the title deterministically.
		return {
			title: null,
			cleaned: scrubTitleMarkers(text0.replace(/^\s*TITLE\s*:\s*/iu, "")),
		};
	}
	return { title: null, cleaned: scrubTitleMarkers(text0) };
}

function deriveCaseSubject({ modelTitle = "", firstMessage = "" } = {}) {
	const model = sanitizeTitle(modelTitle);
	if (model) {
		return model;
	}
	const words = String(firstMessage || "")
		.replace(TITLE_PUNCT, " ")
		.split(/\s+/u)
		.filter(Boolean);
	if (words.length === 0) {
		return null;
	}
	// 48 chars, at a word boundary: a word that would cross the cap is dropped.
	let out = "";
	for (const word of words.slice(0, 8)) {
		const candidate = out ? `${out} ${word}` : word;
		if (candidate.length > 48) {
			break;
		}
		out = candidate;
	}
	if (!out) {
		out = String(words[0]).slice(0, 48);
	}
	return sanitizeTitle(out) || null;
}

const CLARIFICATION_BASE_RULES = [
	"You are the intake assistant for GarTexHub support investigations.",
	"You read the client's description of a problem and ask ONE short clarifying question.",
	"Rules:",
	"- Ask exactly one question. Never ask two at once.",
	"- Never ask again for something the client has already told you.",
	"- Prefer the question whose answer would remove the most ambiguity.",
	"- Never reveal source code, configuration, credentials, internal identifiers, or implementation details.",
	"- Never promise a fix, a refund, or a timeline.",
	"- If the client says they do not know, ask a different question.",
	"- Reply with the question itself. No preamble, no bullet list, no sign-off.",
	"Structured output — use it naturally and sparingly, only when it genuinely helps the client, never in every reply:",
	"- When you believe you know the fault class, put it on its own line:",
	"  Severity: 🔴 Critical Bug   OR   Severity: 🟡 Config Issue   OR   Severity: 🟢 Easy Fix",
	"- When you can state the symptom and root cause in plain language, put each on its own line:",
	"  Symptom: <what the user sees happen>",
	"  Root cause: <what is actually wrong, in plain words>",
	"- When a stack trace, raw log or deeply technical analysis would scare the client, wrap it:",
	"  <details>the scary text here</details>",
	"- When raw logs, a workflow diagram or a health check would be clearer as a visual, emit a fenced mermaid diagram:",
	"  ```mermaid",
	"  flowchart LR; A[Login] --> B{Valid token?}; B -- yes --> C[Feed]; B -- no --> D[401];",
	"  ```",
	"- When you need the client to attach a screenshot, a HAR, a console log or a code file, ask for exactly one on its own line:",
	"  Upload: console screenshot",
	"  The client app renders a dropzone and the investigation receives it.",
	"- When you need a code snippet, paste it:",
	"  Paste: the snippet of the failing route",
	"- When there are two or three possible causes and the client can answer with one tap, offer those as chips:",
	"  Chips: Happens on login | Happens after checkout | Only on mobile",
	"- When you have checked something inside the project, record it so the client sees a ticked table:",
	"  Check: Auth middleware | OK",
	"  Check: Webhook handler | FAIL",
	"- Never quote these hint words or explain this format; the client app parses them silently.",
	"- Every task you do gets the best tools available: use github tools for repo history, render tools for runtime/deploy status, parallel-search for external knowledge, and context7 for library docs. Never mention tools by name.",
];

const CLARIFICATION_TITLE_RULES = [
	"You create a short label for this case, invisibly to the client.",
	"Only for the VERY FIRST message of the case: begin your reply with a line",
	"of exactly this form and nothing else on it:",
	"TITLE: <3 to 8 word title for the problem, no punctuation>",
	"Then a newline, then the one clarifying question as before.",
	"Never mention, quote or explain this line, in any later message.",
];

// The pre-Task-1 prompt: no TITLE lines, byte-identical to the base rules
// joined by a newline. Armed turns (first client message, empty subject) get
// the title rules appended exactly as before.
const CLARIFICATION_BASE_PROMPT = CLARIFICATION_BASE_RULES.join("\n");
const CLARIFICATION_SYSTEM_PROMPT =
	CLARIFICATION_BASE_RULES.concat(CLARIFICATION_TITLE_RULES).join("\n");

function text(value) {
	return String(value ?? "").trim();
}

/**
 * Counts the client's own turns, which is what the round cap measures.
 *
 * The count is taken from the transcript. When the current message is not
 * already the last client turn in the transcript it is counted as well, so
 * the service gives the same answer whether the caller passes the history
 * before or after appending the message.
 *
 * @param {Array<Object>} history The transcript, oldest first.
 * @param {string} clientMessage The message the client just sent.
 * @returns {number} How many client turns the case holds.
 */
function countClientTurns(history = [], clientMessage = "") {
	const list = Array.isArray(history) ? history : [];
	let count = list.filter((message) => message?.role === "client").length;
	const current = text(clientMessage);
	if (current) {
		const last = list.at(-1);
		const lastIsCurrent = last?.role === "client" && text(last?.content) === current;
		if (!lastIsCurrent) {
			count += 1;
		}
	}
	return count;
}

function formatHistory(history = []) {
	const list = Array.isArray(history) ? history : [];
	return list
		.slice(-MAX_HISTORY_MESSAGES)
		.map((message) => {
			const role = text(message?.role) || "client";
			const content = text(message?.content);
			return content ? `${role}: ${content}` : "";
		})
		.filter(Boolean)
		.join("\n");
}

/**
 * Builds the prompt for the clarification question.
 *
 * @param {Object} params
 * @param {string} [params.subject] The case subject.
 * @param {Array<Object>} [params.history] The transcript, oldest first.
 * @param {string} [params.clientMessage] The message the client just sent.
 * @returns {string} The prompt.
 */
function buildClarificationPrompt({ subject, history, clientMessage } = {}) {
	const sections = [];
	const caseSubject = text(subject);
	if (caseSubject) {
		sections.push(`CASE SUBJECT: ${caseSubject}`);
	}
	const transcript = formatHistory(history);
	if (transcript) {
		sections.push(`CONVERSATION SO FAR:\n${transcript}`);
	}
	sections.push(`CLIENT SAYS: ${text(clientMessage)}`);
	sections.push("Ask one clarifying question.");
	return sections.join("\n\n");
}

function lastClientContent(history = []) {
	for (let index = history.length - 1; index >= 0; index -= 1) {
		if (history[index]?.role === "client") {
			return history[index].content;
		}
	}
	return "";
}

/**
 * Normalises the caller's arguments.
 *
 * The controller that owns the message route may describe the turn either as
 * a `history` plus a `clientMessage`, or as a `messages` transcript that
 * already contains the client's turn, or as a `round` number. All three
 * describe the same thing, so all three are accepted: the service and the
 * controller must not have to agree on a spelling to work.
 *
 * @param {Object} options
 * @returns {Object} The normalised turn.
 */
function normalizeOptions(options = {}) {
	let rawHistory = [];
	if (Array.isArray(options.history)) {
		rawHistory = options.history;
	} else if (Array.isArray(options.messages)) {
		rawHistory = options.messages;
	}
	const history = rawHistory
		.map((message) => ({
			role: text(message?.role) || "client",
			content: text(message?.content),
		}))
		.filter((message) => message.content);
	const rounds = Number(options.maxRounds);
	return {
		subject: text(options.subject),
		history,
		clientMessage: text(options.clientMessage) || lastClientContent(history),
		maxRounds: Number.isFinite(rounds) && rounds > 0 ? rounds : MAX_CLARIFICATION_ROUNDS,
		ready: typeof options.ready === "boolean" ? options.ready : undefined,
	};
}

/**
 * Reads the provider configuration from the environment.
 *
 * A provider is used only when it is explicitly configured: a key for
 * OpenRouter or Gemini, or an explicit `OLLAMA_HOST`. The general assistant
 * treats a local Ollama at 127.0.0.1:11434 as "available" by default, which
 * would mean an unanswered intake request on a machine with no model server -
 * a 45-second wait for a connection refusal.
 *
 * `CASE_AI_PROVIDER` names one explicitly ("openrouter", "gemini", "ollama")
 * or turns the AI off ("none"). `AI_ENABLED=false` turns it off for the
 * whole platform.
 *
 * @returns {{ name: string }} The provider to use, or `{ name: "none" }`.
 */
function resolveClarificationProvider() {
	if (process.env.AI_ENABLED === "false") {
		return { name: "none" };
	}
	const explicit = text(process.env.CASE_AI_PROVIDER).toLowerCase();
	if (explicit === "none") {
		return { name: "none" };
	}
	if (explicit === "openrouter" || explicit === "gemini" || explicit === "ollama") {
		return { name: explicit };
	}
	if (text(process.env.OPENROUTER_API_KEY)) {
		return { name: "openrouter" };
	}
	if (text(process.env.GEMINI_API_KEY)) {
		return { name: "gemini" };
	}
	if (text(process.env.OLLAMA_HOST)) {
		return { name: "ollama" };
	}
	return { name: "none" };
}

/**
 * The endpoint, headers and model of the configured provider.
 *
 * @param {string} name One of "openrouter", "gemini", "ollama".
 * @returns {Object|null} The settings, or null when the provider is not configured.
 */
function providerSettings(name) {
	if (name === "openrouter") {
		return openrouterSettings();
	}
	if (name === "gemini") {
		return geminiSettings();
	}
	if (name === "ollama") {
		return ollamaSettings();
	}
	return null;
}

function openrouterSettings() {
	const apiKey = text(process.env.OPENROUTER_API_KEY);
	if (!apiKey) {
		return null;
	}
	return {
		style: "chat",
		endpoint:
			text(process.env.OPENROUTER_BASE_URL) || "https://openrouter.ai/api/v1/chat/completions",
		model: text(process.env.OPENROUTER_MODEL) || "meta-llama/llama-3.1-8b-instruct",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"HTTP-Referer": text(process.env.OPENROUTER_REFERER) || "https://gartexhub.com",
			"X-Title": text(process.env.OPENROUTER_APP_TITLE) || "GarTexHub",
		},
	};
}

function geminiSettings() {
	const apiKey = text(process.env.GEMINI_API_KEY);
	if (!apiKey) {
		return null;
	}
	const model = text(process.env.GEMINI_MODEL) || "gemini-2.0-flash-lite";
	return {
		style: "gemini",
		endpoint: `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
		model,
		headers: { "x-goog-api-key": apiKey },
	};
}

function ollamaSettings() {
	const host = text(process.env.OLLAMA_HOST);
	if (!host) {
		return null;
	}
	const base = host.replace(TRAILING_SLASHES, "");
	return {
		style: "chat",
		endpoint: text(process.env.OLLAMA_CHAT_ENDPOINT) || `${base}/v1/chat/completions`,
		model: text(process.env.OLLAMA_MODEL) || "llama3",
		headers: {},
	};
}

function providerRequest(settings, prompt, systemPrompt) {
	if (settings.style === "gemini") {
		return {
			system_instruction: { parts: [{ text: systemPrompt }] },
			contents: [{ role: "user", parts: [{ text: prompt }] }],
			generationConfig: { temperature: 0.2, maxOutputTokens: 300 },
		};
	}
	return {
		model: settings.model,
		messages: [
			{ role: "system", content: systemPrompt },
			{ role: "user", content: prompt },
		],
		temperature: 0.2,
		max_tokens: 300,
	};
}

function providerAnswer(payload, settings) {
	if (settings.style === "gemini") {
		return text(payload?.candidates?.[0]?.content?.parts?.[0]?.text);
	}
	return text(payload?.choices?.[0]?.message?.content);
}

function timeoutMs() {
	const configured = Number(process.env.CASE_AI_TIMEOUT_MS);
	if (Number.isFinite(configured) && configured > 0) {
		return configured;
	}
	return DEFAULT_TIMEOUT_MS;
}

async function fetchJson(url, options, ms) {
	const response = await fetch(url, { ...options, signal: AbortSignal.timeout(ms) });
	if (!response.ok) {
		throw new Error(`provider responded ${response.status}`);
	}
	return response.json();
}

function callConfiguredProvider(prompt, systemPrompt) {
	const { name } = resolveClarificationProvider();
	if (name === "none") {
		logInfo("No AI provider configured for the clarification conversation");
		return null;
	}
	const settings = providerSettings(name);
	if (!settings) {
		return null;
	}
	const ms = timeoutMs();
	return fetchJson(
		settings.endpoint,
		{
			method: "POST",
			headers: { "Content-Type": "application/json", ...settings.headers },
			body: JSON.stringify(providerRequest(settings, prompt, systemPrompt)),
		},
		ms,
	).then((payload) => providerAnswer(payload, settings));
}

/**
 * Races a promise against a timeout.
 *
 * The timeout is belt and braces: the fetch already carries an abort signal,
 * but a provider that ignores the signal (or a caller-supplied provider that
 * hangs) must not hold the request open either.
 *
 * @param {Promise<any>} promise
 * @param {number} ms
 * @returns {Promise<any>} The promise's value, or a rejection on timeout.
 */
async function withTimeout(promise, ms) {
	let timer = null;
	try {
		return await Promise.race([
			promise,
			new Promise((_resolve, reject) => {
				timer = setTimeout(() => reject(new Error("clarification provider timed out")), ms);
			}),
		]);
	} finally {
		if (timer) {
			clearTimeout(timer);
		}
	}
}

// A provider may be injected for a test (or for a future in-process model)
// without touching the environment. It is module state on purpose: the
// controller calls this service without knowing anything about providers.
let providerOverride = null;

/**
 * Installs a provider used by every later call.
 *
 * @param {Function|null} provider `async (prompt, systemPrompt) => string|null`.
 * @returns {void}
 */
function setClarificationProvider(provider) {
	providerOverride = typeof provider === "function" ? provider : null;
}

/**
 * Removes the installed provider.
 *
 * @returns {void}
 */
function resetClarificationProvider() {
	providerOverride = null;
}

/**
 * Answers one client message with a clarifying question.
 *
 * The caller owns `ready`: pass it when the controller has already decided
 * (the client confirmed, or the round cap is spent) and this service will
 * not ask a question at all. When it is not passed, the service derives it
 * from the transcript with the same round cap the controller uses.
 *
 * @param {Object} [options]
 * @param {string} [options.subject] The case subject.
 * @param {Array<Object>} [options.history] The transcript, oldest first.
 * @param {Array<Object>} [options.messages] The transcript, under its other name.
 * @param {string} [options.clientMessage] The message the client just sent.
 * @param {boolean} [options.ready] Whether the case is already ready.
 * @param {number} [options.maxRounds] The clarification round cap.
 * @param {Function} [options.provider] `async (prompt, systemPrompt) => string|null`.
 * @returns {Promise<{ reply: string, ready: boolean, title?: string|null }>} Never rejects. `title` is present only on the first client message of a case without a subject; the `isReady` path returns no `title` ever.
 */
async function answerClarification(options = {}) {
	const turn = normalizeOptions(options);
	const turns = countClientTurns(turn.history, turn.clientMessage);
	const isFirstClientMessage = turns === 1;
	const wantsTitle = isFirstClientMessage && !text(turn.subject);
	const isReady = typeof turn.ready === "boolean" ? turn.ready : turns >= turn.maxRounds;

	if (isReady) {
		// Nothing left to clarify. Asking a question here would push the case
		// back into a round the client has already spent.
		return { reply: READY_REPLY, ready: true };
	}

	const configured = providerOverride || callConfiguredProvider;
	// The TITLE guidance is armed only for the first client message of a
	// case with no subject. Every other turn gets the base prompt, which is
	// byte-identical to the pre-Task-1 prompt.
	const systemPrompt = wantsTitle ? CLARIFICATION_SYSTEM_PROMPT : CLARIFICATION_BASE_PROMPT;
	try {
		const prompt = buildClarificationPrompt(turn);
		let answer = null;
		if (options.provider) {
			try {
				answer = await withTimeout(
					Promise.resolve().then(() => options.provider(prompt, systemPrompt)),
					timeoutMs(),
				);
			} catch (error) {
				logWarn("clarification provider failed; trying the configured provider", {
					message: String(error),
				});
				answer = null;
			}
			if (!sanitizeString(text(answer)) && configured) {
				try {
					answer = await withTimeout(
						Promise.resolve().then(() => configured(prompt, systemPrompt)),
						timeoutMs(),
					);
				} catch (error) {
					logWarn("Clarification configured provider failed; falling back to the fixed question", {
						message: String(error),
					});
					answer = null;
				}
			}
		} else if (configured) {
			try {
				answer = await withTimeout(
					Promise.resolve().then(() => configured(prompt, systemPrompt)),
					timeoutMs(),
				);
			} catch (error) {
				logWarn("Clarification provider failed; falling back to the fixed question", {
					message: String(error),
				});
				answer = null;
			}
		}
		const replyRaw = text(answer);
		const extractedTitle = extractTitleFromAnswer(replyRaw, { enabled: wantsTitle });
		const reply = sanitizeString(text(extractedTitle.cleaned), MAX_REPLY_CHARS);
		const result = { reply: reply || FALLBACK_CLARIFYING_QUESTION, ready: false };
		if (wantsTitle) {
			result.title =
				extractedTitle.title || deriveCaseSubject({ firstMessage: turn.clientMessage });
		}
		return result;
	} catch (error) {
		// A failed provider is not an error for the client: the case still
		// works, it just asks the fixed question instead.
		logWarn("Clarification provider failed; falling back to the fixed question", {
			message: String(error),
		});
		const result = { reply: FALLBACK_CLARIFYING_QUESTION, ready: false };
		if (wantsTitle) {
			result.title = deriveCaseSubject({ firstMessage: turn.clientMessage });
		}
		return result;
	}
}

export {
	answerClarification,
	buildClarificationPrompt,
	CLARIFICATION_SYSTEM_PROMPT,
	countClientTurns,
	deriveCaseSubject,
	extractTitleFromAnswer,
	FALLBACK_CLARIFYING_QUESTION,
	READY_REPLY,
	resetClarificationProvider,
	resolveClarificationProvider,
	setClarificationProvider,
};
