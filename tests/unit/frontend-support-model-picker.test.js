/**
 * The buyer investigation-model picker
 * (src/components/support/InvestigationModelPicker.jsx).
 *
 * The component reads and writes /support/cases/:caseId/model through
 * apiRequest; the module is mocked so this suite is about the picker's own
 * behavior: the dropdown lists the allowed models, selecting persists the
 * pick, and a disabled buyer toggle renders a read-only badge.
 */
import { jest } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const apiRequest = jest.fn();

jest.unstable_mockModule("../../src/lib/auth.js", () => ({
	apiRequest,
	getToken: () => "test-jwt",
}));

const { default: InvestigationModelPicker } = await import(
	"../../src/components/support/InvestigationModelPicker.jsx"
);

const CONFIG = {
	modelId: null,
	effectiveModelId: "minimax-m3.1-flash-free",
	default: "minimax-m3.1-flash-free",
	buyerSelectEnabled: true,
	allowed: ["minimax-m3.1-flash-free", "glm-5.3-flash-free", "nemotron-3-ultra-free"],
	effectiveModel: {
		id: "minimax-m3.1-flash-free",
		contextLimit: 1_000_000,
		inputModalities: ["text", "image/png"],
	},
};

function makeModelApi() {
	// A stateful server: the effective model follows the stored pick. That is
	// what the real case-model route does, and the picker now refetches after
	// a successful PUT instead of trusting its local state.
	const state = { modelId: null };
	return (path, options = {}) => {
		if ((options.method || "GET") === "GET") {
			return Promise.resolve({
				...CONFIG,
				modelId: state.modelId,
				effectiveModelId: state.modelId ?? CONFIG.effectiveModelId,
			});
		}
		state.modelId = options.body?.modelId ?? null;
		return Promise.resolve({ modelId: state.modelId });
	};
}

beforeEach(() => {
	apiRequest.mockReset();
});

describe("InvestigationModelPicker", () => {
	it("renders the dropdown with the allowed options", async () => {
		apiRequest.mockResolvedValue(CONFIG);
		render(
			<InvestigationModelPicker caseId="case-1" token="jwt" supportToken="" darkMode={true} />,
		);

		const select = await screen.findByLabelText("Investigation model");
		expect(select.tagName).toBe("SELECT");
		expect(select).toHaveValue("minimax-m3.1-flash-free");
		expect(
			screen.getByRole("option", { name: "minimax-m3.1-flash-free · free" }),
		).toBeInTheDocument();
		expect(screen.getByRole("option", { name: "glm-5.3-flash-free · free" })).toBeInTheDocument();
		expect(
			screen.getByRole("option", { name: "nemotron-3-ultra-free · free" }),
		).toBeInTheDocument();
		// The GET went through the case-model route with the token.
		expect(apiRequest).toHaveBeenCalledWith(
			"/support/cases/case-1/model",
			expect.objectContaining({ token: "jwt" }),
		);
		// The copy line renders.
		expect(
			screen.getByText("Applies to the clarifying chat and the investigation. Free models only."),
		).toBeInTheDocument();
	});

	it("calls PUT with the picked model when the selection changes", async () => {
		apiRequest.mockImplementation(makeModelApi());
		render(
			<InvestigationModelPicker caseId="case-1" token="jwt" supportToken="" darkMode={true} />,
		);

		const select = await screen.findByLabelText("Investigation model");
		fireEvent.change(select, { target: { value: "glm-5.3-flash-free" } });

		await waitFor(() => {
			expect(apiRequest).toHaveBeenCalledWith(
				"/support/cases/case-1/model",
				expect.objectContaining({ method: "PUT", body: { modelId: "glm-5.3-flash-free" } }),
			);
		});
		// The selection sticks locally after a 200.
		await waitFor(() => {
			expect(screen.getByLabelText("Investigation model")).toHaveValue("glm-5.3-flash-free");
		});
	});

	it("reverts the select and shows an inline error when PUT answers 400", async () => {
		apiRequest.mockImplementation((path, options = {}) => {
			if ((options.method || "GET") === "GET") {
				return Promise.resolve(CONFIG);
			}
			const error = new Error("modelId is not an allowed model");
			error.status = 400;
			return Promise.reject(error);
		});
		render(
			<InvestigationModelPicker caseId="case-1" token="jwt" supportToken="" darkMode={true} />,
		);

		const select = await screen.findByLabelText("Investigation model");
		fireEvent.change(select, { target: { value: "glm-5.3-flash-free" } });

		expect(await screen.findByText("That model is no longer available")).toBeInTheDocument();
		expect(screen.getByLabelText("Investigation model")).toHaveValue("minimax-m3.1-flash-free");
	});

	it("renders a read-only badge, not a select, when buyerSelectEnabled is false", async () => {
		apiRequest.mockResolvedValue({ ...CONFIG, buyerSelectEnabled: false });
		render(
			<InvestigationModelPicker caseId="case-1" token="jwt" supportToken="" darkMode={true} />,
		);

		expect(
			await screen.findByText("Investigation model: minimax-m3.1-flash-free"),
		).toBeInTheDocument();
		expect(screen.queryByLabelText("Investigation model")).not.toBeInTheDocument();
	});
});
