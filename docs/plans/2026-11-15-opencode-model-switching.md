# OpenCode Assistant — Model Fetching, Switching & Auto-Fallback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the floating assistant live free-tier model fetching, an admin UI to pick the active model (persisted in the DB), and automatic per-turn fallback to the next free model when the active one refuses.

**Architecture:** A new `server/services/opencodeModelService.js` owns model fetching (`/api/model` via the v2 SDK), the persisted active model (`AdminBranding` key-value row `ai.opencode.model_id`, audited via `AdminConfigHistory`), and the per-turn fallback loop (fresh ephemeral session per fallback attempt). The assistant service delegates its opencode prompt to it; two new admin routes expose list/switch to the Admin AI section; the reply envelope gains `metadata.model` / `metadata.fallback_attempts`.

**Tech Stack:** Express 5, Prisma 6 (PostgreSQL), `@opencode/client` (v2 SDK), React 19 + Tailwind 4 admin panel, Jest 29 (`node --experimental-vm-modules … jest --runInBand`).

## Global Constraints

- Free-tier opencode models ONLY — enforced server-side by `isFreeOpencodeModel` from `server/services/investigation/modelChain.js`. Paid models are never listed, never selectable.
- The support-investigation portal is untouched; do not import from its modules except the already-exported `DEFAULT_MODEL_CHAIN` / `isFreeOpencodeModel` / `REPOSITORY_ROOT`.
- No new Prisma models, no migration. Persistence: `AdminBranding` + `AdminConfigHistory` only.
- A timeout on a candidate is NEVER retried (matches the investigation runtime semantics); only model refusals (429 / provider quota / `message.error`) advance the chain.
- `docs/superpowers/specs/2026-11-15-opencode-model-switching-design.md` is the source of truth for behavior.
- **Amended by the final fix wave (2026-11-15):** the run outcome travels by value (no process-global stash), the free-model list is fetched live (no 60 s cache), and a persisted session's recorded model is never re-stamped with the model that is active now. The Task 1 / Task 2 interface lists below carry the amendments; the fenced code blocks are the original task text.

---

### Task 1: New `opencodeModelService.js` + unit tests

**Files:**
- Create: `server/services/opencodeModelService.js`
- Test: `tests/unit/server-opencode-model-service.test.js`
- Modify: `docs/superpowers/specs/2026-11-15-opencode-model-switching-design.md` (clean the self-talk paragraph in §Error handling)

**Interfaces:**
- Consumes: `DEFAULT_MODEL_CHAIN`, `isFreeOpencodeModel` from `server/services/investigation/modelChain.js`; `REPOSITORY_ROOT` from `server/services/investigation/opencodeRuntime.js`; `waitForAssistantTurn` from `server/services/opencodeTurns.js`; `prisma` default export from `server/utils/prisma.js`; `aiConfig`-equivalent read via `process.env` (do NOT import assistantService — avoid a cycle).
- Produces (used by Tasks 2–4):
  - `fetchAvailableModels(client): Promise<Array<{id: string, providerID: string}>>` — fetches the live list every time (amended by the final fix wave: the 60 s cache is gone).
  - `getActiveModel(): Promise<{id: string, providerID: string, source: "admin"|"env"|"default"}>` — DB row wins, then `OPENCODE_MODEL_ID` env, then `minimax-m3.1-flash-free`.
  - `setActiveModel(modelId: string, changedBy: string, client?): Promise<{id: string, providerID: string, source: "admin"}>` — throws `Error` with `.status = 400` on refusal; `.status = 500` on write failure.
  - `getCandidateChain(): Promise<Array<{id: string, providerID: string}>>` — active first, then the default chain minus active.
  - `runAssistantPrompt({client, sessionID, text, timeoutMs, onText}): Promise<{text: string, parts: Array, model: string, providerID: string, attempts: Array<{model: string, outcome: "ok"|"refused"|"timeout"|"wedged"}>}>` or `null` (timeout / wedge / all refused). The outcome travels BY VALUE (amended by the final fix wave: there is no process-global stash).
  - `getModelsSnapshot(client?): Promise<{models, active, source, serverAvailable}>` — used by the GET route.

- [ ] **Step 1: Clean the spec paragraph**

Replace lines 157–162 of `docs/superpowers/specs/2026-11-15-opencode-model-switching-design.md` (the "Actually — decision: …" paragraph) with:

```markdown
- Timeout on a candidate → NOT retried, and the chain does not advance past it.
  The opencode path returns null and the caller's existing HTTP-provider / FAQ
  fallback applies (matches the investigation runtime's semantics: the model
  was working, retrying would double the wall clock).
```

