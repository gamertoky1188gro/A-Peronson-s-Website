import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { jest } from "@jest/globals";

async function renderSearch({ initialEntry = "/search?q=denim" } = {}) {
  jest.unstable_mockModule("../../src/lib/auth.js", () => ({
    apiRequest: async () => ({
      items: [],
      total: 0,
      facets: {},
      capabilities: { filters: { advanced: false } },
    }),
    getCurrentUser: () => ({ id: "u1", role: "buyer" }),
    getToken: () => "token",
    hasEntitlement: () => false,
  }));

  jest.unstable_mockModule("../../src/lib/events", () => ({
    trackClientEvent: () => {},
  }));

  jest.unstable_mockModule("../../src/lib/leadSource", () => ({
    recordLeadSource: () => {},
  }));

  const SearchResults = (await import("../../src/pages/SearchResults.jsx"))
    .default;
  const user = userEvent.setup();
  render(
    React.createElement(
      MemoryRouter,
      { initialEntries: [initialEntry] },
      React.createElement(SearchResults),
    ),
  );

  return { user };
}

describe("SearchResults UI (RTL)", () => {
  test("hydrates query from URL params", async () => {
    await renderSearch({ initialEntry: "/search?q=denim" });
    const input = screen.getByPlaceholderText(
      "Search requests, factories, products...",
    );
    expect(input).toHaveValue("denim");
  });

  test("filters toggle reveals core filter bar", async () => {
    const { user } = await renderSearch();
    await user.click(screen.getByRole("button", { name: /filters/i }));
    const coreBar = await screen.findByTestId("default-core-filter-bar");
    expect(coreBar).toBeInTheDocument();
  });
});
