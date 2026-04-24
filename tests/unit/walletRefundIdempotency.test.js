import walletRoutes from "../../server/routes/walletRoutes.js";
import {
  creditWallet,
  debitWallet,
  redeemCouponForUser,
} from "../../server/services/walletService.js";
import { recordRefund } from "../../server/services/refundService.js";
import { readLocalJson } from "../../server/utils/localStore.js";
import { writeJson } from "../../server/utils/jsonStore.js";

function routeEntries(router) {
  return router.stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      path: layer.route.path,
      methods: Object.keys(layer.route.methods),
    }));
}

describe("wallet routes and wallet/refund service behavior", () => {
  test("walletRoutes exposes me/history/redeem endpoints", () => {
    const entries = routeEntries(walletRoutes);
    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "/me",
          methods: expect.arrayContaining(["get"]),
        }),
        expect.objectContaining({
          path: "/me/history",
          methods: expect.arrayContaining(["get"]),
        }),
        expect.objectContaining({
          path: "/redeem",
          methods: expect.arrayContaining(["post"]),
        }),
      ]),
    );
  });

  test("wallet charge and debit update balances", async () => {
    process.env.NODE_ENV = "test";
    const userId = `wallet-${Date.now()}`;

    await writeJson("users.json", [
      {
        id: userId,
        email: "wallet@example.com",
        role: "buyer",
        wallet_balance_usd: 0,
        wallet_restricted_usd: 0,
        status: "active",
      },
    ]);
    await writeJson("wallet_history.json", []);

    const credited = await creditWallet({
      userId,
      amountUsd: 10,
      reason: "topup",
    });
    expect(credited.wallet.balance_usd).toBe(10);

    const debited = await debitWallet({
      userId,
      amountUsd: 3,
      reason: "charge",
      allowRestricted: false,
    });
    expect(debited.wallet.balance_usd).toBe(7);
  });

  test("coupon redemption is idempotent per user/code pair", async () => {
    process.env.NODE_ENV = "test";
    const userId = `coupon-${Date.now()}`;

    await writeJson("users.json", [
      {
        id: userId,
        email: "coupon@example.com",
        role: "buyer",
        wallet_balance_usd: 0,
        wallet_restricted_usd: 0,
        status: "active",
        profile: {},
      },
    ]);
    await writeJson("wallet_history.json", []);
    await writeJson("coupon_redemptions.json", []);
    await writeJson("coupon_codes.json", [
      {
        id: "coupon-id-1",
        code: "WELCOME5",
        amount_usd: 5,
        active: true,
        max_redemptions: 100,
        created_at: new Date().toISOString(),
      },
    ]);

    const first = await redeemCouponForUser({ userId, code: "WELCOME5" });
    expect(first.wallet.restricted_balance_usd).toBe(5);

    await expect(
      redeemCouponForUser({ userId, code: "WELCOME5" }),
    ).rejects.toMatchObject({ status: 409 });
  });

  test("recordRefund stores refund audit entry", async () => {
    process.env.NODE_ENV = "test";
    const userId = `refund-${Date.now()}`;
    const entry = await recordRefund({
      userId,
      amountUsd: 4.5,
      reason: "manual_refund",
      ref: "ref-1",
      actorId: "admin-1",
    });
    const rows = await readLocalJson("refund_log.json", []);
    expect(
      rows.some((row) => row.id === entry.id && row.user_id === userId),
    ).toBe(true);
  });
});