- [ ] **Step 2: Write the failing test**

Create `tests/unit/server-opencode-model-service.test.js`:

```js
import { jest } from "@jest/globals";

const upsertBranding = jest.fn(async () => ({}));
const findBranding = jest.fn(async () => null);
const createHistory = jest.fn(async () => ({}));

jest.unstable_mockModule("../../server/utils/prisma.js", () => ({
	default: {
		adminBranding: { findUnique: findBranding, upsert: upsertBranding },
		adminConfigHistory: { create: createHistory },
	},
}));

const svc = await import("../../server/services/opencodeModelService.js");

function assistantMsg(id, created, text, finish = "stop", error = null) {
	return {
		id,
		type: "assistant",
		time: { created },
		finish,
		content: [{ type: "text", text }],
		...(error ? { error } : {}),
	};
}

function makeClient({ listResponse, refusalFirst = false } = {}) {
	// Messages already in the session before the prompt (newest first),
	// and the message the prompt will produce.
	let fresh = [];
	const session = {
		create: jest.fn(async () => ({ id: `ephemeral-${Date.now()}` })),
		remove: jest.fn(async () => ({})),
		prompt: jest.fn(async () => {
			fresh = refusalFirst
				? [
						{
							id: "refused-1",
							type: "assistant",
							time: { created: 9999 },
							finish: "error",
							content: [],
							error: { type: "provider.quota", message: "Rate limit exceeded", status: 429 },
						},
					]
				: [assistantMsg("ok-1", 9999, "ANSWER FROM FALLBACK")];
			return { id: "u" };
		}),
	};
	const message = {
		list: jest.fn(async () => ({ data: [...fresh, ...(listResponse ?? [])] })),
	};
	return { session, message };
}

beforeEach(() => {
	upsertBranding.mockClear();
	findBranding.mockResolvedValue(null);
	createHistory.mockClear();
	svc.clearLastOpencodeOutcome();
	delete process.env.OPENCODE_MODEL_ID;
});

describe("fetchAvailableModels", () => {
	test("keeps only free-tier opencode models", async () => {
		const client = {
			model: {
				list: async () => ({
					data: [
						{ modelID: "minimax-m3.1-flash-free", providerID: "opencode" },
						{ modelID: "gpt-5-paid", providerID: "opencode" },
						{ modelID: "minimax-m3.1-flash-free", providerID: "openai" },
					],
				}),
			},
		};
		const models = await svc.fetchAvailableModels(client, { fresh: true });
		expect(models).toEqual([{ id: "minimax-m3.1-flash-free", providerID: "opencode" }]);
	});
});

describe("getActiveModel", () => {
	test("admin row wins when it is a free model", async () => {
		findBranding.mockResolvedValue({ brand_key: "ai.opencode.model_id", value: "glm-5.3-flash-free", active: true });
		const active = await svc.getActiveModel();
		expect(active).toEqual({ id: "glm-5.3-flash-free", providerID: "opencode", source: "admin" });
	});

	test("non-free admin row is ignored", async () => {
		findBranding.mockResolvedValue({ brand_key: "ai.opencode.model_id", value: "gpt-5-paid", active: true });
		const active = await svc.getActiveModel();
		expect(active).toEqual({ id: "minimax-m3.1-flash-free", providerID: "opencode", source: "default" });
	});
});

describe("setActiveModel", () => {
	test("refuses a non-free model id", async () => {
		await expect(svc.setActiveModel("gpt-5-paid", "admin-1", null)).rejects.toMatchObject({
			status: 400,
		});
		expect(upsertBranding).not.toHaveBeenCalled();
	});

	test("persists branding + config history and returns admin source", async () => {
		const client = { model: { list: async () => ({ data: [{ modelID: "beam-free", providerID: "opencode" }] }) } };
		const result = await svc.setActiveModel("beam-free", "admin-1", client);
		expect(result).toEqual({ id: "beam-free", providerID: "opencode", source: "admin" });
		expect(upsertBranding).toHaveBeenCalledTimes(1);
		expect(createHistory).toHaveBeenCalledTimes(1);
	});

	test("rolls back branding when the history write fails", async () => {
		findBranding.mockResolvedValueOnce({ brand_key: "ai.opencode.model_id", value: "minimax-m3.1-flash-free", active: true }); // previous value read for rollback
		const client = { model: { list: async () => ({ data: [{ modelID: "beam-free", providerID: "opencode" }] }) } };
		createHistory.mockRejectedValueOnce(new Error("db down"));
		await expect(svc.setActiveModel("beam-free", "admin-1", client)).rejects.toMatchObject({ status: 500 });
		// 1st upsert = the switch, 2nd upsert = the rollback to the previous value
		expect(upsertBranding).toHaveBeenCalledTimes(2);
	});
});

describe("runAssistantPrompt", () => {
	test("returns the active model's answer with attempts recorded", async () => {
		process.env.OPENCODE_MODEL_ID = "minimax-m3.1-flash-free";
		const client = makeClient();
		const result = await svc.runAssistantPrompt({
			client,
			sessionID: "user-session-1",
			text: "hello",
			timeoutMs: 5000,
		});
		expect(result?.model).toBe("minimax-m3.1-flash-free");
		expect(result?.attempts.map((a) => a.outcome)).toEqual(["ok"]);
		expect(result?.text).toBe("ANSWER FROM FALLBACK");
	});

	test("a refusal on the active model falls back to the next free model", async () => {
		process.env.OPENCODE_MODEL_ID = "minimax-m3.1-flash-free";
		const prompted = new Set();
		const refusedMsg = {
			id: "refused-1",
			type: "assistant",
			time: { created: 1 },
			finish: "error",
			content: [],
			error: { type: "provider.quota", message: "quota", status: 429 },
		};
		const client = {
			session: {
				create: jest.fn(async () => ({ id: "ephemeral-1" })),
				remove: jest.fn(async () => ({})),
				prompt: jest.fn(async ({ sessionID }) => {
					prompted.add(sessionID);
					return {};
				}),
			},
			message: {
				list: jest.fn(async ({ sessionID }) => {
					if (!prompted.has(sessionID)) return { data: [] };
					if (sessionID === "user-session-1") return { data: [refusedMsg] };
					return { data: [assistantMsg("ok-1", 2, "ANSWER FROM FALLBACK")] };
				}),
			},
		};
		const result = await svc.runAssistantPrompt({
			client,
			sessionID: "user-session-1",
			text: "hello",
			timeoutMs: 5000,
		});
		expect(result?.model).toBe("deepseek-v4.1-flash-free"); // first entry of DEFAULT_MODEL_CHAIN
		expect(result?.attempts.map((a) => a.outcome)).toEqual(["refused", "ok"]);
	});

	test("a timeout is NOT retried and the fallback chain does not advance", async () => {
		process.env.OPENCODE_MODEL_ID = "minimax-m3.1-flash-free";
		const createSpy = jest.fn(async () => ({ id: "ephemeral-1" }));
		const client = {
			session: {
				create: createSpy,
				remove: jest.fn(async () => ({})),
				prompt: jest.fn(async () => ({})),
			},
			message: {
				// No assistant message ever appears; the deadline (1 ms) expires first.
				list: jest.fn(async () => ({ data: [] })),
			},
		};
		const result = await svc.runAssistantPrompt({
			client,
			sessionID: "user-session-1",
			text: "hello",
			timeoutMs: 1,
		});
		expect(result).toBeNull();
		expect(createSpy).not.toHaveBeenCalled();
	});
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand tests/unit/server-opencode-model-service.test.js`
Expected: FAIL with `Cannot find module '../../server/services/opencodeModelService.js'`

