# Support — Dynamic Model Catalog + Buyer Model Choice — Implementation Plan (Phase 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Owner manages the support investigation/clarification model set from the live OpenCode free catalog; the buyer picks any owner-allowed model per message (per-turn); the choice covers the five investigation agents and — when the assistant's OpenCode runtime is already warm — the clarifying conversation too.

**Architecture:** A pure `modelCatalog.js` fetches `https://opencode.ai/inference/v1/models` (public) with TTL cache + stale fallback. `investigationModelConfigService.js` persists `ai.opencode.investigation_allowed|investigation_default|buyer_model_select` in AdminBranding rows (audit in AdminConfigHistory). A new nullable `SupportCase.model_id` column carries the buyer's pick. The investigation queue filters the runtime's actual offer list against the case pick → allowlist → `DEFAULT_MODEL_CHAIN`. Clarification receives the case pick via a per-call provider injected by the controller (`clarificationOpencodeProvider.js`), served only when the shared assistant runtime is already up; otherwise behavior is exactly today's.

**Tech Stack:** Express 5, Prisma 6 (PostgreSQL), React 19 + Tailwind 4, Jest 29 (`node --experimental-vm-modules … jest --runInBand`).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-11-15-support-model-catalog-design.md` (authority, incl. the 8s clarification timeout ruling).
- iceman-free NEVER appears anywhere: catalog filter, PUT validation, default, case pick, queue, buyer dropdown.
- Paid models impossible everywhere. Only ids ending `-free` or exactly `big-pickle`.
- `DEFAULT_MODEL_CHAIN` (investigation/modelChain.js) stays as the resilience backstop — not deleted, not widened to paid models.
- iceman-free permanently excluded; longcat-2.5-free excluded from the default allowlist only.
- Phase 1 behavior unchanged when `buyer_model_select` is `"0"`: no dropdown, investigations use owner default.
- Migration applied raw to Aiven (no ledger) per Phase 1 procedure; idempotent SQL only; every file must pass `prisma migrate diff` + `db execute` dry-check semantics — `ADD COLUMN IF NOT EXISTS`.

---

### Task 1: `modelCatalog.js` + unit tests

**Files:**
- Create: `server/services/investigation/modelCatalog.js`
- Test: `tests/unit/server-model-catalog.test.js`

**Interfaces:**
- Produces (used by Tasks 2, 5, 6): `getOpenCodeFreeModels(options = {})` where options: `{ forceRefresh?: boolean, fetchImpl?: Function, ttlMs?: number, now?: () => number }` — returns `Promise<{ models: Array<{ id, name, providerID: "opencode", created: number|null, ownedBy: string|null }>, cached: boolean, stale?: boolean, fetchedAt: number }>` — throws `Error` with `.status = 503` when the fetch fails AND no cache exists.

- [ ] **Step 1: Write the failing test**

```js
import { getOpenCodeFreeModels, __resetModelCatalogForTests } from "../../server/services/investigation/modelCatalog.js";

const CATALOG = {
	data: [
		{ id: "minimax-m3.1-flash-free", object: "model", created: 1794754237, owned_by: "opencode", name: "MiniMax M3.1 Flash Free" },
		{ id: "big-pickle", object: "model", created: 1794754238, owned_by: "opencode", name: "Big Pickle" },
		{ id: "iceman-free", object: "model", created: 1794754239, owned_by: "opencode", name: "Iceman Free" },
		{ id: "longcat-2.5-free", object: "model", created: 1794754240, owned_by: "opencode", name: "LongCat 2.5 Free" },
		{ id: "gpt-paid-model", object: "model", created: 1794754241, owned_by: "openai", name: "GPT Paid" },
	],
};
const fetchImpl = async () => ({ ok: true, json: async () => CATALOG });

beforeEach(() => __resetModelCatalogForTests());

