import {
  createAgentSubId,
  listAgentSubIds,
  getAgentSubIdById,
  deleteAgentSubId,
} from "../../server/services/agentSubIdService.js";
import { writeLocalJson } from "../../server/utils/localStore.js";

describe("agent sub-id service", () => {
  beforeAll(async () => {
    await writeLocalJson("agent_sub_ids.json", []);
  });

  test("create, list, get, delete sub-id", async () => {
    const owner = `agent-${Date.now()}`;
    const row = await createAgentSubId(owner, {
      label: "test sub",
      metadata: { foo: "bar" },
    });
    expect(row).toBeDefined();
    expect(row.owner_id).toBe(String(owner));

    const list = await listAgentSubIds({ id: owner, role: "agent" });
    expect(Array.isArray(list)).toBe(true);
    expect(list.find((r) => String(r.id) === String(row.id))).toBeDefined();

    const byId = await getAgentSubIdById(row.id);
    expect(byId).toBeDefined();

    const ok = await deleteAgentSubId(row.id, { id: owner, role: "agent" });
    expect(ok).toBe(true);
  });
});
