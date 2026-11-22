import { jest } from "@jest/globals";

// The model explorer proxy must fetch the upstream catalog and pass it back
// verbatim, tolerate a cached read, and never claim a failed fetch succeeded.

const fetchMock = jest.fn();
jest.unstable_mockModule("../../server/utils/validators.js", () => ({
	sanitizeString: (v) => String(v ?? ""),
	escapeHtml: (v) => String(v ?? ""),
}));

globalThis.fetch = fetchMock;

const { opencodeModelsHandler, resetModelCatalogCache } = await import(
	"../../server/controllers/supportController.js"
);

function resMock() {
	return {
		statusCode: 200,
		body: null,
		json(payload) {
			this.body = payload;
			return this;
		},
		status(code) {
			this.statusCode = code;
			return this;
		},
	};
}

const sample = {
	data: [{ id: "free-model", name: "Free Model", family: "free", limit: { context: 1000 } }],
};

beforeEach(() => {
	fetchMock.mockReset();
	resetModelCatalogCache();
});

describe("opencodeModelsHandler", () => {
	it("proxies the upstream catalog verbatim with a cached flag", async () => {
		fetchMock.mockResolvedValueOnce({ ok: true, json: async () => sample });
		const res = resMock();
		await opencodeModelsHandler({}, res);
		expect(res.statusCode).toBe(200);
		expect(res.body.data).toEqual(sample.data);
		expect(typeof res.body.cached).toBe("boolean");
	});

	it("returns 502 when the upstream fails", async () => {
		fetchMock.mockResolvedValueOnce({ ok: false, status: 503 });
		const res = resMock();
		await opencodeModelsHandler({}, res);
		expect(res.statusCode).toBe(502);
		expect(res.body.data).toBeUndefined();
	});

	it("rejects a malformed upstream response", async () => {
		fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ nope: true }) });
		const res = resMock();
		await opencodeModelsHandler({}, res);
		expect(res.statusCode).toBe(502);
	});
});
