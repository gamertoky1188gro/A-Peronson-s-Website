import {
	createAgentSubId,
	deleteAgentSubId,
	getAgentSubIdById,
	listAgentSubIds,
} from "../../server/services/agentSubIdService.js";
import {
	createPreset,
	deletePreset,
	getPresetById,
	listPresets,
	updatePreset,
} from "../../server/services/presetsService.js";
import { readLocalJson, updateLocalJson, writeLocalJson } from "../../server/utils/localStore.js";

describe("localStore test-mode isolation (server/utils/localStore.js)", () => {
	test("reads fall back, writes persist, updates transform", async () => {
		expect(await readLocalJson("iso-probe.json", ["fallback"])).toEqual(["fallback"]);
		await writeLocalJson("iso-probe.json", [{ a: 1 }]);
		expect(await readLocalJson("iso-probe.json", [])).toEqual([{ a: 1 }]);
		await updateLocalJson("iso-probe.json", (cur) => [...cur, { a: 2 }], []);
		expect(await readLocalJson("iso-probe.json", [])).toHaveLength(2);
	});

	test("different keys do not leak into each other", async () => {
		await writeLocalJson("iso-a.json", [1]);
		await writeLocalJson("iso-b.json", [2, 3]);
		expect(await readLocalJson("iso-a.json", [])).toEqual([1]);
		expect(await readLocalJson("iso-b.json", [])).toEqual([2, 3]);
	});
});

describe("search presets service (server/services/presetsService.js)", () => {
	const owner = { id: "owner-1", role: "factory" };
	const stranger = { id: "stranger-9", role: "factory" };
	const admin = { id: "admin-1", role: "admin" };
	let presetId;

	test("creates a preset with sanitized name and defaults", async () => {
		const preset = await createPreset(owner.id, {
			name: "  <b>Denim hunt</b>  ",
			filters: { category: "Denim" },
			shared: true,
		});
		presetId = preset.id;
		expect(preset.owner_id).toBe("owner-1");
		expect(preset.name).not.toContain("<b>");
		expect(preset.filters).toEqual({ category: "Denim" });
		expect(preset.shared).toBe(true);
		const fetched = await getPresetById(presetId);
		expect(fetched.id).toBe(presetId);
	});

	test("lists owned + shared for members, everything for admins, nothing anonymously", async () => {
		expect(await listPresets(null)).toEqual([]);
		expect((await listPresets(owner)).some((p) => p.id === presetId)).toBe(true);
		expect((await listPresets(stranger)).some((p) => p.id === presetId)).toBe(true); // shared
		expect((await listPresets(admin)).some((p) => p.id === presetId)).toBe(true);
	});

	test("private presets stay invisible to strangers", async () => {
		const priv = await createPreset(owner.id, { name: "secret", filters: {}, shared: false });
		expect((await listPresets(stranger)).some((p) => p.id === priv.id)).toBe(false);
		expect((await listPresets(owner)).some((p) => p.id === priv.id)).toBe(true);
		await deletePreset(priv.id, owner);
	});

	test("owners can update, strangers get a forbidden error, missing ids return null", async () => {
		const updated = await updatePreset(presetId, { name: "Renamed" }, owner);
		expect(updated.name).toBe("Renamed");
		await expect(updatePreset(presetId, { name: "Hijack" }, stranger)).rejects.toMatchObject({
			status: 403,
		});
		expect(await updatePreset("does-not-exist", { name: "x" }, owner)).toBeNull();
	});

	test("delete removes owned presets and reports unknown ids as false", async () => {
		expect(await deletePreset("does-not-exist", owner)).toBe(false);
		expect(await deletePreset(presetId, owner)).toBe(true);
		expect(await getPresetById(presetId)).toBeNull();
	});
});

describe("agent sub-ids service (server/services/agentSubIdService.js)", () => {
	const owner = { id: "bh-1", role: "buying_house" };
	const other = { id: "bh-2", role: "buying_house" };
	const admin = { id: "ad-1", role: "owner" };

	test("full lifecycle: create, list-scoped, get, delete", async () => {
		const row = await createAgentSubId(owner.id, { label: "Dhaka agent", metadata: { zone: "A" } });
		expect(row.owner_id).toBe("bh-1");
		expect((await listAgentSubIds(owner)).some((r) => r.id === row.id)).toBe(true);
		expect((await listAgentSubIds(other)).some((r) => r.id === row.id)).toBe(false);
		expect((await listAgentSubIds(admin)).some((r) => r.id === row.id)).toBe(true);
		expect(await getAgentSubIdById(row.id)).toMatchObject({ id: row.id });
		expect(await getAgentSubIdById("missing")).toBeNull();

		await expect(deleteAgentSubId(row.id, other)).rejects.toThrow();
		expect(await deleteAgentSubId(row.id, owner)).toBe(true);
		expect(await deleteAgentSubId(row.id, owner)).toBe(false);
	});
});