- [ ] **Step 4: Implement `server/services/opencodeModelService.js`**

```js
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
import prisma from "../utils/prisma.js";
import { logInfo, logWarn, logError } from "../utils/logger.js";
import { DEFAULT_MODEL_CHAIN, isFreeOpencodeModel } from "./investigation/modelChain.js";
import { REPOSITORY_ROOT } from "./investigation/opencodeRuntime.js";
import { waitForAssistantTurn } from "./opencodeTurns.js";

const BRANDING_KEY = "ai.opencode.model_id";
const DEFAULT_MODEL_ID = "minimax-m3.1-flash-free";
const FREE_PROVIDER_ID = "opencode";
const CACHE_TTL_MS = 60_000;

let _modelsCache = null; // { at: number, models: [{id, providerID}] }
let _lastOutcome = null;

export async function fetchAvailableModels(client, { fresh = false } = {}) {
	if (!fresh && _modelsCache && Date.now() - _modelsCache.at < CACHE_TTL_MS) {
		return _modelsCache.models;
	}
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
	_modelsCache = { at: Date.now(), models };
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
	const envId = String(process.env.OPENCODE_MODEL_ID || "").replace(/^opencode\//, "").trim();
	if (envId && isFreeOpencodeModel(envId, FREE_PROVIDER_ID)) {
		return { id: envId, providerID: FREE_PROVIDER_ID, source: "env" };
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
	if (!id || !isFreeOpencodeModel(id, FREE_PROVIDER_ID)) {
		const error = new Error(`Refusing to persist "${id}": only free opencode-tier models may be selected.`);
		error.status = 400;
		throw error;
	}
	if (client) {
		try {
			const live = await fetchAvailableModels(client, { fresh: true });
			if (live.length > 0 && !live.some((m) => m.id === id)) {
				const error = new Error(`Refusing to persist "${id}": the running opencode server does not offer it.`);
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
		} catch (historyError) {
			// Audit or nothing: roll the branding row back to the previous pick.
			try {
				await prisma.adminBranding.upsert({
					where: { brand_key: BRANDING_KEY },
					update: { value: previous ?? DEFAULT_MODEL_ID, active: true },
					create: { brand_key: BRANDING_KEY, value: previous ?? DEFAULT_MODEL_ID, active: true },
				});
			} catch (rollbackError) {
				logError("opencode_model_rollback_failed", { message: rollbackError?.message });
			}
			const error = new Error("Could not record the change in the audit log; the switch was not kept.");
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
	const models = await fetchAvailableModels(client);
	return { models, active: active.id, source: active.source, serverAvailable: true };
}

export function getLastOpencodeOutcome() {
	return _lastOutcome;
}

export function clearLastOpencodeOutcome() {
	_lastOutcome = null;
}

/**
 * Run one assistant prompt with per-turn fallback. The first attempt uses the
 * caller's session (bound to the active model). On a model refusal, each
 * remaining chain candidate gets a FRESH EPHEMERAL session, which is deleted
 * after the turn. Timeouts and wedges are never retried.
 */
export async function runAssistantPrompt({ client, sessionID, text, timeoutMs = 120_000, onText = null }) {
	const chain = await getCandidateChain();
	const attempts = [];

	async function attempt(useSessionID) {
		return waitForAssistantTurn({ client, sessionID: useSessionID, text, timeoutMs, onText });
	}

	for (let i = 0; i < chain.length; i += 1) {
		const candidate = chain[i];
		let targetSessionID = sessionID;
		let ephemeral = false;
		if (i > 0) {
			const created = await client.session.create({
				title: `assistant-fallback-${Date.now()}`,
				model: { id: candidate.id, providerID: candidate.providerID },
				location: { directory: REPOSITORY_ROOT },
			});
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
			_lastOutcome = { model: candidate.id, attempts, failed: outcome };
			return null;
		}
		_lastOutcome = { model: candidate.id, attempts };
		return {
			text: turn.text,
			parts: turn.parts,
			model: candidate.id,
			providerID: candidate.providerID,
			attempts,
		};
	}
	_lastOutcome = { model: null, attempts, failed: "refused" };
	return null;
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand tests/unit/server-opencode-model-service.test.js`
Expected: PASS (all 10 tests). The fallback test keys the list response off `prompted`/`sessionID`, so poll order does not matter.

