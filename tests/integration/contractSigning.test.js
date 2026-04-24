import {
  createDraftContract,
  updateContractSignatures,
  listContracts,
} from "../../server/services/documentService.js";

describe("contract signing artifact generation", () => {
  test("generates PDF artifact when both parties sign", async () => {
    process.env.NODE_ENV = "test";
    const actor = { id: "owner1", role: "owner" };
    const draft = await createDraftContract(actor, {
      buyer_id: "buyer1",
      factory_id: "factory1",
      buyer_name: "B",
      factory_name: "F",
    });
    expect(draft).toBeDefined();
    // sign buyer
    const afterBuyer = await updateContractSignatures(
      draft.id,
      { buyer_signature_state: "signed" },
      actor,
    );
    expect(afterBuyer).toBeDefined();
    // sign factory
    const afterFactory = await updateContractSignatures(
      draft.id,
      { factory_signature_state: "signed" },
      actor,
    );
    expect(afterFactory).toBeDefined();
    expect(afterFactory.artifact?.status).toBe("generated");
    expect(afterFactory.artifact?.pdf_path).toBeTruthy();
  });
});
