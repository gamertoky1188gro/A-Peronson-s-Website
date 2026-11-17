/**
 * @jest-environment allure-jest/jsdom
 *
 * Composer intake intake filter: opencode can only hand PNG/JPEG/GIF/WebP
 * and PDF to the model. A refused file is said once in a note, never added
 * to the pending list, and a text-only model disables the attach button.
 */

import { jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Composer } from "../../src/components/support/Composer.jsx";

describe("Composer attachments", () => {
	it("ignores refused media types and says so in a note", () => {
		const onFiles = jest.fn();
		const { container } = render(<Composer onSend={() => {}} onFiles={onFiles} />);
		const root = container.firstChild;
		const image = new File(["x"], "shot.png", { type: "image/png" });
		const video = new File(["x"], "clip.mp4", { type: "video/mp4" });
		fireEvent.drop(root, { dataTransfer: { files: [image, video] } });
		expect(screen.getByText("shot.png")).toBeTruthy();
		expect(screen.queryByText("clip.mp4")).toBeNull();
		expect(screen.getByText(/ignored/iu)).toBeTruthy();
	});

	it("accepts PDF attachments", () => {
		const { container } = render(<Composer onSend={() => {}} onFiles={() => {}} />);
		const root = container.firstChild;
		const pdf = new File(["x"], "stack.pdf", { type: "application/pdf" });
		fireEvent.drop(root, { dataTransfer: { files: [pdf] } });
		expect(screen.getByText("stack.pdf")).toBeTruthy();
	});

	it("disables the attach button for a text-only model and explains with a tooltip", () => {
		render(<Composer onSend={() => {}} onFiles={() => {}} attachEnabled={false} />);
		const button = screen.getByRole("button", { name: "Attachments unavailable for this model" });
		expect(button).toBeDisabled();
		expect(button).toHaveAttribute(
			"title",
			"The selected model only reads text — attachments are off",
		);
	});

	it("keeps the attach accept list to the opencode-supported mime types", () => {
		const { container } = render(<Composer onSend={() => {}} onFiles={() => {}} />);
		const input = container.querySelector('input[type="file"]');
		expect(input).toHaveAttribute(
			"accept",
			"image/png,image/jpeg,image/gif,image/webp,application/pdf",
		);
	});
});
