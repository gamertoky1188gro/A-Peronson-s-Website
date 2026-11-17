# Support Naming + Live AI Activity Tree — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Titles cases from their first client message (server-side, invisible to the user) and renders a Claude/Copilot-style inline AI activity tree — live during the investigation and persisted after — in the support workspace `/support/case/:id`.

**Architecture:** Two vertical slices. Slice A (naming) extends the intake conversation contract: the model prefixes its first reply with a `TITLE:` marker, `caseConversationService.answerClarification` strips it, `postCaseMessageController` persists it to `support_cases.subject` only when the row has none and this is the first client message, and the client merges the new field from the `POST …/messages` response. Slice B (tree) adds a sanitized label helper shared by the live path (an `onToolSettled` callback threaded through `waitForAssistantTurn`) and the persistence path (`tool_log` entries extended with the same labels), a new `support.case.activity` SSE event, and an inline `ActivityTree` component mounted above the transcript.

**Tech Stack:** Node 26 + Express + Prisma (server), React 19 + Tailwind (client), Jest + React Testing Library + supertest (tests), vitest-free (the repo uses Jest only).

## Global Constraints

Copied verbatim from `docs/superpowers/specs/2026-11-17-support-case-naming-and-activity-tree-design.md`:

- **Basename only.** File tools render the file NAME only (e.g. `Reading walletService.js`) — never a path. Search tools render only `Searching code` (the pattern is never shown). Everything else renders `Using <tool>` with the tool name sanitized (letters/digits/`-_` only, cap 32 chars). Any failure renders `Working`.
- **No reasoning, no args, no payloads.** Event events never carry error text or model reasoning. "Thinking…" is a pulsing label.
- **The AI's message text is never hidden, reordered, or edited** by the tree. The assistant's reply renders exactly as before, above the tree in z-order *below* nothing and *above* nothing (the tree sits in the transcript flow above the messages).
- **Marker contract:** `CLARIFICATION_SYSTEM_PROMPT` may gain exactly one rule, armed only on the first client message of a case: the reply begins with a line `TITLE: <3 to 8 word title>`, then a newline, then the one clarifying question. The marker line never crosses the wire.
- **Extraction runs before any response logic**, on the raw model answer. Title hygiene: collapse whitespace, strip `<>&"'` and control chars, hard cap 80 chars. Regex anchor: the FIRST line must match `^TITLE:\s*(.{1,80})\s*$`.
- **Fallback:** no marker and `subject` empty → `deriveCaseSubject`: first 6–8 words of the first message, punctuation stripped, cap 48 chars. The case is never left untitled while the model path is up or down.
- **Persist only when** the case's `subject` is empty/null AND this is the first client message (`countClientMessages` after append === 1). Response gains `subject` only when just set.
- **`support.case.activity` payload is exactly** `{ caseId, role, id, kind, label, status, at }` — no other fields, ever. `kind` is one of `read | search | list | other` (`list` permitted by contract; unused by the current tools). `status` is `done | failed`.
- **SSE cap:** client keeps at most 200 activity rows per case; dedupe by event `id`.
- **Release order (one commit each):** naming → live tree → persistence closure (docs + QA). `CASE_AI_TIMEOUT_MS` stays 60 s. No migration; additive `tool_log` JSON only.
- `npx biome check --write` must report 0 errors on every changed file; full `npm test` and `npm run build` must pass before each commit.

---

## File Map (create/modify)

| File | Action | Responsibility |
|---|---|---|
| `server/services/caseConversationService.js` | modify | marker rule in prompt; `sanitizeTitle`, `extractTitleFromAnswer`, `deriveCaseSubject` (exported); return `title` from `answerClarification` |
| `server/services/caseService.js` | modify | new `setCaseSubject(caseId, subject)` (mirrors `setCaseModel`, strips+has cap 80) |
| `server/controllers/caseController.js` | modify | `askClarifyingQuestion` returns `title`; persist on first client message; response gains `subject`; `getCaseController` gains `investigations` projection |
| `server/services/investigation/activityLabel.js` | **create** | pure `activityLabelFor(part) -> { kind, label }` sanitizer |
| `server/services/opencodeTurns.js` | modify | `waitForAssistantTurn` gains optional `onToolSettled(part, status)`; per-turn `announced` set + stable key |
| `server/services/investigation/opencodeRuntime.js` | modify | `runAgentPrompt` accepts `onToolSettled` (forwarded), and normalizes `toolCalls` entries to `{ tool, status, error?, kind, label }` from full parts |
| `server/services/investigationQueue.js` | modify | `emitActivity(caseId, role, part, status)`; pass `onToolSettled` into the existing `runAgentPrompt` call site |
| `server/realtime/realtimeBus.js` | modify | `CASE_EVENTS.activity = "support.case.activity"` + comment |
| `src/lib/caseRealtime.js` | modify | add `support.case.activity` to `CASE_EVENT_TYPES` |
| `src/hooks/useSupportCase.js` | modify | `activity: []` state; `activity` reducer action (dedupe, cap 200); `load:ok` seeds from `investigations` and replaces only when non-empty; persist seed helper `seedActivityFromInvestigations` (exported for tests) |
| `src/components/support/ActivityTree.jsx` | **create** | the inline tree component (see Task 7) |
| `src/pages/support/SupportWorkspace.jsx` | modify | render `<ActivityTree>` inline above the message list in the transcript; render `subject` in the header sub-line and the Case-reference card |
| `docs/developer/architecture.md` | modify | update the support SSE bullet to name both events |
| `docs/plans/2026-11-17-naming-and-activity-tree-rollout.md` | create | verification evidence + release notes |
| `docs/superpowers/specs/2026-11-17-support-case-naming-and-activity-tree-design.md` | keep | contract of record (§4.6 does not exist in this repo; see Task 8) |
| Tests | create/extend | `tests/unit/caseConversation-title.test.js` (new), `tests/unit/activity-label.test.js` (new), `tests/unit/frontend-support-activity-tree.test.js` (new), plus additions to `tests/unit/frontend-support-case.test.js`, `tests/integration/support-case-api.test.js` |

---

### Task 1: Naming inside the intake conversation service

**Files:**
- Modify: `server/services/caseConversationService.js` (prompt block ~line 44; body after `FALLBACK_CLARIFYING_QUESTION` and before `READY_REPLY`; and `answerClarification`)
- Test: `tests/unit/caseConversation-title.test.js` (create; same folder style as `tests/unit/server-*.test.js`, run with the default Jest projects)

