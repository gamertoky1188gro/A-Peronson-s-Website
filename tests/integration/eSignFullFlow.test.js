import { createDraftContract } from "../../server/services/documentService.js";
import { createSignSession } from "../../server/services/eSignService.js";
import { createContractSignCallback } from "../../server/controllers/documentController.js";
import { readJson } from "../../server/utils/jsonStore.js";

describe("e-sign full flow (createSignSession -> callback -> PDF)", () => {
  test("creates signing session and generates PDF after both callbacks", async () => {
    process.env.NODE_ENV = "test";
    process.env.ESIGN_WEBHOOK_SECRET = "";

    const actor = { id: `owner-${Date.now()}`, role: "owner" };
    const draft = await createDraftContract(actor, {
      buyer_id: `buyer-${Date.now()}`,
      factory_id: `factory-${Date.now()}`,
      buyer_name: "Buyer X",
      factory_name: "Factory Y",
    });
    expect(draft).toBeDefined();

    const session = await createSignSession(draft.id, actor);
    expect(session).toHaveProperty("signing_url");
    expect(session).toHaveProperty("token");

    const docs = await readJson("documents.json");
    const stored = docs.find((d) => String(d.id) === String(draft.id));
    expect(stored).toBeDefined();
    expect(stored.artifact?.signing_token).toBe(session.token);

    // Simulate buyer callback (raw buffer)
    const req1 = {
      params: { contractId: draft.id },
      body: Buffer.from(JSON.stringify({ buyer_signed: true })),
      headers: {},
      query: {},
    };
    const res1 = {
      _status: 200,
      _json: null,
      status(code) {
        this._status = code;
        return this;
      },
      json(obj) {
        this._json = obj;
        return this._json;
      },
    };

    await createContractSignCallback(req1, res1);
    expect(res1._json).toBeDefined();
    expect(res1._json.contract?.buyer_signature_state).toBe("signed");

    // Simulate factory callback (raw buffer)
    const req2 = {
      params: { contractId: draft.id },
      body: Buffer.from(JSON.stringify({ factory_signed: true })),
      headers: {},
      query: {},
    };
    const res2 = {
      _status: 200,
      _json: null,
      status(code) {
        this._status = code;
        return this;
      },
      json(obj) {
        this._json = obj;
        return this._json;
      },
    };

    await createContractSignCallback(req2, res2);
    expect(res2._json).toBeDefined();
    expect(res2._json.contract?.factory_signature_state).toBe("signed");
    expect(res2._json.contract?.artifact?.status).toBe("generated");
    expect(res2._json.contract?.artifact?.pdf_path).toBeTruthy();
    expect(res2._json.contract?.artifact?.pdf_hash).toBeTruthy();
  });
});
