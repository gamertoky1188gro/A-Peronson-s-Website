# Support Two Modes — Implementation Plan (Phase 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split `/support` into a token-gated buyer AI investigation chat (Mode 01, bearer token bound to the issuing buyer) and a signed-in-only generic support form (Mode 02), on top of the existing support-case/ticket infrastructure.

**Architecture:** A new `SupportAccessToken` table validates buyer tokens by sha256 hash (bearer, revocable, auditable). The case router accepts either the existing JWT (`requireAuth`) or a support token (`requireSupportToken` via a `requireAuthOrSupportToken` wrapper) — the token caller gets `req.user` = the token's buyer, so **case controllers and services change zero lines**. A public `/support` chooser replaces the login-gated page; the admin AI section gains a "Buyer Tokens" tab backed by owner/admin-only routes.

**Tech Stack:** Express 5, Prisma 6 (PostgreSQL), React 19 + Tailwind 4, Jest 29 (`node --experimental-vm-modules … jest --runInBand`).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-11-15-support-two-mode-design.md` (authority).
- Token plaintext is never stored or logged; sha256 at rest; shown exactly once (the issue response).
- The support-investigation portal, its runtime, and its read-only permission config are UNTOUCHED in this phase.
- No public (signed-out) ticket submission; Mode 02 stays signed-in only.
- The token grants support-scope buyer identity only — it never unlocks admin, other buyers' cases, or any non-support route.
- New table ONLY; no existing model/column is altered in the migration.
- `/support` becomes a public route; authorization is enforced by the page AND the API, not the route guard.
- iceman-free stays excluded from investigations (existing behavior; Phase 2 formalizes it).

---

### Task 1: `SupportAccessToken` Prisma model + offline migration SQL

**Files:**
- Modify: `prisma/schema.prisma` (append model)
- Create: `prisma/migrations/20261115170000_add_support_access_tokens/migration.sql` (generated offline)
- Test: `tests/unit/server-support-token-schema.test.js` (new, fails-then-passes approach: schema contains the model and a table-map test is not possible without a DB — keep this task's test to the service in Task 2; this task verifies via `prisma generate` + `migrate diff` idempotence instead)

**Interfaces:**
- Consumes: nothing (groundwork).
- Produces: generated `@prisma/client` with `prisma.supportAccessToken` — Tasks 2–3 consume this delegate.

- [ ] **Step 1: Append the model to `prisma/schema.prisma`**

```prisma
model SupportAccessToken {
  id           String    @id @default(cuid())
  buyer_id     String
  token_hash   String    @unique
  label        String
  expires_at   DateTime?
  revoked_at   DateTime?
  created_by   String
  last_used_at DateTime?
  created_at   DateTime  @default(now())

  buyer        User      @relation("buyerSupportTokens", fields: [buyer_id], references: [id])

  @@index([buyer_id])
  @@index([revoked_at, expires_at])
  @@map("support_access_tokens")
}
```

Add the back-relation to the User model:
```prisma
  support_access_tokens SupportAccessToken[] @relation("buyerSupportTokens")
