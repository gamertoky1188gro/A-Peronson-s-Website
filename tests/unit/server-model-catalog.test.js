import { getOpenCodeFreeModels, __resetModelCatalogForTests } from "../../server/services/investigation/modelCatalog.js";

const CATALOG = {
	data: [
		{ id: "minimax-m3.1-flash-free", object: "model", created: 1794754237, owned_by: "opencode", name: "MiniMax M3.1 Flash Free" },
		{ id: "big-pickle", object: "model", created: 1794754238, owned_by: "opencode", name: "Big Pickle" },
		{ id: "iceman-free", object: "model", created: 1794754239, owned_by: "opencode", name: "Iceman Free" },
		{ id: "longcat-2.5-free", object: "model", created: 1794754240, owned_by: "opencode", name: "LongCat 2.5 Free" },
		{ id: "gpt-paid-model", object: "model", created: 1794754241, owned_by: "openai", name: "GPT Paid" },
	],
};
const fetchImpl = async () => ({ ok: true, json: async () => CATALOG });

beforeEach(() => __resetModelCatalogForTests());

test("filters free opencode ids and excludes iceman-free", async () => {
	const result = await getOpenCodeFreeModels({ fetchImpl });
	expect(result.models.map((m) => m.id).sort()).toEqual([
		"big-pickle",
		"longcat-2.5-free",
		"minimax-m3.1-flash-free",
	]);
});

test("serves cache within TTL and stale copy on failure", async () => {
	await getOpenCodeFreeModels({ fetchImpl });
	const cached = await getOpenCodeFreeModels({ forceRefresh: true, fetchImpl: async () => { throw new Error("boom"); } });
	expect(cached.stale).toBe(true);
	expect(cached.models.length).toBeGreaterThan(0);
});

test("throws 503 when catalog unreachable and no cache exists", async () => {
	await expect(getOpenCodeFreeModels({ fetchImpl: async () => { throw new Error("boom"); } }))
		.rejects.toMatchObject({ status: 503 });
});
