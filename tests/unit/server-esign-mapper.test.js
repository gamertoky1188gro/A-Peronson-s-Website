import { normalizeProviderWebhook } from "../../server/services/eSignCallbackMapper.js";

describe("e-sign webhook mapper (server/services/eSignCallbackMapper.js)", () => {
	test("passes through payloads already in the internal shape", () => {
		expect(normalizeProviderWebhook({ buyer_signed: 1 })).toEqual({
			buyer_signed: true,
			factory_signed: false,
		});
		expect(normalizeProviderWebhook({ factory_signed: true })).toEqual({
			buyer_signed: false,
			factory_signed: true,
		});
	});

	test("maps Dropbox-style signature arrays by signer role", () => {
		const out = normalizeProviderWebhook({
			event: { event_type: "signature_request_signed" },
			signature_request: {
				signatures: [
					{ role: "buyer", status: "signed" },
					{ role: "factory", status: "awaiting_signature" },
				],
			},
		});
		expect(out.buyer_signed).toBe(true);
		expect(out.factory_signed).toBe(false);
	});

	test("detects supplier synonyms and email/name hints for factory", () => {
		const out = normalizeProviderWebhook({
			signers: [{ role: "supplier", signed: true }],
		});
		expect(out.factory_signed).toBe(true);

		const byEmail = normalizeProviderWebhook({
			signatures: [{ email: "factory-contact@example.com", signed_at: "2026-01-01" }],
		});
		expect(byEmail.factory_signed).toBe(true);

		const byName = normalizeProviderWebhook({
			signatures: [{ name: "Buyer Rep", status: "signed" }],
		});
		expect(byName.buyer_signed).toBe(true);
	});

	test("treats all-signed provider events as both parties signed", () => {
		const out = normalizeProviderWebhook({ event_type: "signature_request_all_signed" });
		expect(out).toMatchObject({ buyer_signed: true, factory_signed: true });
	});

	test("returns an empty object when nothing can be determined", () => {
		expect(normalizeProviderWebhook({})).toEqual({});
		expect(normalizeProviderWebhook({ event_type: "viewed", signatures: [] })).toEqual({});
		expect(normalizeProviderWebhook(null)).toEqual({});
	});

	test("attaches the provider event type for debugging", () => {
		const out = normalizeProviderWebhook({
			event: { type: "signed" },
			signers: [{ role: "buyer", status: "signed" }],
		});
		expect(typeof out.provider_event_type).toBe("string");
	});
});
