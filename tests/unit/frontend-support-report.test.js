/**
 * The report preview and submission confirmation routes
 * (src/pages/support/SupportReportPreview.jsx, src/pages/support/SupportSubmitted.jsx).
 *
 * The case engine, the API layer and the markdown renderer are mocked: this
 * suite is about the two pages — numbered sections rendered from the report
 * payload, the approval gate on the submit button, the confirm call and the
 * submitted page's case reference + delivery pill — not about the case engine.
 */
import { jest } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const apiRequest = jest.fn();

const FIXTURE_REPORT = [
	"# Support investigation report",
	"",
	"- **Case:** case-abc123",
	"- **Generated:** 2026-11-16T10:00:00.000Z",
	"",
	"## 1. Case metadata",
	"",
	"| Field | Value |",
	"|---|---|",
	"| Case ID | case-abc123 |",
	"",
	"## 2. Original complaint",
	"",
	"The export button does nothing.",
	"",
	"## 3. Conversation log",
	"",
	"1. client - answer",
	"",
	"## 4. Investigation log",
	"",
	"_No investigation runs were recorded for this case._",
	"",
	"## 5. Findings",
	"",
	"Confirmed findings (1)",
	"",
	"## 6. Recommended next steps",
	"",
	"Fix the export route.",
	"",
	"## 7. Audit and delivery",
	"",
	"- **Report status:** sent",
	"",
].join("\n");

const confirmMock = jest.fn();
const hookState = {
	caseRow: { id: "case-abc123", status: "reporting", report_status: null },
	messages: [],
	status: "reporting",
	error: null,
	errorStatus: null,
	report: { report: FIXTURE_REPORT, reportStatus: "ready" },
	progress: [],
	findings: [],
	attachments: [],
	loading: false,
	send: jest.fn(),
	attach: jest.fn(),
	confirm: confirmMock,
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
	useSupportCase: () => hookState,
}));
jest.unstable_mockModule("react-markdown", () => ({
	default: ({ children }) => <div data-testid="markdown">{children}</div>,
}));
jest.unstable_mockModule("remark-gfm", () => ({ default: () => null }));

const { default: SupportReportPreview } = await import(
	"../../src/pages/support/SupportReportPreview.jsx"
);
const { default: SupportSubmitted } = await import("../../src/pages/support/SupportSubmitted.jsx");

const CASE_ID = "case-abc123";

function renderReport(state) {
	return render(
		<MemoryRouter initialEntries={[{ pathname: `/support/case/${CASE_ID}/report`, state }]}>
			<Routes>
				<Route path="/support/case/:caseId/report" element={<SupportReportPreview />} />
				<Route path="/support/case/:caseId/submitted" element={<SupportSubmitted />} />
			</Routes>
		</MemoryRouter>,
	);
}

function renderSubmitted() {
	return render(
		<MemoryRouter initialEntries={[`/support/case/${CASE_ID}/submitted`]}>
			<Routes>
				<Route path="/support/case/:caseId/submitted" element={<SupportSubmitted />} />
			</Routes>
		</MemoryRouter>,
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
});

beforeEach(() => {
	apiRequest.mockReset();
	apiRequest.mockRejectedValue(new Error("no network in tests"));
	confirmMock.mockReset();
	confirmMock.mockResolvedValue({ id: CASE_ID, status: "completed" });
	hookState.error = null;
	hookState.errorStatus = null;
	hookState.report = { report: FIXTURE_REPORT, reportStatus: "ready" };
	window.localStorage?.clear?.();
});

