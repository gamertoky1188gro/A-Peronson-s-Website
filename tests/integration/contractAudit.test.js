import {
  createDraftContract,
  updateContractSignatures,
  listContractAudit,
} from "../../server/services/documentService.js";

describe("contract audit logging", () => {
  test("records audit rows for create and signatures", async () => {
    const actor = { id: `owner-${Date.now()}`, role: "owner" };
    const draft = await createDraftContract(actor, {
      buyer_id: `buyer-${Date.now()}`,
      factory_id: `factory-${Date.now()}`,
      buyer_name: "Buyer A",
      factory_name: "Factory B",
    });
    expect(draft).toBeDefined();

    // Sign by buyer
    const res1 = await updateContractSignatures(
      draft.id,
      { buyer_signature_state: "signed" },
      actor,
    );
    expect(res1).toBeDefined();

    // Sign by factory
    const res2 = await updateContractSignatures(
      draft.id,
      { factory_signature_state: "signed" },
      actor,
    );
    expect(res2).toBeDefined();

    const audit = await listContractAudit(actor, draft.id);
    expect(audit).toBeDefined();
    expect(Array.isArray(audit.items)).toBe(true);
    const types = audit.items.map((i) => i.action);
    expect(types).toEqual(
      expect.arrayContaining([
        "contract_created",
        "buyer_signed",
        "factory_signed",
        "contract_signed",
      ]),
    );
  });
});
