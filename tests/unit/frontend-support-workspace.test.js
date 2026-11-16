/**
 * The premium investigation workspace (src/pages/support/SupportWorkspace.jsx).
 *
 * The hook, the signed-url helpers and the api layer are mocked: this suite is
 * about the route component — three rails, stage rail, messages, evidence
 * viewer and composer — not about the case engine.
 */
import { jest } from "@jest/globals";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const apiRequest = jest.fn();
const fixtureCase = {
	id: "case-abc123",
	status: "investigating",
	summary: "Checkout button does nothing",
};
const fixtureMessages = [
	{
		id: "m1",
		role: "client",
		kind: "answer",
		content: "The checkout button does nothing when I click it.",
		sequence: 1,
	},
	{
		id: "m2",
		role: "assistant",
		kind: "answer",
		content: "Understood — I will inspect the code paths around checkout.",
		sequence: 2,
	},
	{
		id: "m3",
		role: "system",
		kind: "progress",
		content: "Investigation started.",
		sequence: 3,
	},
];
const fixtureAttachments = [
	{
		file_path: "/uploads/support/case-abc123/checkout-shot.png",
		mime_type: "image/png",
		byte_size: 2048,
	},
];
const inertCase = {
	caseRow: fixtureCase,
	messages: fixtureMessages,
	status: "investigating",
	error: null,
	errorStatus: null,
	report: null,
	progress: [],
	findings: [
		{
			role: "code",
			finding: {
				detail: "onClick handler throws before submit",
				confidence: "probable",
				evidence: [{ file: "src/checkout.jsx", lines: "112" }],
			},
		},
	],
	attachments: fixtureAttachments,
	loading: false,
	send: jest.fn(async () => ({ ready: false })),
	attach: jest.fn(async () => null),
	confirm: jest.fn(async () => fixtureCase),
	refresh: jest.fn(async () => fixtureCase),
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
	signOne: jest.fn(async () => "https://signed.example/shot.png"),
	signAndOpen: jest.fn(async () => true),
	signAndDownload: jest.fn(async () => true),
	signOneWithTtl: jest.fn(async () => ({ url: "https://signed.example/shot.png", ttlMs: 300000 })),
}));

const { default: SupportWorkspace } = await import("../../src/pages/support/SupportWorkspace.jsx");

async function renderWorkspace() {
	const result = render(
		<MemoryRouter initialEntries={["/support/case/case-abc123"]}>
			<Routes>
				<Route path="/support/case/:caseId" element={<SupportWorkspace />} />
			</Routes>
		</MemoryRouter>,
	);
	// Flush the signed-url effect so its state updates land inside act().
	await act(async () => {});
	return result;
}

beforeEach(() => {
	apiRequest.mockReset();
	apiRequest.mockRejectedValue(new Error("no network in tests"));
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

describe("the premium support workspace (src/pages/support/SupportWorkspace.jsx)", () => {
	it("renders the three rails at desktop classes with the grid contract", async () => {
		const { getByTestId } = await renderWorkspace();
		expect(getByTestId("workspace-grid")).toHaveClass("lg:grid-cols-[260px_minmax(0,1fr)_280px]");
		expect(getByTestId("workspace-left-rail")).toBeInTheDocument();
		expect(getByTestId("workspace-center")).toBeInTheDocument();
		expect(getByTestId("workspace-right-rail")).toBeInTheDocument();
	});

	it("renders the stage rail chips and the six-step investigation timeline", async () => {
		await renderWorkspace();
		for (const step of ["Understand", "Investigate", "Discuss", "Report"]) {
			expect(screen.getByText(step)).toBeInTheDocument();
		}
		for (const step of [
			"Understanding complaint",
			"Gathering evidence",
			"Inspecting code",
			"Verifying causes",
			"Discussing findings",
			"Preparing report",
		]) {
			expect(screen.getByText(step)).toBeInTheDocument();
		}
	});

	it("renders the three fixture messages", async () => {
		await renderWorkspace();
		expect(
			screen.getByText("The checkout button does nothing when I click it."),
		).toBeInTheDocument();
		expect(
			screen.getByText("Understood — I will inspect the code paths around checkout."),
		).toBeInTheDocument();
		expect(screen.getByText("Investigation started.")).toBeInTheDocument();
	});

	it("renders the evidence rail from the hook's attachments", async () => {
		await renderWorkspace();
		expect(screen.getByText("Evidence (1)")).toBeInTheDocument();
		expect(screen.getAllByText("checkout-shot.png").length).toBeGreaterThan(0);
	});

	it("opens the evidence viewer when an evidence thumb is clicked", async () => {
		await renderWorkspace();
		const opens = await screen.findAllByRole("button", {
			name: "Open evidence checkout-shot.png",
		});
		fireEvent.click(opens[0]);
		expect(await screen.findByRole("dialog")).toBeInTheDocument();
	});

	it("shows the composer with the attach button when signed in", async () => {
		await renderWorkspace();
		expect(screen.getByLabelText("Message")).toBeInTheDocument();
		expect(screen.getByLabelText("Attach files")).toBeInTheDocument();
	});
});
