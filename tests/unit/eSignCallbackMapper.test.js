import { normalizeProviderWebhook } from "../../server/services/eSignCallbackMapper.js";

describe("eSignCallbackMapper", () => {
  test("passes through internal shape", () => {
    const payload = { buyer_signed: true };
    const res = normalizeProviderWebhook(payload, {});
    expect(res).toMatchObject({ buyer_signed: true });
  });

  test("maps signature_request.signatures with buyer role", () => {
    const payload = {
      signature_request: {
        signatures: [
          { role: "buyer", status: "signed" },
          { role: "factory", status: "pending" },
        ],
      },
    };
    const res = normalizeProviderWebhook(payload, {});
    expect(res).toMatchObject({ buyer_signed: true });
    expect(res.factory_signed).not.toBeTruthy();
  });

  test("maps single signer by email that implies factory", () => {
    const payload = {
      signatures: [{ email: "supplier-factory@example.com", signed: true }],
    };
    const res = normalizeProviderWebhook(payload, {});
    expect(res).toMatchObject({ factory_signed: true });
  });

  test("maps all-signed event to both flags", () => {
    const payload = { event: { event_type: "signature_request_all_signed" } };
    const res = normalizeProviderWebhook(payload, {});
    expect(res.buyer_signed).toBe(true);
    expect(res.factory_signed).toBe(true);
  });

  test("returns empty object for ambiguous payloads", () => {
    const payload = { foo: "bar" };
    const res = normalizeProviderWebhook(payload, {});
    expect(res).toEqual({});
  });
});