**Interfaces:**
- Consumes: none (adds to the same module)
- Produces: `extractTitleFromAnswer(raw: string, { enabled?: boolean }) -> { title: string|null, cleaned: string }`, `deriveCaseSubject({ modelTitle?: string, firstMessage?: string }) -> string|null`, `answerClarification(...) -> { reply, ready, title? }` (additive; existing callers unchanged)

- [ ] **Step 1: Write the failing test**

```js
// tests/unit/caseConversation-title.test.js
import { jest } from "@jest/globals";
import {
	answerClarification,
	deriveCaseSubject,
	extractTitleFromAnswer,
	resetClarificationProvider,
	setClarificationProvider,
} from "../../server/services/caseConversationService.js";

beforeEach(() => resetClarificationProvider());

const FIRST_MESSAGE =
	"Hi — our launch coupon WELCOME3M: 3 free months of verification renewal, and it was supposed to require a saved card.";

test("extractTitleFromAnswer takes and strips the first-line marker", () => {
	const { title, cleaned } = extractTitleFromAnswer(
		"TITLE: Coupon settings not persisting\nWhy would requires_card never fire?",
		{ enabled: true },
	);
	expect(title).toBe("Coupon settings not persisting");
	expect(cleaned).toBe("Why would requires_card never fire?");
});

test("extractTitleFromAnswer refuses when disabled (not the first message)", () => {
	const reply = extractTitleFromAnswer("TITLE: Coupon\nQuestion?", { enabled: false });
	expect(reply).toEqual({ title: null, cleaned: "TITLE: Coupon\nQuestion?" });
});

test("extractTitleFromAnswer handles a marker-only reply (empty cleaned)", () => {
	const { title, cleaned } = extractTitleFromAnswer("TITLE: Coupon", { enabled: true });
	expect(title).toBe("Coupon");
	expect(cleaned).toBe("");
});

test("extractTitleFromAnswer ignores a marker on a later line", () => {
	const { title, cleaned } = extractTitleFromAnswer(
		"Question?\nTITLE: Too late",
		{ enabled: true },
	);
	expect(title).toBeNull();
	expect(cleaned).toBe("Question?\nTITLE: Too late");
});

test("deriveCaseSubject model title wins; falls back to the message's first words", () => {
	expect(deriveCaseSubject({ modelTitle: "Coupon broken", firstMessage: "x y" })).toBe("Coupon broken");
	expect(deriveCaseSubject({ firstMessage: "the verification renewal never applies the free months we owe buyers for coupon" })).toBe(
		"the verification renewal never applies the free months",
	);
	expect(deriveCaseSubject({})).toBeNull();
});

test("answerClarification emits and strips TITLE via an injected provider", async () => {
	setClarificationProvider(async () => `TITLE: WELCOME3M ignores requires_card\nWhen exactly does the card check fail?`);
	const answer = await answerClarification({
		subject: "",
		history: [{ role: "client", content: FIRST_MESSAGE }],
		clientMessage: FIRST_MESSAGE,
	});
	expect(answer.title).toBe("WELCOME3M ignores requires_card");
	expect(answer.reply).toBe("When exactly does the card check fail?");
	expect(answer.reply).not.toContain("TITLE:");
});

test("answerClarification with no provider still returns a deterministic fallback title", async () => {
	process.env.CASE_AI_PROVIDER = "none";
	process.env.AI_ENABLED = "false";
	const answer = await answerClarification({
		subject: "",
		history: [{ role: "client", content: FIRST_MESSAGE }],
		clientMessage: FIRST_MESSAGE,
	});
	expect(answer.title).toBeTruthy();
	expect(FIRST_MESSAGE).toContain(String(answer.title).split(" ")[0]);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx jest tests/unit/caseConversation-title.test.js`
Expected: FAIL — `extractTitleFromAnswer is not a function` (export missing).

- [ ] **Step 3: Implement in `caseConversationService.js`**

`CLARIFICATION_SYSTEM_PROMPT` — append exactly:

```js
	"You create a short label for this case, invisibly to the client.",
	"Only for the VERY FIRST message of the case: begin your reply with a line",
	"of exactly this form and nothing else on it:",
	"TITLE: <3 to 8 word title for the problem, no punctuation>",
	"Then a newline, then the one clarifying question as before.",
	"Never mention, quote or explain this line, in any later message.",
].join("\n");
```

New module-level functions (add below `FALLBACK_CLARIFYING_QUESTION`/`READY_REPLY`):

```js
const TITLE_PREFIX = "TITLE:";
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/gu;
const TITLE_UNSAFE = /[<>&"']/gu;

function sanitizeTitle(value) {
	return String(value || "")
		.replace(CONTROL_CHARS, " ")
		.replace(TITLE_UNSAFE, " ")
		.replace(/\s+/g, " ")
		.trim()
		.slice(0, 80);
}

function firstLineTitle(raw) {
	const lines = String(raw ?? "").split("\n");
	const match = String(lines[0] || "").trim().match(/^TITLE:\s*(.{1,80})\s*$/i);
	if (!match) return null;
	return { title: sanitizeTitle(match[1]), cleaned: lines.slice(1).join("\n").trim() };
}

export function extractTitleFromAnswer(raw, { enabled = true } = {}) {
	const text0 = String(raw ?? "").trim();
	if (!enabled || !text0) {
		return { title: null, cleaned: text0 };
	}
	const extracted = firstLineTitle(text0);
	if (!extracted) {
		return { title: null, cleaned: text0 };
	}
	return { title: extracted.title || null, cleaned: extracted.cleaned };
}

export function deriveCaseSubject({ modelTitle = "", firstMessage = "" } = {}) {
	const model = sanitizeTitle(modelTitle);
	if (model) {
		return model;
	}
	const words = String(firstMessage || "")
		.replace(/[<>&"'`]/gu, " ")
		.replace(/[.,;:!?()\[\]{}"']/gu, " ")
		.split(/\s+/)
		.filter(Boolean);
	if (words.length === 0) {
		return null;
	}
	return sanitizeTitle(words.slice(0, 8).join(" ")).slice(0, 48) || null;
}
```

Then in `answerClarification`, replace the block that computes `reply`/`READY_REPLY`:

```js
	const turns = countClientTurns(turn.history, turn.clientMessage);
	const isFirstClientMessage = turns === 1;
	const wantsTitle = isFirstClientMessage && !text(turn.subject);
	...
			const replyRaw = text(answer);
			const extractedTitle = extractTitleFromAnswer(replyRaw, { enabled: wantsTitle });
			const reply = sanitizeString(text(extractedTitle.cleaned), MAX_REPLY_CHARS);
			const title = wantsTitle
				? extractedTitle.title || deriveCaseSubject({ firstMessage: turn.clientMessage })
				: null;
			return {
				reply: reply || FALLBACK_CLARIFYING_QUESTION,
				ready: false,
				title,
			};
		} catch (error) {
			logWarn("Clarification provider failed; falling back to the fixed question", {
				message: String(error),
			});
			const title = wantsTitle
				? deriveCaseSubject({ firstMessage: turn.clientMessage })
				: null;
			return { reply: FALLBACK_CLARIFYING_QUESTION, ready: false, title };
		}
	} catch (error) {
		logWarn("Clarification provider failed; falling back to the fixed question", {
			message: String(error),
		});
		const title = wantsTitle ? deriveCaseSubject({ firstMessage: turn.clientMessage }) : null;
		return { reply: FALLBACK_CLARIFYING_QUESTION, ready: false, title };
	}
