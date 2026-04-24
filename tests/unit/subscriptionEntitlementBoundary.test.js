import subscriptionRoutes from "../../server/routes/subscriptionRoutes.js";
import { upsertSubscription } from "../../server/services/subscriptionService.js";
import {
  ensureEntitlement,
  getEntitlements,
} from "../../server/services/entitlementService.js";

function routeEntries(router) {
  return router.stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      path: layer.route.path,
      methods: Object.keys(layer.route.methods),
    }));
}

describe("subscription routes and entitlement boundaries", () => {
  test("subscriptionRoutes exposes self-service and admin endpoints", () => {
    const entries = routeEntries(subscriptionRoutes);
    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "/me",
          methods: expect.arrayContaining(["get"]),
        }),
        expect.objectContaining({
          path: "/me",
          methods: expect.arrayContaining(["post"]),
        }),
        expect.objectContaining({
          path: "/admin/:userId",
          methods: expect.arrayContaining(["post"]),
        }),
      ]),
    );
  });

  test("free plan user fails premium entitlement check", async () => {
    process.env.NODE_ENV = "test";
    const user = {
      id: `sub-free-${Date.now()}`,
      role: "factory",
      subscription_status: "free",
    };
    await upsertSubscription(user.id, "free", true);

    await expect(
      ensureEntitlement(user, "advanced_analytics"),
    ).rejects.toMatchObject({
      status: 403,
      code: "PREMIUM_REQUIRED",
      feature: "advanced_analytics",
    });
  });

  test("premium plan enables premium features", async () => {
    process.env.NODE_ENV = "test";
    const user = {
      id: `sub-premium-${Date.now()}`,
      role: "factory",
      subscription_status: "free",
    };
    await upsertSubscription(user.id, "premium", true);

    const entitlements = await getEntitlements(user);
    expect(entitlements.premium).toBe(true);
    expect(entitlements.plan).toBe("premium");
    expect(entitlements.features.advanced_analytics).toBe(true);
  });
});
