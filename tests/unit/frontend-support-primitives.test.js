/**
 * Shared premium UI primitives for the support surfaces
 * (src/components/support/*.jsx + src/lib/supportToken.js).
 *
 * These components are the contract between the support landing page, the
 * investigation workspace, the report pages and the owner console — this
 * suite pins the in-memory token session and the two interactive primitives
 * whose behavior is specified end to end (viewer keyboard/close, stage
 * rail's status mapping).
 */
import { jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import { Composer } from "../../src/components/support/Composer.jsx";
import { EvidenceViewerModal } from "../../src/components/support/EvidenceViewerModal.jsx";
import { StageRail } from "../../src/components/support/StageRail.jsx";
import {
	clearSupportSession,
	getSupportSession,
	setSupportSession,
} from "../../src/lib/supportToken.js";

test("token session module holds the session in memory only", () => {
	expect(getSupportSession()).toBeNull();
	setSupportSession({ token: "gtk_sup_x", buyer: { id: "b1", name: "Buyer" }, label: "pilot" });
	expect(getSupportSession()?.buyer.id).toBe("b1");
	expect(localStorage.getItem("support-token")).toBeNull();
	clearSupportSession();
	expect(getSupportSession()).toBeNull();
});

test("EvidenceViewerModal navigates and closes on Escape", () => {
	const items = [
		{ url: "u1", name: "a.png", type: "image/png", size: 10 },
		{ url: "u2", name: "b.png", type: "image/png", size: 20 },
	];
	const onClose = jest.fn();
	render(<EvidenceViewerModal items={items} index={0} onClose={onClose} onNavigate={jest.fn()} />);
	expect(screen.getByText("a.png")).toBeInTheDocument();
	fireEvent.keyDown(window, { key: "Escape" });
	expect(onClose).toHaveBeenCalled();
});

test("EvidenceViewerModal arrow keys navigate between items", () => {
	const items = [
		{ url: "u1", name: "a.png", type: "image/png", size: 10 },
		{ url: "u2", name: "b.png", type: "image/png", size: 20 },
	];
	const onNavigate = jest.fn();
	const { rerender } = render(
		<EvidenceViewerModal items={items} index={0} onClose={jest.fn()} onNavigate={onNavigate} />,
	);
	fireEvent.keyDown(window, { key: "ArrowRight" });
	expect(onNavigate).toHaveBeenCalledWith(1);
	// At index 0, ArrowLeft is out of bounds and must not navigate.
	fireEvent.keyDown(window, { key: "ArrowLeft" });
	expect(onNavigate).toHaveBeenCalledTimes(1);
	rerender(
		<EvidenceViewerModal items={items} index={1} onClose={jest.fn()} onNavigate={onNavigate} />,
	);
	fireEvent.keyDown(window, { key: "ArrowLeft" });
	expect(onNavigate).toHaveBeenCalledWith(0);
});

test("EvidenceViewerModal zooms with buttons and clamps at the bounds", () => {
	const items = [{ url: "u1", name: "a.png", type: "image/png", size: 10 }];
	render(
		<EvidenceViewerModal items={items} index={0} onClose={jest.fn()} onNavigate={jest.fn()} />,
	);
	const stage = screen.getByTestId("evidence-viewer-stage");
	expect(stage.style.transform).toContain("scale(1)");
	fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
	expect(stage.style.transform).toContain("scale(");
	expect(stage.style.transform).not.toContain("scale(1)");
	// Zoom out back below the floor gets clamped at 0.5.
	for (let i = 0; i < 20; i += 1) {
		fireEvent.click(screen.getByRole("button", { name: "Zoom out" }));
	}
	expect(stage.style.transform).toContain("scale(0.5)");
});

test("StageRail renders all four stages", () => {
	render(
		<StageRail steps={["Understand", "Investigate", "Discuss", "Report"]} status="collecting" />,
	);
	for (const step of ["Understand", "Investigate", "Discuss", "Report"]) {
		expect(screen.getByText(step)).toBeInTheDocument();
	}
});

test("StageRail maps case status onto the current stage", () => {
	const { rerender } = render(
		<StageRail steps={["Understand", "Investigate", "Discuss", "Report"]} status="verifying" />,
	);
	expect(screen.getByText("Discuss").closest("[data-stage]")).toHaveAttribute(
		"data-stage-state",
		"current",
	);
	rerender(
		<StageRail steps={["Understand", "Investigate", "Discuss", "Report"]} status="reporting" />,
	);
	expect(screen.getByText("Report").closest("[data-stage]")).toHaveAttribute(
		"data-stage-state",
		"current",
	);
	rerender(
		<StageRail steps={["Understand", "Investigate", "Discuss", "Report"]} status="nonsense" />,
	);
	expect(screen.getByText("Understand").closest("[data-stage]")).toHaveAttribute(
		"data-stage-state",
		"current",
	);
});

test("Composer hides the attach button when attachVisible is false", () => {
	const { rerender } = render(<Composer onSend={jest.fn()} attachVisible={false} />);
	expect(screen.queryByRole("button", { name: "Attach files" })).not.toBeInTheDocument();
	rerender(<Composer onSend={jest.fn()} />);
	expect(screen.getByRole("button", { name: "Attach files" })).toBeInTheDocument();
});

test("Composer sends on Enter and keeps Shift+Enter as a newline", () => {
	const onSend = jest.fn();
	render(<Composer onSend={onSend} />);
	const textarea = screen.getByRole("textbox");
	fireEvent.change(textarea, { target: { value: "hello case" } });
	fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });
	expect(onSend).not.toHaveBeenCalled();
	fireEvent.keyDown(textarea, { key: "Enter" });
	expect(onSend).toHaveBeenCalledWith("hello case", []);
});