describe("the report preview (src/pages/support/SupportReportPreview.jsx)", () => {
	it("renders the report's sections as numbered cards", async () => {
		renderReport(undefined);
		for (const title of [
			"Case metadata",
			"Original complaint",
			"Conversation log",
			"Investigation log",
			"Findings",
			"Recommended next steps",
			"Audit and delivery",
		]) {
			expect(await screen.findByRole("heading", { name: title })).toBeInTheDocument();
		}
		expect(screen.getByText("01")).toBeInTheDocument();
		expect(screen.getByText("07")).toBeInTheDocument();
	});

	it("renders the back link to the conversation", async () => {
		renderReport(undefined);
		const back = await screen.findByRole("link", { name: /back to conversation/i });
		expect(back.getAttribute("href")).toBe(`/support/case/${CASE_ID}`);
	});

	it("keeps Finish & Submit Report disabled until the approval checkbox is checked", async () => {
		renderReport(undefined);
		const button = await screen.findByRole("button", { name: /finish & submit report/i });
		expect(button).toBeDisabled();
		fireEvent.click(screen.getByRole("checkbox", { name: /i've reviewed this report/i }));
		expect(button).toBeEnabled();
	});

	it("confirms through the case hook and navigates to the submitted route", async () => {
		apiRequest.mockImplementation((path) => {
			if (path === `/support/cases/${CASE_ID}`) {
				return Promise.resolve({
					case: { id: CASE_ID, status: "completed", report_status: "sent" },
				});
			}
			return Promise.reject(new Error(`unexpected path: ${path}`));
		});
		renderReport(undefined);
		fireEvent.click(await screen.findByRole("checkbox", { name: /i've reviewed this report/i }));
		fireEvent.click(screen.getByRole("button", { name: /finish & submit report/i }));
		expect(confirmMock).toHaveBeenCalledTimes(1);
		expect(await screen.findByText("Report submitted!")).toBeInTheDocument();
	});

	it("stays on the page with an inline error when the confirm fails", async () => {
		confirmMock.mockResolvedValue(null);
		hookState.error = "Unable to confirm the case.";
		renderReport(undefined);
		fireEvent.click(await screen.findByRole("checkbox", { name: /i've reviewed this report/i }));
		fireEvent.click(screen.getByRole("button", { name: /finish & submit report/i }));
		expect(await screen.findByRole("alert")).toHaveTextContent(/could not be submitted/i);
		expect(screen.queryByText("Report submitted!")).not.toBeInTheDocument();
		expect(screen.getByRole("heading", { name: /investigation report/i })).toBeInTheDocument();
	});
});

describe("the submitted page (src/pages/support/SupportSubmitted.jsx)", () => {
	it("shows the case reference and the Sent pill when delivery succeeded", async () => {
		apiRequest.mockImplementation((path) => {
			if (path === `/support/cases/${CASE_ID}`) {
				return Promise.resolve({
					case: {
						id: CASE_ID,
						status: "completed",
						report_status: "sent",
						report_delivered_at: "2026-11-16T10:05:00.000Z",
					},
				});
			}
			return Promise.reject(new Error(`unexpected path: ${path}`));
		});
		renderSubmitted();
		expect(await screen.findByText("Report submitted!")).toBeInTheDocument();
		expect(apiRequest).toHaveBeenCalledWith(
			`/support/cases/${CASE_ID}`,
			expect.objectContaining({ token: "test-jwt" }),
		);
		expect(screen.getByText("CASE REFERENCE")).toBeInTheDocument();
		expect(screen.getByText(CASE_ID)).toBeInTheDocument();
		expect(await screen.findByText("Sent")).toBeInTheDocument();
		expect(screen.getByText(/a copy will be sent to your email/i)).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /back to support/i }).getAttribute("href")).toBe(
			"/support",
		);
	});

	it("renders the reference only, without a delivery pill, when the case fetch fails", async () => {
		apiRequest.mockRejectedValue(new Error("network down"));
		renderSubmitted();
		expect(await screen.findByText("Report submitted!")).toBeInTheDocument();
		expect(screen.getByText(CASE_ID)).toBeInTheDocument();
		await waitFor(() => expect(apiRequest).toHaveBeenCalled());
		expect(screen.queryByText("Sent")).not.toBeInTheDocument();
		expect(screen.queryByText("Failed")).not.toBeInTheDocument();
		expect(screen.getByRole("link", { name: /back to support/i })).toBeInTheDocument();
	});

	it("renders the Failed pill when the case reports a failed delivery", async () => {
		apiRequest.mockImplementation((path) => {
			if (path === `/support/cases/${CASE_ID}`) {
				return Promise.resolve({
					case: { id: CASE_ID, status: "completed", report_status: "failed" },
				});
			}
			return Promise.reject(new Error(`unexpected path: ${path}`));
		});
		renderSubmitted();
		expect(await screen.findByText("Failed")).toBeInTheDocument();
	});
});