- [ ] **Step 6: Commit**

```bash
git add server/services/opencodeModelService.js tests/unit/server-opencode-model-service.test.js docs/superpowers/specs/2026-11-15-opencode-model-switching-design.md
git commit -m "feat(assistant): opencode model service — fetch, switch, per-turn fallback"
```

---

### Task 2: Wire the assistant service to the new service

**Files:**
- Modify: `server/services/assistantService.js` (imports; outcome by value instead of the stash; `cachedSessionMatchesModel` → active model; `callOpencode`; `buildMatchedResponse`; `assistantReply`; `streamOpencodeReply`)
- Test: `tests/unit/server-assistant-opencode-metadata.test.js` (new)

**Interfaces:**
- Consumes (from Task 1): `getActiveModel`, `runAssistantPrompt` (amended by the final fix wave: the outcome comes back by value, so there is no `getLastOpencodeOutcome()` / `clearLastOpencodeOutcome()` to consume).
- Produces: REST `/ask` responses carry `metadata.model` + `metadata.fallback_attempts` when (and only when) the opencode provider produced the answer; streaming WS replies carry the same in `metadata`.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/server-assistant-opencode-metadata.test.js`:

```js
import { jest } from "@jest/globals";

jest.unstable_mockModule("../../server/utils/prisma.js", () => ({
	default: {
		user: { findUnique: jest.fn(async () => null) },
		appState: { findUnique: jest.fn(async () => null) },
		assistantKnowledge: { findMany: jest.fn(async () => []) },
		adminBranding: { findUnique: jest.fn(async () => null) },
		adminConfigHistory: { create: jest.fn(async () => ({})) },
	},
}));

const { buildMatchedResponse } = await import("../../server/services/assistantService.js");