```

- [ ] **Step 2: Regenerate the client**

Run: `npx prisma generate`
Expected: "✔ Generated Prisma Client" with no errors. The delegate `prisma.supportAccessToken` now exists.

- [ ] **Step 3: Generate the migration SQL offline**

Run: `npx prisma migrate diff --from-migrations prisma/migrations --to-schema-datamodel prisma/schema.prisma --script > /tmp/two-mode.sql && cat /tmp/two-mode.sql`
Expected: ONLY a `CREATE TABLE "support_access_tokens" …` and its indexes/FK. If the diff contains ANY `ALTER TABLE`, `DROP`, or touches another table, STOP and report — do not proceed.

Note: the migrations folder's existing history is the same shared history Aiven uses, so the new SQL must create only the new table. If the diff also wants to apply the pending support-investigation migration (it was generated, may or may not have been applied), do NOT include it in this migration file; the pending one already lives in `prisma/migrations/` if it was created as a folder there — check `ls prisma/migrations/ | tail -5` and report what you see.

- [ ] **Step 4: Write the migration folder**

```bash
mkdir -p prisma/migrations/20261115170000_add_support_access_tokens
cp /tmp/two-mode.sql prisma/migrations/20261115170000_add_support_access_tokens/migration.sql
```

Then verify the folder's SQL is byte-identical to /tmp/two-mode.sql and create the `migration_lock.toml` check: `cat prisma/migrations/migration_lock.toml` should contain `provider = "postgresql"`.

- [ ] **Step 5: Validate and commit**

Run: `npx prisma validate`
Expected: "The schema is valid 🚀".

```bash
git add prisma/schema.prisma prisma/migrations/20261115170000_add_support_access_tokens/migration.sql
git commit -m "feat(support): SupportAccessToken model + migration SQL"
```

DO NOT run `prisma migrate dev` or `migrate deploy` here — applying to the shared DB is Task 5, after the owner approves.

---

### Task 2: `supportTokenService.js` + `requireSupportToken` middleware

**Files:**
- Create: `server/services/supportTokenService.js`
- Create: `server/middleware/supportToken.js`
- Test: `tests/unit/server-support-token.test.js`

**Interfaces:**
- Consumes: `prisma.supportAccessToken` + `prisma.user` (Task 1); `findUserById` shape from `services/userService.js`.
- Produces (used by Tasks 3–4):
  - `generateToken(): { token: string, hash: string }` — `gtk_sup_` + 32 random bytes base64url.
  - `hashToken(token): string` — sha256 hex.
  - `issueToken({ buyerId, label, expiresAt, createdBy })` → `{ token, id, buyer_id, label, expires_at, created_at }` (plain token returned exactly once). Throws `Error` with `.status`: 400 on bad buyer, 404 on missing buyer.
  - `validateToken(token)` → `{ ok: true, buyer, tokenId, label } | { ok: false, reason: "invalid"|"expired"|"revoked" }`. Updates `last_used_at` fire-and-forget (no await).
  - `listTokens()` → rows joined for admin (id, label, buyer {id, name, email}, created_at, expires_at, revoked_at, last_used_at), newest first, NEVER hashes.
  - `revokeToken(id)` → boolean.
  - Middleware `requireSupportToken(req, res, next)`: reads token from `Authorization: Bearer gtk_sup_…` or `x-support-token` header; valid → sets `req.user` (same fields `requireAuth` uses: id, role, email — from `findUserById` row), `req.authUser` (the row), `req.viaSupportToken = true`, `req.tokenId`; invalid → 401 `{ error }` with reason in `code: "SUPPORT_TOKEN_INVALID|SUPPORT_TOKEN_EXPIRED|SUPPORT_TOKEN_REVOKED"`.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/server-support-token.test.js` (match the repo's `jest.unstable_mockModule` + dynamic import pattern from `tests/unit/server-assistant-opencode-isolation.test.js`):

```js
import { jest } from "@jest/globals";
import crypto from "node:crypto";

const sha256 = (s) => crypto.createHash("sha256").update(String(s)).digest("hex");
const stores = { tokens: new Map(), users: new Map() };
let tokenSeq = 0;

jest.unstable_mockModule("../../server/utils/prisma.js", () => ({
	default: {
		supportAccessToken: {
			create: jest.fn(async ({ data }) => {
				const row = { id: `tok_${++tokenSeq}`, created_at: new Date(), revoked_at: null, last_used_at: null, ...data };
				stores.tokens.set(row.token_hash, row);
				return row;
			}),
			findUnique: jest.fn(async ({ where }) =>
				where.token_hash
					? stores.tokens.get(where.token_hash) ?? null
					: [...stores.tokens.values()].find((row) => row.id === where.id) ?? null,
			),
			findMany: jest.fn(async () => [...stores.tokens.values()].sort((a, b) => b.created_at - a.created_at)),
			update: jest.fn(async ({ where, data }) => {
				if (where.token_hash) return Object.assign(stores.tokens.get(where.token_hash), data);
				const row = [...stores.tokens.values()].find((r) => r.id === where.id);
				return Object.assign(row, data);
			}),
		},
		user: {
			findUnique: jest.fn(async ({ where, select }) => {
				const u = stores.users.get(where.id);
				if (!u) return null;
				if (!select) return u;
				const out = {};
				for (const key of Object.keys(select)) if (select[key]) out[key] = u[key];
				return out;
			}),
		},
	},
}));

const svc = await import("../../server/services/supportTokenService.js");

beforeEach(() => {
	stores.tokens.clear();
	stores.users.clear();
	tokenSeq = 0;
	stores.users.set("buyer-1", { id: "buyer-1", role: "buyer", email: "b@example.com", name: "Buyer One" });
});

describe("supportTokenService", () => {
	test("issue → validate round-trip returns the buyer", async () => {
		const { token } = await svc.issueToken({ buyerId: "buyer-1", label: "onboarding", expiresAt: null, createdBy: "owner-1" });
		expect(token.startsWith("gtk_sup_")).toBe(true);
		const result = await svc.validateToken(token);
		expect(result.ok).toBe(true);
		expect(result.buyer.id).toBe("buyer-1");
		expect(result.label).toBe("onboarding");
	});

	test("unknown token is rejected", async () => {
		expect((await svc.validateToken("gtk_sup_nope")).reason).toBe("invalid");
	});

	test("expired token is rejected with the expired reason", async () => {
		const { token } = await svc.issueToken({ buyerId: "buyer-1", label: "e", expiresAt: new Date(Date.now() - 1000), createdBy: "owner-1" });
		expect((await svc.validateToken(token)).reason).toBe("expired");
	});

	test("revoked token is rejected with the revoked reason", async () => {
		const { token, id } = await svc.issueToken({ buyerId: "buyer-1", label: "e", expiresAt: null, createdBy: "owner-1" });
		await svc.revokeToken(id);
		expect((await svc.validateToken(token)).reason).toBe("revoked");
	});

	test("creating a token for a missing buyer fails", async () => {
		await expect(svc.issueToken({ buyerId: "ghost", label: "e", expiresAt: null, createdBy: "owner-1" })).rejects.toMatchObject({ status: 404 });
	});
});
```

- [ ] **Step 2: Run it — expect FAIL** (`Cannot find module …/supportTokenService.js`)

Run: `node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand tests/unit/server-support-token.test.js`

- [ ] **Step 3: Implement `server/services/supportTokenService.js`**

```js
import crypto from "node:crypto";
import prisma from "../utils/prisma.js";
import { findUserById } from "./userService.js";
import { logWarn } from "../utils/logger.js";

const TOKEN_PREFIX = "gtk_sup_";
const TOKEN_BYTES = 32;

export function hashToken(token) {
	return crypto.createHash("sha256").update(String(token)).digest("hex");
}

export function generateToken() {
	const raw = crypto.randomBytes(TOKEN_BYTES).toString("base64url");
	const token = `${TOKEN_PREFIX}${raw}`;
	return { token, hash: hashToken(token) };
}

export async function issueToken({ buyerId, label, expiresAt = null, createdBy }) {
	const buyer = await prisma.user.findUnique({
		where: { id: String(buyerId) },
		select: { id: true, role: true, email: true, name: true },
	});
	if (!buyer) {
		const error = new Error("Buyer not found");
		error.status = 404;
		throw error;
	}
	const safeLabel = String(label || "").trim().slice(0, 120);
	if (!safeLabel) {
		const error = new Error("A label is required");
		error.status = 400;
		throw error;
	}
	const { token, hash } = generateToken();
	const row = await prisma.supportAccessToken.create({
		data: {
			buyer_id: buyer.id,
			token_hash: hash,
			label: safeLabel,
			expires_at: expiresAt ? new Date(expiresAt) : null,
			created_by: String(createdBy || "unknown"),
		},
	});
	return {
		token,
		id: row.id,
		buyer_id: row.buyer_id,
		label: row.label,
		expires_at: row.expires_at,
		created_at: row.created_at,
	};
}

export async function validateToken(token) {
	const normalized = String(token || "").trim();
	if (!normalized.startsWith(TOKEN_PREFIX)) {
		return { ok: false, reason: "invalid" };
	}
	const row = await prisma.supportAccessToken.findUnique({ where: { token_hash: hashToken(normalized) } });
	if (!row) return { ok: false, reason: "invalid" };
	if (row.revoked_at) return { ok: false, reason: "revoked" };
	if (row.expires_at && new Date(row.expires_at).getTime() <= Date.now()) {
		return { ok: false, reason: "expired" };
	}
	const buyer = await findUserById(row.buyer_id);
	if (!buyer) return { ok: false, reason: "invalid" };
	// fire-and-forget; never block the request on the audit write
	prisma.supportAccessToken
		.update({ where: { id: row.id }, data: { last_used_at: new Date() } })
		.catch(() => {});
	return { ok: true, buyer, tokenId: row.id, label: row.label };
}

export async function listTokens() {
	const rows = await prisma.supportAccessToken.findMany({
		orderBy: { created_at: "desc" },
		take: 200,
		include: { buyer: { select: { id: true, name: true, email: true } } },
	});
	return rows.map(({ token_hash, ...row }) => row);
}

export async function revokeToken(id) {
	const row = await prisma.supportAccessToken.findUnique({ where: { id: String(id) } });
	if (!row || row.revoked_at) return false;
	await prisma.supportAccessToken.update({ where: { id: row.id }, data: { revoked_at: new Date() } });
	return true;
}
```

(`listTokens` uses `findUnique` with `where: { id }` in `revokeToken` — the mock's `update` keys on `where.id`; add `id` to the mock's findUnique if needed. The implementer owns the tests; keep both green.)

- [ ] **Step 4: Implement `server/middleware/supportToken.js`**

```js
import { validateToken } from "../services/supportTokenService.js";

const REASON_STATUS = { invalid: "SUPPORT_TOKEN_INVALID", expired: "SUPPORT_TOKEN_EXPIRED", revoked: "SUPPORT_TOKEN_REVOKED" };

export async function requireSupportToken(req, res, next) {
	const header = req.headers.authorization || "";
	const bearer = header.startsWith("Bearer ") ? header.slice(7) : null;
	const token = req.headers["x-support-token"] || (bearer?.startsWith("gtk_sup_") ? bearer : null);
	if (!token) {
		return res.status(401).json({ error: "A support token is required", code: "SUPPORT_TOKEN_REQUIRED" });
	}
	const result = await validateToken(token);
	if (!result.ok) {
		const code = REASON_STATUS[result.reason] || "SUPPORT_TOKEN_INVALID";
		return res.status(401).json({ error: "Invalid, expired or revoked support token", code });
	}
	const buyer = result.buyer;
	req.user = {
		id: buyer.id,
		role: buyer.role,
		email: buyer.email,
		org_owner_id: buyer.org_owner_id || "",
		member_id: buyer.member_id || "",
	};
	req.authUser = buyer;
	req.viaSupportToken = true;
	req.tokenId = result.tokenId;
	next();
}
```

- [ ] **Step 5: Run the tests — expect PASS**

Run: `node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand tests/unit/server-support-token.test.js`
Expected: PASS (5 tests).

- [ ] **Step 6: Commit**

```bash
git add server/services/supportTokenService.js server/middleware/supportToken.js tests/unit/server-support-token.test.js
git commit -m "feat(support): token service + middleware with hashing, expiry, revocation"
```

---

### Task 3: Wire the case API + token routes + admin routes

**Files:**
- Create: `server/routes/supportTokenRoutes.js` (public validate + me)
- Create: `server/routes/adminSupportTokenRoutes.js` (list/issue/revoke)
- Create: `server/controllers/supportTokenController.js`
- Modify: `server/routes/caseRoutes.js` (add `requireAuthOrSupportToken`)
- Modify: `server/middleware/auth.js` (export `requireAuthOrSupportToken`)
- Modify: `server/server.js` (mount `/api/support/token` BEFORE the `/api/support` router)
- Test: `tests/unit/server-admin-support-token.test.js`

**Interfaces:**
- Consumes: `requireSupportToken` (Task 2), `requireAuth` (existing), `allowRoles` (existing).
- Produces:
  - `POST /api/support/token/validate` body `{ token }` → `200 { ok, buyer: { id, name }, label }` | `200? no — 200 with { ok:false, reason }` (spec: caller needs the reason to render the gate; never 401 here for a completed validation — but DO 401 for missing body). Rate limit 10/min per IP.
  - `GET /api/support/token/me` → `{ ok, buyer: { id, name }, label }` (401 when invalid).
  - `GET /api/admin/support-tokens` (owner/admin) → `{ items: […rows…] }` (no hashes).
  - `POST /api/admin/support-tokens` → `201 { token, id, buyer_id, label, expires_at, created_at }`; 400 on missing buyer/label; 404 unknown buyer.
  - `POST /api/admin/support-tokens/:id/revoke` → `{ ok: true }` (idempotent).

- [ ] **Step 1: Add `requireAuthOrSupportToken` to `server/middleware/auth.js`**

```js
/**
 * Either a signed-in session (requireAuth) or a buyer support token
 * (requireSupportToken). The two fill req.user identically, so every handler
 * downstream works unchanged.
 */
export async function requireAuthOrSupportToken(req, res, next) {
	const header = req.headers.authorization || "";
	const bearer = header.startsWith("Bearer ") ? header.slice(7) : null;
	const wantsToken = req.headers["x-support-token"] || bearer?.startsWith("gtk_sup_");
	if (wantsToken) {
		return requireSupportToken(req, res, next);
	}
	return requireAuth(req, res, next);
}
```
(import `requireSupportToken` at the top of auth.js — keep the import to this one place.)

- [ ] **Step 2: Re-point the case router at the wrapper**

In `server/routes/caseRoutes.js`, import `requireAuthOrSupportToken` instead of `requireAuth`, and replace every `requireAuth` in route definitions with `requireAuthOrSupportToken`. The limiter stays. Nothing else changes.

- [ ] **Step 3: Write the failing admin-route test**

Create `tests/unit/server-admin-support-token.test.js`:

```js
import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

const issueToken = jest.fn(async () => ({
	token: "gtk_sup_testtoken", id: "tok_1", buyer_id: "buyer-1", label: "pilot", expires_at: null, created_at: new Date("2026-11-15"),
}));
const listTokens = jest.fn(async () => []);
const revokeToken = jest.fn(async () => true);

jest.unstable_mockModule("../../server/services/supportTokenService.js", () => ({
	generateToken: () => ({ token: "gtk_sup_testtoken", hash: "h" }),
	hashToken: () => "h",
	issueToken,
	validateToken: jest.fn(async () => ({ ok: true, buyer: { id: "buyer-1", name: "Buyer One", email: "b@example.com", role: "buyer" }, tokenId: "tok_1", label: "pilot" })),
	listTokens,
	revokeToken,
}));

const adminRoutes = (await import("../../server/routes/adminSupportTokenRoutes.js")).default;

function buildApp() {
	const app = express();
	app.use(express.json());
	app.use("/api/admin/support-tokens", adminRoutes);
	return app;
}

describe("admin support-token routes", () => {
	test("requires auth", async () => {
		const res = await request(buildApp()).get("/api/admin/support-tokens");
		expect([401, 403]).toContain(res.status);
	});
});
```

- [ ] **Step 4: Run it — expect FAIL** (`Cannot find module '../../server/routes/adminSupportTokenRoutes.js'`)

- [ ] **Step 5: Implement the public validate/me routes**

`server/controllers/supportTokenController.js`:

```js
import { validateToken } from "../services/supportTokenService.js";
import { sanitizeString } from "../utils/validators.js";
import { handleControllerError } from "../utils/permissions.js";

export async function validateSupportToken(req, res) {
	try {
		const token = sanitizeString(String(req.body?.token || ""), 200);
		if (!token) {
			return res.status(400).json({ error: "A token is required" });
		}
		const result = await validateToken(token);
		if (!result.ok) {
			return res.json({ ok: false, reason: result.reason });
		}
		return res.json({
			ok: true,
			buyer: { id: result.buyer.id, name: result.buyer.name || result.buyer.email },
			label: result.label,
		});
	} catch (error) {
		return handleControllerError(res, error);
	}
}

export async function getSupportTokenMe(req, res) {
	const buyer = req.authUser || req.user;
	return res.json({
		ok: true,
		buyer: { id: buyer.id, name: buyer.name || buyer.email },
		label: req.tokenId ? "support token" : undefined,
	});
}
```

`server/routes/supportTokenRoutes.js`:

```js
import { Router } from "express";
import { getSupportTokenMe, validateSupportToken } from "../controllers/supportTokenController.js";
import { requireSupportToken } from "../middleware/supportToken.js";
import { createRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();
const validateLimiter = createRateLimiter({ windowMs: 60_000, max: 10, prefix: "support-token-validate" });

router.post("/validate", validateLimiter, validateSupportToken);
router.get("/me", requireSupportToken, getSupportTokenMe);

export default router;
```

- [ ] **Step 6: Implement the admin routes**

`server/controllers/adminSupportTokenController.js`:

```js
import { listTokens, issueToken, revokeToken } from "../services/supportTokenService.js";
import { sanitizeString } from "../utils/validators.js";
import { deny, handleControllerError } from "../utils/permissions.js";
import { canManageMembers } from "../utils/permissions.js";

export async function listSupportTokensHandler(req, res) {
	if (!canManageMembers(req.user)) return deny(res);
	try {
		return res.json({ items: await listTokens() });
	} catch (error) {
		return handleControllerError(res, error);
	}
}

export async function issueSupportTokenHandler(req, res) {
	if (!canManageMembers(req.user)) return deny(res);
	try {
		const buyerId = sanitizeString(String(req.body?.buyerUserId || req.body?.buyer_id || ""), 120);
		const label = sanitizeString(String(req.body?.label || ""), 120);
		const expiresAt = req.body?.expiresAt ? new Date(req.body.expiresAt) : null;
		if (!buyerId || !label) {
			return res.status(400).json({ error: "buyerUserId and label are required" });
		}
		if (expiresAt && Number.isNaN(expiresAt.getTime())) {
			return res.status(400).json({ error: "expiresAt must be a valid date" });
		}
		const issued = await issueToken({ buyerId, label, expiresAt, createdBy: req.user.id });
		return res.status(201).json(issued);
	} catch (error) {
		if (error?.status) return res.status(error.status).json({ error: error.message });
		return handleControllerError(res, error);
	}
}

export async function revokeSupportTokenHandler(req, res) {
	if (!canManageMembers(req.user)) return deny(res);
	try {
		const revoked = await revokeToken(req.params.id);
		return res.json({ ok: true, revoked });
	} catch (error) {
		return handleControllerError(res, error);
	}
}
```

`server/routes/adminSupportTokenRoutes.js`:

```js
import { Router } from "express";
import {
	issueSupportTokenHandler,
	listSupportTokensHandler,
	revokeSupportTokenHandler,
} from "../controllers/adminSupportTokenController.js";
import { allowRoles, requireAuth } from "../middleware/auth.js";

const router = Router();
router.get("/", requireAuth, allowRoles("owner", "admin"), listSupportTokensHandler);
router.post("/", requireAuth, allowRoles("owner", "admin"), issueSupportTokenHandler);
router.post("/:id/revoke", requireAuth, allowRoles("owner", "admin"), revokeSupportTokenHandler);

export default router;
```

- [ ] **Step 7: Mount in `server/server.js`**

```js
import supportTokenRoutes from "./routes/supportTokenRoutes.js";
import adminSupportTokenRoutes from "./routes/adminSupportTokenRoutes.js";
// …
// The two-mode support page posts to /api/support/token/*; mount BEFORE the
// /api/support router.
app.use("/api/support/token", supportTokenRoutes);
app.use("/api/admin/support-tokens", adminSupportTokenRoutes);
app.use("/api/support", supportRoutes);
```
(Add both mounts — one line each next to the existing support mounts.)

- [ ] **Step 8: Run the tests — expect PASS**

Run: `node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand tests/unit/server-admin-support-token.test.js`
Expected: PASS. Also run the case-ownership suite to confirm nothing broke:
Run: `node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand tests/unit/server-case-ownership.test.js tests/unit/server-assistant-opencode-isolation.test.js`

- [ ] **Step 9: Commit**

```bash
git add server/middleware/auth.js server/routes/caseRoutes.js server/routes/supportTokenRoutes.js server/routes/adminSupportTokenRoutes.js server/controllers/supportTokenController.js server/controllers/adminSupportTokenController.js server/server.js tests/unit/server-admin-support-token.test.js
git commit -m "feat(support): two-mode token routes — validate/me public, admin list/issue/revoke"
```

---

### Task 4: Frontend — `/support` chooser + AI token gate + generic form + Admin "Buyer Tokens" tab

**Files:**
- Modify: `src/App.jsx` (drop ProtectedRoute from `/support`)
- Modify: `src/pages/SupportReports.jsx` (chooser + token gate + generic form; the existing case conversation UI stays unchanged for `mode !== 'choose'`)
- Modify: `src/pages/admin/sections/AdminAISection.jsx` (new "Buyer Tokens" tab)
- Test: `tests/unit/frontend-support-chooser.test.js`

**Interfaces:**
- Consumes: `GET/POST /api/support/token/validate` (public), `GET /api/support/token/me`, `GET|POST /api/admin/support-tokens`, `POST …/revoke` (Task 3); `GET /api/users/search?q=…` (existing, for buyer search; check actual query params and item shape before use and adjust the admin tab accordingly).
- Produces: public `/support` route.

- [ ] **Step 1: Make `/support` public in `App.jsx`**

Change the existing element to render `<SupportReports />` WITHOUT `<ProtectedRoute>` for `path="/support"` (keep the import).

- [ ] **Step 2: Add the chooser shell in `SupportReports.jsx`**

New state at the top of the component (before the existing case state):
```jsx
const [mode, setMode] = useState("choose"); // "choose" | "ai" | "form"
const [supportBuyer, setSupportBuyer] = useState(null); // { id, name }
const [supportLabel, setSupportLabel] = useState("");
const [tokenInput, setTokenInput] = useState("");
const [tokenBusy, setTokenBusy] = useState(false);
const [tokenError, setTokenError] = useState("");
```
Keep `useSupportCase(...)` uncalled until `mode === "ai"` — implement by extracting the existing case UI into `<SupportCasePanel buyer={supportBuyer} onExit={…} />` and rendering it only when `mode === "ai"` (the existing hook call moves into SupportCasePanel). Do not change the case API contract.

Token persistence: memory only (not localStorage). `apiRequest` calls for the case API need the token header — check `src/lib/auth.js` `apiRequest` signature; add an optional extra-headers param if one does not already exist (only additions, no rewrites) and pass `x-support-token` on case requests made while `mode === "ai"`. If threading headers through every request is not clean, add a small wrapper `aiRequest(path, opts)` inside SupportReports.jsx that attaches the header, and use it ONLY for case calls.

Chooser UI (two cards, minimal but on-brand — reuse existing StatCard/rounded-2xl patterns and the file's existing dark/light cn(...) conventions):
- Header row: logo mark + "Support" + subtitle "How can we help today?"
- Card A — "AI Investigation": description "Talk to our technical assistant. It can inspect authorized sources and prepare a detailed report." + token input (placeholder `gtk_sup_…`), primary button "Continue", inline error.
- Card B — "General Support": description "Submit a support request and our team will respond by email." + if `getCurrentUser()` returns a user → form button "Open the form"; else → button "Sign in to submit" linking to `/login`.

Generic form (Mode 02): fields name (prefilled from user), email (prefilled), subject, category (select: bug, account, search, orders, verification, other), priority (standard/urgent — urgent only if premium, mirroring the server rule), description. Submit → `apiRequest("/api/support/tickets", { method: "POST", token: true, body: { subject, description, category, page_url: window.location.href, contact_email: email } })`; on 201 show a confirmation card with the returned ticket id and a "Back" button; on error show the message inline.

Token gate details:
- `Continue` → `POST /api/support/token/validate { token }`; ok → set buyer, mode "ai"; !ok → error "That support token is invalid, expired or revoked."
- In "ai" mode the header shows: "Buyer: <name>" + "token: <label>" + a subtle "Exit" button (clears token from state, mode → "choose").
- 401 from any case request → clear the buyer state, mode "choose", show "Your support token is no longer authorized."

- [ ] **Step 3: Buyer search in the Admin "Buyer Tokens" tab (AdminAISection.jsx)**

Add a fourth/fifth tab `{ id: "tokens", label: "Buyer Tokens", icon: KeyRound }` (import KeyRound from lucide-react). Implementation mirrors the Models tab:

```jsx
const [tokens, setTokens] = useState([]);
const [tokensLoading, setTokensLoading] = useState(false);
const [tokensError, setTokensError] = useState("");
const [tokensNotice, setTokensNotice] = useState("");
const [buyerQuery, setBuyerQuery] = useState("");
const [buyerResults, setBuyerResults] = useState([]);
const [newLabel, setNewLabel] = useState("");
const [newExpiry, setNewExpiry] = useState("never"); // never|30d|90d|custom
const [customDate, setCustomDate] = useState("");
const [issuedToken, setIssuedToken] = useState(null); // { token, …row } — shown once in a modal
const [issuedBusy, setIssuedBusy] = useState(false);

async function fetchTokens() { /* GET /api/admin/support-tokens */ }
async function searchBuyers(q) { /* GET /api/users/search?q=… ; filter role === "buyer" client-side */ }
async function issueToken() { /* POST /api/admin/support-tokens { buyerUserId, label, expiresAt } */ }
async function revokeToken(id) { /* POST /api/admin/support-tokens/:id/revoke */ }
```
UI: search input → results list (name + email); on pick, clear results; label input; expiry dropdown; optional date input when `custom`; "Issue token" button (disabled while busy or when no buyer picked). On success: modal shows `issuedToken.token` in a read-only mono box + Copy button + warning "This token will not be shown again." Table below: buyer, label, created, last used, expiry, status, Revoke button (confirm via existing ConfirmDialog? use plain window.confirm to keep dependencies zero — actually the file likely has a ConfirmDialog component; use it if it already exists in this file, else window.confirm).

- [ ] **Step 4: Component test**

Create `tests/unit/frontend-support-chooser.test.js` — jsdom, mock `apiRequest`:
- renders both cards
- signed-out user: card B shows "Sign in to submit"
- invalid token → error message shown, still on chooser
- valid token → existing case panel is rendered (mode "ai")

(Match an existing frontend test file's setup — `tests/unit/frontend-signed-file.test.js` — for the jest/RTL import idioms and mocking.)

- [ ] **Step 5: Lint + build**

Run: `npx biome check src/App.jsx src/pages/SupportReports.jsx src/pages/admin/sections/AdminAISection.jsx tests/unit/frontend-support-chooser.test.js` — no NEW errors. (Warnings acceptable.)
Run: `npm test`
Expected: same totals as before + the new test green.

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/pages/SupportReports.jsx src/pages/admin/sections/AdminAISection.jsx tests/unit/frontend-support-chooser.test.js
git commit -m "feat(support): two-mode /support — chooser, token gate, signed-in form, admin Buyer Tokens tab"
```

---

### Task 5: Verification + migration apply (owner present)

**Files:** none beyond Task 1's migration folder.

- [ ] **Step 1: Full suite green on the branch**

Run: `npm test` — expect 990+ tests, no new failures.

- [ ] **Step 2: Apply the migration (owner-approved path)**

Show the migration SQL again (`cat prisma/migrations/20261115170000_add_support_access_tokens/migration.sql`). Only if it creates solely `support_access_tokens`:

```bash
npx prisma migrate deploy
```
Expected output: "Following migration(s) have been applied: … add_support_access_tokens". If the command proposes anything else (reset/baseline), STOP immediately, show the output, and do not proceed.
Then: `npx prisma generate` once more and confirm `prisma.supportAccessToken` exists (e.g. in a tiny node -e script).

- [ ] **Step 3: Live smoke (server must boot)**

Boot with `PORT=4577 node server/server.js` in background; expect startup log with no errors mentioning support tokens; then:

```bash
curl -s -X POST http://127.0.0.1:4577/api/support/token/validate -H 'content-type: application/json' -d '{"token":"gtk_sup_nope"}'
```
Expected: `{ ok: false, reason: "invalid" }`. Then stop the server.

- [ ] **Step 4: Spec/plan bookkeeping**

Append to the spec's rollout note that the migration was applied interactively (or note if it was deferred); commit if changed.
