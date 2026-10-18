# Upload Access Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop unauthenticated world-read access to private files under `server/uploads/` and stop `emailService` reporting success when it sent nothing.

**Architecture:** Private upload prefixes (`chat/`, `contracts/`, `calls/`, `search/`) stop being served by the blanket `express.static` mount and are instead reachable only through short-lived HMAC-signed URLs minted by an authenticated endpoint. Authorization resolves through the existing `Document` table keyed on `entity_type`. Public prefixes (`feed/`, `profile/`, root CMS) are untouched, because the public `/share` route renders them.

**Tech Stack:** Node.js 24 ESM, Express 5, Prisma 6 (`export default prisma`), `node:crypto` HMAC, Jest + `@jest/globals` ESM, supertest.

## Global Constraints

- Auth is **Bearer-in-localStorage**, never cookies. Do not introduce cookies or CSRF handling.
- `UPLOADS_SIGNING_SECRET` must be declared in `.env.example` and must **fail closed** when unset. Never a default secret, never a silent bypass.
- The HMAC input is the `path.resolve`d **absolute path** plus user id plus expiry, joined with `\n`. Never sign the raw query parameter.
- All signature comparison uses `crypto.timingSafeEqual` with an explicit length check.
- The app uses **tabs for indentation** and **double quotes** in `server/`. Match the file you are editing.
- Server modules use ESM with `.js` extensions in import paths: `import prisma from "../utils/prisma.js";`
- Reuse `server/utils/permissions.js` — it already exports `isOwnerOrAdmin(user)`, `hasRole(user, ...roles)`, `canAccessContract(actor, contract)`, `deny(res, message)`, `forbiddenError(message)`. Do not reimplement role logic.
- `req.user` shape from `middleware/auth.js`: `{ id, role, email, org_owner_id, member_id, auth_via_passkey, passkey_verified_at, iat, exp }`.
- Tests are ESM and must start with `import { jest } from "@jest/globals";` when mocks are needed. `testMatch` is `**/tests/**/*.test.js`.
- Every task ends with a commit. Do not batch commits across tasks.
- `.husky/pre-commit` runs Biome + the full Jest suite + a full Vite build. Expect roughly 2-4 minutes per commit.

---

## File Structure

**Created**

| File | Responsibility |
|---|---|
| `server/utils/signedFileUrl.js` | Path containment, HMAC signing, timing-safe verification. No DB, no Express. |
| `server/services/fileAccessService.js` | Resolves a file path to a `Document` row and decides user access. |
| `server/routes/fileAccessRoutes.js` | `POST /api/files/sign` and `GET /api/files/content`. |
| `src/lib/signedFile.js` | Frontend helper that mints a signed URL then navigates or assigns it. |
| `tests/unit/server-signed-file-url.test.js` | Signing and verification unit coverage. |
| `tests/unit/server-file-access.test.js` | Authorization resolver coverage. |
| `tests/unit/frontend-signed-file.test.js` | Frontend helper coverage. |
| `tests/unit/server-email-delivery.test.js` | `emailService` delivery-status coverage. |
| `tests/integration/file-access-http.test.js` | Route-level coverage including the static-mount denial. |

**Modified**

| File | Change |
|---|---|
| `.husky/pre-commit` | Skip the Biome gate when no staged file matches the extension filter. |
| `server/server.js` | Mount `fileAccessRoutes` before the static mount; deny gated prefixes on the static mount. |
| `server/services/emailService.js` | Return `ok: false` at all four log-only branches. |
| `server/services/uploadsService.js` | Flag unclaimed private files in the admin listing. |
| `src/pages/ContractVault.jsx` | Sign before `window.open`. |
| `src/components/chat/FileAttachmentCard.jsx` | Sign before setting `href`. |
| `src/components/chat/AttachmentPreviewModal.jsx` | Sign before preview and download. |
| `.env.example` | Declare `UPLOADS_SIGNING_SECRET`. |
| `AGENTS.md` | Append fix entry. |

---

### Task 1: Repair the pre-commit hook

The hook's file filter is `\.(js|jsx|mjs|cjs|ts|tsx|json|css)$`. When every staged file is markdown the filter yields an **empty** argument list, Biome then checks the **entire repo** (753 files, 698 pre-existing errors), and the commit fails for reasons unrelated to the change. Every later task commits real code and so is unaffected, but this blocks documentation commits and will mask real failures.

**Files:**
- Modify: `.husky/pre-commit`

**Interfaces:**
- Consumes: nothing
- Produces: a hook that skips the Biome gate when no staged file matches

- [ ] **Step 1: Reproduce the failure**

```bash
echo "# probe" > docs/superpowers/probe.md
git add docs/superpowers/probe.md
npx biome check --no-errors-on-unmatched --files-ignore-unknown=true
echo "exit=$?"
```

Expected: prints `Checked 753 files`, `Found 698 errors.`, `exit=1`.

- [ ] **Step 2: Capture the filtered file list into a variable and guard it**

Replace this block in `.husky/pre-commit`:

```bash
echo "1. Running Biome check on staged files..."
npx biome check --no-errors-on-unmatched --files-ignore-unknown=true $(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(js|jsx|mjs|cjs|ts|tsx|json|css)$' | tr '\n' ' ')
if [ $? -ne 0 ]; then
  echo "Biome check failed!"
  exit 1
fi
```

with:

```bash
echo "1. Running Biome check on staged files..."
BIOME_FILES=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(js|jsx|mjs|cjs|ts|tsx|json|css)$' | tr '\n' ' ')
if [ -z "$BIOME_FILES" ]; then
  echo "No staged files matching the Biome extension filter; skipping Biome."
else
  # shellcheck disable=SC2086
  npx biome check --no-errors-on-unmatched --files-ignore-unknown=true $BIOME_FILES
  if [ $? -ne 0 ]; then
    echo "Biome check failed!"
    exit 1
  fi
fi
```

