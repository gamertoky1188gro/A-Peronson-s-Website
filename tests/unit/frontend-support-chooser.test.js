/**
 * The support landing page (src/pages/support/SupportLanding.jsx).
 *
 * The route is public. The page renders two mode cards; card B depends on
 * whether a user is signed in; a bad token stays on the page with an inline
 * error; a good token routes into the case workspace with the buyer's token
 * held in memory only.
 *
 * The api layer and the case hook are mocked: this suite is about the gate,
 * not about the case engine (tests/unit/frontend-support-workspace.test.js)
 * or the markdown pipeline.
 */
import { jest } from "@jest/globals";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "../../src/lib/ThemeProvider.jsx";
import themeReducer from "../../src/store/themeSlice.js";

const apiRequest = jest.fn();

jest.unstable_mockModule("../../src/lib/auth.js", () => ({
	apiRequest,
	getToken: () => null, // signed out by default, as the old chooser suite did
	getCurrentUser: () => null, // signed out by default
	hasEntitlement: () => false,
}));

const { default: SupportLanding } = await import("../../src/pages/support/SupportLanding.jsx");
const { getSupportSession, clearSupportSession } = await import("../../src/lib/supportToken.js");

function makeTestStore() {
	return configureStore({ reducer: { theme: themeReducer } });
}

function renderSupport() {
	return render(
		<Provider store={makeTestStore()}>
			<ThemeProvider>
				<MemoryRouter initialEntries={["/support"]}>
					<Routes>
						<Route path="/support" element={<SupportLanding />} />
						<Route path="/support/case/new" element={<div>new case workspace</div>} />
					</Routes>
				</MemoryRouter>
			</ThemeProvider>
		</Provider>,
	);
}

beforeAll(() => {
	if (typeof window !== "undefined" && !window.matchMedia) {
		window.matchMedia = () => ({
			matches: false,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
		});
	}
	// framer-motion's whileInView needs it; jsdom does not ship one.
	if (typeof globalThis.IntersectionObserver === "undefined") {
		globalThis.IntersectionObserver = class IntersectionObserver {
			observe() {}
			unobserve() {}
			disconnect() {}
		};
	}
});

beforeEach(() => {
	apiRequest.mockReset();
	clearSupportSession();
	window.localStorage?.clear?.();
});

describe("the /support landing (src/pages/support/SupportLanding.jsx)", () => {
	it("renders both mode cards", async () => {
		apiRequest.mockResolvedValue({});
		renderSupport();
		expect(await screen.findByRole("heading", { name: "AI Investigation" })).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "General Support" })).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: /Something isn.t working as expected/i }),
		).toBeInTheDocument();
	});

	it("shows Sign in to submit on card B when signed out", async () => {
		apiRequest.mockResolvedValue({});
		renderSupport();
		expect(
			(await screen.findByRole("link", { name: /sign in to submit/i })).getAttribute("href"),
		).toBe("/login");
		expect(screen.queryByRole("button", { name: /open the form/i })).not.toBeInTheDocument();
	});

	it("keeps the user on the landing with an inline error for an invalid token", async () => {
		apiRequest.mockResolvedValue({ ok: false, reason: "invalid" });
		renderSupport();

		fireEvent.change(await screen.findByLabelText(/support token/i), {
			target: { value: "gtk_sup_not-real" },
		});
		fireEvent.click(screen.getByRole("button", { name: /continue/i }));

		expect(
			await screen.findByText("That support token is invalid, expired or revoked."),
		).toBeInTheDocument();
		// Still on the landing — the workspace was not entered.
		expect(screen.getByRole("heading", { name: "AI Investigation" })).toBeInTheDocument();
		expect(apiRequest).toHaveBeenCalledWith(
			"/support/token/validate",
			expect.objectContaining({ body: { token: "gtk_sup_not-real" } }),
		);
	});

	it("routes a validated token into the case workspace and holds it in memory only", async () => {
		apiRequest.mockImplementation((path) => {
			if (path === "/support/token/validate") {
				return Promise.resolve({
					ok: true,
					buyer: { id: "buyer-1", name: "Acme Buyer" },
					label: "acme-laptop-token",
				});
			}
			return Promise.resolve({});
		});
		renderSupport();

		fireEvent.change(await screen.findByLabelText(/support token/i), {
			target: { value: "gtk_sup_real-token" },
		});
		fireEvent.click(screen.getByRole("button", { name: /continue/i }));

		// The workspace route renders, and the token session was seeded — in memory only.
		expect(await screen.findByText("new case workspace")).toBeInTheDocument();
		expect(getSupportSession()?.buyer?.id).toBe("buyer-1");
		expect(getSupportSession()?.label).toBe("acme-laptop-token");
		expect(window.localStorage.getItem("supportToken")).toBeNull();
		expect(window.sessionStorage.getItem("supportToken")).toBeNull();
	});
});