test("filters free opencode ids and excludes iceman-free", async () => {
	const result = await getOpenCodeFreeModels({ fetchImpl });
	expect(result.models.map((m) => m.id).sort()).toEqual([
		"big-pickle",
		"longcat-2.5-free",
		"minimax-m3.1-flash-free",
	]);
});

test("serves cache within TTL and stale copy on failure", async () => {
	await getOpenCodeFreeModels({ fetchImpl });
	const cached = await getOpenCodeFreeModels({ fetchImpl: async () => { throw new Error("boom"); } });
	expect(cached.stale).toBe(true);
	expect(cached.models.length).toBeGreaterThan(0);
});

test("throws 503 when catalog unreachable and no cache exists", async () => {
	await expect(getOpenCodeFreeModels({ fetchImpl: async () => { throw new Error("boom"); } }))
		.rejects.toMatchObject({ status: 503 });
});
```

- [ ] **Step 2: Run — expect FAIL** (`Cannot find module …/modelCatalog.js`)

- [ ] **Step 3: Implement modelCatalog.js**

```js
/**
 * Dynamic discovery of FREE OpenCode-tier models for the support portal.
 *
 * Source of truth is the public inference catalog
 * (https://opencode.ai/inference/v1/models). Cached for 5 minutes; a failed
 * refresh serves the last good copy marked `stale`. iceman-free is excluded
 * permanently: it is documented to train on prompts.
 */
const CATALOG_URL = "https://opencode.ai/inference/v1/models";
const TTL_MS = 5 * 60_000;
const TIMEOUT_MS = 10_000;
const PERMANENTLY_EXCLUDED = new Set(["iceman-free"]);

let cache = null; // { models, fetchedAt }

export function __resetModelCatalogForTests() {
	cache = null;
}

function normalizeEntry(model) {
	const id = String(model?.id || "").trim();
	return {
		id,
		name: String(model?.name || model?.id || ""),
		providerID: "opencode",
		created: Number.isFinite(model?.created) ? model.created : null,
		ownedBy: model?.owned_by ?? null,
	};
}

export async function getOpenCodeFreeModels({
	forceRefresh = false,
	fetchImpl = globalThis.fetch,
	ttlMs = TTL_MS,
	now = () => Date.now(),
} = {}) {
	if (!forceRefresh && cache && now() - cache.fetchedAt < ttlMs) {
		return { models: cache.models, cached: true, fetchedAt: cache.fetchedAt };
	}
	try {
		const response = await fetchImpl(CATALOG_URL, {
			signal: AbortSignal.timeout(TIMEOUT_MS),
			headers: { Accept: "application/json" },
		});
		if (!response.ok) throw new Error(`OpenCode catalog HTTP ${response.status}`);
		const payload = await response.json();
		const raw = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : null;
		if (!raw) throw new Error("OpenCode catalog: unexpected response shape");
		const models = raw
			.map(normalizeEntry)
			.filter((m) => m.id.length > 0)
			.filter((m) => m.id.endsWith("-free") || m.id === "big-pickle")
			.filter((m) => !PERMANENTLY_EXCLUDED.has(m.id));
		cache = { models, fetchedAt: now() };
		return { models, cached: false, fetchedAt: cache.fetchedAt };
	} catch (error) {
		if (cache) {
			return { models: cache.models, cached: true, stale: true, fetchedAt: cache.fetchedAt };
		}
		const wrapped = new Error(`OpenCode model catalog unavailable: ${error?.message || "unknown"}`);
		wrapped.status = 503;
		throw wrapped;
	}
}
```

- [ ] **Step 4: Run tests — expect PASS** (3 tests)

- [ ] **Step 5: Commit** — `feat(support): dynamic free-model catalog for the support portal`

---

### Task 2: `investigationModelConfigService.js` — settings persistence + audit

**Files:**
- Create: `server/services/investigation/investigationModelConfigService.js`
- Test: `tests/unit/server-investigation-model-config.test.js`

**Interfaces:**
- Consumes: `getOpenCodeFreeModels` (Task 1); `prisma.adminBranding`, `prisma.adminConfigHistory`; `parseModelChain` not needed here.
- Produces (Tasks 3, 5, 6):
  - `getInvestigationModelConfig()` → `{ allowed: string[], default: string, buyerSelectEnabled: boolean, catalog: Array, catalogStale: boolean, catalogFetchedAt: number|null }`. Default `allowed` = live catalog ids minus `longcat-2.5-free` (iceman already excluded by catalog filter). Default `default` = `"minimax-m3.1-flash-free"` (or first allowed if that id vanished from catalog). `buyerSelectEnabled` defaults true.
  - `setInvestigationModelConfig({ allowed, default, buyerSelectEnabled }, actorId)` — validates: `allowed` ⊆ free-tier ids of live catalog (or, if catalog down, ⊆ `DEFAULT_MODEL_CHAIN` ids ∪ prior persisted value); `default` ∈ `allowed`; `buyerSelectEnabled` boolean; `allowed.length >= 1`. Throws `Error` with `.status` 400/503. Writes AdminConfigHistory `{ config_type: "investigation_model_config", changed_by: actorId, new_value: JSON.stringify({ allowed, default, buyerSelectEnabled }), previous_value: JSON.stringify(previous) }`.
  - `getBuyerSelectableConfig()` → same as get but without mutability checks (for frontend/badge).

- [ ] **Step 1: Write the failing test** (mock prisma + mock the catalog module via `jest.unstable_mockModule`):

```js
const brandingStore = new Map();
const historyCalls = [];

