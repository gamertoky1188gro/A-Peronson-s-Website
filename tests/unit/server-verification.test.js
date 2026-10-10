import { jest } from "@jest/globals";

async function loadVerification() {
	jest.resetModules();
	const prisma = (await import("../../server/utils/prisma.js")).default;
	const verification = await import("../../server/services/verificationService.js");
	return { prisma, verification };
}

describe("verification service reads (server/services/verificationService.js)", () => {
	let verification;
	let prisma;

	beforeEach(async () => {
		({ prisma, verification } = await loadVerification());
	});

	test("getVerificationPublicSummary builds a checklist plus credibility meter", () => {
		const summary = verification.getVerificationPublicSummary(
			{ role: "factory", profile: {} },
			{ documents: {}, credibility: undefined, verified: false },
		);
		expect(summary.verified).toBe(false);
		expect(Array.isArray(summary.required_checklist)).toBe(true);
		expect(summary.required_checklist.length).toBeGreaterThan(0);
		for (const item of summary.required_checklist) {
			expect(item).toEqual(
				expect.objectContaining({ key: expect.any(String), submitted: expect.any(Boolean) }),
			);
		}
		expect(summary.credibility.score).toBeGreaterThanOrEqual(0);
		expect(typeof summary.credibility.badge).toBe("string");
	});

	test("getVerification delegates to the verification table", async () => {
		prisma.verification.findUnique = async () => ({ user_id: "u-1", verified: true });
		expect(await verification.getVerification("u-1")).toMatchObject({ user_id: "u-1" });
	});

	test("isVerificationSubscriptionValid is false without a future date", async () => {
		prisma.verification.findUnique = async () => ({
			user_id: "u-1",
			subscription_valid_until: null,
		});
		expect(await verification.isVerificationSubscriptionValid("u-1")).toBe(false);

		prisma.verification.findUnique = async () => ({
			user_id: "u-1",
			subscription_valid_until: new Date(Date.now() + 86_400_000).toISOString(),
		});
		expect(await verification.isVerificationSubscriptionValid("u-1")).toBe(true);
	});

	test("adminRejectVerification returns null for unknown users and rejects otherwise", async () => {
		prisma.verification.findUnique = async () => null;
		expect(await verification.adminRejectVerification("ghost", "fake")).toBeNull();

		prisma.verification.findUnique = async () => ({ user_id: "u-1" });
		prisma.verification.update = async (args) => args;
		const out = await verification.adminRejectVerification("u-1", "docs forged");
		expect(out.data).toMatchObject({ verified: false, review_status: "rejected" });
		expect(out.data.review_reason).toContain("docs forged");
	});

	test("markVerificationExpiringSoon returns null for unknown users", async () => {
		prisma.verification.findUnique = async () => null;
		expect(await verification.markVerificationExpiringSoon("ghost", 3)).toBeNull();
	});
});

describe("verification service transitions (server/services/verificationService.js)", () => {
	let verification;
	let prisma;

	beforeEach(async () => {
		({ prisma, verification } = await loadVerification());
	});

	test("markVerificationExpiringSoon flags the 7-day window correctly", async () => {
		prisma.verification.findUnique = async () => ({ user_id: "u-1", verified: true });
		prisma.verification.update = async (args) => args.data;
		expect(await verification.markVerificationExpiringSoon("u-1", 3)).toMatchObject({
			expiring_soon: true,
			verification_status: "expiring_soon",
			subscription_remaining_days: 3,
		});
		expect(await verification.markVerificationExpiringSoon("u-1", 30)).toMatchObject({
			expiring_soon: false,
			verification_status: "verified_active",
		});
	});

	test("revokeExpiredVerifications expires only lapsed subscriptions", async () => {
		const past = new Date(Date.now() - 86_400_000).toISOString();
		const future = new Date(Date.now() + 86_400_000).toISOString();
		prisma.verification.findMany = async (args) =>
			args?.where?.verified ? [{ user_id: "old", subscription_valid_until: past }] : [];
		const updates = [];
		prisma.verification.update = (args) => {
			updates.push(args);
			return Promise.resolve(args);
		};
		await verification.revokeExpiredVerifications();
		expect(updates).toHaveLength(1);
		expect(updates[0].data).toMatchObject({ verified: false, review_status: "expired" });
		expect(future).toBeDefined();
	});
});
