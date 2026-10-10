/**
 * @jest-environment allure-jest/jsdom
 */
import { jest } from "@jest/globals";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "../../src/lib/ThemeProvider.jsx";
import themeReducer from "../../src/store/themeSlice.js";

function makeTestStore() {
	return configureStore({ reducer: { theme: themeReducer } });
}

describe("AccessDenied page (src/pages/AccessDenied.jsx)", () => {
	let AccessDenied;

	// Import once: re-importing per test under resetModules would create a
	// second copy of React while `render` still references the first,
	// producing "Invalid hook call" failures.
	beforeAll(async () => {
		if (typeof window !== "undefined" && !window.matchMedia) {
			window.matchMedia = () => ({
				matches: false,
				addListener: () => {},
				removeListener: () => {},
				addEventListener: () => {},
				removeEventListener: () => {},
			});
		}
		jest.unstable_mockModule("../../src/lib/auth.js", () => ({
			getToken: () => "",
			apiRequest: jest.fn(),
		}));
		({ default: AccessDenied } = await import("../../src/pages/AccessDenied.jsx"));
	});

	beforeEach(() => {
		window.localStorage?.clear?.();
	});

	function renderAt(route, state) {
		return render(
			<Provider store={makeTestStore()}>
				<ThemeProvider>
					<MemoryRouter initialEntries={[{ pathname: route, state }]}>
						<AccessDenied />
					</MemoryRouter>
				</ThemeProvider>
			</Provider>,
		);
	}

	test("announces the denial and shows the attempted route", () => {
		renderAt("/access-denied", { from: "/admin" });
		expect(screen.getAllByText(/access denied/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText("/admin").length).toBeGreaterThanOrEqual(1);
	});

	test("falls back to a generic label with no attempted route", () => {
		renderAt("/access-denied");
		expect(screen.getByText(/you do not have permission/i)).toBeInTheDocument();
		expect(screen.getAllByText("this page").length).toBeGreaterThan(0);
	});

	test("guests are offered login with another account", () => {
		renderAt("/access-denied", { from: "/owner" });
		expect(screen.getByRole("link", { name: /login with another account/i })).toBeInTheDocument();
	});

	test("supports object-shaped location state", () => {
		renderAt("/access-denied", { from: { pathname: "/contracts" } });
		expect(screen.getAllByText("/contracts").length).toBeGreaterThanOrEqual(1);
	});
});
