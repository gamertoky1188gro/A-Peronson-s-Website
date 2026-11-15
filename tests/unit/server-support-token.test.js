import crypto from "node:crypto";
import { jest } from "@jest/globals";

const sha256 = (s) => crypto.createHash("sha256").update(String(s)).digest("hex");
const stores = { tokens: new Map(), users: new Map() };
let tokenSeq = 0;

jest.unstable_mockModule("../../server/utils/prisma.js", () => ({
	default: {
		supportAccessToken: {
			create: jest.fn(async ({ data }) => {
				const row = {
					id: `tok_${++tokenSeq}`,
					created_at: new Date(),
					revoked_at: null,
					last_used_at: null,
					...data,
				};
				stores.tokens.set(row.token_hash, row);
				return row;
			}),
			findUnique: jest.fn(async ({ where }) =>
				where.token_hash
					? (stores.tokens.get(where.token_hash) ?? null)
					: ([...stores.tokens.values()].find((row) => row.id === where.id) ?? null),
			),
			findMany: jest.fn(async () =>
				[...stores.tokens.values()].sort((a, b) => b.created_at - a.created_at),
			),
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
	stores.users.set("buyer-1", {
		id: "buyer-1",
		role: "buyer",
		email: "b@example.com",
		name: "Buyer One",
		status: "active",
	});
});

describe("supportTokenService", () => {
	it("issue → validate round-trip returns the buyer", async () => {
		const { token } = await svc.issueToken({
			buyerId: "buyer-1",
			label: "onboarding",
			expiresAt: null,
			createdBy: "owner-1",
		});
		expect(token.startsWith("gtk_sup_")).toBe(true);
		const result = await svc.validateToken(token);
		expect(result.ok).toBe(true);
		expect(result.buyer.id).toBe("buyer-1");
		expect(result.label).toBe("onboarding");
	});

	it("unknown token is rejected", async () => {
		expect((await svc.validateToken("gtk_sup_nope")).reason).toBe("invalid");
	});

	it("expired token is rejected with the expired reason", async () => {
		const { token } = await svc.issueToken({
			buyerId: "buyer-1",
			label: "e",
			expiresAt: new Date(Date.now() - 1000),
			createdBy: "owner-1",
		});
		expect((await svc.validateToken(token)).reason).toBe("expired");
	});

	it("revoked token is rejected with the revoked reason", async () => {
		const { token, id } = await svc.issueToken({
			buyerId: "buyer-1",
			label: "e",
			expiresAt: null,
			createdBy: "owner-1",
		});
		await svc.revokeToken(id);
		expect((await svc.validateToken(token)).reason).toBe("revoked");
	});

	it("creating a token for a missing buyer fails", async () => {
		await expect(
			svc.issueToken({ buyerId: "ghost", label: "e", expiresAt: null, createdBy: "owner-1" }),
		).rejects.toMatchObject({ status: 404 });
	});

	it("issuing a token for a non-buyer role rejects and creates no row", async () => {
		stores.users.set("owner-9", {
			id: "owner-9",
			role: "owner",
			email: "o@example.com",
			name: "Owner Nine",
			status: "active",
		});
		await expect(
			svc.issueToken({ buyerId: "owner-9", label: "e", expiresAt: null, createdBy: "owner-1" }),
		).rejects.toMatchObject({ status: 400 });
		expect(stores.tokens.size).toBe(0);
	});

	it("a buyer whose role flips to owner fails validation", async () => {
		const { token } = await svc.issueToken({
			buyerId: "buyer-1",
			label: "e",
			expiresAt: null,
			createdBy: "owner-1",
		});
		stores.users.get("buyer-1").role = "owner";
		expect((await svc.validateToken(token)).reason).toBe("invalid");
	});

	it("a buyer whose access is later locked fails validation", async () => {
		const { token } = await svc.issueToken({
			buyerId: "buyer-1",
			label: "e",
			expiresAt: null,
			createdBy: "owner-1",
		});
		stores.users.get("buyer-1").status = "locked";
		expect((await svc.validateToken(token)).reason).toBe("invalid");
	});
});
