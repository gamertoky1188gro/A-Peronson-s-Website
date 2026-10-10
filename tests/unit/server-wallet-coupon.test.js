import { jest } from "@jest/globals";

const txMocks = {
	user: { update: jest.fn() },
	walletHistory: { create: jest.fn() },
	couponRedemption: { create: jest.fn() },
};

const mockPrisma = {
	user: { findUnique: jest.fn() },
	walletHistory: { findMany: jest.fn(), create: jest.fn() },
	couponCode: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn() },
	couponRedemption: { count: jest.fn(), findFirst: jest.fn(), create: jest.fn() },
	$transaction: jest.fn((fn) => fn(txMocks)),
};

async function loadWallet() {
	jest.resetModules();
	for (const mock of [
		mockPrisma.user.findUnique,
		mockPrisma.walletHistory.findMany,
		mockPrisma.couponCode.findUnique,
		mockPrisma.couponRedemption.count,
		mockPrisma.couponRedemption.findFirst,
	]) {
		mock.mockReset();
	}
	mockPrisma.walletHistory.findMany.mockResolvedValue([]);
	mockPrisma.couponRedemption.count.mockResolvedValue(0);
	mockPrisma.couponRedemption.findFirst.mockResolvedValue(null);
	txMocks.user.update.mockReset().mockResolvedValue({});
	txMocks.walletHistory.create.mockReset();
	txMocks.couponRedemption.create.mockReset();
	jest.unstable_mockModule("../../server/utils/prisma.js", () => ({
		default: mockPrisma,
	}));
	const walletModule = await import("../../server/services/walletService.js");
	return walletModule;
}

describe("wallet balances (server/services/walletService.js)", () => {
	let wallet;

	beforeEach(async () => {
		wallet = await loadWallet();
	});

	test("getWallet returns null for unknown users and rounded balances otherwise", async () => {
		mockPrisma.user.findUnique.mockResolvedValue(null);
		await expect(wallet.getWallet("ghost")).resolves.toBeNull();

		mockPrisma.user.findUnique.mockResolvedValue({
			id: "u-1",
			wallet_balance_usd: 10.555,
			wallet_restricted_usd: 2.344,
		});
		expect(await wallet.getWallet("u-1")).toEqual({
			user_id: "u-1",
			balance_usd: 10.56,
			restricted_balance_usd: 2.34,
		});
	});

	test("creditWallet rejects invalid amounts before touching the DB", async () => {
		await expect(wallet.creditWallet({ userId: "u-1", amountUsd: 0 })).rejects.toMatchObject({
			status: 400,
		});
		await expect(wallet.creditWallet({ userId: "u-1", amountUsd: -5 })).rejects.toMatchObject({
			status: 400,
		});
		await expect(wallet.creditWallet({ userId: "u-1", amountUsd: "abc" })).rejects.toMatchObject({
			status: 400,
		});
		expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
	});

	test("creditWallet reports missing users with 404", async () => {
		mockPrisma.user.findUnique.mockResolvedValue(null);
		await expect(wallet.creditWallet({ userId: "ghost", amountUsd: 10 })).rejects.toMatchObject({
			status: 404,
		});
	});

	test("creditWallet credits the balance and records history in one transaction", async () => {
		mockPrisma.user.findUnique.mockResolvedValue({
			id: "u-1",
			wallet_balance_usd: 5,
			wallet_restricted_usd: 0,
		});
		txMocks.walletHistory.create.mockResolvedValue({ id: "h-1" });
		const out = await wallet.creditWallet({
			userId: "u-1",
			amountUsd: 10,
			reason: "promo",
			ref: "P1",
		});
		expect(out.wallet.balance_usd).toBe(15);
		expect(out.entry).toEqual({ id: "h-1" });
		expect(mockPrisma.$transaction).toHaveBeenCalled();
	});

	test("debitWallet enforces sufficient funds with WALLET_INSUFFICIENT", async () => {
		mockPrisma.user.findUnique.mockResolvedValue({
			id: "u-1",
			wallet_balance_usd: 5,
			wallet_restricted_usd: 0,
		});
		const err = await wallet.debitWallet({ userId: "u-1", amountUsd: 50 }).catch((e) => e);
		expect(err).toMatchObject({ status: 402, code: "WALLET_INSUFFICIENT" });
	});

	test("listWalletHistory clamps the limit window", async () => {
		await wallet.listWalletHistory("u-1", 500);
		expect(mockPrisma.walletHistory.findMany.mock.calls[0][0].take).toBe(200);
		await wallet.listWalletHistory("u-1", 0);
		expect(mockPrisma.walletHistory.findMany.mock.calls.at(-1)[0].take).toBe(50);
	});
});

describe("coupon codes (server/services/walletService.js)", () => {
	let wallet;

	beforeEach(async () => {
		wallet = await loadWallet();
	});

	test("assertCouponRedeemable validates code, activity, and prior redemption", async () => {
		await expect(wallet.assertCouponRedeemable("")).rejects.toMatchObject({ status: 400 });

		mockPrisma.couponCode.findUnique.mockResolvedValue(null);
		await expect(wallet.assertCouponRedeemable("NOPE", "u-1")).rejects.toMatchObject({
			status: 404,
		});

		mockPrisma.couponCode.findUnique.mockResolvedValue({
			id: "c-1",
			code: "SAVE10",
			active: false,
		});
		await expect(wallet.assertCouponRedeemable("save10", "u-1")).rejects.toMatchObject({
			status: 404,
		});

		const future = new Date(Date.now() + 86_400_000);
		mockPrisma.couponCode.findUnique.mockResolvedValue({
			id: "c-2",
			code: "SAVE10",
			active: true,
			expires_at: future,
			max_redemptions: null,
		});
		mockPrisma.couponRedemption.findFirst.mockResolvedValue({ id: "already" });
		await expect(wallet.assertCouponRedeemable("save10", "u-1")).rejects.toMatchObject({
			status: 409,
		});

		mockPrisma.couponRedemption.findFirst.mockResolvedValue(null);
		await expect(wallet.assertCouponRedeemable("save10", "u-1")).resolves.toMatchObject({
			code: "SAVE10",
		});
	});

	test("createCouponCode rejects blank codes/amounts and duplicates", async () => {
		await expect(wallet.createCouponCode({})).rejects.toMatchObject({ status: 400 });
		mockPrisma.couponCode.findUnique.mockResolvedValue({ id: "dup" });
		await expect(wallet.createCouponCode({ code: "DUP", amount_usd: 5 })).rejects.toMatchObject({
			status: 409,
		});
	});
});
