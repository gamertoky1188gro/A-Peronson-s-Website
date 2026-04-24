import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

describe("AccessDenied UI (RTL)", () => {
  test("shows attempted route from router state", async () => {
    const AccessDenied = (await import("../../src/pages/AccessDenied.jsx"))
      .default;

    render(
      React.createElement(
        MemoryRouter,
        {
          initialEntries: [
            { pathname: "/access-denied", state: { from: "/admin" } },
          ],
        },
        React.createElement(
          Routes,
          null,
          React.createElement(Route, {
            path: "/access-denied",
            element: React.createElement(AccessDenied),
          }),
        ),
      ),
    );

    expect(screen.getByText(/access "?denied"?/i)).toBeInTheDocument();
    expect(screen.getByText("/admin")).toBeInTheDocument();
  });

  test("AccessDeniedState renders default message and link", async () => {
    const AccessDeniedState = (
      await import("../../src/components/AccessDeniedState.jsx")
    ).default;

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(AccessDeniedState, null),
      ),
    );

    expect(screen.getByText("Access denied")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View details" })).toHaveAttribute(
      "href",
      "/access-denied",
    );
  });
});
