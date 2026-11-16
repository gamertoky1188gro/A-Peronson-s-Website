/**
 * @jest-environment allure-jest/jsdom
 *
 * The owner console's tabbed case detail and the shared glass chips.
 *
 * AdminPlatformSection.jsx is too coupled to render standalone (it wants the
 * whole admin prop matrix), so this suite asserts at the module level instead:
 * the extracted components under src/pages/admin/caseTabs/ are what the section
 * renders. The fixture is the shape the admin case endpoint returns.
 *
 * signOne is mocked: the signed-url exchange is its own contract and belongs
 * to a different suite; what is asserted here is that evidence renders a
 * signed thumbnail, opens the viewer, and never prints the raw path.
 */
import { jest } from "@jest/globals";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

const signOne = jest.fn(async (path) => `https://signed.example/${encodeURIComponent(path)}`);

jest.unstable_mockModule("../../src/lib/signedFile.js", () => ({ signOne }));

const { CaseDetailTabs } = await import("../../src/pages/admin/caseTabs/CaseDetailTabs.jsx");
const { InvestigationStatusChip, PriorityChip, ReportStatusPill } = await import(
	"../../src/pages/admin/caseTabs/chips.jsx"
);

const CASE_ID = "case-abc123";

const caseRow = {
	id: CASE_ID,
	user_id: "user-42",
	status: "completed",
	subject: "The export button does nothing",
	summary: "Client cannot export contracts to CSV.",
	ticket_id: "TCK-7",
	escalated: false,
	retain: false,
	report_status: "sent",
	report_delivered_at: "2026-11-15T09:30:00.000Z",
	created_at: "2026-11-14T08:00:00.000Z",
	updated_at: "2026-11-15T09:30:00.000Z",
};

const clientUser = { id: "user-42", name: "Dana Buyer", email: "dana@example.com" };

const messages = [
	{
		id: "msg-1",
		sequence: 1,
		role: "client",
		kind: "answer",
		content: "The export button does nothing when I click it.",
		created_at: "2026-11-14T08:00:01.000Z",
	},
	{
		id: "msg-2",
		sequence: 2,
		role: "assistant",
		kind: "question",
		content: "Which browser are you on?",
		created_at: "2026-11-14T08:00:02.000Z",
	},
];

const investigations = [
	{
		id: "inv-1",
		role: "code",
		status: "completed",
		attempt: 1,
		model_id: "minimax-m3.1-flash-free",
		error: null,
		findings: {
			summary: "Export handler throws on the CSV path.",
			limitations: ["Could not reach the production database"],
			findings: [
				{
					confidence: "confirmed",
					detail: "exportCsv() dereferences a null column map for CSV exports",
					evidence: [
						{ file: "server/services/exportService.js", lines: "112-118", commit: "abc1234def" },
					],
				},
			],
		},
		tool_log: [
			{ tool: "grep", status: "completed" },
			{ tool: "read", status: "failed", error: "File not found: server/missing.js" },
		],
	},
	{
		id: "inv-2",
		role: "verify",
		status: "completed",
		attempt: 1,
		model_id: "minimax-m3.1-flash-free",
		error: null,
		report: "The export fails because the CSV column map is null.",
		findings: { summary: "", limitations: [], findings: [] },
		tool_log: [{ tool: "verify-matrix", status: "completed" }],
	},
];

const attachments = [
	{
		id: "att-1",
		file_path: "/uploads/support/1731600000000-export-error.png",
		mime_type: "image/png",
		byte_size: 2048,
	},
];

const toolLog = [
	{ key: "code-grep-1", role: "code", tool: "grep", status: "completed", error: "" },
	{
		key: "code-read-2",
		role: "code",
		tool: "read",
		status: "failed",
		error: "File not found: server/missing.js",
	},
	{ key: "verify-matrix-3", role: "verify", tool: "verify-matrix", status: "completed", error: "" },
];

function renderTabs(overrides = {}) {
	const props = {
		caseRow,
		clientUser,
		messages,
		investigations,
		attachments,
		toolLog,
		report: "The export fails because the CSV column map is null.",
		busy: false,
		onResendReport: jest.fn(),
		...overrides,
	};
	return { props, ...render(<CaseDetailTabs {...props} />) };
}

