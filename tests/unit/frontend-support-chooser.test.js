/**
 * The two-mode /support page (src/pages/SupportReports.jsx).
 *
 * The route is public. The chooser renders two cards; card B depends on
 * whether a user is signed in; a bad token keeps the user on the chooser
 * with an inline error; a good token mounts the AI case panel with the
 * buyer's token held in memory.
 *
 * The hook, the premium check, the signed-url helpers and the markdown
 * renderer are mocked: this suite is about the gate, not about the case
 * engine (tests/unit/frontend-support-case.test.js) or the markdown
 * pipeline.
 */
import { jest } from "@jest/globals";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "../../src/lib/ThemeProvider.jsx";
import themeReducer from "../../src/store/themeSlice.js";

const apiRequest = jest.fn();
const inertCase = {
	caseRow: null,
	messages: [],
	status: "collecting",
	error: null,
	errorStatus: null,
	report: null,
	progress: [],
	findings: [],
	attachments: [],
	loading: false,
	send: jest.fn(async () => null),
	attach: jest.fn(async () => null),
	confirm: jest.fn(async () => null),
	refresh: jest.fn(async () => null),
	clearError: jest.fn(),
};

jest.unstable_mockModule("../../src/lib/auth.js", () => ({
	apiRequest,
	getToken: () => "test-jwt",
	getCurrentUser: () => null, // signed out by default
	hasEntitlement: () => false,
}));
jest.unstable_mockModule("../../src/hooks/useSupportCase.js", () => ({
	useSupportCase: () => inertCase,
}));
jest.unstable_mockModule("../../src/hooks/useSecureUser.js", () => ({
	usePremiumCheck: () => ({ isPremium: false, loading: false }),
}));
jest.unstable_mockModule("../../src/lib/signedFile.js", () => ({
	signOne: jest.fn(async () => null),
	signAndDownload: jest.fn(async () => true),
	signAndOpen: jest.fn(async () => true),
}));
jest.unstable_mockModule("react-markdown", () => ({ default: () => null }));
jest.unstable_mockModule("remark-gfm", () => ({ default: () => null }));

const { default: SupportReports } = await import("../../src/pages/SupportReports.jsx");

function makeTestStore() {
	return configureStore({ reducer: { theme: themeReducer } });
}

function renderSupport() {
	return render(
		<Provider store={makeTestStore()}>
			<ThemeProvider>
				<MemoryRouter initialEntries={["/support"]}>
					<SupportReports />
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
	window.localStorage?.clear?.();
});

describe("the /support chooser (src/pages/SupportReports.jsx)", () => {
	it("renders both cards", async () => {
		apiRequest.mockResolvedValue({});
		renderSupport();
		expect(await screen.findByRole("heading", { name: "AI Investigation" })).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "General Support" })).toBeInTheDocument();
		expect(screen.getByText("How can we help today?")).toBeInTheDocument();
	});

	it("shows Sign in to submit on card B when signed out", async () => {
		apiRequest.mockResolvedValue({});
		renderSupport();
		expect(
			(await screen.findByRole("link", { name: /sign in to submit/i })).getAttribute("href"),
		).toBe("/login");
		expect(screen.queryByRole("button", { name: /open the form/i })).not.toBeInTheDocument();
	});

	it("keeps the user on the chooser with an inline error for an invalid token", async () => {
		apiRequest.mockResolvedValue({ ok: false, reason: "invalid" });
		renderSupport();

		fireEvent.change(await screen.findByLabelText(/support token/i), {
			target: { value: "gtk_sup_not-real" },
		});
		fireEvent.click(screen.getByRole("button", { name: /continue/i }));

		expect(
			await screen.findByText("That support token is invalid, expired or revoked."),
		).toBeInTheDocument();
		// Still on the chooser — the case panel was not mounted.
		expect(screen.getByRole("heading", { name: "AI Investigation" })).toBeInTheDocument();
		expect(apiRequest).toHaveBeenCalledWith(
			"/support/token/validate",
			expect.objectContaining({ body: { token: "gtk_sup_not-real" } }),
		);
	});

	it("mounts the case panel with a valid token", async () => {
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

		// The buyer strip renders, and the case panel is mounted.
		expect(await screen.findByText(/Acme Buyer/)).toBeInTheDocument();
		expect(screen.getByText(/acme-laptop-token/)).toBeInTheDocument();
		expect(
			await screen.findByRole("button", { name: /open an investigation/i }),
		).toBeInTheDocument();
		// The token stays in memory only — never written to storage.
		expect(window.localStorage.getItem("supportToken")).toBeNull();
		expect(window.sessionStorage.getItem("supportToken")).toBeNull();
	});
});