jest.unstable_mockModule("../../server/utils/prisma.js", () => ({
	default: {
		adminBranding: {
			findUnique: jest.fn(async ({ where }) => brandingStore.get(where.brand_key) ?? null),
			findMany: jest.fn(async ({ where }) => [...brandingStore.values()]),
			upsert: jest.fn(async ({ where, create, update }) => {
				const row = { ...(brandingStore.get(where.brand_key) || {}), ...(update || create), brand_key: where.brand_key };
				brandingStore.set(where.brand_key, row);
				return row;
			}),
		},
		adminConfigHistory: { create: jest.fn(async ({ data }) => { historyCalls.push(data); return data; }) },
	},
}));
jest.unstable_mockModule("../../server/services/investigation/modelCatalog.js", () => ({
	getOpenCodeFreeModels: jest.fn(async () => ({
		models: [
			{ id: "minimax-m3.1-flash-free", name: "MiniMax", providerID: "opencode", created: 1, ownedBy: "opencode" },
			{ id: "deepseek-v4.1-flash-free", name: "DeepSeek", providerID: "opencode", created: 1, ownedBy: "opencode" },
			{ id: "big-pickle", name: "Big Pickle", providerID: "opencode", created: 1, ownedBy: "opencode" },
			{ id: "longcat-2.5-free", name: "LongCat", providerID: "opencode", created: 1, ownedBy: "opencode" },
		],
		cached: false,
		fetchedAt: 1000,
	})),
}));
const svc = await import("../../server/services/investigation/investigationModelConfigService.js");
beforeEach(() => { brandingStore.clear(); historyCalls.length = 0; });

test("default allowed excludes longcat; iceman never appears", async () => {
	const cfg = await svc.getInvestigationModelConfig();
	expect(cfg.allowed).not.toContain("longcat-2.5-free");
	expect(cfg.allowed).not.toContain("iceman-free");
});
test("setInvestigationModelConfig persists and audits; default must be in allowed", async () => {
	await svc.setInvestigationModelConfig({ allowed: ["minimax-m3.1-flash-free"], default: "deepseek-v4.1-flash-free" }, "owner-1")
		.then(() => { throw new Error("should have thrown"); }, (e) => expect(e.status).toBe(400));
	const next = await svc.setInvestigationModelConfig({ allowed: ["deepseek-v4.1-flash-free"], default: "deepseek-v4.1-flash-free", buyerSelectEnabled: true }, "owner-1");
	expect(historyCalls).toHaveLength(1);
	expect(next.default).toBe("deepseek-v4.1-flash-free");
});
```

- [ ] **Step 2: Run — expect FAIL** (`Cannot find module …/investigationModelConfigService.js`)

- [ ] **Step 3: Implement the service**

```js
import prisma from "../../utils/prisma.js";
import { logWarn } from "../../utils/logger.js";
import { getOpenCodeFreeModels } from "./modelCatalog.js";
import { parseModelChain } from "./modelChain.js";