```

Notes for the editor:
- `turn.subject` already exists in `normalizeOptions` output (`subject`).
- The `!reply`/`READY_REPLY` path must remain behavior-identical for existing tests: when the marker is present but everything is stripped away (`cleaned === ""`), return `{ reply: FALLBACK_CLARIFYING_QUESTION, ready: false, title }` — NOT `READY_REPLY` (the case is not ready).
- Export both new functions in the `export {}` block.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest tests/unit/caseConversation-title.test.js`
Expected: PASS (all seven cases).

- [ ] **Step 5: Commit**

```bash
npx biome check --write server/services/caseConversationService.js tests/unit/caseConversation-title.test.js
npm test
git add server/services/caseConversationService.js tests/unit/caseConversation-title.test.js
git commit -m "feat(support): intake contract can carry an invisible TITLE marker

The intake system prompt now asks the model, only on the first client
message of a case, to start its reply with 'TITLE: <3-8 words>'; the
service extracts and strips the line before anything reaches the client,
and a deterministic first-words fallback guarantees the case is never
left untitled. Existing offline fallbacks behave as before, plus a title."
```

---

### Task 2: Persist the subject from the message route

**Files:**
- Modify: `server/services/caseService.js` (after `setCaseModel`, ~line 82)
- Modify: `server/controllers/caseController.js` (`askClarifyingQuestion` return; `postCaseMessageController`; response)
- Test: extend `tests/integration/support-case-api.test.js`

**Interfaces:**
- Consumes: `deriveCaseSubject` output via `answer.title` (already extracted/derived in Task 1 — the controller does NOT re-derive when `answer.title` is set)
- Produces: `response body gains "subject": string` (only when just set); `caseService.setCaseSubject(caseId: String, subject: String) -> SupportCase`

- [ ] **Step 1: Write the failing assertions (extend the integration test)**

Find the section that posts a first message (near line 257) and add:

```js
	test("names the case from the first client message, and only then", async () => {
		state.messages = [];
		state.cases = [];
		const user = await seedOwner(); // existing helper in this file
		const created = await postCase(user); // existing helper in this file
		const first = await postMessage(user, created.id, "the verification renewal never applies the free months");
		expect(typeof first.body.subject).toBe("string");
		expect(first.body.subject.length).toBeGreaterThan(3);
		expect(first.body.reply.content).not.toContain("TITLE:");

		const second = await postMessage(user, created.id, "a second message");
		expect(second.body.subject).toBeUndefined();

		const reread = await getCase(user, created.id);
		expect(reread.body.case.subject).toBe(first.body.subject);
	});
```

