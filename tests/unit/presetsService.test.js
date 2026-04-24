import {
  createPreset,
  listPresets,
  getPresetById,
  updatePreset,
  deletePreset,
} from "../../server/services/presetsService.js";
import { writeLocalJson } from "../../server/utils/localStore.js";

describe("presetsService CRUD", () => {
  beforeAll(async () => {
    // ensure clean state
    await writeLocalJson("search_presets.json", []);
  });

  test("create, list, get, update and delete preset", async () => {
    const ownerId = `owner-${Date.now()}`;
    const actor = { id: ownerId, role: "owner" };

    const created = await createPreset(ownerId, {
      name: "My Preset",
      filters: { industry: "garments" },
      shared: false,
    });
    expect(created).toBeDefined();
    expect(created).toHaveProperty("id");
    expect(String(created.owner_id)).toBe(String(ownerId));

    const items = await listPresets(actor);
    expect(Array.isArray(items)).toBe(true);
    const found = items.find((p) => String(p.id) === String(created.id));
    expect(found).toBeDefined();

    const byId = await getPresetById(created.id);
    expect(byId).toBeDefined();
    expect(byId.name).toBe("My Preset");

    const updated = await updatePreset(
      created.id,
      { name: "Updated Preset", shared: true },
      actor,
    );
    expect(updated).toBeDefined();
    expect(updated.name).toBe("Updated Preset");
    expect(updated.shared).toBe(true);

    const ok = await deletePreset(created.id, actor);
    expect(ok).toBe(true);

    const after = await getPresetById(created.id);
    expect(after).toBeNull();
  });
});