const KEY_ALLOWED = "ai.opencode.investigation_allowed";
const KEY_DEFAULT = "ai.opencode.investigation_default";
const KEY_BUYER_TOGGLE = "ai.opencode.buyer_model_select";

async function readRows() {
	try {
		const rows = await prisma.adminBranding.findMany({ where: { brand_key: { in: [KEY_ALLOWED, KEY_DEFAULT, KEY_BUYER_TOGGLE] } } });
		const map = {};
		for (const row of rows) map[row.brand_key] = row;
		return map;
	} catch {
		return {};
	}
}
const FREE_ID = (id) => typeof id === "string" && (id.endsWith("-free") || id === "big-pickle") && id !== "iceman-free";

export async function getInvestigationModelConfig() {
	const catalogResult = await getOpenCodeFreeModels().catch(async () => ({ models: [], stale: true, fetchedAt: null }));
	const catalog = catalogResult.models;
	const catalogIds = new Set(catalog.map((m) => m.id));
	const persisted = await readRows();
	let allowed = null;
	try {
		if (persisted[KEY_ALLOWED]?.value) allowed = JSON.parse(persisted[KEY_ALLOWED].value);
		if (!Array.isArray(allowed)) allowed = null;
	} catch { allowed = null; }
	if (!allowed) {
		allowed = catalog.filter((m) => m.id !== "longcat-2.5-free").map((m) => m.id);
	}
	allowed = allowed.filter(FREE_ID).filter((id) => catalogIds.size === 0 || catalogIds.has(id));
	let def = persisted[KEY_DEFAULT]?.value;
	if (!def || !allowed.includes(def)) def = allowed.includes("minimax-m3.1-flash-free") ? "minimax-m3.1-flash-free" : allowed[0] ?? "minimax-m3.1-flash-free";
	const buyerSelectEnabled = persisted[KEY_BUYER_TOGGLE]?.value !== "0";
	return {
		allowed,
		default: def,
		buyerSelectEnabled,
		catalog,
		catalogStale: Boolean(catalogResult.stale),
		catalogFetchedAt: catalogResult.fetchedAt ?? null,
	};
}