If the helpers are named differently (inspect `grep -n "async function \|const postMessage\|const postCase" tests/integration/support-case-api.test.js` first and use the file's own names).

- [ ] **Step 2: Run to verify failure**

Run: `npx jest tests/integration/support-case-api.test.js -t "names the case"`
Expected: FAIL — `expected undefined to be string` (no subject on the response yet).

- [ ] **Step 3: Implement**

`caseService.js`, after `setCaseModel`:

```js
/**
 * Stores the case's display title. Only the message route calls this, and
 * only when the case has no subject yet — the intake model may have named it
 * from the client's first words.
 *
 * @param {string} caseId The case to update.
 * @param {string} subject The title.
 * @returns {Promise<Object>} The updated case row.
 */
export async function setCaseSubject(caseId, subject) {
	return prisma.supportCase.update({
		where: { id: String(caseId) },
		data: { subject: sanitizeString(String(subject || ""), 80) || null },
	});
}
```

`sanitizeString` is already imported in this module.

`caseController.js` — in `askClarifyingQuestion`, change the success return to:

```js
		return {
			reply,
			ready: typeof answer?.ready === "boolean" ? answer.ready : ready,
			degraded: false,
			title: typeof answer?.title === "string" ? answer.title : null,
		};
```

and the degraded return to `{ reply: …, ready, degraded: true, title: null }`.

In `postCaseMessageController`, replace the answer/ready block:

```js
		const answer = await askClarifyingQuestion({
			subject: found.subject || "",
			messages: thread,
			clientMessage: content,
			ready,
			round: rounds,
			caseRow: found,
		});
		let subjectSet = null;
		if (rounds === 1 && !found.subject && answer?.title) {
			try {
				const saved = await caseService.setCaseSubject(caseId, answer.title);
				subjectSet = saved?.subject ?? String(answer.title).slice(0, 80);
			} catch (error) {
				logWarn("case subject write failed", { caseId, reason: error?.message });
			}
		} else if (rounds === 1 && !found.subject) {
			const { deriveCaseSubject } = await import("../services/caseConversationService.js");
			const derived = deriveCaseSubject({ firstMessage: content });
			if (derived) {
				try {
					const saved = await caseService.setCaseSubject(caseId, derived);
					subjectSet = saved?.subject ?? derived;
				} catch (error) {
					logWarn("case subject write failed", { caseId, reason: error?.message });
				}
			}
		}
```

…and the response:

```js
		return res.status(201).json({
			message,
			reply,
			ready,
			...(subjectSet ? { subject: subjectSet } : {}),
		});
```

- [ ] **Step 4: Run the integration test**

Run: `npx jest tests/integration/support-case-api.test.js`
Expected: PASS (new test included, no existing assertions broken).

- [ ] **Step 5: Commit**

```bash
npx biome check --write server/services/caseService.js server/controllers/caseController.js tests/integration/support-case-api.test.js
npm test
git add server/services/caseService.js server/controllers/caseController.js tests/integration/support-case-api.test.js
git commit -m "feat(support): persist the case title on the first client message

The message route now writes support_cases.subject (only when empty and
only for the first client message, through setCaseSubject mirroring
setCaseModel) and returns it as 'subject' in the 201 response body, which
the client can merge without a second round trip. Falls back to the
deterministic first-words title when the model produced none."
```

---

### Task 3: Client — the title everywhere it should appear

**Files:**
- Modify: `src/hooks/useSupportCase.js` (`applySent`)
- Modify: `src/pages/support/SupportWorkspace.jsx` (header sub-line + Case reference card + any subject-aware rendering)
- Test: extend `tests/unit/frontend-support-case.test.js`

**Interfaces:**
- Consumes: `POST /messages` response `subject?: string`
- Produces: `caseRow.subject` updates in hook state (nothing else new crosses the wire)

- [ ] **Step 1: Write the failing test**

In `tests/unit/frontend-support-case.test.js`, in the hook-describe block, add:

```js
test("applies the returned subject to the case row", async () => {
	const { result } = renderHook(() => useSupportCase(CASE_ID, "tok"));
	await waitFor(() => expect(result.current.loading).toBe(false));
	apiRequest.mockImplementationOnce(async () => ({
		message: { id: "m2", role: "client", content: "hi", sequence: 2 },
		reply: { id: "m3", role: "assistant", kind: "question", content: "Where exactly?", sequence: 3 },
		ready: false,
		subject: "verification renewal free months never applied",
	}));
	await act(async () => {
		await result.current.send("hi", []);
	});
	expect(result.current.caseRow?.subject).toBe("verification renewal free months never applied");
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx jest tests/unit/frontend-support-case.test.js -t "applies the returned subject"`
Expected: FAIL — `expected undefined, received "…"` (caseRow keeps old subject, undefined since the GET mock carries none).

- [ ] **Step 3: Implement**

`applySent` in `useSupportCase.js`:

```js
function applySent(state, action) {
	const { data, attachments } = action;
	const ready = data?.ready === true;
	const subject =
		typeof data?.subject === "string" && data.subject.trim() ? data.subject.trim() : null;
	let caseRow =
		state.caseRow &&
		(ready || subject)
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
```

`SupportWorkspace.jsx`: locate the header sub-line — it is the `<p>` under the `h1` at ~line 1026:

```jsx
<p
	class="max-w-[10rem] truncate font-mono text-[10px] text-[#a99bbd] sm:max-w-[16rem]"
	title={caseId ?? "new case"}
>
	{caseId ? `case ${caseId}` : "new case"}
</p>
```

Replace with (subject is the report title; the id stays in the reference card):

```jsx
<p
	class="max-w-[14rem] truncate text-[10px] text-[#a99bbd] sm:max-w-[16rem]"
	title={supportCase.caseRow?.subject ?? caseId ?? "new case"}
>
	{supportCase.caseRow?.subject || (caseId ? `case ${caseId}` : "new case")}
</p>
```

And in the Case-reference card (search `"Case reference"`, ~line 779): render the subject as the primary line and keep the id as the mono second line; `title={…}` unchanged:

```jsx
<p class="mt-1 truncate text-[12px] text-[#f4eeff]" title={supportCase.caseRow?.subject ?? ""}>
	{supportCase.caseRow?.subject || "Untitled case"}
</p>
<p class="mt-0.5 truncate font-mono text-[10px] text-[#a99bbd]" title={caseId ?? ""}>
	{caseId ? `case ${caseId}` : "not opened yet"}
</p>
```

No other header/copy changes — the `READY`/`Investigating` pill stays as it is.

Screenshot both before committing (see Task 8 evidence).

- [ ] **Step 4: Run the hook tests**

Run: `npx jest tests/unit/frontend-support-case.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
npx biome check --write src/hooks/useSupportCase.js src/pages/support/SupportWorkspace.jsx tests/unit/frontend-support-case.test.js
npm test
git add src/hooks/useSupportCase.js src/pages/support/SupportWorkspace.jsx tests/unit/frontend-support-case.test.js
git commit -m "feat(support): merge the case title from the messages response

applySent applies the optional 'subject' key to caseRow, and the
workspace renders it in the header sub-line and the Case reference card;
recent cases already render it."
```

---

### Task 4: The sanitized label helper (server, pure, no integration)

**Files:**
- Create: `server/services/investigation/activityLabel.js`
- Test: `tests/unit/activity-label.test.js`

**Interfaces:**
- Consumes: none
- Produces: `activityLabelFor(part: Object) -> { kind: "read"|"search"|"other", label: string }`. `label` ≤ 80 chars, never a path — basename only. `kind` is never anything outside that union.

- [ ] **Step 1: Write the failing test**

```js
// tests/unit/activity-label.test.js
import { activityLabelFor } from "../../server/services/investigation/activityLabel.js";

const readPart = (path, name = "read") => ({
	type: "tool",
	name,
	state: { status: "completed", input: { path } },
});

test("read tools render the basename only", () => {
	expect(activityLabelFor(readPart("server/services/walletService.js"))).toEqual({
		kind: "read",
		label: "Reading walletService.js",
	});
	expect(activityLabelFor(readPart("/home/ccm/Desktop/A-Peronson-s-Website/src/App.jsx", "write")).label).toBe("Writing App.jsx");
	expect(activityLabelFor(readPart('readPart: server/services/"quoted".js')).label).toBe('Reading quoted.js');
});

test("path traversal never escapes to a parent directory", () => {
	expect(activityLabelFor(readPart("../../.env")).label).toBe("Reading files");
	expect(activityLabelFor(readPart("..")).label).toBe("Reading files");
});

test("search tools show no pattern", () => {
	expect(activityLabelFor(readPart("coupon", "grep"))).toEqual({ kind: "search", label: "Searching code" });
	expect(activityLabelFor(readPart("couponController", "glob"))).toEqual({ kind: "search", label: "Searching code" });
});

test("unknown tools render only the sanitized tool name", () => {
	expect(activityLabelFor(readPart("x", "subagent"))).toEqual({ kind: "other", label: "Using subagent" });
	expect(activityLabelFor(readPart("x", "drop-table!;rm-rf")).label.startsWith("Using ")).toBe(true);
});

test("unreadable input degrades instead of throwing", () => {
	expect(activityLabelFor({ type: "tool", name: "read", state: null })).toEqual({ kind: "read", label: "Reading files" });
	expect(activityLabelFor(null)).toEqual({ kind: "other", label: "Working" });
	expect(activityLabelFor("garbage")).toEqual({ kind: "other", label: "Working" });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx jest tests/unit/activity-label.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```js
// server/services/investigation/activityLabel.js
//
// The one place a tool part becomes display text for the activity tree.
//Basename only, never a path; the investigation must not leak the repo
// layout to buyers. Anything unreadable degrades to "Working".

const READ_VERB = new Map([
	["read", "Reading"],
	["read_file", "Reading"],
	["write", "Writing"],
	["edit", "Editing"],
	["cat", "Reading"],
	["open", "Reading"],
]);
const SEARCH_TOOLS = new Set(["grep", "glob", "rg", "find", "ls"]);
const PATH_KEYS = ["path", "filePath", "file", "filepath", "target"];
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/gu;
const UNSAFE = /[<>&"'`]/gu;

function sanitizeToolName(raw) {
	const cleaned = String(raw || "tool").replace(/[^a-zA-Z0-9_-]/gu, "").slice(0, 32);
	return cleaned || "tool";
}
function sanitizeLabelText(value, cap = 80) {
	return String(value || "")
		.replace(CONTROL_CHARS, " ")
		.replace(UNSAFE, "")
		.replace(/\s+/gu, " ")
		.trim()
		.slice(0, cap);
}
function pathBasename(raw) {
	const cleaned = String(raw || "")
		.replace(/["']/gu, "")
		.replace(/\\/gu, "/");
	if (cleaned.includes("../") || cleaned.includes("..\\") || cleaned.endsWith("..")) {
		return null;
	}
	const parts = cleaned.split("/").filter(Boolean);
	const base = parts[parts.length - 1] || "";
	if (!base || base === ".." || base.includes("\0")) {
		return null;
	}
	return base;
}

/**
 * @param {{ type?: string, name?: string, tool?: string, state?: { input?: unknown } | null } | null} part
 * @returns {{ kind: "read" | "search" | "other", label: string }}
 */
export function activityLabelFor(part) {
	try {
		if (!part || part.type !== "tool") {
			return { kind: "other", label: "Working" };
		}
		const tool = sanitizeToolName(part.name || part.tool).toLowerCase();
		const verb = READ_VERB.get(tool);
		if (verb) {
			const input = part.state?.input;
			for (const key of PATH_KEYS) {
				const raw = input && typeof input === "object" ? input[key] : null;
				const base = typeof raw === "string" ? pathBasename(raw) : null;
				if (base) {
					return { kind: "read", label: sanitizeLabelText(`${verb} ${base}`) };
				}
			}
			return { kind: "read", label: `${verb} files` };
		}
		if (SEARCH_TOOLS.has(tool)) {
			return { kind: "search", label: "Searching code" };
		}
		return { kind: "other", label: `Using ${sanitizeToolName(tool)}` };
	} catch {
		return { kind: "other", label: "Working" };
	}
}
```

- [ ] **Step 4: Run test**

Run: `npx jest tests/unit/activity-label.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
npx biome check --write server/services/investigation/activityLabel.js tests/unit/activity-label.test.js
npm test
git add server/services/investigation/activityLabel.js tests/unit/activity-label.test.js
git commit -m "feat(support): shared sanitizer for tool-call display labels

activityLabelFor maps an opencode tool part to {kind,label}: basename
only for file tools, no pattern is ever shown for search tools, tool
names are charset-sanitized. Never throws; garbage renders 'Working'."
```

---

### Task 5: Emit `support.case.activity` from the investigation runtime

**Files:**
- Modify: `server/services/opencodeTurns.js` (`waitForAssistantTurn` — signature, per-turn announcement set)
- Modify: `server/services/investigation/opencodeRuntime.js` (`runAgentPrompt` — normalize `toolCalls`, forward `onToolSettled`)
- Modify: `server/services/investigationQueue.js` (add `emitActivity` next to `emitProgress`; pass callback at the `runAgentPrompt` call site ~line 630)
- Modify: `server/realtime/realtimeBus.js` (`CASE_EVENTS`)
- Test: `tests/unit/opencodeTurns.test.js` (extend or create)

**Interfaces:**
- Consumes: `activityLabelFor` (Task 4)
- Produces: SSE `support.case.activity` `{ caseId, role, id, kind, label, status, at }`; `waitForAssistantTurn({ …, onToolSettled })`; `runAgentPrompt({ client, sessionID, text, timeoutMs, onToolSettled })`; `toolCalls` entries gain `kind` and `label`

- [ ] **Step 1: Write the failing test**

```js
// tests/unit/opencodeTurns.test.js
import { jest } from "@jest/globals";
import { waitForAssistantTurn } from "../../server/services/opencodeTurns.js";

function partList(status) {
	return [
		{ type: "tool", name: "read", state: { status, input: { path: "server/services/walletService.js" } } },
	];
}

test("onToolSettled fires once per settled tool and toolCalls carry labels", async () => {
	const seen = [];
	const client = {
		session: {
			prompt: jest.fn(async () => ({})),
		},
		message: {
			list: jest.fn()
				.mockResolvedValueOnce({ data: [] }) // seen snapshot
				.mockResolvedValue({
					data: [
						{ id: "m1", type: "assistant", content: partList("completed"), finish: "stop", time: { created: 1 } },
					],
				}),
		},
	};
	const turn = await waitForAssistantTurn({
		client,
		sessionID: "s1",
		text: "go",
		timeoutMs: 30_000,
		pollIntervalMs: 1,
		stablePollsToSettle: 99,
		onToolSettled: (part) => seen.push(part),
	});
	expect(seen).toHaveLength(1);
	expect(turn.content[0].state.status).toBe("completed");
});
```

(Mock client shape must satisfy whatever `collectMessages` expects: `client.message.list({ sessionID, order })` returns an object whose `.data` is the array, matching existing usage at line ~156. If the existing tests in the repo mock the same path differently, mirror their shape — check `tests/unit/file-access.test.js` / assistant tests if this test fails at link time.)

- [ ] **Step 2: Run to verify it fails**

Run: `npx jest tests/unit/opencodeTurns.test.js`
Expected: FAIL — `onToolSettled is not a function` or no callback invoked.

- [ ] **Step 3: Implement**

`opencodeTurns.js` — inside `waitForAssistantTurn`, after the destructured options at the top:

```js
	const announced = new Set();
```

and after the `texts` assignment inside the while loop:

```js
		if (typeof onToolSettled === "function") {
			for (const part of content) {
				if (!part || part.type !== "tool") {
					continue;
				}
				const status = String(part.state?.status ?? "");
				if (status !== "completed" && status !== "failed" && status !== "error") {
					continue;
				}
				let key;
				try {
					key = `${part.name || part.tool || "tool"}|${status}|${JSON.stringify(part.state?.input ?? null)}`;
				} catch {
					key = `${part.name || part.tool || "tool"}|${status}|unserializable`;
				}
				if (announced.has(key)) {
					continue;
				}
				announced.add(key);
				try {
					onToolSettled(part, status);
				} catch {
					// telemetry must never break the poll loop
				}
			}
		}
```

and add `onToolSettled = null` to the destructured options and pass `onToolSettled` into the returned object untouched (it already returns only selected fields — append none).

`opencodeRuntime.js`:

```js
import { activityLabelFor } from "./activityLabel.js";
```

(notice the import path — `opencodeRuntime.js` lives in `server/services/investigation/`, and `activityLabel.js` is created there, so: `import { activityLabelFor } from "./activityLabel.js";`)

In `runAgentPrompt`, replace the `toolCalls` mapping and the signature:

```js
	export async function runAgentPrompt({
	client,
	sessionID,
	text,
	timeoutMs = 180_000,
	onToolSettled = null,
}) {
	let turn;
	try {
		turn = await waitForAssistantTurn({
			client,
			sessionID,
			text,
			timeoutMs,
			pollIntervalMs: POLL_INTERVAL_MS,
			stablePollsToSettle: STABLE_POLLS_TO_SETTLE,
			onToolSettled,
		});
	} catch (error) { … unchanged … }

	const toolCalls = turn.content
		.filter((part) => part.type === "tool")
		.map((part) => ({
			tool: part.tool || part.name || "unknown",
			status: part.state?.status || "unknown",
			...activityLabelFor(part),
			error: part.state?.error ? formatToolError(part.state.error) : undefined,
		}));
```

`investigationQueue.js` — add next to `emitProgress`:

```js
import { activityLabelFor } from "./investigation/activityLabel.js";

function emitActivity(caseId, role, part, status) {
	const { kind, label } = activityLabelFor(part);
	return emitCaseEvent("support.case.activity", {
		caseId,
		role,
		id: crypto.randomUUID(),
		kind,
		label,
		status: status === "completed" ? "done" : "failed",
		at: new Date().toISOString(),
	});
}
```

In the role-runner call site of `runAgentPrompt` (find it: `const result = await runAgentPrompt({ client, sessionID, text, timeoutMs })` — grep the exact shape), add:

```js
		onToolSettled: (part, status) => {
			emitActivity(caseId, role, part, status);
		},
```

(emitActivity swallows its own errors via `emitCaseEvent`'s internal try/catch; passing it directly is fine — if you want the poll loop immune, wrap in try/catch too, matching the reducer-level guard.)

`realtimeBus.js` — in `CASE_EVENTS`:

```js
	activity: "support.case.activity",
```
(plus the sibling comment line that lists the events, update its count)

- [ ] **Step 4: Run the test files**

Run: `npx jest tests/unit/opencodeTurns.test.js tests/unit/activity-label.test.js`
Expected: PASS. Also run `node --experimental-vm-modules -e "require('node:assert')"` sanity via `npm run build` — but this is server-side JS (CommonJS-ish ESM mix; the repo's ESM loader tolerates it).

- [ ] **Step 5: Commit**

```bash
npx biome check --write server/services/opencodeTurns.js server/services/investigation/opencodeRuntime.js server/services/investigationQueue.js server/realtime/realtimeBus.js
npm test
git add server/services/opencodeTurns.js server/services/investigation/opencodeRuntime.js server/services/investigationQueue.js server/realtime/realtimeBus.js tests/unit/opencodeTurns.test.js
git commit -m "feat(support): stream tool calls as support.case.activity

Each tool part that leaves running/streaming emits one SSE line
{caseId, role, id, kind, label, status, at} through the existing
realtime bus (same discipline as support.case.progress: emission failure
never stops the investigation). Labels are basename-only via
activityLabelFor, which is also what runAgentPrompt persists into
tool_log. verified no raw args or reasoning cross the wire."
```

---

### Task 6: Persisted activity — `GET /support/cases/:id` projection

**Files:**
- Modify: `server/controllers/caseController.js` — `getCaseController`
- Test: extend `tests/integration/support-case-api.test.js`

**Interfaces:**
- Consumes: `SupportInvestigation` rows with `tool_log` carrying Task-5 shape
- Produces: response gains `investigations: Array<{ role: string, status: string, completed_at: Date|null, tool_log: unknown }>` — deliberately narrow

- [ ] **Step 1: Write the failing test**

Add to the integration file:

```js
	test("GET case returns a narrow investigations projection", async () => {
		state.cases = [caseRow({ id: "case-it-1", user_id: user.id, status: "collecting" })];
		state.investigations = [
			{ id: "inv-1", case_id: "case-it-1", role: "repo", status: "complete", completed_at: new Date(), tool_log: [{ tool: "read", status: "completed", kind: "read", label: "Reading walletService.js" }] },
		];
		const res = await getCase(user, "case-it-1");
		expect(res.body.investigations).toHaveLength(1);
		expect(Object.keys(res.body.investigations[0]).sort()).toEqual(["completed_at", "role", "status", "tool_log"]);
	});
```

(Match whatever `caseRow`/`seedOwner` helpers the file already defines; if the investigation collection helper differs, adapt the seeding to the file's own `state.investigations` used elsewhere in this file — grep `investigations` first.)

- [ ] **Step 2: Run to verify failure**

Run: `npx jest tests/integration/support-case-api.test.js -t "narrow investigations"`
Expected: FAIL — `body.investigations` undefined.

- [ ] **Step 3: Implement in `getCaseController`** — before the final `res.json`:

```js
		const investigations = await prisma.supportInvestigation
			.findMany({
				where: { case_id: caseId },
				select: { role: true, status: true, completed_at: true, tool_log: true },
				orderBy: { started_at: "asc" },
			})
			.catch(() => []);

		return res.json({
			case: caseRow,
			messages: messages || [],
			attachments: Array.isArray(attachments) ? attachments : [],
			feedback,
			investigations: Array.isArray(investigations) ? investigations : [],
		});
```

- [ ] **Step 4: Run the integration suite**

Run: `npx jest tests/integration/support-case-api.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
npx biome check --write server/controllers/caseController.js tests/integration/support-case-api.test.js
npm test
git add server/controllers/caseController.js tests/integration/support-case-api.test.js
git commit -m "feat(support): expose a narrow investigations projection on GET case

The case GET now returns only {role, status, completed_at, tool_log} per
investigation — enough to re-seed the activity tree after a reload, and
nothing about findings, prompts, evidence or errors."
```

---

### Task 7: Client render — the inline tree, reducer state, persistence seed

**Files:**
- Modify: `src/lib/caseRealtime.js` (whitelist)
- Modify: `src/hooks/useSupportCase.js` (reducer `activity`, seed on `load:ok`, export `seedActivityFromInvestigations`)
- Create: `src/components/support/ActivityTree.jsx`
- Modify: `src/pages/support/SupportWorkspace.jsx` (mount inline above the message list)
- Test: `tests/unit/frontend-support-activity-tree.test.js` (create) + additions to `frontend-support-case.test.js`

**Interfaces:**
- Consumes: `investigations[]` (Task 6), event `support.case.activity` (Task 5)
- Produces: hook state `activity: Array<{ id: string, role?: string, kind: string, label: string, status: string, at?: string }>`; `<ActivityTree activity status />`

- [ ] **Step 1: Write the failing component test**

```js
// tests/unit/frontend-support-activity-tree.test.js
/** @jest-environment allure-jest/jsdom */
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { ActivityTree } from "../../src/components/support/ActivityTree.jsx";

const rows = [
	{ id: "1", role: "lead", kind: "read", label: "Reading walletService.js", status: "done", at: "2026-11-17T06:00:00.000Z" },
	{ id: "2", role: "repo", kind: "search", label: "Searching code", status: "done", at: "2026-11-17T06:00:06.000Z" },
];

test("renders labels with no paths and collapses on toggle", () => {
	const { container } = render(<ActivityTree activity={rows} status="investigating" />);
	expect(screen.getByText("Reading walletService.js")).toBeTruthy();
	expect(screen.getByText("Searching code")).toBeTruthy();
	expect(container.textContent).not.toContain("server/");
	const toggle = screen.getByRole("button", { name: /investigation/i });
	fireEvent.click(toggle);
	expect(screen.queryByText("Reading walletService.js")).toBeTruthy(); // header stays; body collapses
});

test("shows How this was investigated when completed and no rows leak tool errors", () => {
	render(<ActivityTree activity={rows.map((r) => ({ ...r, error: "no" }))} status="completed" />);
	expect(screen.getByText(/How this was investigated/i)).toBeTruthy();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx jest tests/unit/frontend-support-activity-tree.test.js`
Expected: FAIL — cannot find module.

- [ ] **Step 3: Implement `ActivityTree.jsx`**

```jsx
import { Check, ChevronDown, LoaderCircle, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/cn.js";

const STAGE_ORDER = ["lead", "code", "repo", "research", "verify"];

function summarize(rows) {
	// duration from live timestamps; absent or 0 => omit (never lie)
	const times = (rows ?? []).map((row) => Date.parse(row?.at ?? "")).filter(Number.isFinite);
	if (times.length >= 2) {
		const delta = Math.max(...times) - Math.min(...times);
		if (delta >= 1000) return `${Math.round(delta / 1000)}s`;
	}
	return null;
}

/**
 * The inline AI activity tree. Rows are pre-sanitized server-side; this
 * component renders exactly what it is given and never the assistant's
 * message text.
 */
export function ActivityTree({ activity = [], status = "collecting" }) {
	const rows = Array.isArray(activity) ? activity : [];
	const running = ["investigating", "verifying", "reporting"].includes(
		String(status ?? "").toLowerCase(),
	);
	const [open, setOpen] = useState(true);
	if (rows.length === 0 && !running) {
		return null;
	}
	const ordered = [...rows].sort((left, right) => (STAGE_ORDER.indexOf(left?.role ?? "") - STAGE_ORDER.indexOf(right?.role ?? "")) || 0);
	const heading = running ? "Working…" : `How this was investigated · ${rows.length} steps${summarize(rows) ? ` · ${summarize(rows)}` : ""}`;
	return (
		<section aria-label="AI activity" className="mx-auto w-full max-w-3xl">
			<button
				type="button"
				onClick={() => setOpen((value) => !value)}
				aria-expanded={open}
				className="flex w-full items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-left text-[11px] font-semibold text-cyan-200 transition hover:border-cyan-400/40"
			>
				{running ? (
					<LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
				) : (
					<Check className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
				)}
				<span className="min-w-0 flex-1 truncate font-mono">{heading}</span>
				<ChevronDown
					className={cn("h-4 w-4 shrink-0 text-[#a99bbd] transition-transform", open && "rotate-180")}
					aria-hidden="true"
				/>
			</button>
			{open ? (
				<ol className="mt-1.5 border-l border-cyan-400/20 pl-4">
					{ordered.map((row, index) => {
						const previousRole = ordered[index - 1]?.role ?? null;
						const showRole = row?.role && row.role !== previousRole;
						const failed = row?.status === "failed";
						return (
							<li key={row?.id ?? index} className="flex items-baseline gap-2 py-0.5 font-mono text-[11px] leading-5">
								<span className={failed ? "text-amber-400" : "text-emerald-400"} aria-hidden="true">
									{failed ? <TriangleAlert className="h-3 w-3 translate-y-0.5" /> : "|_"}
								</span>
								{showRole ? <span className="text-[#8f83a8]">{row.role} ·</span> : null}
								<span className="text-[#cfe8ef]">{row?.label ?? "Working"}</span>
							</li>
						);
					})}
				</ol>
			) : null}
		</section>
	);
}
```

Note: status pill for running uses `LoaderCircle` (confirm the icon exists in the installed lucide-react version — `Loader2` is the older name; if the build fails, use `Loader2`. Check `node_modules/lucide-react/dist/esm/icons/ | grep -i loader`).

`caseRealtime.js`:

```js
const CASE_EVENT_TYPES = Object.freeze([
	"support.case.message",
	"support.case.status",
	"support.case.progress",
	"support.case.finding",
	"support.case.report",
	"support.case.activity",
]);
```

`useSupportCase.js` — INITIAL_CASE_STATE gains `activity: []`. Reducer: add to `case "load:ok"` the seed computation (and keep seeds only when non-empty), and a new `"activity"` action, and export `seedActivityFromInvestigations`:

```js
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

export function seedActivityFromInvestigations(investigations) {
	const rows = [];
	for (const investigation of Array.isArray(investigations) ? investigations : []) {
		const role = investigation?.role ?? null;
		const at = investigation?.completed_at
			? new Date(investigation.completed_at).toISOString()
			: "";
		const entries = Array.isArray(investigation?.tool_log) ? investigation.tool_log : [];
		entries.forEach((entry, index) => {
			const kind = typeof entry?.kind === "string" ? entry.kind : "other";
			const label = typeof entry?.label === "string" && entry.label.trim() ? entry.label.trim() : `Using ${String(entry?.tool ?? "tool").slice(0, 32)}`;
			const failed = entry?.status === "failed" || entry?.status === "error";
			rows.push({
				id: `persist:${role}:${index}`,
				role,
				kind,
				label: String(label).slice(0, 80),
				status: failed ? "failed" : "done",
				at,
			});
		});
	}
	return rows;
}
```

reducer:
```js
		"load:ok": {
			...
			activity: (() => {
				const seeds = seedActivityFromInvestigations(action.investigations);
				return seeds.length > 0 ? seeds : (state.activity ?? []);
			})(),
		},
		case "activity": {
			const entry = action.entry;
			if (!entry?.id) return state;
			return { ...state, activity: upsertActivityRow(state.activity, entry) };
		},
```

In `applyCaseEvent`:
```js
		case "support.case.activity": {
			const payload = action.payload;
			if (!payload?.id) return state;
			const entry = {
				id: String(payload.id),
				role: typeof payload.role === "string" ? payload.role : undefined,
				kind: typeof payload.kind === "string" ? payload.kind : "other",
				label: typeof payload.label === "string" ? payload.label.slice(0, 80) : "Working",
				status: payload.status === "failed" ? "failed" : "done",
				at: typeof payload.at === "string" ? payload.at : undefined,
			};
			return { ...state, activity: upsertActivityRow(state.activity, entry) };
		}
```

`subscribeToCase` whitelist is automatic (CASE_EVENT_TYPES covers it).

`SupportWorkspace.jsx`: in the transcript wrapper, right before `<div ref={transcriptRef}` (or inside it, first child), mount:

```jsx
<ActivityTree activity={supportCase.activity} status={caseStatus} />
```
Only when `supportCase.activity.length > 0 || isInvestigating` (the component returns null otherwise).

- [ ] **Step 4: Run the suites**

Run: `npx jest tests/unit/frontend-support-activity-tree.test.js tests/unit/frontend-support-case.test.js tests/unit/frontend-support-landing.test.js`
Expected: PASS. (The workspace suite `frontend-support-workspace.test.js` may need the new component import stubbed or it will pass naturally — run it too.)

- [ ] **Step 5: Commit**

```bash
npx biome check --write src/lib/caseRealtime.js src/hooks/useSupportCase.js src/components/support/ActivityTree.jsx src/pages/support/SupportWorkspace.jsx tests/unit/frontend-support-activity-tree.test.js tests/unit/frontend-support-case.test.js
npm test
npm run build
git add src/lib/caseRealtime.js src/hooks/useSupportCase.js src/components/support/ActivityTree.jsx src/pages/support/SupportWorkspace.jsx tests/unit/frontend-support-activity-tree.test.js tests/unit/frontend-support-case.test.js
git commit -m "feat(support): inline activity tree while the AI works

New support.case.activity rows merge into hook state (dedupe by id, cap
200, seeded from the persisted investigations projection) and render as
an inline collapsible tree above the transcript. Rows show the
server-sanitized labels only; failed steps get a warning glyph; the
tree collapses to 'How this was investigated' once done. The assistant's
text is untouched."
```

---

### Task 8: Docs, QA evidence and release hygiene

**Files:**
- Modify: `docs/developer/architecture.md` (SSE bullet)
- Create: `docs/rollout/2026-11-17-naming-and-activity-tree-rollout.md`
- Move: screenshots (fresh, from a real local run) into `qa-screenshots/`

**Interfaces**
- Consumes: Tasks 1–7 complete
- Produces: release evidence

- [ ] **Step 1: Doc updates**

`docs/developer/architecture.md`, the SSE line ~47: change `support-case progress` to `support-case progress and support.case.activity` and add one sentence: "`caseRealtime.js` whitelists both; the activity event carries only server-sanitized basename labels (see `activityLabel.js`), never paths or reasoning."

Rollout doc: what shipped, verification transcript (curl of POST messages showing `subject`, `wget`/browser screenshot paths), known limits (first message may still be canned while the runtime boots ~7 s; persisted reload relies on `tool_log` present since this build), the note that `docs/contracts.md` is not committed to this repository — the contract of record is the spec + this rollout note.

- [ ] **Step 2: Live verification**

With backend + frontend running: open `/support`, paste the buyer token, file the WELCOME3M ticket as the first message of a fresh case; confirm (a) the reply shows no `TITLE:`, (b) the header and Case reference show a real title, (c) `GET /api/support/cases/<id>` contains `subject`, (d) starting the investigation shows the tree with `Reading walletService.js`-style rows streaming live, (e) after completion the tree collapses to "How this was investigated · N steps". Capture two PNGs under `/tmp/opencode/qa-screenshots/` and move them into the repo’s `qa-screenshots/` folder (do not leave screenshots at repo root).

- [ ] **Step 3: Full gate**

Run: `npm test && npm run build`
Expected: 1144 total / 1131 passed (or new count ≥ that), exit 0.

- [ ] **Step 4: Commit**

```bash
git add docs/developer/architecture.md docs/rollout/2026-11-17-naming-and-activity-tree-rollout.md qa-screenshots/
git commit -m "docs(support): rollout notes and QA evidence for naming + activity tree"
```

---

## Self-Review

**Spec coverage:** marker+strip+fallback → Task 1; persistence+response subject → Task 2; client render → Task 3; labels helper → Task 4; live events + bus → Task 5; narrow investigations projection → Task 6; render+state+seed+persistence collapse → Task 7; docs/QA → Task 8. Every spec section maps to a task; nothing in the spec is unimplemented.

**Types/consistency check:** `activityLabelFor` returns `{kind,label}` consumed by Task 5 (emit) and Task 1-era Task-5 normalization (`runAgentPrompt` spread) — both use the same import path `./activityLabel.js` from `investigation/` (note: Task 5 imports it correctly for opencodeRuntime.js, which is in the same directory). `subject` key is the same name everywhere (server response, hook state `caseRow.subject`, UI). Event name `support.case.activity` identical in bus, whitelist, reducer, docs.

**Deliberate deviations from the spec (flag, don't hide):** `docs/contracts.md` §4.6 cannot be edited — that file is not committed to this repo (referenced by code comments and history logs but absent); Task 8 records the contract in the rollout note and `architecture.md` instead. The upload of `activities` into the report document is out of scope (spec non-goals).
