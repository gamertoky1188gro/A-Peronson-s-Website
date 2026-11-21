/** @jest-environment allure-jest/jsdom */
import { jest } from "@jest/globals";
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
	const { container } = render(
		<ActivityTree activity={rows} status="investigating" defaultSimple={false} />,
	);
	expect(screen.getByText("Reading walletService.js")).toBeTruthy();
	expect(screen.getByText("Searching code")).toBeTruthy();
	expect(container.textContent).not.toContain("server/");
	const toggle = screen.getByRole("button", { name: /working/iu });
	fireEvent.click(toggle);
	expect(screen.queryByText("Reading walletService.js")).toBeNull(); // body collapses
	expect(screen.getByRole("button", { name: /working/iu })).toBeTruthy(); // header stays
});

it("shows How this was investigated when completed and no rows leak tool errors", () => {
	render(
		<ActivityTree
			activity={rows.map((r) => ({ ...r, error: "no" }))}
			status="completed"
			defaultSimple={false}
		/>,
	);
	expect(screen.getByText(/How this was investigated/iu)).toBeTruthy();
});

it("renders collapsed by default once the investigation is completed", () => {
	render(<ActivityTree activity={rows} status="completed" defaultSimple={false} />);
	expect(screen.queryByText("Reading walletService.js")).toBeNull(); // rows hidden
	expect(screen.getByRole("button", { name: /investigat/iu })).toBeTruthy(); // header stays
});

it("renders open by default while the investigation is running", () => {
	render(<ActivityTree activity={rows} status="investigating" defaultSimple={false} />);
	expect(screen.getByText("Reading walletService.js")).toBeTruthy(); // rows visible
	expect(screen.getByRole("button", { name: /working/iu })).toBeTruthy();
});

it("renders nothing when there are no rows and nothing is running", () => {
	const { container } = render(<ActivityTree activity={[]} status="collecting" />);
	expect(container.firstChild).toBeNull();
});

it("groups nodes by stage and opens the inspector on click", () => {
	const onInspect = jest.fn();
	// running keeps the tree open so stage groups are visible.
	render(
		<ActivityTree
			activity={rows}
			status="investigating"
			onInspect={onInspect}
			defaultSimple={false}
		/>,
	);
	// Stage headers name the roles.
	expect(screen.getByText("Planning")).toBeTruthy();
	expect(screen.getByText("Repository history")).toBeTruthy();
	const nodes = screen.getAllByTestId("activity-node");
	expect(nodes.length).toBe(2);
	fireEvent.click(nodes[0]);
	expect(onInspect).toHaveBeenCalledTimes(1);
	const node = onInspect.mock.calls[0][0];
	expect(node.type).toBe("read");
	expect(node.title).toContain("Reading walletService.js");
});

it("defaults to simple, buyer-friendly milestones and can toggle to technical view", () => {
	render(<ActivityTree activity={rows} status="investigating" />);
	// Raw tool labels are hidden in the default simple view.
	expect(screen.queryByText("Reading walletService.js")).toBeNull();
	expect(screen.getAllByText("Checking evidence").length).toBeGreaterThan(0);
	// A toggle switches to the technical view.
	fireEvent.click(screen.getByRole("button", { name: /technical view/iu }));
	expect(screen.getByText("Reading walletService.js")).toBeTruthy();
});
