import { jest } from "@jest/globals";

/**
 * Regression test for a real defect found during the suite rebuild:
 * upsertVerification called `getRequiredFields(...)`, which was never
 * imported or defined — every verification submission crashed with
 * `ReferenceError: getRequiredFields is not defined`. Fixed by calling the
 * existing `getVerificationRequirements(role, buyerRegion)` helper.
 */
describe("verification upsert regression (server/services/verificationService.js)", () => {
	let verification;
	let prisma;

	beforeEach(async () => {
		jest.resetModules();
		prisma = (await import("../../server/utils/prisma.js")).default;
		// Empty platform: no existing verification, no duplicate candidates.
		prisma.verification.findUnique = async () => null;
		prisma.user.findMany = async () => [];
		prisma.verification.findMany = async () => [];
		prisma.verification.upsert = async (args) => ({ ...args.create, ...args.update });
		verification = await import("../../server/services/verificationService.js");
	});

	test("upsertVerification no longer throws ReferenceError", async () => {
		const user = { id: "factory-9", role: "factory", name: "Test Factory", profile: {} };
		let error = null;
		const record = await verification
			.upsertVerification(user, { company_registration: "REG-123", bank_proof: "BANK-9" })
			.catch((e) => {
				error = e;
				return null;
			});
		expect(error).toBeNull();
		expect(record).toMatchObject({ user_id: "factory-9", role: "factory" });
		expect(Array.isArray(record.missing_required)).toBe(true);
		expect(record.credibility.score).toBeGreaterThan(0);
	});

	test("upsertVerification marks incomplete submissions for factory roles", async () => {
		const user = { id: "factory-10", role: "factory", name: "Sparse Factory", profile: {} };
		const record = await verification.upsertVerification(user, {
			company_registration: "ONLY-ONE",
		});
		expect(record.missing_required.length).toBeGreaterThan(0);
		expect(record.review_status).toBe("incomplete");
		expect(record.verified).toBe(false);
	});

	test("upsertVerification rejects EU buyers without an EU country", async () => {
		const user = { id: "buyer-eu", role: "buyer", name: "EU Buyer", profile: {} };
		await expect(
			verification.upsertVerification(user, { buyer_region: "EU", buyer_country: "United States" }),
		).rejects.toThrow();
	});
});
