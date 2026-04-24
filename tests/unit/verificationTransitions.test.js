import verificationRoutes from "../../server/routes/verificationRoutes.js";
import {
  adminApproveVerification,
  adminRejectVerification,
  setVerificationSubscription,
  upsertVerification,
} from "../../server/services/verificationService.js";

function routeEntries(router) {
  return router.stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      path: layer.route.path,
      methods: Object.keys(layer.route.methods),
    }));
}

describe("verification routes and transition lifecycle", () => {
  test("verificationRoutes exposes submit and admin review endpoints", () => {
    const entries = routeEntries(verificationRoutes);
    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "/me",
          methods: expect.arrayContaining(["post"]),
        }),
        expect.objectContaining({
          path: "/admin/:userId/approve",
          methods: expect.arrayContaining(["post"]),
        }),
        expect.objectContaining({
          path: "/admin/:userId/reject",
          methods: expect.arrayContaining(["post"]),
        }),
      ]),
    );
  });

  test("submit with missing docs stays incomplete", async () => {
    process.env.NODE_ENV = "test";
    const user = { id: `verify-${Date.now()}`, role: "factory", profile: {} };

    const rec = await upsertVerification(user, {
      company_registration: "doc://company",
    });

    expect(rec.verified).toBe(false);
    expect(rec.review_status).toBe("incomplete");
    expect(Array.isArray(rec.missing_required)).toBe(true);
    expect(rec.missing_required.length).toBeGreaterThan(0);
  });

  test("approve/reject transitions are stable", async () => {
    process.env.NODE_ENV = "test";
    const userId = `verify-approve-${Date.now()}`;
    const user = { id: userId, role: "factory", profile: {} };

    await upsertVerification(user, {
      company_registration: "doc://company",
      trade_license: "doc://trade",
      tin: "TIN-123",
      authorized_person_nid: "NID-123",
      bank_proof: "doc://bank",
      erc: "ERC-123",
    });
    await setVerificationSubscription(
      userId,
      new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    );

    const approved = await adminApproveVerification(userId);
    expect(approved.verified).toBe(true);
    expect(approved.review_status).toBe("approved");

    const rejected = await adminRejectVerification(userId, "document_mismatch");
    expect(rejected.verified).toBe(false);
    expect(rejected.review_status).toBe("rejected");
    expect(rejected.review_reason).toBe("document_mismatch");
  });
});
