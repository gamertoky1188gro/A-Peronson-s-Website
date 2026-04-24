import { jest } from "@jest/globals";
import searchRoutes from "../../server/routes/searchRoutes.js";
import validateFiltersMiddleware from "../../server/middleware/validateSearchFilters.js";
import { createSearchAlert } from "../../server/controllers/notificationController.js";

function routeEntries(router) {
  return router.stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      path: layer.route.path,
      methods: Object.keys(layer.route.methods),
    }));
}

function createMockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe("search route + filter validation malformed payload handling", () => {
  test("searchRoutes exposes alerts endpoint", () => {
    const entries = routeEntries(searchRoutes);
    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "/alerts",
          methods: expect.arrayContaining(["post"]),
        }),
      ]),
    );
  });

  test("validateSearchFilters rejects malformed numeric type", async () => {
    const req = { query: { gsmMin: "not-a-number", verifiedOnly: "true" } };
    const res = createMockRes();
    const next = jest.fn();

    await validateFiltersMiddleware(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body?.error).toBe("Invalid search filter types");
    expect(Array.isArray(res.body?.details)).toBe(true);
    expect(next).not.toHaveBeenCalled();
  });

  test("createSearchAlert rejects empty query payload", async () => {
    process.env.NODE_ENV = "test";
    const req = {
      user: { id: `search-user-${Date.now()}` },
      body: { query: "   ", filters: { category: ["denim"] } },
    };
    const res = createMockRes();

    await createSearchAlert(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Query is required" });
  });
});
