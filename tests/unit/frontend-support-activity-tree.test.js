/** @jest-environment allure-jest/jsdom */
import { fireEvent, render, screen } from "@testing-library/react";
import { ActivityTree } from "../../src/components/support/ActivityTree.jsx";

const rows = [
	{
		id: "1",
		role: "lead",
		kind: "read",
		label: "Reading walletService.js",
		status: "done",
		at: "2026-11-17T06:00:00.000Z",
	},
	{
		id: "2",
		role: "repo",
		kind: "search",
		label: "Searching code",
		status: "done",
		at: "2026-11-17T06:00:06.000Z",
	},
];

it("renders labels with no paths and collapses on toggle", () => {
	const { container } = render(<ActivityTree activity={rows} status="investigating" />);
	expect(screen.getByText("Reading walletService.js")).toBeTruthy();
	expect(screen.getByText("Searching code")).toBeTruthy();
	expect(container.textContent).not.toContain("server/");
	const toggle = screen.getByRole("button", { name: /working/iu });
	fireEvent.click(toggle);
	expect(screen.queryByText("Reading walletService.js")).toBeNull(); // body collapses
	expect(screen.getByRole("button", { name: /working/iu })).toBeTruthy(); // header stays
});

it("shows How this was investigated when completed and no rows leak tool errors", () => {
	render(<ActivityTree activity={rows.map((r) => ({ ...r, error: "no" }))} status="completed" />);
	expect(screen.getByText(/How this was investigated/iu)).toBeTruthy();
});

it("renders collapsed by default once the investigation is completed", () => {
	render(<ActivityTree activity={rows} status="completed" />);
	expect(screen.queryByText("Reading walletService.js")).toBeNull(); // rows hidden
	expect(screen.getByRole("button", { name: /investigat/iu })).toBeTruthy(); // header stays
});

it("renders open by default while the investigation is running", () => {
	render(<ActivityTree activity={rows} status="investigating" />);
	expect(screen.getByText("Reading walletService.js")).toBeTruthy(); // rows visible
	expect(screen.getByRole("button", { name: /working/iu })).toBeTruthy();
});

it("renders nothing when there are no rows and nothing is running", () => {
	const { container } = render(<ActivityTree activity={[]} status="collecting" />);
	expect(container.firstChild).toBeNull();
});
