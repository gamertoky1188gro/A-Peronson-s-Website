import requirementRoutes from "../../server/routes/requirementRoutes.js";
import {
  createRequirement,
  updateRequirement,
} from "../../server/services/requirementService.js";
import { writeJson } from "../../server/utils/jsonStore.js";

function routeEntries(router) {
  return router.stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      path: layer.route.path,
      methods: Object.keys(layer.route.methods),
    }));
}

describe("requirement routes and service validation/moderation", () => {
  test("requirementRoutes exposes create and patch endpoints", () => {
    const entries = routeEntries(requirementRoutes);
    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "/",
          methods: expect.arrayContaining(["post"]),
        }),
        expect.objectContaining({
          path: "/:requirementId",
          methods: expect.arrayContaining(["patch"]),
        }),
      ]),
    );
  });

  test("createRequirement enforces validation for non-draft payload", async () => {
    process.env.NODE_ENV = "test";

    await expect(
      createRequirement("buyer-validation", {
        request_type: "garments",
        status: "open",
      }),
    ).rejects.toMatchObject({ status: 400 });
  });

  test("createRequirement moderates outside-contact text", async () => {
    process.env.NODE_ENV = "test";
    const buyerId = `buyer-${Date.now()}`;

    await writeJson("users.json", [
      {
        id: buyerId,
        name: "Buyer",
        email: "buyer@example.com",
        role: "buyer",
        status: "active",
        verified: true,
      },
    ]);

    const created = await createRequirement(buyerId, {
      title: "Need t-shirts",
      request_type: "garments",
      product: "T-Shirt",
      category: "Knit",
      quantity: "1000",
      delivery_timeline: "30 days",
      gender_target: "men",
      season: "summer",
      target_fob_price: "3.50",
      incoterm: "FOB",
      ex_factory_date: new Date(
        Date.now() + 20 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      payment_terms: "LC at sight",
      status: "open",
      custom_description: "contact me on whatsapp +880123456789",
    });

    expect(created.moderated).toBe(true);
    expect(String(created.custom_description)).toMatch(
      /Removed: outside contact/i,
    );
  });

  test("updateRequirement blocks buyer from changing assignee", async () => {
    process.env.NODE_ENV = "test";
    const buyerId = `buyer-assign-${Date.now()}`;

    await writeJson("users.json", [
      {
        id: buyerId,
        name: "Buyer 2",
        email: "buyer2@example.com",
        role: "buyer",
        status: "active",
        verified: true,
      },
    ]);

    const row = await createRequirement(buyerId, {
      title: "Need denim",
      request_type: "garments",
      product: "Jeans",
      category: "Denim",
      quantity: "500",
      delivery_timeline: "45 days",
      gender_target: "men",
      season: "winter",
      target_fob_price: "7.00",
      incoterm: "FOB",
      ex_factory_date: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      payment_terms: "TT 30/70",
      status: "open",
    });

    const result = await updateRequirement(
      row.id,
      { assigned_agent_id: "agent-x" },
      { id: buyerId, role: "buyer" },
    );
    expect(result).toBe("forbidden");
  });
});