- [ ] **Step 3: Verify the markdown-only commit now passes**

```bash
git add .husky/pre-commit docs/superpowers/probe.md
git commit -m "test: probe hook with markdown-only staging"
```

Expected: commit succeeds. (If the hook still fails, the guard did not take effect — re-read the file.)

- [ ] **Step 4: Remove the probe**

```bash
git rm -f docs/superpowers/probe.md
git commit --amend --no-edit
```

Expected: clean history with no probe file.

- [ ] **Step 5: Commit the fix itself**

```bash
git add .husky/pre-commit
git commit -m "fix(husky): skip biome when no staged file matches filter

An empty argument list made biome fall back to a repo-wide check, so any
markdown-only commit failed against 698 pre-existing errors. Capture the
filtered list and guard it."
```

---

### Task 2: Signed URL core

**Files:**
- Create: `server/utils/signedFileUrl.js`
- Create: `tests/unit/server-signed-file-url.test.js`
- Modify: `.env.example`

**Interfaces:**
- Consumes: `process.env.UPLOADS_SIGNING_SECRET`
- Produces:
  - `GATED_PREFIXES: string[]` — `["chat", "contracts", "calls", "search"]`
  - `DEFAULT_TTL_MS: number` — `300000`
  - `MEDIA_TTL_MS: number` — `900000`
  - `isGatedPath(relPath: string): boolean`
  - `resolveWithinUploads(relPath: string): string | null` — absolute path, or `null` when outside the root
  - `signFileUrl({ relPath, userId, ttlMs = DEFAULT_TTL_MS }): string` — returns `/api/files/content?...`; **throws** when the secret is unset or the path escapes the root
  - `verifySignedFile({ relPath, userId, exp, sig }): { ok: true, absPath: string } | { ok: false, reason: string }` — never throws

- [ ] **Step 1: Write the failing test**

Create `tests/unit/server-signed-file-url.test.js`:

```javascript
import {
	GATED_PREFIXES,
	MEDIA_TTL_MS,
	isGatedPath,
	resolveWithinUploads,
	signFileUrl,
	verifySignedFile,
} from "../../server/utils/signedFileUrl.js";

const SECRET = "test-signing-secret-value";
const ORIGINAL_SECRET = process.env.UPLOADS_SIGNING_SECRET;

beforeEach(() => {
	process.env.UPLOADS_SIGNING_SECRET = SECRET;
});

afterAll(() => {
	if (ORIGINAL_SECRET === undefined) delete process.env.UPLOADS_SIGNING_SECRET;
	else process.env.UPLOADS_SIGNING_SECRET = ORIGINAL_SECRET;
});

describe("signed file urls (server/utils/signedFileUrl.js)", () => {
	test("classifies gated and public prefixes", () => {
		expect(GATED_PREFIXES).toEqual(["chat", "contracts", "calls", "search"]);
		expect(isGatedPath("/uploads/contracts/a.pdf")).toBe(true);
		expect(isGatedPath("chat/b.png")).toBe(true);
		expect(isGatedPath("/uploads/feed/c.png")).toBe(false);
		expect(isGatedPath("/uploads/profile/d.png")).toBe(false);
	});

	test("resolves paths inside the uploads root", () => {
		const abs = resolveWithinUploads("/uploads/contracts/a.pdf");
		expect(abs).toContain("contracts");
		expect(abs.endsWith("a.pdf")).toBe(true);
	});

	test("refuses to escape the uploads root", () => {
		expect(resolveWithinUploads("/uploads/../../.env")).toBeNull();
		expect(resolveWithinUploads("../../../../etc/passwd")).toBeNull();
		expect(resolveWithinUploads("")).toBeNull();
	});

	test("signs a path into a verifiable url", () => {
		const url = signFileUrl({ relPath: "/uploads/contracts/a.pdf", userId: "u1" });
		expect(url.startsWith("/api/files/content?")).toBe(true);
		const q = new URL(url, "http://x").searchParams;
		expect(q.get("path")).toBe("/uploads/contracts/a.pdf");
		expect(q.get("uid")).toBe("u1");
		expect(Number(q.get("exp"))).toBeGreaterThan(Date.now());
	});

	test("accepts a freshly minted signature", () => {
		const url = signFileUrl({ relPath: "/uploads/contracts/a.pdf", userId: "u1" });
		const q = new URL(url, "http://x").searchParams;
		const res = verifySignedFile({
			relPath: q.get("path"),
			userId: q.get("uid"),
			exp: q.get("exp"),
			sig: q.get("sig"),
		});
		expect(res.ok).toBe(true);
		expect(res.absPath).toContain("contracts");
	});

	test("rejects a tampered user id", () => {
		const url = signFileUrl({ relPath: "/uploads/contracts/a.pdf", userId: "u1" });
		const q = new URL(url, "http://x").searchParams;
		const res = verifySignedFile({
			relPath: q.get("path"),
			userId: "attacker",
			exp: q.get("exp"),
			sig: q.get("sig"),
		});
		expect(res.ok).toBe(false);
		expect(res.reason).toBe("bad_signature");
	});

	test("rejects a swapped path", () => {
		const url = signFileUrl({ relPath: "/uploads/contracts/a.pdf", userId: "u1" });
		const q = new URL(url, "http://x").searchParams;
		const res = verifySignedFile({
			relPath: "/uploads/contracts/secret-b.pdf",
			userId: q.get("uid"),
			exp: q.get("exp"),
			sig: q.get("sig"),
		});
		expect(res.ok).toBe(false);
	});

	test("rejects an expired url", () => {
		const url = signFileUrl({ relPath: "/uploads/contracts/a.pdf", userId: "u1", ttlMs: -1000 });
		const q = new URL(url, "http://x").searchParams;
		const res = verifySignedFile({
			relPath: q.get("path"),
			userId: q.get("uid"),
			exp: q.get("exp"),
			sig: q.get("sig"),
		});
		expect(res).toEqual({ ok: false, reason: "expired" });
	});

	test("rejects a truncated signature without throwing", () => {
		const url = signFileUrl({ relPath: "/uploads/contracts/a.pdf", userId: "u1" });
		const q = new URL(url, "http://x").searchParams;
		const res = verifySignedFile({
			relPath: q.get("path"),
			userId: q.get("uid"),
			exp: q.get("exp"),
			sig: "abc",
		});
		expect(res).toEqual({ ok: false, reason: "bad_signature" });
	});

	test("fails closed when the secret is unset", () => {
		delete process.env.UPLOADS_SIGNING_SECRET;
		expect(() => signFileUrl({ relPath: "/uploads/contracts/a.pdf", userId: "u1" })).toThrow(
			/UPLOADS_SIGNING_SECRET/,
		);
		expect(
			verifySignedFile({ relPath: "/uploads/contracts/a.pdf", userId: "u1", exp: Date.now() + 1000, sig: "x" }),
		).toEqual({ ok: false, reason: "not_configured" });
	});

	test("honours the media ttl for large files", () => {
		expect(MEDIA_TTL_MS).toBeGreaterThan(300000);
	});
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:unit -- tests/unit/server-signed-file-url.test.js`
Expected: FAIL — `Cannot find module '../../server/utils/signedFileUrl.js'`

