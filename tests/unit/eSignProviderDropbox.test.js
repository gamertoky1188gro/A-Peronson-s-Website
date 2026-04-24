import { jest } from "@jest/globals";
import axios from "axios";

describe("Dropbox Sign provider integration", () => {
  test("creates provider session and stores provider IDs on contract", async () => {
    process.env.NODE_ENV = "test";
    process.env.ESIGN_PROVIDER_TYPE = "dropbox_sign";
    process.env.ESIGN_PROVIDER_URL = "https://api.dropbox.sign.test";
    process.env.ESIGN_DROPBOX_SIGN_API_KEY = "testkey";

    axios.post = jest
      .fn()
      .mockResolvedValue({
        data: {
          signing_url: "https://provider/sign/abc",
          session_id: "sess-abc",
        },
      });

    const { createDraftContract } =
      await import("../../server/services/documentService.js");
    const { createSignSession } =
      await import("../../server/services/eSignService.js");
    const { readJson } = await import("../../server/utils/jsonStore.js");

    const actor = { id: `owner-${Date.now()}`, role: "owner" };
    const draft = await createDraftContract(actor, {
      buyer_id: `buyer-${Date.now()}`,
      factory_id: `factory-${Date.now()}`,
      buyer_name: "Buyer X",
      factory_name: "Factory Y",
    });

    const session = await createSignSession(draft.id, actor);
    expect(session).toHaveProperty("signing_url");
    expect(session).toHaveProperty("token");

    const docs = await readJson("documents.json");
    const stored = docs.find((d) => String(d.id) === String(draft.id));
    expect(stored).toBeDefined();
    expect(stored.artifact?.provider_session_id).toBe("sess-abc");
    expect(stored.artifact?.signing_token).toBe(session.token);
  });
});