export async function setInvestigationModelConfig({ allowed, default: def, buyerSelectEnabled }, actorId) {
	const catalogResult = await getOpenCodeFreeModels({ forceRefresh: true }).catch(() => ({ models: [] }));
	const catalogIds = new Set(catalogResult.models.map((m) => m.id));
	const previous = await getInvestigationModelConfig();
	const nextAllowed = Array.isArray(allowed) ? allowed.filter(FREE_ID) : previous.allowed;
	if (nextAllowed.length < 1) {
		const error = new Error("At least one allowed model is required");
		error.status = 400;
		throw error;
	}
	for (const id of nextAllowed) {
		if (catalogIds.size > 0 && !catalogIds.has(id)) {
			const error = new Error(`"${id}" is not in the live free catalog`);
			error.status = 400;
			throw error;
		}
	}
	const nextDefault = def ?? previous.default;
	if (!nextAllowed.includes(nextDefault)) {
		const error = new Error("The default model must be in the allowed set");
		error.status = 400;
		throw error;
	}
	const nextToggle = typeof buyerSelectEnabled === "boolean" ? buyerSelectEnabled : previous.buyerSelectEnabled;
	const write = async (key, value) => prisma.adminBranding.upsert({
		where: { brand_key: key },
		update: { value, active: true },
		create: { brand_key: key, value, active: true },
	});
	try {
		await write(KEY_ALLOWED, JSON.stringify(nextAllowed));
		await write(KEY_DEFAULT, nextDefault);
		await write(KEY_BUYER_TOGGLE, nextToggle ? "1" : "0");
		await prisma.adminConfigHistory.create({
			data: {
				config_type: "investigation_model_config",
				changed_by: String(actorId || "unknown"),
				previous_value: JSON.stringify({ allowed: previous.allowed, default: previous.default, buyerSelectEnabled: previous.buyerSelectEnabled }),
				new_value: JSON.stringify({ allowed: nextAllowed, default: nextDefault, buyerSelectEnabled: nextToggle }),
			},
		});
	} catch (error) {
		const wrapped = new Error(`Could not persist the investigation model config: ${error?.message}`);
		wrapped.status = 500;
		throw wrapped;
	}
	return getInvestigationModelConfig();
}
```
(Note: `parseModelChain` import only used if needed for the catalog-down fallback — either drop the import, or use it in the catch path: `DEFAULT_MODEL_CHAIN.map(m => m.id)`. Use it: when catalog is unreachable at PUT time, allow validation against `parseModelChain()` free ids ∪ previous allowed. One line — keep the import.)

- [ ] **Step 4: Run tests — expect PASS**

- [ ] **Step 5: Commit** — `feat(support): persist investigation model config with audit (AdminBranding + history)`

---

### Task 3: Clarification on the warm OpenCode runtime

**Files:**
- Create: `server/services/clarificationOpencodeProvider.js`
- Modify: `server/controllers/caseController.js` (build provider, pass into the conversation entry)
- Test: `tests/unit/server-clarification-opencode.test.js`

**Interfaces:**
- Consumes: `getRunningOpencodeClient` from `assistantService.js` (exists; returns null when the shared runtime is down — never spawns); `waitForAssistantTurn` from `opencodeTurns.js`; `sanitizeString` (validators).
- Produces: `makeClarificationProvider({ modelId, caseId, timeoutMs = 8000 }) → (prompt, systemPrompt) => Promise<string|null>`.

- [ ] **Step 1: Write the failing test**

```js
import { jest } from "@jest/globals";

const sessionCreate = jest.fn(async () => ({ id: "ses-1" }));
const sessionRemove = jest.fn(async () => ({}));
const turnText = "What page were you on?";

jest.unstable_mockModule("../../server/services/assistantService.js", () => ({
	getRunningOpencodeClient: () => ({
		session: { create: sessionCreate, remove: sessionRemove },
		message: { list: async () => ({ data: [
			{ id: "a1", type: "assistant", time: { created: 1 }, finish: "stop", content: [{ type: "text", text: turnText }] },
		] }) },

	}),
}));
jest.unstable_mockModule("../../server/services/opencodeTurns.js", () => ({
	waitForAssistantTurn: jest.fn(async () => ({
		text: turnText,
		parts: [{ type: "text", text: turnText }],
	})),
	formatToolError: (e) => String(e),
}));

const { makeClarificationProvider } = await import("../../server/services/clarificationOpencodeProvider.js");

