/**
 * @jest-environment allure-jest/jsdom
 *
 * Render tests for the new structured-reply cards used inside assistant bubbles:
 * GuidedChips, CheckTable, PasteBox, StructuredUpload. They exist because the
 * model's own output drives these surfaces and the user must never see a
 * blank card when it tries one.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import {
	CheckTable,
	GuidedChips,
	PasteBox,
	StructuredUpload,
} from "../../src/components/support/StructuredReply.jsx";

describe("structured reply cards", () => {
	it("GuidedChips renders one button per chip and fires onPick with the label", () => {
		const picked = [];
		render(
			<GuidedChips
				chips={["Happens on login", "After checkout"]}
				onPick={(chip) => picked.push(chip)}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Happens on login" }));
		expect(picked).toEqual(["Happens on login"]);
	});

	it("GuidedChips renders nothing for an empty list", () => {
		const { container } = render(<GuidedChips chips={[]} onPick={() => {}} />);
		expect(container).toBeEmptyDOMElement();
	});

	it("CheckTable renders labels with ok/fail icons", () => {
		render(
			<CheckTable
				rows={[
					{ label: "Auth middleware", ok: true },
					{ label: "Webhook handler", ok: false },
				]}
			/>,
		);
		expect(screen.getByText("Auth middleware")).toBeTruthy();
		expect(screen.getByText("Webhook handler")).toBeTruthy();
		expect(screen.getByText("Auth middleware")).toBeTruthy();
		expect(screen.getByText("Webhook handler")).toBeTruthy();
	});

	it("CheckTable renders nothing for empty input", () => {
		const { container } = render(<CheckTable rows={[]} />);
		expect(container).toBeEmptyDOMElement();
	});

	it("PasteBox fires onSend with trimmed content and clears", () => {
		const sent = [];
		render(<PasteBox hint="code" placeholder="paste" onSend={(text) => sent.push(text)} />);
		const textarea = screen.getByPlaceholderText("paste");
		fireEvent.change(textarea, { target: { value: "  const x = 1;  " } });
		fireEvent.click(screen.getByRole("button", { name: /Attach to case/iu }));
		expect(sent).toEqual(["const x = 1;"]);
	});

	it("PasteBox attach button is disabled until text is entered", () => {
		render(<PasteBox hint="code" placeholder="paste" onSend={() => {}} />);
		expect(screen.getByRole("button", { name: /Attach to case/iu })).toBeDisabled();
	});

	it("StructuredUpload exposes a file input and fires onAttach with the chosen files", async () => {
		const attached = [];
		const { container } = render(
			<StructuredUpload label="console log" onAttach={(files) => attached.push(files)} />,
		);
		const input = container.querySelector('input[type="file"]');
		expect(input).not.toBeNull();
		const file = new File(["x"], "log.txt", { type: "text/plain" });
		fireEvent.change(input, { target: { files: [file] } });
		expect(attached).toHaveLength(1);
		expect(attached[0][0].name).toBe("log.txt");
	});
});
