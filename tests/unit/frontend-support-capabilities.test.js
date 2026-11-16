/**
 * The right-rail RESOURCES card (src/pages/support/SupportWorkspace.jsx).
 *
 * apiRequest is mocked: this suite is about the pills — six rows, the
 * Authorized/Unavailable split, and the failure path, which must never claim
 * a capability the server did not grant.
 */
import { jest } from "@jest/globals";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const apiRequest = jest.fn();
const inertCase = {
	caseRow: { id: "case-abc123", status: "collecting", summary: "" },
	messages: [],
	status: "collecting",
	error: null,
	errorStatus: null,
	report: null,
	progress: [],
	findings: [],
	attachments: [],
	loading: false,
	send: jest.fn(async () => ({ ready: false })),
	attach: jest.fn(async () => null),
	confirm: jest.fn(async () => null),
	refresh: jest.fn(async () => null),
	clearError: jest.fn(),
};

jest.unstable_mockModule("../../src/lib/auth.js", () => ({
	apiRequest,
	getToken: () => "test-jwt",
	getCurrentUser: () => null,
	hasEntitlement: () => false,
}));
jest.unstable_mockModule("../../src/hooks/useSupportCase.js", () => ({
	useSupportCase: () => inertCase,
}));
jest.unstable_mockModule("../../src/lib/signedFile.js", () => ({
	signOne: jest.fn(async () => null),
	signAndOpen: jest.fn(async () => true),
	signAndDownload: jest.fn(async () => true),
	signOneWithTtl: jest.fn(async () => ({ url: null, ttlMs: 0 })),
}));

const { default: SupportWorkspace } = await import("../../src/pages/support/SupportWorkspace.jsx");
const { setSupportSession, clearSupportSession } = await import("../../src/lib/supportToken.js");

const FULL_ENVELOPE = {
	repositoryInspection: true,
	githubHistory: true,
	renderServices: true,
	research: true,
	libraryDocs: true,
	applicationData: false,
};

function renderWorkspace() {
	return render(
		<MemoryRouter initialEntries={["/support/case/case-abc123"]}>
			<Routes>
				<Route path="/support/case/:caseId" element={<SupportWorkspace />} />
			</Routes>
		</MemoryRouter>,
	);
}

function rowFor(label) {
	return screen.getByText(label).closest("li");
}

beforeEach(() => {
	apiRequest.mockReset();
	clearSupportSession();
	window.localStorage?.clear?.();
});

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
	if (typeof globalThis.IntersectionObserver === "undefined") {
		globalThis.IntersectionObserver = class IntersectionObserver {
			observe() {}
			unobserve() {}
			disconnect() {}
		};
	}
});

describe("the right-rail capabilities card (src/pages/support/SupportWorkspace.jsx)", () => {
	it("renders six capability rows from the endpoint once it answers", async () => {
		apiRequest.mockResolvedValue({ ...FULL_ENVELOPE });
		renderWorkspace();
		await act(async () => {});
		expect(apiRequest).toHaveBeenCalledWith("/support/capabilities", {
			token: "test-jwt",
			headers: undefined,
		});
		for (const label of [
			"Repository inspection",
			"GitHub history",
			"Render services",
			"Parallel research",
			"Library docs",
			"Approved application data",
		]) {
			expect(screen.getByText(label)).toBeInTheDocument();
		}
	});

	it("forwards the in-memory support token as x-support-token when the buyer holds one", async () => {
		setSupportSession({ token: "gtk_sup_buyer-123", buyer: { id: "buyer-9" }, label: "demo" });
		apiRequest.mockResolvedValue({ ...FULL_ENVELOPE });
		renderWorkspace();
		await act(async () => {});
		expect(apiRequest).toHaveBeenCalledWith("/support/capabilities", {
			token: "test-jwt",
			headers: { "x-support-token": "gtk_sup_buyer-123" },
		});
	});

	it("shows Authorized for granted capabilities and Unavailable for refused ones", async () => {
		apiRequest.mockResolvedValue({ ...FULL_ENVELOPE });
		renderWorkspace();
		await act(async () => {});
		expect(rowFor("Repository inspection")).toHaveTextContent("Authorized");
		expect(rowFor("GitHub history")).toHaveTextContent("Authorized");
		expect(rowFor("Render services")).toHaveTextContent("Authorized");
		expect(rowFor("Parallel research")).toHaveTextContent("Authorized");
		expect(rowFor("Library docs")).toHaveTextContent("Authorized");
		expect(rowFor("Approved application data")).toHaveTextContent("Unavailable");
		expect(rowFor("Approved application data")).not.toHaveTextContent("Authorized");
	});

	it("shows Unavailable for env-gated capabilities the endpoint reports false", async () => {
		apiRequest.mockResolvedValue({
			...FULL_ENVELOPE,
			githubHistory: false,
			renderServices: false,
			libraryDocs: false,
		});
		renderWorkspace();
		await act(async () => {});
		expect(rowFor("GitHub history")).toHaveTextContent("Unavailable");
		expect(rowFor("Render services")).toHaveTextContent("Unavailable");
		expect(rowFor("Library docs")).toHaveTextContent("Unavailable");
		// The always-on rows are unaffected by the env-gated ones.
		expect(rowFor("Repository inspection")).toHaveTextContent("Authorized");
		expect(rowFor("Parallel research")).toHaveTextContent("Authorized");
	});

	it("shows Unknown on every pill when the endpoint fails — never a silent Authorized", async () => {
		apiRequest.mockRejectedValue(new Error("no network in tests"));
		renderWorkspace();
		await act(async () => {});
		for (const label of [
			"Repository inspection",
			"GitHub history",
			"Render services",
			"Parallel research",
			"Library docs",
			"Approved application data",
		]) {
			expect(rowFor(label)).toHaveTextContent("Unknown");
			expect(rowFor(label)).not.toHaveTextContent("Authorized");
		}
	});
});