test("answers through the warm runtime and deletes the ephemeral session", async () => {
	const provider = makeClarificationProvider({ modelId: "minimax-m3.1-flash-free", caseId: "case-1" });
	const reply = await provider("The page is blank after login", "system prompt");
	expect(reply).toBe(turnText);
	expect(sessionCreate).toHaveBeenCalledTimes(1);
	expect(sessionCreate.mock.calls[0][0].model.id).toBe("minimax-m3.1-flash-free");
	expect(sessionRemove).toHaveBeenCalledTimes(1);
});
```

- [ ] **Step 2: Run — expect FAIL** (`Cannot find module …/clarificationOpencodeProvider.js`)

- [ ] **Step 3: Implement `clarificationOpencodeProvider.js`**

```js
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
```

- [ ] **Step 4: Wire the provider into `askClarifyingQuestion`** (`caseController.js`)

The controller already builds `answer` via the conversation service entry; add, right before the `await entry({ … })` call:

```js
let provider = null;
const caseModelId = found?.model_id || found?.modelId || null; // `found` is the case row already loaded for history/ownership
if (caseModelId) {
	try {
		const { makeClarificationProvider } = await import("../services/clarificationOpencodeProvider.js");
		provider = makeClarificationProvider({ modelId: caseModelId, caseId: found?.id });
	} catch {
		provider = null; // fall back to env providers exactly as before
	}
}
const answer = await entry({
	subject,
	history,
	messages: history,
	clientMessage,
	ready,
	maxRounds: MAX_CLARIFICATION_ROUNDS,
	...(provider ? { provider } : {}),
});
```
(Confirm at the call site which variable holds the case row in this function; if it isn't loaded there, load it — it is needed for the model anyway — but do NOT add a new DB round trip if it is already available.)

- [ ] **Step 5: Run the new test — expect PASS; existing case tests still green**

Run: `node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand tests/unit/server-clarification-opencode.test.js tests/unit/server-case-ownership.test.js`
Expected: PASS.

- [ ] **Step 6: Commit** — `feat(support): buyer model choice drives clarification via warm opencode runtime (8s hard timeout, env-chain fallback)`

---

### Task 4: Case model order — pure chain builder + investigation queue wiring

**Files:**
- Create: `server/services/investigation/caseModelChain.js`
- Modify: `server/services/investigationQueue.js` (`pickModels` → `pickCaseModels(client, caseRow)`)
- Test: `tests/unit/server-investigation-case-chain.test.js`

**Interfaces:**
- Produces: `computeCaseModelOrder({ caseModelId, allowed, available }) → Array<{ id, providerID: "opencode" }>` — (1) case pick if allowed AND offered; (2) the rest of allowed in allowlist order, offered-filtered; (3) `DEFAULT_MODEL_CHAIN` entries not already included; (4) iceman never.
- `investigationQueue.js`: `pickCaseModels(client, caseRow)` uses `getInvestigationModelConfig().allowed` + the runtime's `listAvailableModels(client)` + `caseRow?.model_id`; persists the EFFECTIVE first model into each SupportInvestigation row (existing `model_id` column, unchanged).

- [ ] **Step 1: Write the failing test**

```js
import { computeCaseModelOrder } from "../../server/services/investigation/caseModelChain.js";

