/**
 * @jest-environment allure-jest/jsdom
 */
import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmDialog from "../../src/components/ConfirmDialog.jsx";

describe("ConfirmDialog (src/components/ConfirmDialog.jsx)", () => {
	test("renders nothing when closed", () => {
		render(
			<ConfirmDialog
				open={false}
				onClose={() => {}}
				onConfirm={() => {}}
				title="Delete?"
				message="Sure?"
			/>,
		);
		expect(screen.queryByText("Delete?")).toBeNull();
	});

	test("renders title, message, and default button labels when open", () => {
		render(
			<ConfirmDialog
				open={true}
				onClose={() => {}}
				onConfirm={() => {}}
				title="Delete lead?"
				message="This cannot be undone."
			/>,
		);
		expect(screen.getByText("Delete lead?")).toBeInTheDocument();
		expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});

	test("cancel calls onClose without confirming", async () => {
		const user = userEvent.setup();
		const onClose = jest.fn();
		const onConfirm = jest.fn();
		render(
			<ConfirmDialog open={true} onClose={onClose} onConfirm={onConfirm} title="T" message="M" />,
		);
		await user.click(screen.getByRole("button", { name: "Cancel" }));
		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onConfirm).not.toHaveBeenCalled();
	});

	test("confirm calls onConfirm then onClose", async () => {
		const user = userEvent.setup();
		const calls = [];
		render(
			<ConfirmDialog
				open={true}
				onClose={() => calls.push("close")}
				onConfirm={() => calls.push("confirm")}
				title="T"
				message="M"
			/>,
		);
		await user.click(screen.getByRole("button", { name: "Confirm" }));
		expect(calls).toEqual(["confirm", "close"]);
	});

	test("supports custom labels for destructive actions", async () => {
		const user = userEvent.setup();
		const onConfirm = jest.fn();
		render(
			<ConfirmDialog
				open={true}
				onClose={() => {}}
				onConfirm={onConfirm}
				title="Remove member?"
				message="They lose access immediately."
				confirmLabel="Remove"
				cancelLabel="Keep"
				destructive={true}
			/>,
		);
		await user.click(screen.getByRole("button", { name: "Remove" }));
		expect(onConfirm).toHaveBeenCalledTimes(1);
		expect(screen.getByRole("button", { name: "Keep" })).toBeInTheDocument();
	});
});