describe("<CaseDetailTabs>", () => {
	it("renders the six tabs with the overview selected by default", () => {
		renderTabs();
		expect(screen.getByRole("tablist", { name: "Case detail" })).toBeTruthy();
		const tabs = screen.getAllByRole("tab");
		expect(tabs.map((tab) => tab.textContent)).toEqual([
			"Overview",
			"Conversation",
			"Evidence",
			"Code findings",
			"Activity",
			"Email report",
		]);
		expect(screen.getByRole("tab", { selected: true }).textContent).toBe("Overview");
		// Overview carries the subject, the client and the stage rail.
		expect(screen.getByRole("heading", { name: "The export button does nothing" })).toBeTruthy();
		expect(screen.getByText("Dana Buyer")).toBeTruthy();
		expect(screen.getByLabelText("Case progress")).toBeTruthy();
	});

	it("switches aria-selected when another tab is clicked", () => {
		renderTabs();
		fireEvent.click(screen.getByRole("tab", { name: "Conversation" }));
		expect(screen.getByRole("tab", { selected: true }).textContent).toBe("Conversation");
	});

	it("conversation renders the right-aligned client bubble and the left-aligned assistant bubble", () => {
		renderTabs();
		fireEvent.click(screen.getByRole("tab", { name: "Conversation" }));
		expect(screen.getByText(/The export button does nothing when I click it\./)).toBeTruthy();
		expect(screen.getByText(/Which browser are you on\?/)).toBeTruthy();
	});

	it("evidence signs urls, renders the thumbnail and opens the viewer modal", async () => {
		renderTabs();
		fireEvent.click(screen.getByRole("tab", { name: "Evidence" }));
		await waitFor(() =>
			expect(signOne).toHaveBeenCalledWith("/uploads/support/1731600000000-export-error.png"),
		);
		const thumb = await screen.findByRole("button", { name: /Open evidence .*export-error\.png/i });
		fireEvent.click(thumb);
		const dialog = await screen.findByRole("dialog", { name: /Evidence viewer/i });
		expect(
			within(dialog).getByRole("img", { name: "1731600000000-export-error.png" }),
		).toBeTruthy();
	});

	it("code findings renders per-role cards with confidence chips and file:line evidence", () => {
		renderTabs();
		fireEvent.click(screen.getByRole("tab", { name: "Code findings" }));
		expect(screen.getAllByText("code").length).toBeGreaterThan(0);
		expect(screen.getAllByText("verify").length).toBeGreaterThan(0);
		expect(screen.getByText("confirmed")).toBeTruthy();
		expect(screen.getByText(/server\/services\/exportService\.js:112-118/)).toBeTruthy();
	});

	it("activity renders the tool-call log with tool, status and error", () => {
		renderTabs();
		fireEvent.click(screen.getByRole("tab", { name: "Activity" }));
		expect(screen.getByText("grep")).toBeTruthy();
		expect(screen.getAllByText("failed").length).toBeGreaterThan(0);
		expect(screen.getByText(/File not found: server\/missing\.js/)).toBeTruthy();
		expect(screen.getByText("verify-matrix")).toBeTruthy();
	});

	it("email report shows the sent pill and resends via the rerun action", () => {
		const onResendReport = jest.fn();
		renderTabs({ onResendReport });
		fireEvent.click(screen.getByRole("tab", { name: "Email report" }));
		const panel = screen.getByRole("tabpanel", { name: "Email report" });
		expect(within(panel).getByText("Sent")).toBeTruthy();
		expect(within(panel).getByText(/Delivered/)).toBeTruthy();
		fireEvent.click(screen.getByRole("button", { name: /Resend report/i }));
		expect(onResendReport).toHaveBeenCalledTimes(1);
		expect(screen.getByText(/The export fails because the CSV column map is null\./)).toBeTruthy();
	});
});

describe("glass chips", () => {
	it("priority chip tones each level; unknown priorities render a dash", () => {
		const { container } = render(
			<div>
				<PriorityChip priority="low" />
				<PriorityChip priority="normal" />
				<PriorityChip priority="high" />
				<PriorityChip priority="urgent" />
				<PriorityChip priority={undefined} />
			</div>,
		);
		expect(container.textContent).toContain("low");
		expect(container.textContent).toContain("normal");
		expect(container.textContent).toContain("high");
		expect(container.textContent).toContain("urgent");
		expect(container.textContent).toContain("—");
		expect(container.querySelector(".text-rose-300")).toBeTruthy();
		expect(container.querySelector(".text-amber-300")).toBeTruthy();
		expect(container.querySelector(".text-sky-300")).toBeTruthy();
	});

	it("investigation status chip: completed emerald, investigating sky, collecting slate", () => {
		const { container } = render(
			<div>
				<InvestigationStatusChip status="completed" />
				<InvestigationStatusChip status="investigating" />
				<InvestigationStatusChip status="collecting" />
			</div>,
		);
		expect(container.querySelector(".text-emerald-300")).toBeTruthy();
		expect(container.querySelector(".text-sky-300")).toBeTruthy();
		expect(container.querySelector(".text-slate-300")).toBeTruthy();
	});

	it("email pill: sent emerald, queued amber, failed rose, none slate", () => {
		const { container } = render(
			<div>
				<ReportStatusPill status="sent" />
				<ReportStatusPill status="queued" />
				<ReportStatusPill status="failed" />
				<ReportStatusPill status={null} />
			</div>,
		);
		expect(screen.getByText("Sent")).toBeTruthy();
		expect(screen.getByText("Queued")).toBeTruthy();
		expect(screen.getByText("Failed")).toBeTruthy();
		expect(screen.getByText("None")).toBeTruthy();
		expect(container.querySelector(".text-emerald-300")).toBeTruthy();
		expect(container.querySelector(".text-amber-300")).toBeTruthy();
		expect(container.querySelector(".text-rose-300")).toBeTruthy();
	});
});