test("case pick leads when allowed and offered", () => {
	const order = computeCaseModelOrder({
		caseModelId: "deepseek-v4.1-flash-free",
		allowed: ["minimax-m3.1-flash-free", "deepseek-v4.1-flash-free"],
		available: ["minimax-m3.1-flash-free", "deepseek-v4.1-flash-free"],
	});
	expect(order[0].id).toBe("deepseek-v4.1-flash-free");
});
test("withdrawn case pick falls back to allowlist order", () => {
	const order = computeCaseModelOrder({
		caseModelId: "gone-model-free",
		allowed: ["minimax-m3.1-flash-free"],
		available: ["minimax-m3.1-flash-free", "gone-model-free"],
	});
	expect(order[0].id).toBe("minimax-m3.1-flash-free");
});
test("iceman never appears even if allowed list contains it", () => {
	const order = computeCaseModelOrder({ caseModelId: null, allowed: ["iceman-free", "minimax-m3.1-flash-free"], available: ["iceman-free", "minimax-m3.1-flash-free"] });
	expect(order.map((m) => m.id)).not.toContain("iceman-free");
});
test("DEFAULT_MODEL_CHAIN backstops when allowlist is exhausted by the runtime", () => {
	const order = computeCaseModelOrder({ caseModelId: null, allowed: [], available: ["deepseek-v4.1-flash-free"] });
	expect(order.map((m) => m.id)).toContain("deepseek-v4.1-flash-free");
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement `caseModelChain.js`**

```js
import { DEFAULT_MODEL_CHAIN } from "./modelChain.js";

const FORBIDDEN = new Set(["iceman-free"]);
const okId = (id) => typeof id === "string" && (id.endsWith("-free") || id === "big-pickle") && !FORBIDDEN.has(id);
const offerSet = (available) => new Set((available || []).map((m) => m?.id));

export function computeCaseModelOrder({ caseModelId = null, allowed = [], available = [] } = {}) {
	const offered = offerSet(available);
	const allowedClean = (Array.isArray(allowed) ? allowed : []).filter(okId);
	const offeredAllowed = allowedClean.filter((id) => offered.has(id));
	const order = [];
	const push = (id) => {
		if (!order.some((m) => m.id === id) && !FORBIDDEN.has(id)) {
			order.push({ id, providerID: "opencode" });
		}
	};
	if (caseModelId && okId(caseModelId) && allowedClean.includes(caseModelId) && offered.has(caseModelId)) {
		push(caseModelId);
	}
	for (const id of offeredAllowed) push(id);
	for (const entry of DEFAULT_MODEL_CHAIN) {
		if (offered.has(entry.id)) push(entry.id);
	}
	return order;
}
```

- [ ] **Step 4: Wire into investigationQueue.js**

Replace `pickModels(client)`:

```js
async function pickCaseModels(client, caseRow) {
	const available = await listAvailableModels(client);
	const { allowed } = await getInvestigationModelConfig();
	return computeCaseModelOrder({ caseModelId: caseRow?.model_id || null, allowed, available });
}
```

Call site: `const models = await pickCaseModels(runtime.client, caseRow);` — ensure `caseRow` carries `model_id` (the full row, `prisma.supportCase.findUnique` includes all columns by default). Keep the retry/refusal logic unchanged (it already iterates `models` in order). Record the effective model on the investigation rows as today (check the existing row creation code and pass `order[0]?.id` — it already stores the picked model per attempt — verify and report).

Import `getInvestigationModelConfig` from `./investigation/investigationModelConfigService.js` and `computeCaseModelOrder` from `./investigation/caseModelChain.js`.

- [ ] **Step 5: Run tests — expect PASS**; also `tests/unit/server-investigation-*.test.js` remain green.

- [ ] **Step 6: Commit** — `feat(support): investigation queue honors case model pick with allowlist + backstop order`

---

### Task 5: `SupportCase.model_id` column + routes (buyer + admin)

**Files:**
- Modify: `prisma/schema.prisma` (one column on SupportCase)
- Create: `prisma/migrations/20261116000000_add_case_model_id/migration.sql` (idempotent)
- Modify: `server/services/caseService.js` (`setCaseModel(caseId, modelId)` with ownership-free caller checks left to controller)
- Modify: `server/routes/caseRoutes.js` (`PUT /:caseId/model`, `GET /:caseId/model`)
- Create: `server/controllers/caseModelController.js`
- Create: `server/routes/adminSupportModelRoutes.js` (`GET|PUT /api/admin/support-models`)
- Create: `server/controllers/adminSupportModelController.js`
- Modify: `server/routes/supportTokenRoutes.js` — no; mount admin routes in `server/server.js` next to `/api/admin/support-tokens`
- Test: `tests/unit/server-case-model-route.test.js`

**Interfaces:**
- `PUT /api/support/cases/:caseId/model` body `{ modelId: string|null }` → auth: `requireAuthOrSupportToken` + `canReadCase` (buyer's own case, or owner/admin) + `getBuyerSelectableConfig` gate (buyer toggle off → 403) → body modelId ∈ allowed (or `null`) → stores on the case → `200 { modelId }`. 400 on bad id; 403 when buyer select disabled; 404 unknown case (or 403 for strangers, per the existing rule — keep the case ownership rule: owner/admin or case owner).
- `GET /api/support/cases/:caseId/model` → `{ modelId, effectiveModelId, default, buyerSelectEnabled, allowed }` (effectiveModelId = model_id if allowed/offered else default).
- Admin: `GET /api/admin/support-models` → same + `catalogStale`, `catalogFetchedAt`; `PUT` → validated persist (Task 2 service), audit, same shape. Both `requireAuth + allowRoles("owner","admin")`.

- [ ] **Step 1: Write the migration** — `ALTER TABLE "support_cases" ADD COLUMN IF NOT EXISTS "model_id" TEXT;`

Append to schema.prisma SupportCase model (verify exact current block first): `model_id String?`.

- [ ] **Step 2: Write the failing route test** (mock prisma + mock config service + mock caseService) — assert: stranger 403; buyer sets own case 200; invalid model 400; toggle off 403; admin GET 200.

- [ ] **Step 3: Implement controller + routes + mounts** (follow existing caseRoute mounting pattern).

- [ ] **Step 4: Run the suite + focused tests.** `npm test` — no new failures; report totals.

- [ ] **Step 5: Commit** — `feat(support): case model_id column + buyer/admin model routes`

---

### Task 6: Frontend — buyer composer dropdown + admin "Investigation Models" tab

**Files:**
- Modify: `src/pages/SupportReports.jsx` (buyer composer dropdown in the case panel subtree — fetch effective config from `GET /api/support/cases/:caseId/model`, render a native `<select>` styled to match; onChange → `PUT …/model`; disabled + read-only when `buyerSelectEnabled === false`; label: "Investigation model — applies to the clarifying chat and the investigation").
- Modify: `src/pages/admin/sections/AdminAISection.jsx` (new tab `{ id: "models-admin", label: "Investigation Models", icon: Cpu? or ListChecks — pick one consistent with the file's imports }`, renders: catalog list with enable/disable toggles (checkbox per row bound to `allowed`), default dropdown (allowed only), buyer-toggle switch, "Refresh catalog" button (forceRefresh via GET with `?refresh=1` — implement in admin GET handler: `?refresh=1` → forceRefresh), Save button → PUT with optimistic error handling, audit note).
- Test: `tests/unit/frontend-support-model-picker.test.js` (jsdom; mock apiRequest; renders select with options; onChange persists).

- [ ] **Step 1: Write the failing frontend test** (mock `apiRequest`; assert the dropdown lists exactly the allowed models; selecting calls PUT; toggle-off renders a read-only badge).

- [ ] **Step 2: Implement the dropdown** in the case composer (mode `"ai"` subtree only). Minimal: `<select>` + `aria-label="Investigation model"` + tiny copy line. No new state beyond `effectiveConfig` + `saving`.

- [ ] **Step 3: Implement the admin tab** (mirror the Buyer Tokens tab pattern).

- [ ] **Step 4: `npx biome check` changed files (no NEW errors) + `npm test` green.**

- [ ] **Step 5: Commit** — `feat(support): buyer investigation-model dropdown + admin Investigation Models tab`

---

### Task 7: Verification + migration apply (owner-present)

- [ ] **Step 1: `npm test`** — record totals (expect ≥ 1020).
- [ ] **Step 2: Apply migration raw** — confirm `migrate diff` shows ONLY the one column; apply via `prisma db execute`; verify column exists (`information_schema.columns`); boot smoke (`PORT=4579`): `GET /health` 200, `PUT /api/support/cases/nonexistent/model` → 401 without auth, `GET /api/admin/support-models` → 401 without token.
- [ ] **Step 3: Rollout note** — append Phase 2 section to `docs/rollout/2026-11-15-support-two-mode-migration.md` (new column applied raw; catalog endpoint is public; iceman excluded at three layers).
- [ ] **Step 4: Spec/plan bookkeeping** — check spec compliance note in plan file done.
