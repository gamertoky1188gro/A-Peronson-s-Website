/**
 * The premium /support landing page (src/pages/support/SupportLanding.jsx).
 *
 * Public route. The hero + feature cards always render; the General Support
 * card depends on whether a session token exists; a bad token keeps the user
 * on the landing with an inline error; a good token stores the support
 * session in memory and navigates to the workspace route.
 *
 * The API layer is mocked; react-router-dom is real — navigation to
 * /support/case/new is asserted with a probe route (mocking the router
 * loads a second copy of react-router and breaks context).
 */
import { jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const apiRequest = jest.fn();
const getToken = jest.fn(() => null);

jest.unstable_mockModule("../../src/lib/auth.js", () => ({
	apiRequest,
	getToken,
	getCurrentUser: () => null,
}));

const { default: SupportLanding } = await import("../../src/pages/support/SupportLanding.jsx");
const { Routes, Route } = await import("react-router-dom");
const { getSupportSession, clearSupportSession } = await import("../../src/lib/supportToken.js");

function renderLanding() {
	return render(
		<MemoryRouter initialEntries={["/support"]}>
			<Routes>
				<Route path="/support" element={<SupportLanding />} />
				<Route path="/support/case/new" element={<div>WORKSPACE_PROBE</div>} />
			</Routes>
		</MemoryRouter>,
	);
}

beforeEach(() => {
	apiRequest.mockReset();
	getToken.mockReset();
	getToken.mockReturnValue(null);
	clearSupportSession();
	window.localStorage?.clear?.();
});

describe("the /support landing (src/pages/support/SupportLanding.jsx)", () => {
	it("renders the hero and both mode cards", () => {
		renderLanding();
		expect(
			screen.getByRole("heading", { name: /something isn't working as expected\?/iu }),
		).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "AI Investigation", level: 2 })).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "General Support", level: 2 })).toBeInTheDocument();
		expect(screen.getByText("Talk naturally")).toBeInTheDocument();
		expect(screen.getByText("Evidence-based investigation")).toBeInTheDocument();
		expect(screen.getByText("Detailed reporting")).toBeInTheDocument();
	});

	it("shows Sign in to submit on the General Support card when signed out", () => {
		renderLanding();
		expect(screen.getByRole("link", { name: /sign in to submit/iu }).getAttribute("href")).toBe(
			"/login",
		);
		expect(screen.queryByRole("button", { name: /open the form/iu })).not.toBeInTheDocument();
	});

	it("stores the support session and navigates to the workspace for a valid token", async () => {
		apiRequest.mockResolvedValue({
			ok: true,
			buyer: { id: "buyer-1", name: "Acme Buyer" },
			label: "acme-laptop-token",
		});
		renderLanding();

		fireEvent.change(screen.getByLabelText(/support token/iu), {
			target: { value: "gtk_sup_real-token" },
		});
		fireEvent.click(screen.getByRole("button", { name: /continue/iu }));

		await screen.findByText("WORKSPACE_PROBE");
		expect(apiRequest).toHaveBeenCalledWith(
			"/support/token/validate",
			expect.objectContaining({
				method: "POST",
				body: { token: "gtk_sup_real-token" },
			}),
		);
		expect(getSupportSession()?.token).toBe("gtk_sup_real-token");
		// The token never touches storage.
		expect(window.localStorage.getItem("supportToken")).toBeNull();
		expect(window.sessionStorage.getItem("supportToken")).toBeNull();
	});

	it("keeps the user on the landing with a generic error for an invalid token", async () => {
		apiRequest.mockResolvedValue({ ok: false, reason: "expired" });
		renderLanding();

		fireEvent.change(screen.getByLabelText(/support token/iu), {
			target: { value: "gtk_sup_not-real" },
		});
		fireEvent.click(screen.getByRole("button", { name: /continue/iu }));

		expect(
			await screen.findByText("That support token is invalid, expired or revoked."),
		).toBeInTheDocument();
		expect(screen.queryByText("WORKSPACE_PROBE")).not.toBeInTheDocument();
		expect(getSupportSession()).toBeNull();
	});

	it("submits a general support ticket and shows the ticket id", async () => {
		getToken.mockReturnValue("test-jwt");
		apiRequest.mockResolvedValue({ ticket: { id: "TCK-42" } });
		renderLanding();

		fireEvent.click(screen.getByRole("button", { name: /open the form/iu }));
		fireEvent.change(screen.getByLabelText(/subject/iu), {
			target: { value: "Export button is broken" },
		});
		fireEvent.change(screen.getByLabelText(/description/iu), {
			target: { value: "Clicking Export does nothing." },
		});
		fireEvent.click(screen.getByRole("button", { name: /submit request/iu }));

		expect(await screen.findByText("TCK-42")).toBeInTheDocument();
		expect(apiRequest).toHaveBeenCalledWith(
			"/support/tickets",
			expect.objectContaining({
				method: "POST",
				token: "test-jwt",
				body: expect.objectContaining({
					subject: "Export button is broken",
					category: "bug",
					priority: "standard",
				}),
			}),
		);
	});
});