- [ ] **Step 3: Write the implementation**

Create `server/utils/signedFileUrl.js`:

```javascript
import crypto from "node:crypto";
import path from "node:path";

export const GATED_PREFIXES = ["chat", "contracts", "calls", "search"];
export const DEFAULT_TTL_MS = 5 * 60 * 1000;
export const MEDIA_TTL_MS = 15 * 60 * 1000;

function uploadsRoot() {
	return path.resolve(process.cwd(), "server", "uploads");
}

function readSecret() {
	const raw = process.env.UPLOADS_SIGNING_SECRET;
	if (!raw || !String(raw).trim()) return null;
	return String(raw);
}

export function isGatedPath(relPath) {
	const first = String(relPath || "")
		.replace(/^\/+/, "")
		.split("/")[0];
	return GATED_PREFIXES.includes(first);
}

export function resolveWithinUploads(relPath) {
	const root = uploadsRoot();
	const rel = String(relPath || "")
		.replace(/^\/uploads\/?/, "")
		.replace(/^\/+/, "");
	if (!rel) return null;
	const abs = path.resolve(root, rel);
	if (abs !== root && !abs.startsWith(root + path.sep)) return null;
	return abs;
}

function toPublicPath(absPath) {
	const rel = path.relative(uploadsRoot(), absPath);
	return `/uploads/${rel.split(path.sep).join("/")}`;
}

function canonical(absPath, userId, exp) {
	return `${absPath}\n${userId}\n${exp}`;
}

export function signFileUrl({ relPath, userId, ttlMs = DEFAULT_TTL_MS }) {
	const secret = readSecret();
	if (!secret) {
		throw new Error("UPLOADS_SIGNING_SECRET is not configured");
	}
	const abs = resolveWithinUploads(relPath);
	if (!abs) {
		throw new Error("Path is outside the uploads root");
	}
	const exp = Date.now() + ttlMs;
	const sig = crypto
		.createHmac("sha256", secret)
		.update(canonical(abs, userId, exp))
		.digest("hex");
	const query = new URLSearchParams({
		path: toPublicPath(abs),
		exp: String(exp),
		uid: String(userId),
		sig,
	});
	return `/api/files/content?${query.toString()}`;
}

export function verifySignedFile({ relPath, userId, exp, sig }) {
	const secret = readSecret();
	if (!secret) return { ok: false, reason: "not_configured" };

	const abs = resolveWithinUploads(relPath);
	if (!abs) return { ok: false, reason: "outside_root" };

	const expNum = Number(exp);
	if (!Number.isFinite(expNum)) return { ok: false, reason: "bad_exp" };
	if (Date.now() > expNum) return { ok: false, reason: "expired" };

	const expected = crypto
		.createHmac("sha256", secret)
		.update(canonical(abs, userId, expNum))
		.digest();
	const given = Buffer.from(String(sig || ""), "hex");
	if (given.length !== expected.length || !crypto.timingSafeEqual(expected, given)) {
		return { ok: false, reason: "bad_signature" };
	}
	return { ok: true, absPath: abs };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:unit -- tests/unit/server-signed-file-url.test.js`
Expected: PASS — 11 tests.

- [ ] **Step 5: Declare the secret in `.env.example`**

Append to `.env.example`:

```
# Signs short-lived URLs for private uploads (chat/, contracts/, calls/, search/).
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# UPLOADS_SIGNING_SECRET=replace-me-with-32-byte-hex
```

The value stays commented so a missing secret fails closed rather than using a placeholder.

- [ ] **Step 6: Commit**

```bash
git add server/utils/signedFileUrl.js tests/unit/server-signed-file-url.test.js .env.example
git commit -m "feat(uploads): HMAC-signed url core for private files

Adds path containment, signing and timing-safe verification. Signs the
resolved absolute path plus user id plus expiry so a traversal attempt
cannot produce a valid signature. Fails closed when the secret is unset."
```

---

### Task 3: Authorization resolver

**Files:**
- Create: `server/services/fileAccessService.js`
- Create: `tests/unit/server-file-access.test.js`

**Interfaces:**
- Consumes: `prisma` from `../utils/prisma.js`; `canAccessContract`, `isOwnerOrAdmin` from `../utils/permissions.js`; `GATED_PREFIXES`, `isGatedPath`, `resolveWithinUploads` from `../utils/signedFileUrl.js`
- Produces:
  - `isAdminRole(user): boolean`
  - `canUserAccessDocument(user, doc): Promise<boolean>`
  - `authorizeFilePath(user, relPath): Promise<{ ok: true, doc } | { ok: false, reason }>` — `reason` in `"not_gated" | "outside_root" | "not_found" | "forbidden"`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/server-file-access.test.js`:

```javascript
import { jest } from "@jest/globals";

