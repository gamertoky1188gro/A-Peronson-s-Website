import { renderHook, waitFor } from "@testing-library/react";
import { jest } from "@jest/globals";

let dashboardError = null;
const mockApiRequest = jest.fn(async (path) => {
  if (dashboardError && path === "/analytics/dashboard") {
    const err = new Error(dashboardError.message);
    err.status = dashboardError.status;
    throw err;
  }
  if (path === "/analytics/dashboard") return { ok: true };
  if (path === "/subscriptions/me") return { plan: "premium" };
  if (path === "/analytics/company") return { items: [] };
  if (path === "/analytics/platform/admin") return { total: 1 };
  if (path === "/analytics/premium") return { upsell: true };
  return {};
});

jest.unstable_mockModule("../../src/lib/auth.js", () => ({
  apiRequest: (...args) => mockApiRequest(...args),
  getCurrentUser: () => ({ id: "u1", role: "owner" }),
  getToken: () => "token",
}));

let useAnalyticsDashboard;

async function setupHook({ hookDashboardError = null } = {}) {
  dashboardError = hookDashboardError;
  if (!useAnalyticsDashboard) {
    useAnalyticsDashboard = (
      await import("../../src/hooks/useAnalyticsDashboard.js")
    ).default;
  }
  return renderHook(() => useAnalyticsDashboard()).result;
}

describe("useAnalyticsDashboard (RTL)", () => {
  beforeEach(() => {
    dashboardError = null;
    mockApiRequest.mockClear();
  });

  test("loads data and marks enterprise plan", async () => {
    const result = await setupHook();
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.dashboard).toEqual({ ok: true });
    expect(result.current.subscription.plan).toBe("premium");
    expect(result.current.isEnterprise).toBe(true);
  });

  test("handles forbidden error", async () => {
    const result = await setupHook({
      hookDashboardError: { status: 403, message: "Forbidden" },
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.forbidden).toBe(true);
    expect(result.current.error).toMatch(/permission/i);
  });
});
