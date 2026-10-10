import { jest } from "@jest/globals";
import request from "supertest";

const TEXT_REQUIRED = /text is required/;
const EXTRACTED_REQUIRED = /extracted fields are required/;

describe("assistant draft endpoints (tests/testServer.js harness)", () => {
	let app;

	beforeEach(async () => {
		jest.resetModules();
		// Force the AI verifier + orchestration onto deterministic paths:
		// no real network calls.
		global.fetch = () => Promise.reject(new Error("network disabled in tests"));
		({ default: app } = await import("../testServer.js"));
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	test("POST /extract-requirement rejects missing text with 400", async () => {
		const res = await request(app).post("/api/assistant/extract-requirement").send({});
		expect(res.status).toBe(400);
		expect(res.body.error).toMatch(TEXT_REQUIRED);
	});

	test("POST /generate-first-response rejects missing extracted fields with 400", async () => {
		const res = await request(app).post("/api/assistant/generate-first-response").send({});
		expect(res.status).toBe(400);
		expect(res.body.error).toMatch(EXTRACTED_REQUIRED);
	});

	test("POST /generate-first-response drafts a reply from extracted fields", async () => {
		const res = await request(app)
			.post("/api/assistant/generate-first-response")
			.send({ extracted: { product_type: "Denim Fabric", moq: "5000", target_price: "4.50" } });
		expect(res.status).toBe(200);
		expect(res.body.draft).toContain("Denim Fabric");
		expect(res.body.draft).toContain("5000");
		expect(res.body.meta).toEqual(expect.objectContaining({ confidence: expect.any(Number) }));
	});

	test("orchestration maps LLM JSON to extraction fields with confidence", async () => {
		// Stub the Ollama chat endpoint (OpenAI-style payload) instead of
		// mocking modules: every caller in the chain reads global fetch.
		const LLM_JSON =
			'{"product_type":"Denim","category":"Fabric","moq":"1000","target_price":"5","timeline":null,"incoterm":"FOB","certifications":[],"verified":true,"score":1,"notes":"ok"}';
		global.fetch = async () => ({
			ok: true,
			json: async () => ({ choices: [{ message: { content: LLM_JSON } }] }),
		});
		const orchestration = await import("../../server/services/aiOrchestrationService.js");
		const out = await orchestration.orchestrateRequirementExtraction(
			{ text: "Need 1000m denim at $5 FOB" },
			null,
		);
		expect(out.extracted.product_type).toBe("Denim");
		expect(out.extracted.incoterm).toBe("FOB");
		expect(out.confidence).toBeGreaterThan(0);
		expect(Array.isArray(out.missing_fields)).toBe(true);
		expect(out.thresholds).toEqual(expect.objectContaining({ confidence: expect.any(Number) }));
	});
});