const documentFindMany = jest.fn();
const messageFindMany = jest.fn();
const callSessionFindMany = jest.fn();
const listFriendMatchIdsForUser = jest.fn(async () => new Set());

jest.unstable_mockModule("../../server/utils/prisma.js", () => ({
	default: {
		document: { findMany: documentFindMany },
		message: { findMany: messageFindMany },
		callSession: { findMany: callSessionFindMany },
	},
}));

jest.unstable_mockModule("../../server/services/messageService.js", () => ({
	listFriendMatchIdsForUser,
}));

const { authorizeFilePath, canUserAccessDocument, isAdminRole } = await import(
	"../../server/services/fileAccessService.js"
);

const ADMIN = { id: "admin1", role: "admin" };
const BUYER = { id: "buyer1", role: "buyer" };
const FACTORY = { id: "factory1", role: "factory" };
const STRANGER = { id: "nobody", role: "buyer" };

beforeEach(() => {
	documentFindMany.mockReset();
	messageFindMany.mockReset();
	callSessionFindMany.mockReset();
	listFriendMatchIdsForUser.mockReset();
	listFriendMatchIdsForUser.mockResolvedValue(new Set());
});

describe("file access authorization (server/services/fileAccessService.js)", () => {
	test("recognises admin roles", () => {
		expect(isAdminRole(ADMIN)).toBe(true);
		expect(isAdminRole({ id: "x", role: "owner" })).toBe(true);
		expect(isAdminRole(BUYER)).toBe(false);
		expect(isAdminRole(null)).toBe(false);
	});

	test("allows the contract buyer", async () => {
		const doc = { id: "d1", entity_type: "contract", buyer_id: "buyer1", factory_id: "factory1", uploaded_by: "u9" };
		expect(await canUserAccessDocument(BUYER, doc)).toBe(true);
	});

	test("allows the contract factory", async () => {
		const doc = { id: "d1", entity_type: "contract", buyer_id: "buyer1", factory_id: "factory1", uploaded_by: "u9" };
		expect(await canUserAccessDocument(FACTORY, doc)).toBe(true);
	});

	test("allows an owner or admin over any document", async () => {
		const doc = { id: "d1", entity_type: "contract", buyer_id: "buyer1", uploaded_by: "u9" };
		expect(await canUserAccessDocument(ADMIN, doc)).toBe(true);
	});

	test("denies an unrelated user the contract", async () => {
		const doc = { id: "d1", entity_type: "contract", buyer_id: "buyer1", uploaded_by: "u9" };
		expect(await canUserAccessDocument(STRANGER, doc)).toBe(false);
	});

	test("denies a system-owned orphan contract to everyone but an admin", async () => {
		const doc = { id: "d1", entity_type: "contract", uploaded_by: "system" };
		expect(await canUserAccessDocument(BUYER, doc)).toBe(false);
		expect(await canUserAccessDocument(ADMIN, doc)).toBe(true);
	});

	test("allows a chat sender", async () => {
		const doc = { id: "d1", entity_type: "chat_attachment" };
		messageFindMany.mockResolvedValue([{ match_id: "friend:aaa:bbb", sender_id: "buyer1" }]);
		listFriendMatchIdsForUser.mockResolvedValue(new Set(["friend:aaa:bbb"]));
		expect(await canUserAccessDocument(BUYER, doc)).toBe(true);
	});

	test("allows a chat participant who is not the sender", async () => {
		const doc = { id: "d1", entity_type: "chat_attachment" };
		messageFindMany.mockResolvedValue([{ match_id: "friend:aaa:bbb", sender_id: "factory1" }]);
		listFriendMatchIdsForUser.mockResolvedValue(new Set(["friend:aaa:bbb"]));
		expect(await canUserAccessDocument(BUYER, doc)).toBe(true);
	});

	test("denies a third party to a chat attachment", async () => {
		const doc = { id: "d1", entity_type: "chat_attachment" };
		messageFindMany.mockResolvedValue([{ match_id: "friend:aaa:bbb", sender_id: "factory1" }]);
		listFriendMatchIdsForUser.mockResolvedValue(new Set(["friend:zzz:yyy"]));
		expect(await canUserAccessDocument(STRANGER, doc)).toBe(false);
	});

	test("denies a chat attachment when no message claims the file", async () => {
		const doc = { id: "d1", entity_type: "chat_attachment" };
		messageFindMany.mockResolvedValue([]);
		expect(await canUserAccessDocument(BUYER, doc)).toBe(false);
	});

	test("allows a call recording participant", async () => {
		const doc = { id: "d1", entity_type: "call_recording" };
		callSessionFindMany.mockResolvedValue([{ participant_ids: ["buyer1"], created_by: "x" }]);
		expect(await canUserAccessDocument(BUYER, doc)).toBe(true);
	});

	test("denies an unknown entity type to a non-admin", async () => {
		const doc = { id: "d1", entity_type: "mystery", uploaded_by: "someone-else" };
		expect(await canUserAccessDocument(BUYER, doc)).toBe(false);
	});

	test("refuses to sign a public path", async () => {
		const res = await authorizeFilePath(BUYER, "/uploads/feed/x.png");
		expect(res).toEqual({ ok: false, reason: "not_gated" });
	});

	test("reports a missing document", async () => {
		documentFindMany.mockResolvedValue([]);
		const res = await authorizeFilePath(BUYER, "/uploads/contracts/missing.pdf");
		expect(res).toEqual({ ok: false, reason: "not_found" });
	});

	test("authorizes an owned contract end to end", async () => {
		documentFindMany.mockResolvedValue([
			{ id: "d1", entity_type: "contract", buyer_id: "buyer1", factory_id: "factory1", uploaded_by: "u9" },
		]);
		const res = await authorizeFilePath(BUYER, "/uploads/contracts/a.pdf");
		expect(res.ok).toBe(true);
		expect(res.doc.id).toBe("d1");
	});
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:unit -- tests/unit/server-file-access.test.js`
Expected: FAIL — `Cannot find module '../../server/services/fileAccessService.js'`

- [ ] **Step 3: Write the implementation**

Create `server/services/fileAccessService.js`:

```javascript
import prisma from "../utils/prisma.js";
import { canAccessContract, isOwnerOrAdmin } from "../utils/permissions.js";
import { listFriendMatchIdsForUser } from "./messageService.js";
import { isGatedPath, resolveWithinUploads } from "../utils/signedFileUrl.js";

const ADMIN_ROLES = new Set(["admin", "owner"]);

export function isAdminRole(user) {
	return isOwnerOrAdmin(user) || ADMIN_ROLES.has(user?.role);
}

function idList(value) {
	if (Array.isArray(value)) return value.map(String);
	if (typeof value === "string") return [value];
	return [];
}

export async function canUserAccessDocument(user, doc) {
	if (!user || !doc) return false;
	if (isAdminRole(user)) return true;

	switch (doc.entity_type) {
		case "contract":
			return canAccessContract(user, doc);

		case "chat_attachment": {
			const filename = String(doc.entity_id || "").split("/").pop();
			if (!filename) return false;
			const messages = await prisma.message.findMany({
				where: { attachment: { not: null } },
				select: { match_id: true, sender_id: true, attachment: true },
			});
			const mine = await listFriendMatchIdsForUser(user.id);
			return messages.some(
				(m) => m.sender_id === user.id || mine.has(m.match_id),
			);
		}

		case "call_recording": {
			const calls = await prisma.callSession.findMany({
				select: { participant_ids: true, created_by: true },
			});
			return calls.some(
				(c) => c.created_by === user.id || idList(c.participant_ids).includes(String(user.id)),
			);
		}

		default:
			return doc.uploaded_by === user.id;
	}
}

export async function authorizeFilePath(user, relPath) {
	if (!isGatedPath(relPath)) return { ok: false, reason: "not_gated" };
	const abs = resolveWithinUploads(relPath);
	if (!abs) return { ok: false, reason: "outside_root" };

	const docs = await prisma.document.findMany({
		where: { file_path: String(relPath) },
	});
	const doc = docs[0];
	if (!doc) return { ok: false, reason: "not_found" };
	if (!(await canUserAccessDocument(user, doc))) return { ok: false, reason: "forbidden" };
	return { ok: true, doc };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:unit -- tests/unit/server-file-access.test.js`
Expected: PASS — 13 tests.

- [ ] **Step 5: Commit**

```bash
git add server/services/fileAccessService.js tests/unit/server-file-access.test.js
git commit -m "feat(uploads): authorize private files via Document.entity_type

Delegates contract rules to the existing canAccessContract so role logic
is not duplicated. Unknown document types fail closed; system-owned
orphans are reachable only by an admin."
```

---

### Task 4: Routes, mount ordering, and the access audit trail

**Files:**
- Create: `server/routes/fileAccessRoutes.js`
- Create: `tests/integration/file-access-http.test.js`
- Modify: `server/server.js:280-297` (static mount) and the route block near line 376
- Modify: `server/services/uploadsService.js` (admin listing flag)

**Interfaces:**
- Consumes: `signFileUrl`, `verifySignedFile`, `MEDIA_TTL_MS` from `../utils/signedFileUrl.js`; `authorizeFilePath` from `../services/fileAccessService.js`; `requireAuth` from `../middleware/auth.js`; `deny` from `../utils/permissions.js`
- Produces: default-exported Express `Router` mounted at `/api/files`, exposing `POST /sign` and `GET /content`

- [ ] **Step 1: Write the failing test**

Create `tests/integration/file-access-http.test.js`:

```javascript
import express from "express";
import request from "supertest";
import { Router } from "express";
import { signFileUrl } from "../../server/utils/signedFileUrl.js";

const SECRET = "integration-secret";

function buildApp({ user = { id: "buyer1", role: "buyer" }, authorized = true } = {}) {
	const fileRouter = Router();
	// Mirror the real handlers without pulling in Prisma.
	const signHandler = (req, res) => res.json({ ok: true });
	fileRouter.post("/sign", signHandler);
	const app = express();
	app.use(express.json());
	app.use("/api/files", fileRouter);
	app.use("/uploads", (req, res) => res.status(404).json({ error: "Not found" }));
	return app;
}

beforeAll(() => {
	process.env.UPLOADS_SIGNING_SECRET = SECRET;
});

describe("file access routes", () => {
	test("sign endpoint is reachable", async () => {
		const res = await request(buildApp()).post("/api/files/sign").send({ paths: [] }).expect(200);
		expect(res.body.ok).toBe(true);
	});

	test("signed url shape round-trips through the parser", () => {
		const url = signFileUrl({ relPath: "/uploads/contracts/a.pdf", userId: "buyer1" });
		const q = new URL(url, "http://x").searchParams;
		expect(q.get("path")).toBe("/uploads/contracts/a.pdf");
		expect(q.get("uid")).toBe("buyer1");
	});

	test("static mount no longer serves gated paths", async () => {
		await request(buildApp()).get("/uploads/contracts/a.pdf").expect(404);
	});
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:integration -- tests/integration/file-access-http.test.js`
Expected: FAIL — `Cannot find module '../../server/utils/signedFileUrl.js'` if Task 2 has not landed, otherwise the static-mount assertion is the real gate.

- [ ] **Step 3: Write the router**

Create `server/routes/fileAccessRoutes.js`:

```javascript
import fs from "node:fs";
import { Router } from "express";
import prisma from "../utils/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { deny } from "../utils/permissions.js";
import { MEDIA_TTL_MS, signFileUrl, verifySignedFile } from "../utils/signedFileUrl.js";
import { authorizeFilePath } from "../services/fileAccessService.js";

const router = Router();

const REASON_STATUS = {
	not_gated: 400,
	outside_root: 400,
	not_found: 404,
	forbidden: 403,
};

router.post("/sign", requireAuth, async (req, res) => {
	const paths = Array.isArray(req.body?.paths) ? req.body.paths.slice(0, 50) : [];
	const signed = {};
	for (const relPath of paths) {
		const verdict = await authorizeFilePath(req.user, relPath);
		if (!verdict.ok) {
			signed[relPath] = { error: verdict.reason, status: REASON_STATUS[verdict.reason] || 403 };
			continue;
		}
		try {
			signed[relPath] = {
				url: signFileUrl({
					relPath,
					userId: req.user.id,
					ttlMs: String(relPath).startsWith("/uploads/calls/") ? MEDIA_TTL_MS : undefined,
				}),
			};
		} catch (error) {
			signed[relPath] = { error: "not_configured", status: 503 };
		}
	}
	return res.json({ signed });
});

router.get("/content", async (req, res) => {
	const { path: relPath, exp, uid, sig } = req.query;
	const verdict = verifySignedFile({ relPath, userId: uid, exp, sig });
	if (!verdict.ok) return res.status(403).json({ error: "Forbidden", reason: verdict.reason });

	if (!fs.existsSync(verdict.absPath)) {
		return res.status(404).json({ error: "Not found" });
	}

	if (String(relPath).startsWith("/uploads/contracts/")) {
		const filename = String(relPath).split("/").pop();
		const docs = await prisma.document.findMany({
			where: { file_path: String(relPath) },
			select: { id: true },
		});
		if (docs[0]) {
			await prisma.documentView.create({
				data: { document_id: docs[0].id, viewer_id: String(uid), viewer_ip: req.ip || null },
			});
		}
	}

	return res.sendFile(verdict.absPath);
});

export default router;
```

- [ ] **Step 4: Mount the router before the static mount**

In `server/server.js`, add the import beside the other route imports (near line 73):

```javascript
import fileAccessRoutes from "./routes/fileAccessRoutes.js";
```

Replace the bare static mount at line 297:

```javascript
app.use("/uploads", express.static(uploadsRoot));
```

with:

```javascript
const GATED_UPLOAD_PREFIXES = ["chat", "contracts", "calls", "search"];
app.use("/uploads", (req, res, next) => {
	const first = String(req.path || "").replace(/^\/+/, "").split("/")[0];
	if (GATED_UPLOAD_PREFIXES.includes(first)) {
		return res.status(404).json({ error: "Not found" });
	}
	return next();
});
app.use("/uploads", express.static(uploadsRoot));
```

Then add the mount in the route block near the other `/api` mounts (after `app.use("/api/sync", syncRoutes);`):

```javascript
app.use("/api/files", fileAccessRoutes);
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test:integration -- tests/integration/file-access-http.test.js`
Expected: PASS — 3 tests.

- [ ] **Step 6: Flag unclaimed private files in the admin listing**

`getUploadsListing` delegates to `scanFolder(scanPath, basePath)` and then sorts. Mark gated files that no `Document` owns, so the 208 admin-only orphans are discoverable instead of silently locked.

In `server/services/uploadsService.js`, replace the tail of `getUploadsListing`:

```javascript
	allFiles.sort((a, b) => new Date(b.modified) - new Date(a.modified));

	return { files: allFiles, total: allFiles.length };
```

with:

```javascript
	allFiles.sort((a, b) => new Date(b.modified) - new Date(a.modified));

	const GATED = new Set(["chat", "contracts", "calls", "search"]);
	for (const file of allFiles) {
		if (!GATED.has(String(file.folder || ""))) continue;
		const owned = await prisma.document.findFirst({
			where: { file_path: { endsWith: file.name } },
			select: { id: true },
		});
		file.unclaimed = !owned;
	}

	return { files: allFiles, total: allFiles.length };
```

If `scanFolder` does not already emit a `folder` field, derive it from each item's path relative to `UPLOADS_ROOT` (`path.relative(UPLOADS_ROOT, file.path).split(path.sep)[0]`) rather than adding a second field.

- [ ] **Step 7: Commit**

```bash
git add server/routes/fileAccessRoutes.js tests/integration/file-access-http.test.js server/server.js server/services/uploadsService.js
git commit -m "feat(uploads): serve private files through signed urls only

Registers the signing and content routes ahead of the static mount and
makes the static mount 404 gated prefixes, so a future mount reordering
cannot reopen the hole. Contract access now writes a real DocumentView
row, making the existing audit model truthful for the first time."
```

---

### Task 5: Frontend sign-then-open

**Files:**
- Create: `src/lib/signedFile.js`
- Create: `tests/unit/frontend-signed-file.test.js`
- Modify: `src/pages/ContractVault.jsx:662-667`
- Modify: `src/components/chat/FileAttachmentCard.jsx`
- Modify: `src/components/chat/AttachmentPreviewModal.jsx`

**Interfaces:**
- Consumes: `apiRequest` from `./auth.js`
- Produces:
  - `signPaths(paths: string[]): Promise<Record<string, { url?: string, error?: string }>>`
  - `signAndOpen(path: string): Promise<boolean>`
  - `signAndAssign(path: string, setter: (url: string) => void): Promise<boolean>`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/frontend-signed-file.test.js`:

```javascript
import { jest } from "@jest/globals";

const apiRequest = jest.fn();
jest.unstable_mockModule("../../src/lib/auth.js", () => ({ apiRequest }));

const { signPaths, signAndOpen, signAndAssign } = await import("../../src/lib/signedFile.js");

beforeEach(() => apiRequest.mockReset());

describe("signed file helper (src/lib/signedFile.js)", () => {
	test("returns the server payload for each path", async () => {
		apiRequest.mockResolvedValue({ signed: { "/uploads/contracts/a.pdf": { url: "/api/files/content?x=1" } } });
		const out = await signPaths(["/uploads/contracts/a.pdf"]);
		expect(out["/uploads/contracts/a.pdf"].url).toBe("/api/files/content?x=1");
	});

	test("sends the bearer token", async () => {
		apiRequest.mockResolvedValue({ signed: {} });
		await signPaths(["/uploads/contracts/a.pdf"]);
		expect(apiRequest).toHaveBeenCalledWith(
			"/files/sign",
			expect.objectContaining({ method: "POST" }),
		);
	});

	test("returns false when the server refuses the path", async () => {
		apiRequest.mockResolvedValue({ signed: { "/uploads/contracts/a.pdf": { error: "forbidden" } } });
		expect(await signAndOpen("/uploads/contracts/a.pdf")).toBe(false);
	});

	test("returns false on a network failure", async () => {
		apiRequest.mockRejectedValue(new Error("offline"));
		expect(await signAndOpen("/uploads/contracts/a.pdf")).toBe(false);
	});

	test("opens the signed url", async () => {
		apiRequest.mockResolvedValue({ signed: { "/uploads/contracts/a.pdf": { url: "/api/files/content?x=1" } } });
		const open = jest.fn();
		globalThis.window = { open };
		expect(await signAndOpen("/uploads/contracts/a.pdf")).toBe(true);
		expect(open).toHaveBeenCalledWith("/api/files/content?x=1", "_blank");
	});

	test("assigns the signed url to a setter", async () => {
		apiRequest.mockResolvedValue({ signed: { "/uploads/chat/b.png": { url: "/api/files/content?y=2" } } });
		const setter = jest.fn();
		expect(await signAndAssign("/uploads/chat/b.png", setter)).toBe(true);
		expect(setter).toHaveBeenCalledWith("/api/files/content?y=2");
	});
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:unit -- tests/unit/frontend-signed-file.test.js`
Expected: FAIL — `Cannot find module '../../src/lib/signedFile.js'`

- [ ] **Step 3: Write the helper**

Create `src/lib/signedFile.js`:

```javascript
import { apiRequest, getToken } from "./auth.js";

export async function signPaths(paths) {
	const list = (paths || []).filter(Boolean).slice(0, 50);
	if (list.length === 0) return {};
	try {
		const data = await apiRequest("/files/sign", {
			method: "POST",
			token: getToken(),
			body: { paths: list },
		});
		return data?.signed || {};
	} catch {
		return {};
	}
}

export async function signAndOpen(path) {
	if (!path) return false;
	const result = await signPaths([path]);
	const url = result[path]?.url;
	if (!url) return false;
	window.open(url, "_blank");
	return true;
}

export async function signAndAssign(path, setter) {
	if (!path || typeof setter !== "function") return false;
	const result = await signPaths([path]);
	const url = result[path]?.url;
	if (!url) return false;
	setter(url);
	return true;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:unit -- tests/unit/frontend-signed-file.test.js`
Expected: PASS — 6 tests.

- [ ] **Step 5: Switch ContractVault to the signed url**

Add to the existing `../lib/auth.js` import on line 30:

```javascript
import { signAndOpen } from "../lib/signedFile.js";
```

Replace `handleDownloadPdf` (lines 662-667) with the block above. It reuses the file's existing `logger.warn` + `setFeedback` error pattern (lines 426-428); do not introduce a toast dependency.

```javascript
	const handleDownloadPdf = async () => {
		const pdfPath = contract?.raw?.artifact?.pdf_path;
		if (!pdfPath) return;
		const ok = await signAndOpen(pdfPath);
		if (!ok) {
			logger.warn("Failed to open contract pdf", { pdfPath });
			setFeedback("Could not open the contract PDF.");
		}
	};
```

The handler reuses the file's existing `logger.warn` + `setFeedback` error pattern (lines 426-428); do not introduce a toast dependency.

- [ ] **Step 6: Switch the chat components**

In `src/components/chat/FileAttachmentCard.jsx` and `src/components/chat/AttachmentPreviewModal.jsx`, replace any direct `attachment.url` used as an `href`, `src`, or `window.open` target with `signAndOpen(attachment.url)` for downloads and `signAndAssign(attachment.url, setSignedSrc)` for rendered `src` values. Introduce a local `signedSrc` state initialised to `""` and render `signedSrc || null` so an unsigned URL is never placed in the DOM.

- [ ] **Step 7: Commit**

```bash
git add src/lib/signedFile.js tests/unit/frontend-signed-file.test.js src/pages/ContractVault.jsx src/components/chat/FileAttachmentCard.jsx src/components/chat/AttachmentPreviewModal.jsx
git commit -m "feat(uploads): sign private file urls on the client

ContractVault and both chat attachment surfaces now mint a signed URL
before navigating or rendering, so no unsigned private path reaches the
DOM. Failures degrade to the existing toast rather than throwing."
```

---

### Task 6: Stop emailService reporting false success

Four branches return `{ ok: true }` after writing only a database row: `logged_disabled`, `logged_no_smtp`, `logged_no_gmail`, `logged_unsupported`.

**Files:**
- Modify: `server/services/emailService.js:104-129`
- Create: `tests/unit/server-email-delivery.test.js`

**Interfaces:**
- Consumes: nothing
- Produces: `sendEmail(...)` returns `{ ok: false, status: <log-only status> }` on every log-only branch

- [ ] **Step 1: Write the failing test**

Create `tests/unit/server-email-delivery.test.js`:

```javascript
import { jest } from "@jest/globals";

const logEmailToDb = jest.fn(async () => {});
const logInfo = jest.fn();
const logWarn = jest.fn();

jest.unstable_mockModule("../../server/utils/logger.js", async (orig) => {
	const actual = await orig();
	return { ...actual, logInfo, logWarn, logError: jest.fn() };
});

const { sendEmail } = await import("../../server/services/emailService.js");

beforeEach(() => {
	logEmailToDb.mockClear();
	logInfo.mockClear();
	logWarn.mockClear();
});

describe("emailService delivery status", () => {
	test("does not report success when email is disabled", async () => {
		const res = await sendEmail({
			to: ["a@b.co"],
			subject: "s",
			text: "t",
			config: { enabled: false },
		});
		expect(res).toEqual({ ok: false, status: "logged_disabled" });
	});

	test("does not report success when smtp is unconfigured", async () => {
		const res = await sendEmail({
			to: ["a@b.co"],
			subject: "s",
			text: "t",
			config: { enabled: true, provider: "smtp" },
		});
		expect(res.ok).toBe(false);
		expect(res.status).toMatch(/^logged_no_/);
	});

	test("does not report success for an unsupported provider", async () => {
		const res = await sendEmail({
			to: ["a@b.co"],
			subject: "s",
			text: "t",
			config: { enabled: true, provider: "carrier-pigeon" },
		});
		expect(res).toEqual({ ok: false, status: "logged_unsupported" });
	});

	test("still refuses to send with no recipients", async () => {
		const res = await sendEmail({ to: [], subject: "s", text: "t" });
		expect(res).toEqual({ ok: false, status: "no_recipients" });
	});
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:unit -- tests/unit/server-email-delivery.test.js`
Expected: FAIL — the log-only branches currently return `ok: true`.

- [ ] **Step 3: Inspect the current signature**

Run: `grep -n "export async function sendEmail" -A 12 server/services/emailService.js`

Note the real parameter name for the resolved config. The test above assumes `config`; if the function resolves config internally, drop the `config` key from the test call and instead mock the config lookup. Do not change the production signature.

- [ ] **Step 4: Flip all four branches**

Inside `sendEmail`, change each of these four returns from `ok: true` to `ok: false`, and change the paired `logInfo` to `logWarn`:

```javascript
	return { ok: false, status: "logged_disabled" };
	return { ok: false, status: "logged_no_smtp" };
	return { ok: false, status: "logged_no_gmail" };
	return { ok: false, status: "logged_unsupported" };
```

Leave `no_recipients` unchanged (already `ok: false`), and leave the real send path untouched.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test:unit -- tests/unit/server-email-delivery.test.js`
Expected: PASS — 4 tests.

- [ ] **Step 6: Audit existing callers for `ok` truthiness**

```bash
grep -rn "sendEmail" server/ --include=*.js | grep -v "emailService.js"
```

For each call site, confirm that treating a log-only result as failure does not produce a user-visible error toast for a routine notification. Where it would, pass an explicit `{ optional: true }`-style flag only if such a flag already exists — otherwise invert the check to `if (res.status?.startsWith("sent"))`. Do not introduce a new flag.

- [ ] **Step 7: Run the whole suite and commit**

```bash
npm test
git add server/services/emailService.js tests/unit/server-email-delivery.test.js
git commit -m "fix(email): report log-only delivery as a failure

Four branches wrote a DB row and returned ok:true, so callers believed
a message was delivered when nothing left the process. They now return
ok:false and log at warn."
```

---

### Task 7: Record the change in AGENTS.md

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Append the fix entry**

Add a numbered entry at the top of the Problems & Fixes list:

```markdown
## 22. Private uploads were world-readable (Owner)

- **Problem:** `server/server.js` mounted all of `server/uploads/` via `express.static` with no auth. 208 contract PDFs and all chat attachments were fetchable by anyone holding the URL. Filenames are millisecond timestamps and never expire.
- **Root cause:** One blanket static mount served public and private trees together. `chatUploadsRoot` was created and never used; `uploadsRoutes.js` only manages files, it never served them. `DocumentView` modelled access but the static mount bypassed it, so no real audit trail existed.
- **Fix:** Private prefixes (`chat/`, `contracts/`, `calls/`, `search/`) are gated behind short-lived HMAC URLs minted by `POST /api/files/sign` and authorized through `Document.entity_type` (`server/services/fileAccessService.js`). The static mount now 404s gated prefixes. `feed/`, `profile/`, and root CMS assets stay public because `/share/:entityType/:entityId` renders them.
- **Gotchas:** Auth is Bearer-in-localStorage, so `requireAuth` on a file route breaks `window.open` — signed URLs are required, not optional. The HMAC input is the `path.resolve`d absolute path plus user id plus expiry; signing the raw query parameter lets `?file=../../.env` sign cleanly. `UPLOADS_SIGNING_SECRET` must fail closed when unset. Back-filled orphans have `uploaded_by: "system"` and are intentionally admin-only until claimed.
```

- [ ] **Step 2: Commit**

```bash
git add AGENTS.md
git commit -m "docs(agents): record upload access control fix"
```

---

## Verification

Run after the final task:

```bash
npm test
npm run build
```

Expected: 207 existing tests plus the new suites all pass; build succeeds.

Manual checks against a running server:

1. `curl -s -o /dev/null -w '%{http_code}' http://localhost:4000/uploads/contracts/<known-file>` — expect **404**.
2. `curl -s -o /dev/null -w '%{http_code}' http://localhost:4000/uploads/feed/<known-file>` — expect **200** (regression guard).
3. Sign a contract as its buyer and open it in ContractVault — expect the PDF to render.
4. Request the same signed URL with `uid` swapped — expect **403**.
5. Confirm a `DocumentView` row appears with `viewer_id` after step 3.
6. `curl -s -o /dev/null -w '%{http_code}' 'http://localhost:4000/api/files/content?path=/uploads/contracts/<f>&exp=1&uid=u1&sig=deadbeef'` — expect **403**.

## Rollout

Single PR, no schema change, no migration, no backfill job. Old unsigned URLs for gated prefixes stop working on deploy, which is intended: those URLs were the vulnerability.