describe("buildMatchedResponse opencode metadata", () => {
	test("adds model and fallback_attempts when an opencode outcome is provided", () => {
		const res = buildMatchedResponse({
			matchedAnswer: "hi",
			source: "dynamic_ai:local_llm",
			score: 2,
			opencodeMeta: { model: "glm-5.3-flash-free", attempts: [{ model: "minimax-m3.1-flash-free", outcome: "refused" }] },
		});
		expect(res.metadata.model).toBe("glm-5.3-flash-free");
		expect(res.metadata.fallback_attempts).toHaveLength(1);
	});

	test("omits model when no opencode outcome is provided", () => {
		const res = buildMatchedResponse({ matchedAnswer: "hi", source: "faq", score: 1 });
		expect(res.metadata.model).toBeUndefined();
	});
});
```

- [ ] **Step 2: Run it — expect FAIL** (`buildMatchedResponse` is not exported and takes no `opencodeMeta`)

Run: `node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand tests/unit/server-assistant-opencode-metadata.test.js`
Expected: FAIL with `buildMatchedResponse is not a function` (or similar).

- [ ] **Step 3: Export `buildMatchedResponse` and add `opencodeMeta`**

In `server/services/assistantService.js`, change the signature to:

```js
export function buildMatchedResponse({
	matchedAnswer,
	source,
	score,
	fallbackReason = null,
	matchedType = null,
	codeContext = null,
	knowledgeContext = "",
	opencodeMeta = null,
}) {
	const metadata = {
		matched_source: source,
		matched_type: matchedType,
		confidence: Number(Math.min(0.95, 0.45 + score * 0.1).toFixed(2)),
		fallback_reason: fallbackReason,
		code_context: codeContext,
		knowledge_context: knowledgeContext,
	};
	if (opencodeMeta?.model) {
		metadata.model = opencodeMeta.model;
		metadata.fallback_attempts = opencodeMeta.attempts || [];
	}
	return {
		matched_answer: matchedAnswer,
		source,
		confidence: metadata.confidence,
		metadata,
	};
}
```

- [ ] **Step 4: Import the new service**

Add near the other service imports in `assistantService.js`:

```js
import {
	getActiveModel,
	runAssistantPrompt,
	getLastOpencodeOutcome,
	clearLastOpencodeOutcome,
} from "./opencodeModelService.js";
```

- [ ] **Step 5: Bind sessions to the RESOLVED active model**

`cachedSessionMatchesModel` is currently synchronous and compares against `aiConfig.opencode.modelID`. Make it async and compare against the resolved active model:

```js
async function cachedSessionMatchesModel(meta) {
	if (!meta?.sessionId) {
		return false;
	}
	const had = String(meta.model || "");
	if (!had) {
		// An old meta with no model recorded cannot be proven stale, so it is
		// kept: discarding a good session is the worse failure.
		return true;
	}
	const active = await getActiveModel();
	return had === String(active.id || "");
}
```

Update every caller in `assistantService.js` to `await cachedSessionMatchesModel(meta)` (they are all inside async functions — grep for `cachedSessionMatchesModel(` and fix each of the 3 call sites; the streaming path compares inside `if (userId)` blocks already inside async functions; the `loadSessionMeta`-based comparisons inside `callOpencode` and `streamOpencodeReply` are in async functions too).

- [ ] **Step 6: Bind `createUserOpencodeSession` to the resolved active model**

In `createUserOpencodeSession`, replace `cfg.modelID`/`cfg.providerID` with the resolved active model (keep `cfg` only for the `baseUrl` guard):

```js
const active = await getActiveModel();
// ...model: { id: active.id, providerID: active.providerID },
```

and update the `saveSessionMeta(userId, { … model: active.id, provider: active.providerID … })` call and its log line to use `active.id`/`active.source`.

- [ ] **Step 7: Rewrite `callOpencode`'s prompt call**

At the top of `callOpencode()` add `clearLastOpencodeOutcome();` so a stale stash can never leak into a non-opencode answer. Replace the existing `promptOpencodeSession(...)` invocation (around line ~1666) with:

```js
const response = await runAssistantPrompt({
	client,
	sessionID: actualSessionId,
	text: String(prompt || ""),
	timeoutMs: 120_000,
});
if (!response) {
	return null; // outcome stashed by runAssistantPrompt; caller falls back
}
```

and read `const parts = response.parts;` from the new shape (the existing part-processing loop stays unchanged). Also replace the two `model: cfg.modelID`/`provider: cfg.providerID` pairs in the `saveOpencodeConfig`/`saveSessionMeta` calls with the resolved active model — call `getActiveModel()` once near the top of the function and reuse it.

- [ ] **Step 8: Surface the outcome in `assistantReply`**

After `const dynamicAnswer = await generateDynamicAnswer(...)`:

```js
const opencodeMeta = getLastOpencodeOutcome();
clearLastOpencodeOutcome();
```

and pass `opencodeMeta` into the `buildMatchedResponse({ … opencodeMeta })` call in the `if (dynamicAnswer)` branch. In the `forward_to_agent` fallback branch leave metadata unchanged.

- [ ] **Step 9: Streaming path**

In `streamOpencodeReply`: after the session-resolution block, clear the outcome (`clearLastOpencodeOutcome()`), and replace the `promptOpencodeSession` call with:

```js
const response = await runAssistantPrompt({
	client,
	sessionID: sessionId,
	text: prompt,
	timeoutMs: 120_000,
	onText: (delta, total) => {
		fullText = total;
		onChunk(unescapeHtml(delta), unescapeHtml(total));
	},
});
const outcome = getLastOpencodeOutcome();
clearLastOpencodeOutcome();
const meta = outcome ? { model: outcome.model, attempts: outcome.attempts } : null;
```

Guard the existing `const parts = response.parts` / `textPart` block with `response ?` (a null response → `onComplete(null, outcome?.failed === "refused" ? "opencode_refused" : "opencode_unavailable", meta)`). Pass `meta` as the third argument to every `onComplete` call in this function: success → `onComplete(unescapeHtml(fullText) || null, null, meta)`, catch → `onComplete(null, error.message, null)`.

- [ ] **Step 10: Thread `meta` through the WS handler in `server.js`**

At `server/server.js` the `gotComplete` in the `/ws/assistant` handler becomes `const gotComplete = (answer, error, meta) => {` and both `sendReply({ … })` payloads in it gain:

```js
metadata: {
	…existing fields…,
	...(meta?.model ? { model: meta.model, fallback_attempts: meta.attempts || [] } : {}),
},
```

- [ ] **Step 11: Run both test files**

Run: `node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand tests/unit/server-assistant-opencode-metadata.test.js tests/unit/server-assistant-opencode-isolation.test.js`
Expected: PASS (isolation suite must stay green — it asserts the spawn env, unchanged).

- [ ] **Step 12: Commit**

```bash
git add server/services/assistantService.js server/server.js tests/unit/server-assistant-opencode-metadata.test.js
git commit -m "feat(assistant): per-turn model fallback wired into ask + stream paths"
```

---

### Task 3: Admin routes for live model list and switching

**Files:**
- Create: none
- Modify: `server/services/assistantService.js` (export `getRunningOpencodeClient`), `server/controllers/assistantController.js` (two handlers), `server/routes/assistantRoutes.js` (two routes)
- Test: `tests/unit/server-admin-models-route.test.js` (new)

**Interfaces:**
- Consumes: `getModelsSnapshot`, `setActiveModel` (Task 1); `requireAuth`, `allowRoles` (existing).
- Produces: `GET /api/assistant/models` → `{ models, active, source, serverAvailable }`; `PUT /api/assistant/models` `{ modelId }` → same shape on success; `400` on refusal; `500` on write failure. Owner/admin only.

- [ ] **Step 1: Export a client getter from `assistantService.js`**

```js
/**
 * A client for the RUNNING assistant opencode server, or null. Never spawns
 * one — the admin model list must not boot a server as a side effect.
 */
export function getRunningOpencodeClient() {
	if (!(_opencodeServer && opencodePort)) {
		return null;
	}
	return opencodeV2Client(`http://localhost:${opencodePort}`);
}
```

- [ ] **Step 2: Write the failing route test**

Create `tests/unit/server-admin-models-route.test.js`:

```js
import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

jest.unstable_mockModule("../../server/utils/prisma.js", () => ({
	default: {
		user: { findUnique: jest.fn(async () => ({ id: "owner-1", role: "owner" })) },
		appState: { findUnique: jest.fn(async () => null) },
		assistantKnowledge: { findMany: jest.fn(async () => []) },
		adminBranding: {
			findUnique: jest.fn(async () => null),
			upsert: jest.fn(async () => ({})),
		},
		adminConfigHistory: { create: jest.fn(async () => ({})) },
	},
}));

const assistantRoutes = (await import("../../server/routes/assistantRoutes.js")).default;

function buildApp() {
	const app = express();
	app.use(express.json());
	app.use("/api/assistant", assistantRoutes);
	return app;
}

describe("GET /api/assistant/models", () => {
	test("requires authentication", async () => {
		const res = await request(buildApp()).get("/api/assistant/models");
		expect(res.status).toBe(401);
	});
});
```

(Auth’s token-less path must 401 — confirm how existing route tests assert this; `requireAuth` rejects before hitting the DB.)

- [ ] **Step 3: Run it — expect FAIL** (route does not exist → 404, not 401)

Run: `node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand tests/unit/server-admin-models-route.test.js`
Expected: FAIL (`expected 401, received 404`).

- [ ] **Step 4: Add the controller handlers**

In `server/controllers/assistantController.js`, import `getModelsSnapshot, setActiveModel` with the existing assistantService import block, import `getRunningOpencodeClient` there too, and add:

```js
export async function getAssistantModelsHandler(req, res) {
	if (!canManageMembers(req.user)) {
		return deny(res);
	}
	try {
		const client = getRunningOpencodeClient();
		const snapshot = await getModelsSnapshot(client);
		return res.json(snapshot);
	} catch (error) {
		return handleError(res, error);
	}
}

export async function putAssistantModelsHandler(req, res) {
	if (!canManageMembers(req.user)) {
		return deny(res);
	}
	try {
		const client = getRunningOpencodeClient();
		const saved = await setActiveModel(req.body?.modelId, req.user?.id, client);
		const snapshot = await getModelsSnapshot(client);
		return res.json({ ...snapshot, active: saved.id, source: "admin" });
	} catch (error) {
		if (error?.status) {
			return res.status(error.status).json({ error: error.message });
		}
		return handleError(res, error);
	}
}
```

(`canManageMembers`/`deny` are already imported — owner+admin pass, member gets 403 via `deny`.)

- [ ] **Step 5: Register the routes**

In `server/routes/assistantRoutes.js`, add next to the other `/config` routes:

```js
router.get("/models", requireAuth, allowRoles("owner", "admin"), getAssistantModelsHandler);
router.put("/models", requireAuth, allowRoles("owner", "admin"), putAssistantModelsHandler);
```

and add the two handler imports at the top.

- [ ] **Step 6: Run the route test — expect PASS**

Run: `node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand tests/unit/server-admin-models-route.test.js`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add server/services/assistantService.js server/controllers/assistantController.js server/routes/assistantRoutes.js tests/unit/server-admin-models-route.test.js
git commit -m "feat(admin): assistant model list + switch endpoints"
```

---

### Task 4: Admin AI section — "OpenCode Models" tab

**Files:**
- Modify: `src/pages/admin/sections/AdminAISection.jsx`

**Interfaces:**
- Consumes: `GET/PUT /api/assistant/models` (Task 3).
- Produces: a fourth tab in the Admin AI section.

- [ ] **Step 1: Add state + fetch logic**

Add near the existing `useState` declarations:

```jsx
const [modelsInfo, setModelsInfo] = useState({
	models: [],
	active: null,
	source: null,
	serverAvailable: false,
});
const [modelsLoading, setModelsLoading] = useState(false);
const [modelsSaving, setModelsSaving] = useState(false);
const [modelsNotice, setModelsNotice] = useState("");
const [modelsError, setModelsError] = useState("");

async function fetchModels() {
	try {
		setModelsLoading(true);
		setModelsError("");
		const data = await apiRequest("/api/assistant/models", { token: true });
		if (data) {
			setModelsInfo({
				models: data.models || [],
				active: data.active || null,
				source: data.source || null,
				serverAvailable: Boolean(data.serverAvailable),
			});
		}
	} catch (err) {
		setModelsError(err?.message || "Failed to load the model list");
	} finally {
		setModelsLoading(false);
	}
}

async function saveModel(modelId) {
	try {
		setModelsSaving(true);
		setModelsNotice("");
		setModelsError("");
		const data = await apiRequest("/api/assistant/models", {
			method: "PUT",
			token: true,
			body: { modelId },
		});
		if (data) {
			setModelsInfo({
				models: data.models || [],
				active: data.active || null,
				source: data.source || null,
				serverAvailable: Boolean(data.serverAvailable),
			});
		}
		setModelsNotice("Active model saved");
	} catch (err) {
		setModelsError(err?.message || "Failed to switch the model");
	} finally {
		setModelsSaving(false);
	}
}
```

- [ ] **Step 2: Add the tab**

Import `Cpu` and `RefreshCw` from `lucide-react`; extend the `tabs` array:

```jsx
{ id: "models", label: "OpenCode Models", icon: Cpu },
```

and extend the fetch `useEffect` to also call `fetchModels()` on mount (separate `useEffect(() => { fetchModels(); }, [])` is fine — do not change the existing one).

- [ ] **Step 3: Render the tab**

Insert `) : activeTab === "models" ? (` branch before the rules branch. Content (mirrors the existing card styling with `cn(...)` and `adminDark`):

```jsx
<div className="space-y-6">
	<div className={cn("rounded-3xl border p-6", adminDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white")}>
		<div className="mb-4 flex items-center justify-between gap-4">
			<div className="flex items-center gap-2">
				<Cpu className="h-5 w-5 text-indigo-400" />
				<h3 className={cn("font-semibold", adminDark ? "text-white" : "text-slate-900")}>
					OpenCode Models
				</h3>
				{modelsInfo.source && (
					<span className="rounded-full border border-indigo-400/40 bg-indigo-500/10 px-3 py-0.5 text-xs text-indigo-300">
						{modelsInfo.source === "admin" ? "Admin pick" : modelsInfo.source === "env" ? "Env default" : "Default"}
					</span>
				)}
			</div>
			<button
				type="button"
				onClick={fetchModels}
				disabled={modelsLoading}
				className="flex items-center gap-2 rounded-xl border border-slate-600 px-3 py-1.5 text-xs text-slate-300 hover:text-white disabled:opacity-50"
			>
				<RefreshCw className={cn("h-3.5 w-3.5", modelsLoading && "animate-spin")} />
				Refresh
			</button>
		</div>
		<p className={cn("mb-4 text-sm", adminDark ? "text-slate-400" : "text-slate-500")}>
			Free-tier models offered by the embedded opencode server. Switching takes effect for new turns immediately;
			existing sessions are rebound on their next turn. Free models only — paid models are never listed.
		</p>

		{modelsError && (
			<div className="mb-3 flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
				<AlertCircle className="h-4 w-4" />
				{modelsError}
			</div>
		)}
		{modelsNotice && (
			<div className="mb-3 flex items-center gap-2 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-400">
				<CheckCircle className="h-4 w-4" />
				{modelsNotice}
			</div>
		)}
		{!modelsInfo.serverAvailable && (
			<div className="mb-3 flex items-center gap-2 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-300">
				<AlertCircle className="h-4 w-4" />
				The opencode server is not running (or is memory-guarded on this host). The persisted choice
				will apply when it starts.
			</div>
		)}

		<div className="space-y-2">
			{(modelsInfo.models.length ? modelsInfo.models : [{ id: modelsInfo.active || "minimax-m3.1-flash-free", providerID: "opencode" }]).map((model) => (
				<label
					key={model.id}
					className={cn(
						"flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 transition-all",
						modelsInfo.active === model.id
							? "border-indigo-500/60 bg-indigo-500/10"
							: adminDark
								? "border-white/10 hover:border-white/20"
								: "border-slate-200 hover:border-slate-300",
					)}
				>
					<input
						type="radio"
						name="opencode-model"
						className="sr-only"
						checked={modelsInfo.active === model.id}
						disabled={modelsSaving}
						onChange={() => saveModel(model.id)}
					/>
					<span className={cn("font-mono text-sm", adminDark ? "text-slate-100" : "text-slate-800")}>{model.id}</span>
					<span className={cn("text-xs", adminDark ? "text-slate-500" : "text-slate-400")}>{model.providerID}</span>
				</label>
			))}
		</div>
	</div>
</div>
```

(The fallback list entry covers the server-down case: the persisted/env choice is still selectable-looking but disabled via `modelsSaving` only if needed — the radio simply remains checked; keep it simple.)

- [ ] **Step 4: Lint the file**

Run: `npx biome check src/pages/admin/sections/AdminAISection.jsx`
Expected: no errors (warnings about the existing file are acceptable; NEW errors must be fixed).

- [ ] **Step 5: Commit**

```bash
git add src/pages/admin/sections/AdminAISection.jsx
git commit -m "feat(admin): OpenCode Models tab in the AI section"
```

---

### Task 5: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the whole suite**

Run: `npm test` (uses `node --experimental-vm-modules jest --runInBand`)
Expected: the same pass count as `main` before this branch, plus the 10 new tests. Investigation-portal and assistant-isolation suites MUST stay green.

- [ ] **Step 2: Live smoke (best effort)**

Boot the server (`node server/server.js`, ~20–30 s cold start), then as an owner account:

```bash
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/assistant/models | jq
```
Expected: `{ models, active, source, serverAvailable }` with the free list when the opencode server started (it needs ~450 MiB free; on a small host expect `serverAvailable: false` with `active` still resolved). Then `PUT /api/assistant/models` with one of the listed ids and confirm the GET reflects it.

- [ ] **Step 3: Commit any verification notes, or nothing**

If the smoke passes, no files change. If a finding requires a code fix, fix it under the relevant task's file ownership, re-run Step 1, commit as `fix(assistant): …`.
